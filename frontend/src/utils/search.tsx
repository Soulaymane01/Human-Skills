import React from 'react';
import { Clock, BookOpen, Target, Compass } from 'lucide-react';
const apiUrl = import.meta.env.VITE_API_URL;

type SearchResult = {
  type: string;
  title: string;
  description?: string;
  excerpt?: string;
  category?: string;
  readTime?: string;
  views?: number;
  author?: {
    name: string;
    role: string;
    image: string;
  };
};

type SearchConfig = {
  renderItem?: (result: SearchResult) => React.ReactNode;
  emptyState?: React.ReactNode;
};


// Add inside the same file
const DefaultSearchResultItem = ({ result }: { result: SearchResult }) => (
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
  );
  

class SearchService {
  // In src/utils/search.tsx
  static async searchAllEndpoints(query: string): Promise<SearchResult[]> {
    try {
      const endpoints = ['articles', 'techniques', 'tools'];
      const responses = await Promise.all(
        endpoints.map(endpoint => fetch(`${apiUrl}/${endpoint}`))
      );
      
      const data = await Promise.all(responses.map(res => res.json()));

      console.log("______________")
      
      return data.flatMap((results, index) => 
        results
          .filter((item: any) => {
            console.log(results)
            const title = item.title?.toLowerCase() || '';
            const description = item.description?.toLowerCase() || '';
            return title.includes(query.toLowerCase()) || 
                  description.includes(query.toLowerCase());
          })
          .map((item: any) => ({ 
            ...item,
            type: endpoints[index],
            description: item.description || '' // Ensure description exists
          }))
      );
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  static async searchArticles(query: string): Promise<SearchResult[]> {
    try {
      const response = await fetch(`${apiUrl}/articles`);
      const articles = await response.json();
      return articles.filter((article: any) => {
        const title = article.title?.toLowerCase() || '';
        const excerpt = article.excerpt?.toLowerCase() || '';
        return title.includes(query.toLowerCase()) ||
              excerpt.includes(query.toLowerCase());
      });
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  static renderResults(results: SearchResult[], config?: SearchConfig) {
    if (results.length === 0) {
      return config?.emptyState || (
        <div className="text-center py-12 text-gray-500">
          No results found. Try different keywords.
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Search Results</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result, index) => (
            config?.renderItem ? 
              config.renderItem(result) : 
              <DefaultSearchResultItem key={index} result={result} />
          ))}
        </div>
      </div>
    );
  }
}

export default SearchService;