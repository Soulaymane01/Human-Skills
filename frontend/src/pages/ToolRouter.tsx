import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TimeBlocking from './tools/TimeBlocking';
import MindMap from './tools/MindMapping';
import GoalSettingTool from './tools/GoalSetting';
import CreativityBooster from './tools/CreativeBooster'
import TeamCollaborationGuide from './tools/TeamCollaboration';
import ProgressTracker from './tools/ProgressTracker';
import DecisionMatrix from './tools/DecisionMatrix';

const apiUrl = import.meta.env.VITE_API_URL;

const ToolRouter = () => {
  const { slug } = useParams();
  const [tool, setTool] = useState<any>(null);

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await fetch(`${apiUrl}/tools/slug/${slug}`);
        const data = await response.json();
        setTool(data);
      } catch (error) {
        console.error('Error fetching tool:', error);
      }
    };
  
    fetchTool();
  }, [slug]);

  if (!tool) return <div>Loading...</div>;
  console.log(tool)

  // Route to specific components based on the tool's component field
  switch(tool.component) {
    case 'TimeBlocking':
      return <TimeBlocking />;
    case 'MindMapping' :
        return <MindMap />;
    case 'GoalSetting' :
        return <GoalSettingTool />;
    case 'CreativeBooster':
      return <CreativityBooster />
    case 'TeamCollaboration':
      return <TeamCollaborationGuide />
    case 'ProgressTracker':
      return <ProgressTracker />
    case 'DecisionMatrix':
      return <DecisionMatrix />
    default:
      return "This tool that you are searching for doesn't exist yet , but stay tooned";
  }
};

export default ToolRouter;