import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Brain, Target, Sparkles, Users, LineChart, Workflow } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const apiUrl = import.meta.env.VITE_API_URL;

// Icon mapping
const iconMap = {
  Calendar,
  Clock,
  Brain,
  Target,
  Sparkles,
  Users,
  LineChart,
  Workflow
};

interface Tool {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: keyof typeof iconMap;
  slug: string;
  createdAt: Date;
  component?: string;
}

const categories = ["All", "Productivity", "Creativity", "Planning", "Communication"];

function Tools() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [tools, setTools] = useState<Tool[]>([]);
  const [hoveredTool, setHoveredTool] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/tools`)
      .then(response => response.json())
      .then(data => setTools(data))
      .catch(error => {
        console.error('Error fetching tools:', error);
      });
  }, []);

  const filteredTools = tools.filter(tool => 
    selectedCategory === "All" ? true : tool.category === selectedCategory
  );

  const handleCardClick = (toolSlug: string) => {
    navigate(`/tools/${toolSlug}`);
  };

  const handleActionClick = (e: React.MouseEvent, toolSlug: string) => {
    e.stopPropagation();
    navigate(`/tools/${toolSlug}`);
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <PageHeader
          title="Growth Tools"
          description="Practical tools to help you develop and implement new skills"
        />

        <div className="relative mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                {category}
                {selectedCategory === category && (
                  <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, index) => {
            // Map the icon string to its component
            const IconComponent = iconMap[tool.icon];
            const isHovered = hoveredTool === index;

            return (
              <div 
                key={tool._id} 
                onClick={() => handleCardClick(tool.slug)}
                className={`group bg-white rounded-xl p-8 transition-all duration-300 transform ${
                  isHovered ? 'shadow-xl scale-105' : 'shadow-sm hover:shadow-lg'
                }`}
                onMouseEnter={() => setHoveredTool(index)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-100 rounded-lg transform rotate-6 transition-transform group-hover:rotate-12" />
                  <div className="relative bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                    {IconComponent ? (
                      <IconComponent className="w-7 h-7 text-blue-600" />
                    ) : (
                      <div className="w-7 h-7 text-blue-600">?</div>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-gray-600 mb-4">{tool.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-600">
                    {tool.category}
                  </span>
                  
                  <button 
                    className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={(e) => handleActionClick(e, tool.slug)}
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                </div>

                {isHovered && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent rounded-xl" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Tools;
