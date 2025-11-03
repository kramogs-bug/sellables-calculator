import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Info } from 'lucide-react';
import { useState } from 'react';
import { sellablesIcons } from '../assets/assets.js';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-slate-200 animate-slideDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex items-center animate-fadeIn">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <img 
                  src="/src/assets/calculator-nobg.png" 
                  alt="Calculator Icon"
                  className="w-30 h-15 transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback if calculator icon fails to load
                    console.warn('Calculator icon not found, using star icon as fallback');
                    e.target.src = sellablesIcons.star;
                    e.target.className = "w-10 h-10 transition-transform duration-300 group-hover:scale-110";
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-all duration-300">
                  Graal Calculator
                </h1>
                <p className="text-xs text-slate-500 font-medium transition-all duration-300 group-hover:text-blue-500">by kramogss</p>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 animate-fadeIn">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-semibold transform hover:scale-105 ${
                isActive('/') 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600 hover:shadow-md'
              }`}
            >
              <Home size={20} className="transition-transform duration-300 group-hover:rotate-12" />
              <span>Home</span>
            </Link>
            <Link 
              to="/calculator" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-semibold transform hover:scale-105 ${
                isActive('/calculator') 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600 hover:shadow-md'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <img 
                  src="/src/assets/calculator-nobg.png" 
                  alt="Calculator"
                  className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12"
                  onError={(e) => {
                    console.warn('Calculator icon not found for menu');
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <span>Calculator</span>
            </Link>
            <Link 
              to="/about" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-semibold transform hover:scale-105 ${
                isActive('/about') 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600 hover:shadow-md'
              }`}
            >
              <Info size={20} className="transition-transform duration-300 group-hover:rotate-12" />
              <span>About</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center animate-fadeIn">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <X 
                  size={24} 
                  className={`absolute inset-0 transition-all duration-300 ${
                    isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
                  }`}
                />
                <Menu 
                  size={24} 
                  className={`absolute inset-0 transition-all duration-300 ${
                    isOpen ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-white border-t border-slate-200 shadow-lg overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          <Link 
            to="/" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold transform hover:scale-105 hover:translate-x-2 ${
              isActive('/') 
                ? 'bg-blue-500 text-white shadow-lg scale-105' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
            }`}
            onClick={() => setIsOpen(false)}
            style={{ animationDelay: '0ms' }}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link 
            to="/calculator" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold transform hover:scale-105 hover:translate-x-2 ${
              isActive('/calculator') 
                ? 'bg-blue-500 text-white shadow-lg scale-105' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
            }`}
            onClick={() => setIsOpen(false)}
            style={{ animationDelay: '100ms' }}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <img 
                src="/src/assets/calculator-nobg.png" 
                alt="Calculator"
                className="w-4 h-4"
                onError={(e) => {
                  console.warn('Calculator icon not found for mobile menu');
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <span>Calculator</span>
          </Link>
          <Link 
            to="/about" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold transform hover:scale-105 hover:translate-x-2 ${
              isActive('/about') 
                ? 'bg-blue-500 text-white shadow-lg scale-105' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
            }`}
            onClick={() => setIsOpen(false)}
            style={{ animationDelay: '200ms' }}
          >
            <Info size={20} />
            <span>About</span>
          </Link>
        </div>
        
        {/* Mobile Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 animate-fadeIn">
          <p className="text-xs text-center text-slate-500 font-medium">
            Made with <span className="text-red-500 animate-pulse inline-block">❤️</span> by kramogs
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </nav>
  );
}