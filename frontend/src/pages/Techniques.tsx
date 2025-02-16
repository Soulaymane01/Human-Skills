import React, { useEffect, useState } from 'react';
import { Brain, Heart, Compass, Lightbulb, Clock, Target, BarChart, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';


const apiUrl = import.meta.env.VITE_API_URL;
const iconMap = {
  "Cognitive Skills": Brain,
  "Emotional Intelligence": Heart,
  "Life Navigation": Compass,
  "Problem Solving": Lightbulb,
};

function Techniques() {
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/techniques`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch techniques");
        return response.json();
      })
      .then((data) => {
        setTechniques(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
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

  // Add this function to handle technique clicks
  const handleCardClick = (techniqueSlug: string) => {
    navigate(`/techniques/${techniqueSlug}`);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <PageHeader
          title="Learning Techniques"
          description="Proven methods to develop and enhance your skills"
        />

        <div className="space-y-16">
          {techniques.map((category, index) => {
            const Icon = iconMap[category.category] || Lightbulb;
            const isActive = activeCategory === index;

            return (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-sm transition-all duration-300 ${
                  isActive ? 'ring-2 ring-blue-500 transform scale-[1.02]' : 'hover:shadow-lg'
                }`}
                onMouseEnter={() => setActiveCategory(index)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="p-8">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-blue-50 rounded-lg mr-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {category.techniques.map((technique, techIndex) => (
                      <div 
                        key={techIndex}
                        onClick={() => handleCardClick(technique.slug)}
                        className="group relative bg-gray-50 rounded-xl p-6 hover:bg-gradient-to-br from-blue-50 to-white transition-all duration-300"
                      >
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-xl transition-colors duration-300" />
                        
                        <h3 className="font-bold text-xl mb-3 group-hover:text-blue-700 transition-colors">
                          {technique.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{technique.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
                            <Target className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-gray-700">
                              {technique.difficulty}
                            </span>
                          </div>
                          
                          <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
                            <Clock className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-gray-700">
                              {technique.timeNeeded}
                            </span>
                          </div>

                          {technique.successRate && (
                            <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
                              <BarChart className="w-4 h-4 text-blue-600 mr-2" />
                              <span className="text-sm font-medium text-gray-700">
                                {technique.successRate}% success rate
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Techniques;