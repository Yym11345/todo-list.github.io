import React from 'react';
import { Users, Target, Award, Globe, Database, BarChart3, Shield, Zap } from 'lucide-react';

const AboutPage: React.FC = () => {
  const milestones = [
    { year: '2020', event: '项目启动，开始构建烟叶酶基因数据库' },
    { year: '2021', event: '完成核心数据库架构设计和基础数据收集' },
    { year: '2022', event: '发布第一版平台，支持基本的基因检索功能' },
    { year: '2023', event: '新增多维度查询接口，收录超过8,000条基因序列' },
    { year: '2024', event: '平台全面升级，收录9,876条非冗余序列，集成145种功能结构域分析' },
  ];

  const features = [
    {
      icon: Database,
      title: '海量数据',
      description: '收录9,876条非冗余烟叶酶基因序列，涵盖六大类酶和145种功能结构域'
    },
    {
      icon: BarChart3,
      title: '多维检索',
      description: '支持基于酶类别、功能特征、序列特性的多维度检索和综合条件查询'
    },
    {
      icon: Shield,
      title: '数据质量',
      description: '严格的质量控制体系，确保数据的准确性和可靠性'
    },
    {
      icon: Zap,
      title: '高效分析',
      description: '基于先进算法的快速序列比对和功能注释分析工具'
    }
  ];

  const team = [
    {
      name: '郑雪坳博士',
      role: '项目负责人',
      description: '植物分子生物学专家，在基因功能研究领域有15年经验',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    },
    {
      name: '张伟',
      role: '技术总监',
      description: '生物信息学技术专家，专注于大数据处理和云计算架构',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    },
    {
      name: '王丽博士',
      role: '数据科学家',
      description: '基因组学研究专家，负责数据质量控制和标准化工作',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    }
  ];

  const dataStats = [
    { label: '非冗余基因序列', value: '9,876条' },
    { label: '完整基因序列', value: '8,234条' },
    { label: '部分序列', value: '1,642条' },
    { label: '功能结构域', value: '145种' },
  ];

  const enzymeDistribution = [
    { name: '蛋白酶', count: 2876, percentage: 29.1 },
    { name: '果胶酶', count: 2145, percentage: 21.7 },
    { name: '淀粉酶', count: 1534, percentage: 15.5 },
    { name: '脂肪酶', count: 1321, percentage: 13.4 },
    { name: '纤维素酶', count: 1256, percentage: 12.7 },
    { name: '木质素酶', count: 744, percentage: 7.5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">关于我们</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
              致力于构建世界领先的烟叶酶基因资源管理平台，推动烟叶酶学研究和工业应用的发展
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 数据概览 */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">数据库概览</h2>
            <p className="text-xl text-gray-600">全面收录烟叶酶基因序列，提供高质量的研究数据</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {dataStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <h3 className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">六大类酶基因分布</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enzymeDistribution.map((enzyme, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{enzyme.name}</p>
                    <p className="text-sm text-gray-600">{enzyme.count}条 ({enzyme.percentage}%)</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{enzyme.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 使命愿景 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">我们的使命</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              通过构建全面、准确、易用的烟叶酶基因数据库，为全球植物生物学研究人员提供高质量的数据资源和分析工具，
              促进烟草植物酶学研究的深入发展，推动相关领域的科学发现和技术创新。
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-6">
              <Globe className="h-8 w-8 text-teal-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">我们的愿景</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              成为国际领先的植物酶基因资源平台，建立标准化的数据共享机制，构建开放的科研合作生态系统，
              为植物分子生物学、农业生物技术和生物制药等领域的发展贡献力量。
            </p>
          </div>
        </div>

        {/* 平台特色 */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">平台特色</h2>
            <p className="text-xl text-gray-600">专业、可靠、高效的基因资源管理解决方案</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 查询功能介绍 */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">查询功能</h2>
            <p className="text-xl text-gray-600">多维度的检索功能，满足不同研究需求</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">主要查询功能</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">基于酶类别的查询</p>
                      <p className="text-gray-600 text-sm">可按照六大类酶(果胶酶、蛋白酶、脂肪酶、淀粉酶、纤维素酶和木质素酶)进行筛选</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">基于功能特征的查询</p>
                      <p className="text-gray-600 text-sm">支持通过催化活性、底物特异性等功能参数进行检索</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">基于序列特性的查询</p>
                      <p className="text-gray-600 text-sm">可按序列长度、特定保守区域或结构域组成进行筛选</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">综合条件查询</p>
                      <p className="text-gray-600 text-sm">支持多条件组合查询，如同时基于酶类别和反应条件进行筛选</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">结构域分析</h3>
                <p className="text-gray-600 mb-4">
                  在结构域分布方面，共鉴定出145种功能结构域，其中出现频率最高的结构域包括：
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">糖苷水解酶家族(GH)</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">丝氨酸蛋白酶催化域</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">脂肪酶α/β水解酶折叠</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">果胶裂解酶结构域</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-teal-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">半乳糖苷酶结构域</span>
                  </li>
                </ul>
                <p className="text-gray-600 mt-4 text-sm">
                  这些高频结构域的存在与烟叶中主要生物大分子的降解和转化密切相关。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 发展历程 */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">发展历程</h2>
            <p className="text-xl text-gray-600">从构想到实现，见证平台的成长轨迹</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 font-medium">{milestone.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 合作伙伴 */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">合作伙伴</h2>
            <p className="text-xl text-gray-600">与国内外知名科研院所建立合作关系</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-gray-600" />
                </div>
                <p className="text-gray-700 font-medium">国家烟草基因研究中心</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-gray-600" />
                </div>
                <p className="text-gray-700 font-medium">清华大学</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-gray-600" />
                </div>
                <p className="text-gray-700 font-medium">北京大学</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-gray-600" />
                </div>
                <p className="text-gray-700 font-medium">中国农科院</p>
              </div>
            </div>
          </div>
        </div>

        {/* 联系我们 */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">加入我们的科研社区</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            如果您对我们的平台感兴趣，或希望建立合作关系，欢迎随时与我们联系。
            我们期待与更多的研究人员和机构携手合作，共同推动烟叶酶学研究的发展。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              联系我们
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              了解更多
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;