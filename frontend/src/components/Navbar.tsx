import React from 'react';
import { Book, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl">Human Skills</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/tools" 
              className={`${isActive('/tools') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}
            >
              Tools
            </Link>
            <Link 
              to="/techniques" 
              className={`${isActive('/techniques') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}
            >
              Techniques
            </Link>
            <Link 
              to="/articles" 
              className={`${isActive('/articles') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}
            >
              Articles
            </Link>
            <Link 
              to="/resources" 
              className={`${isActive('/resources') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}
            >
              Resources
            </Link>
            <Link 
              to="/about" 
              className={`${isActive('/about') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600`}
            >
              About
            </Link>
          </div>

          <button className="md:hidden">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;