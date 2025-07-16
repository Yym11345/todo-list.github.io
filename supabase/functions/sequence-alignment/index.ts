import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface AlignmentRequest {
  fileUrl: string;
  userId: string;
}

interface AlignmentResult {
  id: string;
  sequences: {
    id: string;
    name: string;
    sequence: string;
  }[];
  alignmentResult: string;
  score: number;
  createdAt: string;
}

// 解析FASTA格式
function parseFasta(fastaContent: string) {
  const sequences = [];
  const lines = fastaContent.split('\n');
  let currentSeq = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    if (trimmedLine.startsWith('>')) {
      if (currentSeq) {
        sequences.push(currentSeq);
      }
      currentSeq = {
        name: trimmedLine.slice(1),
        sequence: ''
      };
    } else if (currentSeq) {
      currentSeq.sequence += trimmedLine;
    }
  }

  if (currentSeq) {
    sequences.push(currentSeq);
  }

  return sequences;
}

// Needleman-Wunsch 全局序列比对算法
function needlemanWunsch(seq1: string, seq2: string) {
  const MATCH_SCORE = 1;
  const MISMATCH_SCORE = -1;
  const GAP_PENALTY = -2;

  // 初始化得分矩阵
  const m = seq1.length + 1;
  const n = seq2.length + 1;
  const scoreMatrix = Array(m).fill(null).map(() => Array(n).fill(0));
  const tracebackMatrix = Array(m).fill(null).map(() => Array(n).fill(''));

  // 初始化第一行和第一列
  for (let i = 0; i < m; i++) {
    scoreMatrix[i][0] = i * GAP_PENALTY;
    tracebackMatrix[i][0] = 'up';
  }
  for (let j = 0; j < n; j++) {
    scoreMatrix[0][j] = j * GAP_PENALTY;
    tracebackMatrix[0][j] = 'left';
  }

  // 填充矩阵
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      const match = scoreMatrix[i-1][j-1] + (seq1[i-1] === seq2[j-1] ? MATCH_SCORE : MISMATCH_SCORE);
      const del = scoreMatrix[i-1][j] + GAP_PENALTY;
      const ins = scoreMatrix[i][j-1] + GAP_PENALTY;

      // 找出最大得分
      const maxScore = Math.max(match, del, ins);
      scoreMatrix[i][j] = maxScore;

      // 记录回溯方向
      if (maxScore === match) {
        tracebackMatrix[i][j] = 'diag';
      } else if (maxScore === del) {
        tracebackMatrix[i][j] = 'up';
      } else {
        tracebackMatrix[i][j] = 'left';
      }
    }
  }

  // 回溯得到比对结果
  let alignedSeq1 = '';
  let alignedSeq2 = '';
  let i = m - 1;
  let j = n - 1;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && tracebackMatrix[i][j] === 'diag') {
      alignedSeq1 = seq1[i-1] + alignedSeq1;
      alignedSeq2 = seq2[j-1] + alignedSeq2;
      i--;
      j--;
    } else if (i > 0 && tracebackMatrix[i][j] === 'up') {
      alignedSeq1 = seq1[i-1] + alignedSeq1;
      alignedSeq2 = '-' + alignedSeq2;
      i--;
    } else {
      alignedSeq1 = '-' + alignedSeq1;
      alignedSeq2 = seq2[j-1] + alignedSeq2;
      j--;
    }
  }

  return {
    alignedSeq1,
    alignedSeq2,
    score: scoreMatrix[m-1][n-1]
  };
}

serve(async (req) => {
  try {
    // 验证请求方法
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: '只支持 POST 请求' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 解析请求体
    const { fileUrl, userId } = await req.json() as AlignmentRequest;

    if (!fileUrl || !userId) {
      return new Response(
        JSON.stringify({ error: '缺少必要参数' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 获取文件内容
    const response = await fetch(fileUrl);
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: '无法获取文件内容' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fastaContent = await response.text();
    const sequences = parseFasta(fastaContent);

    if (sequences.length < 2) {
      return new Response(
        JSON.stringify({ error: '需要至少两个序列进行比对' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 执行序列比对
    const { alignedSeq1, alignedSeq2, score } = needlemanWunsch(
      sequences[0].sequence,
      sequences[1].sequence
    );

    // 准备结果
    const result: AlignmentResult = {
      id: crypto.randomUUID(),
      sequences: sequences.map((seq, index) => ({
        id: crypto.randomUUID(),
        name: seq.name,
        sequence: index === 0 ? alignedSeq1 : alignedSeq2
      })),
      alignmentResult: `
序列1: ${sequences[0].name}
${alignedSeq1}
序列2: ${sequences[1].name}
${alignedSeq2}
比对得分: ${score}
      `.trim(),
      score,
      createdAt: new Date().toISOString()
    };

    // 创建 Supabase 客户端
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    );

    // 保存结果到数据库
    const { error: dbError } = await supabaseClient
      .from('sequence_alignments')
      .insert({
        user_id: userId,
        result: result
      });

    if (dbError) {
      console.error('保存结果失败:', dbError);
      // 继续返回结果，但记录错误
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error('序列比对失败:', error);
    return new Response(
      JSON.stringify({ error: '序列比对过程中发生错误' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}); 