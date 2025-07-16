#!/usr/bin/env node

/**
 * 这个脚本用于执行数据库迁移，添加缺失的列
 * 使用方法: node scripts/update-schema.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// 检查环境变量
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('错误: 缺少必要的环境变量。请确保在.env.local文件中设置了NEXT_PUBLIC_SUPABASE_URL和SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 创建Supabase客户端（使用服务角色密钥以获取管理员权限）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runMigration() {
  try {
    console.log('开始执行数据库迁移...');
    
    // 读取迁移SQL文件
    const migrationFilePath = path.join(__dirname, '../lib/supabase/migrations/add_image_url_column.sql');
    const migrationSQL = fs.readFileSync(migrationFilePath, 'utf8');
    
    // 执行SQL
    const { error } = await supabase.rpc('pgmigrate', { query: migrationSQL });
    
    if (error) {
      throw error;
    }
    
    console.log('迁移成功完成！');
    console.log('已添加image_url列到todos表');
    console.log('请刷新您的应用页面，问题应该已解决');
    
  } catch (error) {
    console.error('迁移失败:', error.message);
    console.log('\n如果上述方法失败，请尝试手动执行迁移:');
    console.log('1. 登录到Supabase控制台: https://supabase.com/dashboard');
    console.log('2. 选择您的项目');
    console.log('3. 点击左侧菜单的"SQL编辑器"');
    console.log('4. 执行以下SQL:');
    console.log(`
    -- 添加image_url列到todos表
    ALTER TABLE IF EXISTS todos
    ADD COLUMN IF NOT EXISTS image_url TEXT;
    
    -- 刷新Supabase的schema缓存
    SELECT pg_notify('supabase_db_changes', 'reload_schema');
    `);
  }
}

runMigration(); 