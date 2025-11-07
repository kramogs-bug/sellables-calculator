import { useState, useEffect } from 'react';
import { Search, Copy, Check, Sparkles, Zap, Palette, Image, Type, ShoppingBag, Sword, Heart, Code, Filter, X } from 'lucide-react';
import {
  categories,
  filterCodes,
  getTotalResults,
  getPreview,
  toggleCategory,
  selectAllCategories,
  clearAllCategories,
  copyToClipboard
} from './graalCodesBackend';

export default function GraalCodesModern() {
  const [activeCategories, setActiveCategories] = useState(['html']);
  const [copiedCode, setCopiedCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // Handle scroll to track header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      
      // Check if header is visible (rough calculation)
      const headerHeight = 80; // Approximate header height
      setIsHeaderVisible(currentScrollY < headerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter codes based on search term and active categories
  const filteredCodes = filterCodes(activeCategories, searchTerm);
  const totalResults = getTotalResults(filteredCodes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      </div>

      {/* Main Header - Always visible */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/95 border-b border-purple-500/30 shadow-2xl shadow-purple-500/20' 
          : 'bg-slate-900/70 border-b border-purple-500/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Graal Era Codes
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">Complete reference for customizing your profile</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-xs">{totalResults} Results</span>
              </div>
              
              {/* Toggle Search Bar Button in Header - Only visible when header is visible */}
              {isHeaderVisible && (
                <button
                  onClick={() => setShowSearchBar(!showSearchBar)}
                  className="p-2 bg-slate-800/50 border-2 border-purple-500/30 rounded-xl text-white hover:border-pink-500/50 hover:bg-slate-800 transition-all duration-300"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar - Hidden by default */}
      <div className={`sticky top-16 z-50 backdrop-blur-xl bg-slate-900/95 border-b border-purple-500/30 shadow-2xl shadow-purple-500/20 transition-all duration-500 ${
        showSearchBar ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 py-0 overflow-hidden border-b-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400 group-focus-within:text-pink-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by name, code, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800/50 border-2 border-purple-500/30 rounded-xl px-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-800 transition-all duration-300 shadow-lg shadow-purple-500/10 text-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 bg-slate-800/50 border-2 border-purple-500/30 rounded-xl text-white hover:border-pink-500/50 hover:bg-slate-800 transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {activeCategories.length > 0 && (
                  <span className="bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {activeCategories.length}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="bg-slate-800/50 border-2 border-purple-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm">Filter by Category</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => selectAllCategories(setActiveCategories)}
                      className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={() => clearAllCategories(setActiveCategories)}
                      className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {Object.entries(categories).map(([key, category]) => {
                    const IconComponent = category.icon;
                    const isActive = activeCategories.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleCategory(key, activeCategories, setActiveCategories)}
                        className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all duration-300 text-xs ${
                          isActive
                            ? `bg-gradient-to-r ${category.gradient} border-transparent text-white shadow-lg`
                            : 'bg-slate-700/50 border-slate-600/50 text-gray-300 hover:border-purple-500/50'
                        }`}
                      >
                        <IconComponent className="w-3 h-3" />
                        <span className="font-medium truncate">{category.title}</span>
                        <span className="opacity-70">({category.codes.length})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Summary */}
        <div className="mb-6 p-4 bg-slate-800/50 border border-purple-500/30 rounded-xl">
          <p className="text-gray-300 text-sm">
            Showing <span className="font-bold text-purple-400">{totalResults}</span> codes
            {activeCategories.length > 0 && (
              <span> in <span className="font-bold text-pink-400">{activeCategories.length}</span> categories</span>
            )}
            {searchTerm && (
              <span> for "<span className="font-bold text-cyan-400">{searchTerm}</span>"</span>
            )}
          </p>
        </div>

        {/* Codes Grid */}
        {filteredCodes.length > 0 ? (
          <div className="space-y-6">
            {filteredCodes.map(({ category, title, codes, gradient, icon }) => {
              const IconComponent = icon;
              return (
                <div key={category} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{title}</h2>
                      <p className="text-gray-400 text-xs">{codes.length} codes</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {codes.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700/50 rounded-xl p-4 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
                        
                        <div className="relative">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => copyToClipboard(item.code, item.id, setCopiedCode)}
                              className={`flex-shrink-0 px-3 py-1.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 text-xs ${
                                copiedCode === item.id
                                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/50'
                                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                              }`}
                            >
                              {copiedCode === item.id ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span className="hidden sm:inline">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span className="hidden sm:inline">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          
                          <p className="text-xs text-gray-400 mb-2">{item.desc}</p>
                          
                          {/* Preview */}
                          <div className="mb-2" dangerouslySetInnerHTML={{ __html: getPreview(item) }} />
                          
                          {/* Code Display */}
                          <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-2 overflow-x-auto">
                            <code className="text-xs text-green-400 font-mono whitespace-nowrap">
                              {item.code}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border-2 border-slate-700/50 mb-4">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No codes found</h3>
            <p className="text-gray-400 mb-4 text-sm">Try adjusting your filters or search terms</p>
            <button
              onClick={() => selectAllCategories(setActiveCategories)}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-sm"
            >
              Show All Codes
            </button>
          </div>
        )}
      </main>

      {/* Floating Search Toggle Button - Only shows when header search button is not visible */}
      {!isHeaderVisible && !showSearchBar && (
        <button
          onClick={() => setShowSearchBar(true)}
          className="fixed top-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-110 group"
        >
          <Search className="w-6 h-6" />
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Show Search Bar
          </div>
        </button>
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-16 border-t border-purple-500/20 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-purple-400">
              <Sparkles className="w-4 h-4" />
              <p className="text-xs sm:text-sm font-semibold">Copy any code and paste it into your Graal Era status!</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-green-500" />
                Real code previews
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                Multiple category filters
              </span>
              <span className="flex items-center gap-1">
                <Code className="w-3 h-3 text-blue-500" />
                {Object.values(categories).reduce((sum, cat) => sum + cat.codes.length, 0)}+ codes available
              </span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}