import React from 'react';
import { Search, Database, BarChart3, Users, Download, FileText, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScanEffect from './ScanEffect';
import AnimatedCounter from './AnimatedCounter';
import FloatingParticles from './FloatingParticles';
import GlowButton from './GlowButton';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: '非冗余基因序列', value: 9876, icon: Database },
    { label: '完整基因序列', value: 8234, icon: FileText },
    { label: '功能结构域', value: 145, icon: BarChart3 },
    { label: '活跃用户', value: 2341, icon: Users },
  ];

  const features = [
    {
      icon: Search,
      title: '多维度基因检索',
      description: '支持基于酶类别、功能特征、序列特性的多维度检索，涵盖六大类酶的全面筛选功能。',
      action: () => navigate('/search'),
    },
    {
      icon: BarChart3,
      title: '综合条件查询',
      description: '支持多条件组合查询，可同时基于酶类别、催化活性、底物特异性等参数进行精确检索。',
      action: () => navigate('/analysis'),
    },
    {
      icon: Download,
      title: '数据导出',
      description: '支持多种格式导出基因数据，包括FASTA、CSV和标准生物信息学格式。',
      action: () => navigate('/search'),
    },
    {
      icon: Zap,
      title: '结构域分析',
      description: '基于145种功能结构域进行深度分析，包括糖苷水解酶家族、丝氨酸蛋白酶等高频结构域。',
      action: () => navigate('/analysis'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 relative">
      <FloatingParticles />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-teal-600 text-white overflow-hidden">
        {/* 背景动画效果 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-teal-600/90" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              烟叶酶基因资源平台
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              收录9,876条非冗余烟叶酶基因序列，涵盖六大类酶的全面数据库和分析平台，
              推动烟叶酶学研究和工业应用的发展。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <GlowButton
                onClick={() => navigate('/search')}
                variant="primary"
                icon={<Search className="h-5 w-5" />}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                开始基因检索
              </GlowButton>
              <GlowButton
                onClick={() => navigate('/analysis')}
                variant="secondary"
                icon={<BarChart3 className="h-5 w-5" />}
              >
                分析工具
              </GlowButton>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScanEffect key={index} delay={index * 200}>
                <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter end={stat.value} />
                  </h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </ScanEffect>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            强大的研究工具
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            获取全面的基因数据和为烟叶酶研究设计的高级分析工具。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScanEffect key={index} delay={index * 300}>
                <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <button
                    onClick={feature.action}
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors group-hover:translate-x-2 transform duration-300 inline-flex items-center"
                  >
                    了解更多 
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </button>
                </div>
              </ScanEffect>
            );
          })}
        </div>
      </div>

      {/* Quick Search */}
      <div className="relative bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up">快速基因检索</h2>
            <p className="text-xl text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              搜索我们全面的烟叶酶基因数据库
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <ScanEffect>
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors duration-300">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="输入基因名称、酶类别或功能特征..."
                    className="w-full px-4 py-3 border-0 bg-transparent focus:ring-0 focus:outline-none text-lg placeholder-gray-500"
                  />
                </div>
                <GlowButton
                  onClick={() => navigate('/search')}
                  variant="primary"
                  icon={<Search className="h-5 w-5" />}
                  className="shrink-0"
                >
                  搜索
                </GlowButton>
              </div>
            </ScanEffect>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;