import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Clock, Bookmark, ArrowLeft, User } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const apiUrl = import.meta.env.VITE_API_URL;

interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    image: string;
  };
  slug: string;
  createdAt: string;
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${apiUrl}/articles/slug/${slug}`);
        if (!response.ok) throw new Error('Article not found');
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

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
      <button
        onClick={() => navigate(-1)}
        className="mt-4 text-blue-600 hover:text-blue-800"
      >
        ← Back to Articles
      </button>
    </div>
  );

  if (!article) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <PageHeader
          title={article.title}
          description={article.excerpt}
          showBackButton={true}
        />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 lg:p-12">
            {/* Article Header Image */}
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-64 object-cover rounded-xl mb-8"
            />

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full transition-all hover:bg-blue-100">
                <Bookmark className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">{article.category}</span>
              </div>
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full transition-all hover:bg-blue-100">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">{article.readTime}</span>
              </div>
              <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full transition-all hover:bg-blue-100">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-800">{article.author.name}</span>
              </div>
            </div>

            {/* Author Section */}
            <div className="flex items-center mb-12 p-4 bg-gray-50 rounded-lg">
              <img 
                src={article.author.image} 
                alt={article.author.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <div className="font-medium text-gray-900">{article.author.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Markdown Content */}
            <div className="prose prose-lg lg:prose-xl max-w-none">
              <ReactMarkdown
                rehypePlugins={[rehypeSanitize]}
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-4xl font-bold mt-12 mb-6 text-gray-900 border-b border-gray-200 pb-4" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-3xl font-bold mt-10 mb-5 text-gray-800 border-b border-gray-200 pb-3" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-800" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-8 mb-6 space-y-3 text-gray-600" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-8 mb-6 space-y-3 text-gray-600" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-lg leading-relaxed" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-6 my-8 italic text-gray-700 bg-blue-50 py-4 pr-4 rounded-r-lg" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-blue-600 hover:text-blue-800 underline decoration-2 decoration-blue-200 hover:decoration-blue-500 transition-all" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  code: ({ node, inline, ...props }) => (
                    inline ? 
                    <code className="bg-gray-100 px-2 py-1 rounded-md text-sm font-mono text-blue-600" {...props} /> :
                    <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto my-6" {...props} />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre className="bg-gray-900 rounded-lg p-0 my-6" {...props} />
                  ),
                  img: ({ node, ...props }) => (
                    <img className="rounded-lg shadow-lg my-8 max-w-full h-auto" {...props} />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-12 border-t-2 border-gray-100" {...props} />
                  )
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}