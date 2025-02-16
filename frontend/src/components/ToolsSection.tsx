import * as LucideIcons from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ToolsSection = ({ tools }) => {
  const navigate = useNavigate();

  const handleCardClick = (toolsSlug: string) => {
    navigate(`/tools/${toolsSlug}`);
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center text-gray-800">
          Essential Tools
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => {
            const IconComponent = LucideIcons[tool.icon];
            return (
              <div 
                key={index}
                onClick={() => handleCardClick(tool.slug)}
                className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 group"
              >
                {IconComponent && (
                  <IconComponent className="w-10 h-10 text-blue-600 mb-6 transition-colors group-hover:text-indigo-700" />
                )}
                <h3 className="font-bold text-xl mb-3 text-gray-800">{tool.title}</h3>
                <p className="text-gray-600 leading-relaxed">{tool.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default ToolsSection;