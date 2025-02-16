import React, { useEffect, useState } from 'react';
import { Search, Clock, ArrowRight, BookOpen } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';
import SearchService, { SearchResult } from '../utils/search'; // Add SearchResult import

const apiUrl = import.meta.env.VITE_API_URL;

const categories = [
  "All",
  "Personal Growth",
  "Communication",
  "Leadership",
  "Productivity",
  "Emotional Intelligence",
  "Decision Making"
];

function Articles() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [articles, setArticles] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const searchArticles = async () => {
      try {
        if (searchQuery.trim()) {
          const results = await SearchService.searchArticles(searchQuery);
          setArticles(results);
        } else {
          const response = await fetch(`${apiUrl}/articles`);
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    const delayDebounce = setTimeout(searchArticles, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleCardClick = (slug: string) => {
    navigate(`/articles/${slug}`);
  };

  const filteredArticles = articles.filter(article => 
    selectedCategory === 'All' || article.category === selectedCategory
  );

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <PageHeader
          title="Articles & Insights"
          description="In-depth articles, research summaries, and case studies to deepen your understanding of human skills."
          showSearch={true}
          searchQuery={searchQuery}
          onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setSearchQuery(e.target.value)
          }
        />

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {SearchService.renderResults(filteredArticles, {
          emptyState: (
            <div className="text-center py-12 text-gray-500">
              No articles found matching your search criteria
            </div>
          ),
          renderItem: (result) => (
            <div 
              key={result.slug}
              onClick={() => handleCardClick(result.slug)}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm text-blue-600 px-4 py-1 rounded-full text-sm font-medium shadow-sm">
                    {result.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {result.readTime}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {result.views} views
                  </div>
                </div>
                
                <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">
                  {result.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{result.excerpt}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img
                      src={result.author?.image}
                      alt={result.author?.name}
                      className="w-10 h-10 rounded-full ring-2 ring-white"
                    />
                    <div>
                      <span className="block text-sm font-medium text-gray-900">
                        {result.author?.name}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {result.author?.role}
                      </span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        <div className="mt-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl transform -rotate-1" />
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="mb-6 max-w-xl mx-auto text-blue-100">
                Get the latest articles, techniques, and resources delivered directly to your inbox.
              </p>
              <div className="flex max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-white text-blue-600 px-8 py-3 rounded-r-lg hover:bg-blue-50 transition-colors font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Articles;