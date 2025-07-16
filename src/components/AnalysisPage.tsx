import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, BarChart2, AlignLeft, FunctionSquare } from 'lucide-react';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();

  const analysisTools = [
    {
      id: 'enzyme',
      name: '酶类分布分析',
      description: '分析不同类型酶的分布情况',
      icon: PieChart,
      path: '/enzyme-analysis'
    },
    {
      id: 'domain',
      name: '结构域分析',
      description: '分析蛋白质结构域的组成和特征',
      icon: BarChart2,
      path: '/domain-analysis'
    },
    {
      id: 'sequence',
      name: '序列比对',
      description: '支持FASTA格式的序列比对分析',
      icon: AlignLeft,
      path: '/sequence-alignment'
    },
    {
      id: 'function',
      name: '功能分类',
      description: '基因功能的分类和统计分析',
      icon: FunctionSquare,
      path: '/function-analysis'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">分析工具</h1>
        <p className="text-lg text-gray-600">烟叶酶基因的全面分析和可视化工具</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analysisTools.map((tool) => {
          const Icon = tool.icon;
                return (
            <div
              key={tool.id}
              onClick={() => navigate(tool.path)}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tool.description}
                </p>
              </div>
            </div>
          );
        })}
            </div>

      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">使用说明</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>点击任意分析工具卡片进入对应的分析页面</li>
          <li>每个工具都支持数据的导出和结果的可视化</li>
          <li>分析结果可以保存到您的账户中</li>
          <li>如需帮助，请查看帮助文档或联系我们</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalysisPage;