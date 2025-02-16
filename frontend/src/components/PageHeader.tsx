import React from 'react';
import { Search } from 'lucide-react';

const PageHeader = ({ title, description, showSearch = false, category = '' }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="absolute inset-0 bg-[url('/api/placeholder/20/20')] opacity-5" />
        <div 
          className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" 
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0) 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Optional Category Tag */}
            {category && (
              <div className="animate-fade-in-up">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                  {category}
                </span>
              </div>
            )}

            {/* Title with gradient animation */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 text-transparent bg-clip-text animate-gradient-x">
              {title}
            </h1>

            {/* Description with fade animation */}
            <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in">
              {description}
            </p>

            {/* Optional Search Bar */}
            {showSearch && (
              <div className="max-w-2xl mx-auto mt-8 animate-fade-in-up">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20 group-hover:opacity-30 blur transition duration-500" />
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-6 py-3 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                    />
                    <Search className="absolute right-4 top-3.5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 8s ease infinite;
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PageHeader;