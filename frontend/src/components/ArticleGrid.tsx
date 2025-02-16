import { useNavigate } from 'react-router-dom';

const ArticleGrid = ({ articles }) => {
  const navigate = useNavigate();

  const handleCardClick = (articleSlug: string) => {
    navigate(`/articles/${articleSlug}`);
  };
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">
          Latest Insights
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div 
              key={index}
              onClick={() => handleCardClick(article.slug)}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-60 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {article.category}
                </span>
                <h3 className="font-bold text-xl mb-4 text-gray-800 leading-snug">
                  {article.title}
                </h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={article.author.image}
                    alt={article.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-700">{article.author.name}</p>
                    <p className="text-gray-500 text-sm">
                      {article.readTime} • {new Date(article.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleGrid;