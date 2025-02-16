import React, { useState, useEffect } from "react";
import { Download, Book, Link as LinkIcon, FileText, ExternalLink } from "lucide-react";
import PageHeader from '../components/PageHeader';

const apiUrl = import.meta.env.VITE_API_URL;

function Resources() {
  const [resources, setResources] = useState({
    downloadables: [],
    books: [],
    external: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch(`${apiUrl}/resources`);
        if (!response.ok) throw new Error("Failed to load resources");
        const data = await response.json();
        setResources(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-12">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <PageHeader
          title="Resources"
          description="Access our collection of downloadable resources, recommended books, and curated external links to support your learning journey."
        />

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Downloadable Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.downloadables.map((resource, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {resource.type}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{resource.size}</span>
                  <a
                    href={resource.url}
                    download
                    className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Recommended Books</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {resources.books.map((book, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex"
              >
                <div className="w-1/3 relative overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="p-6 flex-1">
                  <h3 className="font-bold text-xl mb-1 group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-blue-600 text-sm mb-3">by {book.author}</p>
                  <p className="text-gray-600 mb-4 line-clamp-3">{book.description}</p>
                  {book.url && (
                    <a
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Book className="w-4 h-4 mr-2" />
                      Learn More
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">External Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {resources.external.map((resource, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <LinkIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {resource.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Resources;