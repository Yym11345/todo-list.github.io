import React from 'react';
import { Mail, Phone, MapPin, User, Building, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 平台信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">TobaccoGeneDB</h3>
            <p className="text-gray-300 mb-4">
              专业的烟叶酶基因资源管理平台，收录9,876条非冗余基因序列，为烟叶酶学研究提供全面支持。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* 产品负责人 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">产品负责人</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-400" />
                <span className="text-gray-300">郑雪坳博士</span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-blue-400" />
                <span className="text-gray-300">国家烟草基因研究中心</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-400" />
                <a href="mailto:zhengxueao@163.com" className="text-gray-300 hover:text-white transition-colors">
                  zhengxueao@163.com
                </a>
              </div>
            </div>
          </div>

          {/* 技术支持 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">技术支持</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-green-400" />
                <span className="text-gray-300">张伟工程师</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-green-400" />
                <a href="mailto:support@tobaccogene.org" className="text-gray-300 hover:text-white transition-colors">
                  support@tobaccogene.org
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-green-400" />
                <a href="tel:+86-0371-12345678" className="text-gray-300 hover:text-white transition-colors">
                  +86-0371-12345678
                </a>
              </div>
            </div>
          </div>

          {/* 联系地址 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系地址</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-teal-400" />
                <div className="text-gray-300">
                  <p>国家烟草基因研究中心</p>
                  <p>河南省郑州市中原区翠竹街6号</p>
                  <p>邮编：450000</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-teal-400" />
                <span className="text-gray-300">+86-0371-62836210</span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 TobaccoGeneDB. 版权所有 | 国家烟草基因研究中心
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                隐私政策
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                使用条款
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                数据使用协议
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;