import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-toastify/dist/ReactToastify.css';

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Techniques from './pages/Techniques';
import Articles from './pages/Articles';
import Resources from './pages/Resources';
import About from './pages/About';
import Footer from './components/Footer';
import ToolRouter from './pages/ToolRouter';
import TechniquePage from './pages/TechniquePage';
import ArticlePage from './pages/ArticlesPage'


function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/techniques" element={<Techniques />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="/tools/:slug" element={<ToolRouter />} />
          <Route path="/techniques/:slug" element={<TechniquePage />}/>
          <Route path="/articles/:slug" element={<ArticlePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App