import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Book, Video, MessageCircle, Download } from 'lucide-react';

const HelpPage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const faqData = [
    {
      id: 'search',
      question: 'How do I search for specific genes?',
      answer: 'Use the Gene Search page to enter gene names, sequences, or functional keywords. You can also apply filters for organism, function, and expression patterns to narrow your results.',
    },
    {
      id: 'analysis',
      question: 'What analysis tools are available?',
      answer: 'The platform provides expression analysis, sequence alignment, functional classification, and comparative analysis tools. Each tool is designed for specific research needs in tobacco enzyme gene studies.',
    },
    {
      id: 'export',
      question: 'How can I export my data?',
      answer: 'Data can be exported in various formats including FASTA, CSV, and JSON. Use the export buttons in search results or analysis pages to download your selected data.',
    },
    {
      id: 'upload',
      question: 'Can I upload my own sequence data?',
      answer: 'Yes, registered users can upload sequence data for analysis. The platform supports FASTA format and provides annotation and analysis tools for user-submitted sequences.',
    },
    {
      id: 'api',
      question: 'Is there an API available?',
      answer: 'Yes, we provide RESTful API endpoints for programmatic access to gene data. Contact support for API documentation and access credentials.',
    },
  ];

  const resources = [
    {
      title: 'User Guide',
      description: 'Comprehensive guide to using all platform features',
      icon: Book,
      link: '#',
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      icon: Video,
      link: '#',
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for developers',
      icon: Download,
      link: '#',
    },
    {
      title: 'Community Forum',
      description: 'Join discussions with other researchers',
      icon: MessageCircle,
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Documentation</h1>
          <p className="text-gray-600">Find answers to common questions and learn how to use the platform effectively</p>
        </div>

        {/* Quick Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                  Learn More →
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {faqData.map((faq) => (
              <div key={faq.id} className="p-6">
                <button
                  onClick={() => setExpandedSection(expandedSection === faq.id ? null : faq.id)}
                  className="w-full text-left flex justify-between items-center hover:text-blue-600 transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  {expandedSection === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {expandedSection === faq.id && (
                  <div className="mt-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">Getting Started</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Explore the Database</h3>
                  <p className="text-gray-600">Browse our comprehensive collection of tobacco leaf enzyme genes using the search functionality.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Use Analysis Tools</h3>
                  <p className="text-gray-600">Analyze gene expression patterns, perform sequence alignments, and compare functional classifications.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Export Your Results</h3>
                  <p className="text-gray-600">Download gene data and analysis results in various formats for your research needs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg text-white p-8 mt-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need Additional Help?</h2>
            <p className="text-blue-100 mb-6">Our support team is here to assist you with any questions or technical issues.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;