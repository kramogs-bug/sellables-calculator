import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Zap, ArrowRight, Sparkles, DollarSign, Package, Flame, Code, ShoppingCart, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 text-blue-700 px-4 py-2 rounded-full mb-8 backdrop-blur-sm shadow-sm">
            <Sparkles size={18} className="text-blue-600" />
            <span className="text-sm font-bold">GraalOnline Era Trading Tool</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 mb-6">
            Calculate Your
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Gralats Instantly
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            Your ultimate trading companion for <span className="font-bold text-blue-600">GraalOnline Era</span>. 
            Track sellables, calculate profits, and maximize your earnings—all in real-time.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link 
              to="/calculator" 
              className="group bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Calculator size={22} />
              Start Calculating
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/about" 
              className="bg-white border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            >
              Learn More
            </Link>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-20">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">21+</div>
              <div className="text-sm text-slate-600 font-semibold">Sellable Items</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">100%</div>
              <div className="text-sm text-slate-600 font-semibold">Accurate</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">⚡</div>
              <div className="text-sm text-slate-600 font-semibold">Instant</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200">
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">Free</div>
              <div className="text-sm text-slate-600 font-semibold">Forever</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-20">
          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <Calculator className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Instant Calculations</h3>
            <p className="text-slate-600 leading-relaxed">
              Enter item quantities and get instant total values in Gralats. Fast, accurate, and reliable every time.
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <TrendingUp className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Maximize Profits</h3>
            <p className="text-slate-600 leading-relaxed">
              Track all sellable items including shells, trash, minerals, and flowers to optimize your trading strategy.
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <Zap className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Lightweight & Fast</h3>
            <p className="text-slate-600 leading-relaxed">
              Designed for GraalOnline Era players. Quick loading, smooth animations, and easy to use anywhere, anytime.
            </p>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 sm:p-12 mb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_70%)]"></div>
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Traders Love Us</h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">Everything you need to track and maximize your Graal earnings</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <DollarSign className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Auto-Save Progress</h3>
                  <p className="text-blue-100 leading-relaxed">Your data is automatically saved. Close and reopen anytime without losing progress.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">All Categories Covered</h3>
                  <p className="text-blue-100 leading-relaxed">Shells, trash, crab shells, minerals, and flowers—everything you can sell in Era.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Flame className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Real-Time Updates</h3>
                  <p className="text-blue-100 leading-relaxed">Watch your total Gralats update instantly as you add or remove items from your inventory.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Draggable Total Bar</h3>
                  <p className="text-blue-100 leading-relaxed">Move the floating total display anywhere on screen for maximum convenience while scrolling.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">All Your Trading Tools in One Place</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Complete suite of calculators and trackers for GraalOnline Era</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/calculator" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <Calculator className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Calculator</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Calculate total Gralats value of your sellables instantly</p>
            </Link>

            <Link to="/calculator" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <ShoppingCart className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tro Converter</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Convert your Tro to Gralats and plan purchases</p>
            </Link>

            <Link to="/tracker" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <BarChart3 className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Progress Tracker</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Track daily earnings and set achievable goals</p>
            </Link>

            <Link to="/codes" className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <Code className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Graal Codes</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Complete collection of HTML codes for your profile</p>
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 sm:p-12 mb-20 border border-slate-200">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Ready to Start Trading Smarter?</h2>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">Join GraalOnline Era players who track their profits effortlessly.</p>
          <Link 
            to="/calculator" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-5 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 text-lg"
          >
            <Calculator size={24} />
            Launch Calculator
            <ArrowRight size={24} />
          </Link>
        </div>

        {/* Footer - Discord Link */}
        <div className="text-center py-8 border-t border-slate-200">
          <p className="text-slate-600 mb-4 text-lg font-medium">Created with ❤️ for the GraalOnline Era community</p>
          <a 
            href="https://discord.com/users/itzmekramogs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Contact Creator on Discord
          </a>
          <p className="text-sm text-slate-500 mt-4 font-medium">@kramogss</p>
        </div>
      </div>
    </div>
  );
}