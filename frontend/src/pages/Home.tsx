import React, { useEffect, useState } from 'react';
import { Search, Brain, Heart, Compass, Lightbulb, Sparkles, Book, Target, ArrowRight, ChevronRight, Clock, X } from 'lucide-react';
import ArticleGrid from '../components/ArticleGrid';
import ToolsSection from '../components/ToolsSection';
import SkeletonLoader from '../components/SkeletonLoader';
import SearchService from '../utils/search';
import type { SearchResult } from '../utils/search';

import { useNavigate } from 'react-router-dom';


function Home() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [articles, setArticles] = useState([]);
  const [tools, setTools] = useState([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, toolsRes] = await Promise.all([
          fetch(`${apiUrl}/articles`),
          fetch(`${apiUrl}/tools`)
        ]);

        const articlesData = await articlesRes.json();
        const toolsData = await toolsRes.json();

        const categoryCounts = articlesData.reduce((acc, article) => {
          acc[article.category] = (acc[article.category] || 0) + 1;
          return acc;
        }, {});

        const categories = [
          { icon: Brain, title: 'Cognitive Skills', color: 'from-blue-400 to-blue-600' },
          { icon: Heart, title: 'Emotional Intelligence', color: 'from-rose-400 to-rose-600' },
          { icon: Compass, title: 'Personal Growth', color: 'from-emerald-400 to-emerald-600' },
          { icon: Lightbulb, title: 'Problem Solving', color: 'from-amber-400 to-amber-600' },
        ].map(cat => ({
          ...cat,
          count: `${categoryCounts[cat.title] || 0} Articles`
        }));

        setCategoriesData(categories);
        setArticles(articlesData.slice(0, 3));
        setTools(toolsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <SkeletonLoader />;
  }

  const handleCtaClick = () => {
    navigate(`/techniques`);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await SearchService.searchAllEndpoints(searchQuery);
      setSearchResults(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Animated Background */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 overflow-hidden ">
          <div className="absolute inset-0 bg-[url('/api/placeholder/20/20')] opacity-10" />
          <div className="absolute w-full h-full bg-gradient-to-br from-blue-500/30 via-indigo-500/30 to-purple-500/30 backdrop-blur-3xl animate-pulse" />
          <div className="absolute -inset-[10px] bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 backdrop-blur-xl transform rotate-12 animate-float" />
        </div>

        <div className="relative py-8 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Floating Badge */}
            <div className="inline-block animate-bounce-slow">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
                <Sparkles className="w-4 h-4" />
                Join Our Early Access Program
              </span>
            </div>

            {/* Animated Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-gradient-text">
              Master Essential
              <br />
              Life Skills
            </h1>

            <p className="text-xl md:text-2xl font-light text-blue-100 max-w-2xl mx-auto animate-fade-in">
              Transform your personal and professional life with evidence-based strategies and expert guidance
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto mt-12 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <input
              type="text"
              placeholder="Search skills, resources, or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="w-full px-8 py-5 rounded-full text-lg bg-white/10 backdrop-blur-sm border border-white/20 placeholder-white/60 text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 focus:bg-white/15 transition-all relative z-10"
            />
              <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full hover:bg-white/10 transition-colors z-10"
            >
              <Search className="w-6 h-6 text-white" />
            </button>
            </div>
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16">
              {[
                {
                  icon: Book,
                  title: 'Curated Content',
                  description: 'Expert-vetted resources and practical exercises'
                },
                {
                  icon: Target,
                  title: 'Goal Tracking',
                  description: 'Set milestones and track your progress'
                },
                {
                  icon: Sparkles,
                  title: 'Community',
                  description: 'Learn and grow with like-minded individuals'
                }
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all cursor-pointer hover:scale-105"
                >
                  <feature.icon className="w-8 h-8 mb-4 text-blue-200 group-hover:scale-110 transition-transform" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-blue-100">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Enhanced CTA Button */}
            <div className="mt-12">
              <button 
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors overflow-hidden"
                onClick={() => handleCtaClick()}>
                <span className="relative z-10 flex items-center gap-2">
                  Start Learning Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Search Results Overlay */}
    {searchResults.length > 0 && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-12 max-h-[90vh] overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Search Results ({searchResults.length})
              </h2>
              <button
                onClick={() => setSearchResults([])}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            {SearchService.renderResults(searchResults, {
              renderItem: (result) => (
                <div className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                      {result.type}
                    </span>
                    {result.category && (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded-full">
                        {result.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
                  <p className="text-gray-600 line-clamp-2">
                    {result.description || result.excerpt}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )}

      {searchResults.length > 0 ? (
        SearchService.renderResults(searchResults, {
          renderItem: (result) => (
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
                  {result.type}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{result.title}</h3>
              <p className="text-gray-600 mb-4">
                {result.description || result.excerpt}
              </p>
              {result.readTime && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  {result.readTime}
                </div>
              )}
            </div>
        )
      })
    ) : (
      <>
      {/* Enhanced Categories Section */}
      <div className="container mx-auto px-4 py-20 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {categoriesData.map((category, index) => (
            <div 
              key={index}
              className="relative group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <category.icon className="w-12 h-12 text-blue-600 mb-6 transition-all group-hover:scale-110 group-hover:text-indigo-700" />
              <h3 className="font-bold text-xl mb-2 text-gray-800">{category.title}</h3>
              <p className="text-gray-500 font-medium">{category.count}</p>
              <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-gray-400 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Articles Section with Enhanced Styling */}
      <div className="relative">
        <div className="absolute  bg-gradient-to-b from-gray-50 via-gray-100 to-white " />
        <ArticleGrid articles={articles} />
      </div>

      {/* Tools Section with Background Pattern */}
      <div className="relative">
        <div className="absolute  bg-gradient-to-b from-white to-gray-50" style={{ pointerEvents: 'none' }} />
        <div className="absolute inset-0 bg-[url('/api/placeholder/40/40')] opacity-5" style={{ pointerEvents: 'none' }} />
        <ToolsSection tools={tools} />
      </div>
    </>
    )}

      {/* Add custom styles */}
      <style jsx global>{`
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
          100% { transform: translateY(0px) rotate(12deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(5%); }
        }
        
        .animate-gradient-text {
          background: linear-gradient(to right, #ffffff, #e0e7ff, #ffffff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% auto;
          animation: gradient-text 4s linear infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Home;