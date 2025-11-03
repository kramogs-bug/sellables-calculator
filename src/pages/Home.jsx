import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Zap, ArrowRight, Sparkles, DollarSign, Package, Flame } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center animate-fadeInUp">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6 animate-bounce">
            <Sparkles size={16} />
            <span className="text-sm font-semibold">GraalOnline Era Trading Tool</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 animate-fadeInUp animation-delay-200">
            Calculate Your
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Gralats Instantly
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animation-delay-400">
            Your ultimate trading companion for <span className="font-bold text-blue-600">GraalOnline Era</span>. 
            Track sellables, calculate profits, and maximize your earnings—all in real-time.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fadeInUp animation-delay-600">
            <Link 
              to="/calculator" 
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <Calculator size={20} />
              Start Calculating
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/about" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 transform shadow-md hover:shadow-lg"
            >
              Learn More
            </Link>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-20 animate-fadeInUp animation-delay-800">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="text-3xl font-bold text-blue-600">21+</div>
              <div className="text-sm text-gray-600 font-medium">Sellable Items</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="text-3xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600 font-medium">Accurate</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="text-3xl font-bold text-purple-600">⚡</div>
              <div className="text-sm text-gray-600 font-medium">Instant</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100">
              <div className="text-3xl font-bold text-orange-600">Free</div>
              <div className="text-sm text-gray-600 font-medium">Forever</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fadeInUp animation-delay-1000">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-500 shadow-lg">
              <Calculator className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Instant Calculations</h3>
            <p className="text-gray-600 leading-relaxed">
              Enter item quantities and get instant total values in Gralats. Fast, accurate, and reliable every time.
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fadeInUp animation-delay-1200">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-500 shadow-lg">
              <TrendingUp className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Maximize Profits</h3>
            <p className="text-gray-600 leading-relaxed">
              Track all sellable items including shells, trash, minerals, and flowers to optimize your trading strategy.
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fadeInUp animation-delay-1400">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-500 shadow-lg">
              <Zap className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Lightweight & Fast</h3>
            <p className="text-gray-600 leading-relaxed">
              Designed for GraalOnline Era players. Quick loading, smooth animations, and easy to use anywhere, anytime.
            </p>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-12 mb-20 animate-fadeInUp animation-delay-1600 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Why Traders Love Us</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <DollarSign className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Auto-Save Progress</h3>
                  <p className="text-blue-100">Your data is automatically saved. Close and reopen anytime without losing progress.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">All Categories Covered</h3>
                  <p className="text-blue-100">Shells, trash, crab shells, minerals, and flowers—everything you can sell in Era.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Flame className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Real-Time Updates</h3>
                  <p className="text-blue-100">Watch your total Gralats update instantly as you add or remove items from your inventory.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Draggable Total Bar</h3>
                  <p className="text-blue-100">Move the floating total display anywhere on screen for maximum convenience while scrolling.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-12 mb-20 animate-fadeInUp animation-delay-1800 border border-gray-100">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Start Trading Smarter?</h2>
          <p className="text-xl text-gray-600 mb-8">Join GraalOnline Era players who track their profits effortlessly.</p>
          <Link 
            to="/calculator" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 transform text-lg"
          >
            <Calculator size={24} />
            Launch Calculator
            <ArrowRight size={24} />
          </Link>
        </div>

        {/* Footer - Discord Link */}
        <div className="text-center py-8 border-t border-gray-200 animate-fadeInUp animation-delay-2000">
          <p className="text-gray-600 mb-4 text-lg">Created with Love for the GraalOnline Era community</p>
          <a 
            href="https://discord.com/users/itzmekramogs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Contact Creator on Discord
          </a>
          <p className="text-sm text-gray-500 mt-4">@kramogss</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
          animation-fill-mode: both;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-1200 {
          animation-delay: 1.2s;
        }

        .animation-delay-1400 {
          animation-delay: 1.4s;
        }

        .animation-delay-1600 {
          animation-delay: 1.6s;
        }

        .animation-delay-1800 {
          animation-delay: 1.8s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .bg-grid-white\/10 {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
