import React, { useState } from 'react';
import { Mail, Phone, MapPin, User, Building, Send, Clock, Globe } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 处理表单提交
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const teamMembers = [
    {
      name: '郑雪坳',
      title: '产品负责人 / 首席科学家',
      department: '国家烟草基因研究中心',
      email: 'zhengxueao@163.com',
      phone: '+86-0371-62836210',
      expertise: '植物基因组学、分子生物学、生物信息学',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: '张伟',
      title: '技术总监',
      department: '生物信息技术部',
      email: 'zhangwei@tobaccogene.org',
      phone: '+86-0371-62836211',
      expertise: '数据库设计、云计算、机器学习',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: '王丽',
      title: '数据管理专家',
      department: '基因数据中心',
      email: 'wangli@tobaccogene.org',
      phone: '+86-0371-62836212',
      expertise: '基因注释、数据标准化、质量控制',
      avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: '陈强',
      title: '用户支持经理',
      department: '用户服务部',
      email: 'chenqiang@tobaccogene.org',
      phone: '+86-0371-62836213',
      expertise: '用户培训、技术支持、文档编写',
      avatar: 'https://images.pexels.com/photos/2182973/pexels-photo-2182973.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">联系我们</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            我们致力于为研究人员提供最优质的服务和技术支持。如有任何问题或建议，请随时与我们联系。
          </p>
        </div>

        {/* 联系方式卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">邮箱联系</h3>
            <p className="text-gray-600 mb-4">发送邮件获取技术支持</p>
            <a href="mailto:support@tobaccogene.org" className="text-blue-600 hover:text-blue-800 font-medium">
              support@tobaccogene.org
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">电话支持</h3>
            <p className="text-gray-600 mb-4">工作日 9:00-18:00</p>
            <a href="tel:+86-0371-62836210" className="text-green-600 hover:text-green-800 font-medium">
              +86-0371-62836210
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">访问地址</h3>
            <p className="text-gray-600 mb-4">欢迎预约参观交流</p>
            <p className="text-teal-600 font-medium">河南省郑州市中原区翠竹街6号</p>
          </div>
        </div>

        {/* 联系表单和机构信息 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 联系表单 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">发送消息</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    邮箱 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  咨询类型
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="general">一般咨询</option>
                  <option value="technical">技术支持</option>
                  <option value="collaboration">合作洽谈</option>
                  <option value="data">数据提交</option>
                  <option value="bug">问题反馈</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  主题 *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  详细描述 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请详细描述您的问题或需求..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                发送消息
              </button>
            </form>
          </div>

          {/* 机构信息 */}
          <div className="space-y-8">
            {/* 详细地址 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">机构信息</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Building className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">国家烟草基因研究中心</h3>
                    <p className="text-gray-600">烟叶酶基因资源管理平台</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-green-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">地址</h3>
                    <p className="text-gray-600">河南省郑州市中原区翠竹街6号</p>
                    <p className="text-gray-600">邮编：450000</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-teal-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">工作时间</h3>
                    <p className="text-gray-600">周一至周五：9:00 - 18:00</p>
                    <p className="text-gray-600">周六：9:00 - 12:00</p>
                    <p className="text-gray-600">周日及法定节假日休息</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Globe className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">在线服务</h3>
                    <p className="text-gray-600">24小时在线数据库访问</p>
                    <p className="text-gray-600">工作时间内技术支持响应</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 服务承诺 */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg text-white p-8">
              <h2 className="text-2xl font-semibold mb-4">服务承诺</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>24小时内回复邮件咨询</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>工作时间内电话即时响应</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>专业技术团队全程支持</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  <span>定期举办用户培训活动</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;