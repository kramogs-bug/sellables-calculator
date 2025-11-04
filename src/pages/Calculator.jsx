import { useState, useEffect } from 'react';
import { DollarSign, ChevronDown, Plus, Minus, RotateCcw, ArrowRightLeft, ShoppingCart, Coins } from 'lucide-react';

// Import icons from assets.js
import { sellablesIcons } from "../assets/assets.js";

const sellableItems = {
  shells: [
    { name: "Tro", price: 3, icon: sellablesIcons.tro },
    { name: "Aero", price: 3, icon: sellablesIcons.aero },
    { name: "Sand Dollar", price: 5, icon: sellablesIcons.sandDollar },
    { name: "Scallop", price: 5, icon: sellablesIcons.scallop },
    { name: "Starfish", price: 7, icon: sellablesIcons.star },
  ],
  trash: [
    { name: "Bottle", price: 5, icon: sellablesIcons.bottle },
    { name: "Paper", price: 4, icon: sellablesIcons.paper },
    { name: "NewsPaper", price: 4, icon: sellablesIcons.news },
    { name: "Tires", price: 6, icon: sellablesIcons.tires },
  ],
  crabshells: [
    { name: "Crabshells", price: 6, icon: sellablesIcons.crabshell },
  ],
  minerals: [
    { name: "Minerals", price: 5, icon: sellablesIcons.mineral },
  ],
  rareminerals: [
    { name: "Gold", price: 10, icon: sellablesIcons.gold },
    { name: "Diamond", price: 10, icon: sellablesIcons.diamond },
    { name: "Emerald", price: 8, icon: sellablesIcons.emerald },
    { name: "Ruby", price: 7, icon: sellablesIcons.ruby },
    { name: "Sapphire", price: 7, icon: sellablesIcons.sapphire },
  ],
  flowers: [
    { name: "Mum", price: 0.3, icon: sellablesIcons.mum, unit: "flowers", displayPrice: "10pcs = 3 Gralats" },
    { name: "Tulip", price: 0.4, icon: sellablesIcons.tulip, unit: "flowers", displayPrice: "10pcs = 4 Gralats" },
    { name: "Carnation", price: 0.5, icon: sellablesIcons.carnation, unit: "flowers", displayPrice: "10pcs = 5 Gralats" },
    { name: "Aster", price: 0.6, icon: sellablesIcons.aster, unit: "flowers", displayPrice: "10pcs = 6 Gralats" },
    { name: "Rose", price: 0.7, icon: sellablesIcons.rose, unit: "flowers", displayPrice: "10pcs = 7 Gralats" },
  ],
};

// Function to safely evaluate mathematical expressions and validate input
const evaluateExpression = (expression) => {
  if (!expression || expression === '') return { value: 0, isValid: true };
  
  const expr = String(expression).replace(/\s+/g, '');
  
  if (expr === '') return { value: 0, isValid: true };
  
  try {
    const result = new Function(`return ${expr}`)();
    const finalValue = Math.max(0, Math.floor(Number(result))) || 0;
    return { value: finalValue, isValid: true };
  } catch (error) {
    return { value: 0, isValid: true };
  }
};

// Tro to Gralats Converter Component
function TroToGralatsConverter({ onBack, initialData }) {
  const [troQuantities, setTroQuantities] = useState(initialData?.troQuantities || {});
  const [troInputValues, setTroInputValues] = useState(() => {
    const quantities = initialData?.troQuantities || {};
    const inputs = {};
    Object.keys(quantities).forEach(key => {
      inputs[key] = quantities[key] > 0 ? quantities[key].toString() : '';
    });
    return inputs;
  });

  const [troRatio, setTroRatio] = useState(initialData?.troRatio || 3.8);
  const [availableTro, setAvailableTro] = useState(initialData?.availableTro || 0);
  const [availableTroInput, setAvailableTroInput] = useState(initialData?.availableTro ? initialData.availableTro.toString() : '');

  const [expandedCategories, setExpandedCategories] = useState(initialData?.troExpandedCategories || {
    shells: true,
    trash: true,
    crabshells: true,
    minerals: true,
    rareminerals: true,
    flowers: true
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const categories = {
    shells: { 
      name: "Shells", 
      icon: sellablesIcons.shell,
      bgColor: "bg-blue-500/10",
    },
    trash: { 
      name: "Trash Items", 
      icon: sellablesIcons.trash,
      bgColor: "bg-emerald-500/10",
    },
    crabshells: {
      name: "Crab Shells",
      icon: sellablesIcons.crabshell,
      bgColor: "bg-orange-500/10",
    },
    minerals: { 
      name: "Minerals", 
      icon: sellablesIcons.mineral,
      bgColor: "bg-purple-500/10",
    },
    rareminerals: { 
      name: "Rare Minerals", 
      icon: sellablesIcons.rareMineral,
      bgColor: "bg-violet-500/10",
    },
    flowers: {
      name: "Flowers",
      icon: sellablesIcons.flowers,
      bgColor: "bg-pink-500/10",
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const calculateMaxAffordableQuantity = (itemPrice) => {
    if (itemPrice <= 0) return 0;
    
    const currentTotalCost = calculateTotalTroCost();
    const remainingBeforeThisItem = availableTro - currentTotalCost;
    
    if (remainingBeforeThisItem <= 0) return 0;
    
    const troCostPerItem = itemPrice / troRatio;
    const maxAffordable = Math.floor(remainingBeforeThisItem / troCostPerItem);
    
    return Math.max(0, maxAffordable);
  };

  const handleTroQuantityChange = (itemName, value, itemPrice) => {
    if (availableTro <= 0 && value !== '' && value !== '0') {
      return;
    }

    setTroInputValues(prev => ({
      ...prev,
      [itemName]: value
    }));
    
    if (value === '' || value === null || value === undefined) {
      setTroQuantities(prev => ({
        ...prev,
        [itemName]: 0
      }));
    } else {
      const { value: evaluatedValue } = evaluateExpression(value);
      
      const newTroCost = (itemPrice * evaluatedValue) / troRatio;
      const currentTotalCost = calculateTotalTroCost();
      const currentItemCost = (itemPrice * (troQuantities[itemName] || 0)) / troRatio;
      const newTotalCost = currentTotalCost - currentItemCost + newTroCost;
      
      if (newTotalCost <= availableTro) {
        setTroQuantities(prev => ({
          ...prev,
          [itemName]: evaluatedValue
        }));
      } else {
        const maxAffordable = calculateMaxAffordableQuantity(itemPrice);
        setTroQuantities(prev => ({
          ...prev,
          [itemName]: maxAffordable
        }));
        setTroInputValues(prev => ({
          ...prev,
          [itemName]: maxAffordable > 0 ? maxAffordable.toString() : ''
        }));
      }
    }
  };

  const handleTroQuantityBlur = (itemName, itemPrice) => {
    const value = troInputValues[itemName] || '';
    if (value === '') return;

    const { value: evaluatedValue } = evaluateExpression(value);
    
    const newTroCost = (itemPrice * evaluatedValue) / troRatio;
    const currentTotalCost = calculateTotalTroCost();
    const currentItemCost = (itemPrice * (troQuantities[itemName] || 0)) / troRatio;
    const newTotalCost = currentTotalCost - currentItemCost + newTroCost;
    
    if (newTotalCost <= availableTro && evaluatedValue > 0) {
      setTroInputValues(prev => ({
        ...prev,
        [itemName]: evaluatedValue.toString()
      }));
      setTroQuantities(prev => ({
        ...prev,
        [itemName]: evaluatedValue
      }));
    } else {
      const maxAffordable = calculateMaxAffordableQuantity(itemPrice);
      setTroInputValues(prev => ({
        ...prev,
        [itemName]: maxAffordable > 0 ? maxAffordable.toString() : ''
      }));
      setTroQuantities(prev => ({
        ...prev,
        [itemName]: maxAffordable
      }));
    }
  };

  const handleTroQuantityKeyPress = (e, itemName, itemPrice) => {
    if (e.key === 'Enter') {
      handleTroQuantityBlur(itemName, itemPrice);
      e.target.blur();
    }
  };

  const incrementTroQuantity = (itemName, itemPrice) => {
    if (availableTro <= 0) return;
    
    const currentValue = troQuantities[itemName] || 0;
    const newTroCost = (itemPrice * (currentValue + 1)) / troRatio;
    const currentTotalCost = calculateTotalTroCost();
    const currentItemCost = (itemPrice * currentValue) / troRatio;
    const newTotalCost = currentTotalCost - currentItemCost + newTroCost;
    
    if (newTotalCost <= availableTro) {
      const newValue = currentValue + 1;
      setTroQuantities(prev => ({
        ...prev,
        [itemName]: newValue
      }));
      setTroInputValues(prev => ({
        ...prev,
        [itemName]: newValue.toString()
      }));
    }
  };

  const decrementTroQuantity = (itemName) => {
    const currentValue = troQuantities[itemName] || 0;
    const newValue = Math.max(0, currentValue - 1);
    setTroQuantities(prev => ({
      ...prev,
      [itemName]: newValue
    }));
    setTroInputValues(prev => ({
      ...prev,
      [itemName]: newValue > 0 ? newValue.toString() : ''
    }));
  };

  const handleAvailableTroChange = (value) => {
    setAvailableTroInput(value);
    
    if (value === '' || value === null || value === undefined) {
      setAvailableTro(0);
    } else {
      const { value: evaluatedValue } = evaluateExpression(value);
      setAvailableTro(evaluatedValue);
    }
  };

  const handleAvailableTroBlur = () => {
    const value = availableTroInput || '';
    if (value === '') {
      setAvailableTroInput('');
      return;
    }

    const { value: evaluatedValue } = evaluateExpression(value);
    
    if (evaluatedValue > 0) {
      setAvailableTroInput(evaluatedValue.toString());
      setAvailableTro(evaluatedValue);
    }
  };

  const incrementAvailableTro = () => {
    const newValue = availableTro + 1;
    setAvailableTro(newValue);
    setAvailableTroInput(newValue.toString());
  };

  const decrementAvailableTro = () => {
    const newValue = Math.max(0, availableTro - 1);
    setAvailableTro(newValue);
    setAvailableTroInput(newValue > 0 ? newValue.toString() : '');
  };

  const calculateTotalTroCost = () => {
    let total = 0;
    Object.entries(sellableItems).forEach(([category, items]) => {
      items.forEach(item => {
        const gralatsValue = item.price * (troQuantities[item.name] || 0);
        const troCost = gralatsValue / troRatio;
        total += troCost;
      });
    });
    return total;
  };

  const calculateGralatsNeeded = () => {
    let total = 0;
    Object.entries(sellableItems).forEach(([category, items]) => {
      items.forEach(item => {
        total += item.price * (troQuantities[item.name] || 0);
      });
    });
    return total.toFixed(2);
  };

  const calculateRemainingTro = () => {
    const totalTroCost = calculateTotalTroCost();
    return (availableTro - totalTroCost).toFixed(2);
  };

  const resetTroCalculator = () => {
    setTroQuantities({});
    setTroInputValues({});
    setAvailableTro(0);
    setAvailableTroInput('');
  };

  const handleTroRatioChange = (value) => {
    let ratio = parseFloat(value) || 1;
    ratio = Math.max(0.1, Math.min(100, ratio));
    setTroRatio(ratio);
  };

  const incrementTroRatio = () => {
    setTroRatio(prev => {
      const newValue = parseFloat((prev + 0.1).toFixed(1));
      return Math.min(100, newValue);
    });
  };

  const decrementTroRatio = () => {
    setTroRatio(prev => {
      const newValue = parseFloat((prev - 0.1).toFixed(1));
      return Math.max(0.1, newValue);
    });
  };

  const totalTroCost = calculateTotalTroCost();
  const gralatsNeeded = calculateGralatsNeeded();
  const remainingTro = calculateRemainingTro();
  const hasEnoughTro = remainingTro >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-all duration-300 border border-slate-300 mb-6 hover:scale-105"
          >
            <ArrowRightLeft size={16} />
            Back to Calculator
          </button>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg border border-amber-200 mb-6">
            <ShoppingCart className="text-amber-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Tro to Gralats Converter
          </h1>
          <p className="text-lg text-slate-600 font-medium">Calculate Gralats needed for Tro purchases</p>
        </div>

        {(isMobile && isScrolled) && (
          <div className="fixed top-4 left-4 right-4 z-50 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-4 border-2 border-amber-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="text-white" size={20} />
                <div>
                  <p className="text-xs text-white/80 font-medium">Remaining</p>
                  <p className="text-lg font-bold text-white">
                    {remainingTro} Tro
                  </p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-lg ${hasEnoughTro ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                <p className="text-xs font-semibold text-white">
                  {hasEnoughTro ? '✅ Enough' : '❌ Low'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <Coins className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Available Tro</p>
                <p className="text-3xl sm:text-4xl font-bold text-slate-800">
                  {availableTro.toLocaleString()} <span className="text-xl sm:text-2xl text-slate-500">Tro</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementAvailableTro}
                className="w-10 h-10 bg-white hover:bg-red-100 border-2 border-slate-300 hover:border-red-400 text-slate-700 hover:text-red-600 rounded-xl transition-all duration-300 flex items-center justify-center font-bold shadow-sm"
              >
                <Minus size={16} />
              </button>
              <input
                type="text"
                value={availableTroInput}
                onChange={(e) => handleAvailableTroChange(e.target.value)}
                onBlur={handleAvailableTroBlur}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAvailableTroBlur();
                    e.target.blur();
                  }
                }}
                className="w-32 text-center text-xl sm:text-2xl font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl py-2 sm:py-3 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="0"
              />
              <button
                onClick={incrementAvailableTro}
                className="w-10 h-10 bg-white hover:bg-green-100 border-2 border-slate-300 hover:border-green-400 text-slate-700 hover:text-green-600 rounded-xl transition-all duration-300 flex items-center justify-center font-bold shadow-sm"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 rounded-2xl shadow-lg border-2 border-amber-300 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <img src={sellablesIcons.tro} alt="Tro" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900 uppercase">Total Tro Cost</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {totalTroCost.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-amber-200/30">
              <p className="text-xs text-amber-900 font-medium text-center">
                Cost in Tro for selected items
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 rounded-2xl shadow-lg border-2 border-blue-300 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <DollarSign className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 uppercase">Gralats Needed</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {gralatsNeeded}
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-blue-200/30">
              <p className="text-xs text-blue-900 font-medium text-center">
                Gralats required for purchase
              </p>
            </div>
          </div>

          <div className={`rounded-2xl shadow-lg border-2 p-6 ${
            hasEnoughTro 
              ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 border-green-300' 
              : 'bg-gradient-to-r from-red-400 via-rose-500 to-pink-500 border-red-300'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Coins className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white uppercase">Remaining Tro</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {remainingTro}
                </p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30">
              <p className="text-xs text-white font-medium text-center">
                {hasEnoughTro ? 'Sufficient Tro' : 'Insufficient Tro'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-8">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
            <label className="block text-sm font-semibold text-slate-600 mb-4">
              Conversion Ratio (Gralats ÷ Ratio = Tro Cost)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementTroRatio}
                disabled={troRatio <= 0.1}
                className="w-10 h-10 bg-white hover:bg-slate-200 border-2 border-slate-300 text-slate-700 rounded-xl transition-all duration-300 flex items-center justify-center font-bold shadow-sm disabled:opacity-50"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                value={troRatio}
                onChange={(e) => handleTroRatioChange(e.target.value)}
                className="flex-1 text-center text-xl sm:text-2xl font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl py-2 sm:py-3 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={incrementTroRatio}
                disabled={troRatio >= 100}
                className="w-10 h-10 bg-white hover:bg-slate-200 border-2 border-slate-300 text-slate-700 rounded-xl transition-all duration-300 flex items-center justify-center font-bold shadow-sm disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="mt-4 bg-white/50 rounded-lg p-3 border border-amber-200">
              <p className="text-xs text-amber-700 font-medium text-center">
                Calculation: (Item Price × Quantity) ÷ {troRatio} = Tro Cost
              </p>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={resetTroCalculator}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-700 font-semibold rounded-xl transition-all duration-300 border border-slate-300 hover:border-red-500"
            >
              <RotateCcw size={16} />
              Reset All
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-20">
          {Object.entries(categories).map(([categoryKey, category]) => {
            const categoryTotal = sellableItems[categoryKey].reduce((sum, item) => {
              const gralatsNeeded = item.price * (troQuantities[item.name] || 0);
              const troCost = gralatsNeeded / troRatio;
              return sum + troCost;
            }, 0);

            return (
              <div key={categoryKey} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => toggleCategory(categoryKey)}
                  className={`w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-slate-50 ${category.bgColor}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                      <img src={category.icon} alt={category.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-800">{category.name}</h2>
                      <p className="text-xs sm:text-sm text-slate-500">{sellableItems[categoryKey].length} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <p className="text-base sm:text-lg font-bold text-slate-800">
                      {categoryTotal.toFixed(2)} <span className="text-xs sm:text-sm text-slate-500">Tro</span>
                    </p>
                    <ChevronDown className="text-slate-500" size={18} style={{ transform: expandedCategories[categoryKey] ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                </button>

                {expandedCategories[categoryKey] && (
                  <div className="px-4 sm:px-6 py-4 border-t border-slate-200">
                    <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${
                      sellableItems[categoryKey].length === 1 
                        ? 'sm:grid-cols-1 sm:max-w-md sm:mx-auto' 
                        : 'sm:grid-cols-2'
                    }`}>
                      {sellableItems[categoryKey].map((item) => {
                        const currentQty = troQuantities[item.name] || 0;
                        const currentInput = troInputValues[item.name] !== undefined ? troInputValues[item.name] : '';
                        const isExpression = currentInput && /[+\-*/()]/.test(currentInput);
                        const gralatsNeeded = item.price * currentQty;
                        const troCost = gralatsNeeded / troRatio;
                        const maxAffordable = calculateMaxAffordableQuantity(item.price);
                        const canAffordMore = maxAffordable > currentQty;
                        const isDisabled = availableTro <= 0;
                        
                        return (
                          <div
                            key={item.name}
                            className={`bg-slate-50 rounded-xl p-3 sm:p-4 border transition-all ${
                              isDisabled ? 'opacity-60 border-slate-300' : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-lg border border-slate-200">
                                <img 
                                  src={item.icon} 
                                  alt={item.name}
                                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{item.name}</p>
                                <p className="text-xs sm:text-sm text-amber-600 font-medium">
                                  {item.displayPrice || `${item.price} Gralats${item.unit === 'flowers' ? '/pc' : ''}`}
                                </p>
                                {!canAffordMore && currentQty > 0 && (
                                  <p className="text-xs text-red-500 font-medium mt-1">
                                    Max affordable: {maxAffordable}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => decrementTroQuantity(item.name)}
                                disabled={isDisabled || currentQty <= 0}
                                className="w-8 h-8 sm:w-9 sm:h-9 bg-white hover:bg-red-100 border-2 border-slate-300 hover:border-red-400 text-slate-700 hover:text-red-600 rounded-lg transition-all duration-300 flex items-center justify-center font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus size={14} />
                              </button>
                              
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  value={currentInput}
                                  onChange={(e) => handleTroQuantityChange(item.name, e.target.value, item.price)}
                                  onBlur={() => handleTroQuantityBlur(item.name, item.price)}
                                  onKeyPress={(e) => handleTroQuantityKeyPress(e, item.name, item.price)}
                                  disabled={isDisabled}
                                  className={`w-full text-center text-base sm:text-lg font-bold rounded-lg py-1.5 sm:py-2 px-2 focus:outline-none focus:ring-2 border-2 transition-colors ${
                                    isDisabled
                                      ? 'text-slate-400 bg-slate-100 border-slate-300 cursor-not-allowed'
                                      : 'text-slate-900 bg-white border-slate-300 focus:ring-amber-500 focus:border-amber-500'
                                  }`}
                                  placeholder="0"
                                />
                                {isExpression && currentQty > 0 && (
                                  <div className="absolute -bottom-5 left-0 right-0">
                                    <p className="text-xs text-green-600 text-center font-medium">
                                      = {currentQty}
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                              <button
                                onClick={() => incrementTroQuantity(item.name, item.price)}
                                disabled={isDisabled || !canAffordMore}
                                className="w-8 h-8 sm:w-9 sm:h-9 bg-white hover:bg-green-100 border-2 border-slate-300 hover:border-green-400 text-slate-700 hover:text-green-600 rounded-lg transition-all duration-300 flex items-center justify-center font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                                <span className="text-slate-500 font-medium">Gralats:</span>
                                <span className="font-bold text-slate-800">
                                  {gralatsNeeded.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-amber-600">
                                <span>Tro Cost:</span>
                                <span className="font-bold">
                                  {troCost.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Main Calculator Component
export default function CalculatorPage() {
  const [currentPage, setCurrentPage] = useState('main');
  const [quantities, setQuantities] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({
    shells: true,
    trash: true,
    crabshells: true,
    minerals: true,
    rareminerals: true,
    flowers: true
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [troRatio, setTroRatio] = useState(3.8);
  const [showTroConversion, setShowTroConversion] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setPosition({
        x: window.innerWidth / 2 - 150,
        y: 20
      });
    }
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging) {
        const touch = e.touches[0];
        setPosition({
          x: touch.clientX - dragOffset.x,
          y: touch.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleTroConversion = () => {
    setShowTroConversion(prev => !prev);
  };

  const handleQuantityChange = (itemName, value) => {
    setInputValues(prev => ({
      ...prev,
      [itemName]: value
    }));
    
    if (value === '' || value === null || value === undefined) {
      setQuantities(prev => ({
        ...prev,
        [itemName]: 0
      }));
    } else {
      const { value: evaluatedValue } = evaluateExpression(value);
      setQuantities(prev => ({
        ...prev,
        [itemName]: evaluatedValue
      }));
    }
  };

  const handleQuantityBlur = (itemName) => {
    const value = inputValues[itemName] || '';
    if (value === '') return;

    const { value: evaluatedValue } = evaluateExpression(value);
    
    if (evaluatedValue > 0) {
      setInputValues(prev => ({
        ...prev,
        [itemName]: evaluatedValue.toString()
      }));
      setQuantities(prev => ({
        ...prev,
        [itemName]: evaluatedValue
      }));
    }
  };

  const handleQuantityKeyPress = (e, itemName) => {
    if (e.key === 'Enter') {
      handleQuantityBlur(itemName);
      e.target.blur();
    }
  };

  const incrementQuantity = (itemName) => {
    const currentValue = quantities[itemName] || 0;
    const newValue = currentValue + 1;
    setQuantities(prev => ({
      ...prev,
      [itemName]: newValue
    }));
    setInputValues(prev => ({
      ...prev,
      [itemName]: newValue.toString()
    }));
  };

  const decrementQuantity = (itemName) => {
    const currentValue = quantities[itemName] || 0;
    const newValue = Math.max(0, currentValue - 1);
    setQuantities(prev => ({
      ...prev,
      [itemName]: newValue
    }));
    setInputValues(prev => ({
      ...prev,
      [itemName]: newValue > 0 ? newValue.toString() : ''
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    Object.entries(sellableItems).forEach(([category, items]) => {
      items.forEach(item => {
        total += item.price * (quantities[item.name] || 0);
      });
    });
    return total;
  };

  const resetAll = () => {
    setQuantities({});
    setInputValues({});
  };

  const handleTroRatioChange = (value) => {
    let ratio = parseFloat(value) || 1;
    ratio = Math.max(1, Math.min(10, ratio));
    setTroRatio(ratio);
  };

  const incrementTroRatio = () => {
    setTroRatio(prev => {
      const newValue = parseFloat((prev + 0.1).toFixed(1));
      return Math.min(10, newValue);
    });
  };

  const decrementTroRatio = () => {
    setTroRatio(prev => {
      const newValue = parseFloat((prev - 0.1).toFixed(1));
      return Math.max(1, newValue);
    });
  };

  const calculateTroValue = () => {
    return (total / troRatio).toFixed(2);
  };

  const categories = {
    shells: { 
      name: "Shells", 
      icon: sellablesIcons.shell,
      bgColor: "bg-blue-500/10",
    },
    trash: { 
      name: "Trash Items", 
      icon: sellablesIcons.trash,
      bgColor: "bg-emerald-500/10",
    },
    crabshells: {
      name: "Crab Shells",
      icon: sellablesIcons.crabshell,
      bgColor: "bg-orange-500/10",
    },
    minerals: { 
      name: "Minerals", 
      icon: sellablesIcons.mineral,
      bgColor: "bg-purple-500/10",
    },
    rareminerals: { 
      name: "Rare Minerals", 
      icon: sellablesIcons.rareMineral,
      bgColor: "bg-violet-500/10",
    },
    flowers: {
      name: "Flowers",
      icon: sellablesIcons.flowers,
      bgColor: "bg-pink-500/10",
    }
  };

  const total = calculateTotal();


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg border border-blue-200 mb-6 hover:scale-110 hover:rotate-3 transition-all duration-300">
            <DollarSign className="text-blue-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Sellables Calculator
          </h1>
          <p className="text-lg text-slate-600 font-medium">Track your Gralats in real-time</p>
        </div>

        <div 
          className={`fixed z-50 transition-opacity duration-500 ${
            (isMobile || isScrolled) ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <div 
            className="select-none"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className={`bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl shadow-2xl px-4 sm:px-6 py-4 backdrop-blur-lg border-2 border-green-400/50 max-w-sm ${
              isDragging ? 'scale-105 shadow-3xl ring-4 ring-green-300/50' : 'hover:shadow-3xl'
            }`}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <DollarSign className="text-white" size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">Total Value</p>
                    <p className="text-lg sm:text-2xl font-bold text-white whitespace-nowrap">
                      {total.toLocaleString()} <span className="text-sm sm:text-base text-white/80">Gralats</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTroConversion}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 font-semibold rounded-xl transition-all duration-300 border backdrop-blur-sm hover:scale-105 ${
                      showTroConversion 
                        ? 'bg-amber-500/80 hover:bg-amber-600/80 text-white border-amber-400' 
                        : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                    }`}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <img 
                        src={sellablesIcons.tro} 
                        alt="Tro"
                        className="w-3 h-3 object-contain"
                      />
                    </div>
                    <span className="text-xs hidden xs:inline">Tro</span>
                  </button>
                  
                  <button
                    onClick={resetAll}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl transition-all duration-300 border border-white/30 hover:scale-105 group"
                  >
                    <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-xs hidden sm:inline">Reset</span>
                  </button>
                </div>
              </div>
              
              {showTroConversion && (
                <div className="pt-3 border-t border-white/20">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-400/30 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                          <img 
                            src={sellablesIcons.tro} 
                            alt="Tro"
                            className="w-3 h-3 sm:w-4 sm:h-4 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/70 font-medium">Tro Value</p>
                          <p className="text-lg sm:text-xl font-bold text-white">
                            {calculateTroValue()} <span className="text-xs sm:text-sm text-white/80">Tro</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg p-3 border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/80 font-medium">Ratio</span>
                        <span className="text-xs text-white/60">{troRatio}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={decrementTroRatio}
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          disabled={troRatio <= 1}
                          className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg border border-white/30 transition-all duration-300 disabled:opacity-50"
                        >
                          <Minus size={14} className="mx-auto" />
                        </button>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="10"
                          value={troRatio}
                          onChange={(e) => handleTroRatioChange(e.target.value)}
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          className="flex-1 text-center text-sm font-bold text-slate-900 bg-white rounded-md py-2 px-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <button
                          onClick={incrementTroRatio}
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          disabled={troRatio >= 10}
                          className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg border border-white/30 transition-all duration-300 disabled:opacity-50"
                        >
                          <Plus size={14} className="mx-auto" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-2 border border-white/20">
                      <p className="text-xs text-white/60 text-center">
                        {total.toLocaleString()} ÷ {troRatio} = {calculateTroValue()} Tro
                      </p>
                    </div>

                    <button
                      onClick={() => setCurrentPage('tro-converter')}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg py-2 px-3 border border-white/30 transition-all duration-300 hover:scale-105"
                    >
                      <ShoppingCart size={14} />
                      <span className="text-xs">Tro to Gralats Converter</span>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="mt-2 text-center">
                <p className="text-xs text-white/60 font-medium">
                  {isMobile ? '👆 Tap and hold to move' : '✋ Drag to move'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <DollarSign className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Value</p>
                <p className="text-3xl sm:text-4xl font-bold text-slate-800">
                  {total.toLocaleString()} <span className="text-xl sm:text-2xl text-slate-500">Gralats</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
              <button
                onClick={toggleTroConversion}
                className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-3 font-semibold rounded-xl transition-all duration-300 border hover:scale-105 ${
                  showTroConversion 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600' 
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300'
                }`}
              >
                <img src={sellablesIcons.tro} alt="Tro" className="w-4 h-4 object-contain" />
                <span className="text-sm sm:text-base">Tro Conversion</span>
                <ChevronDown size={16} className={showTroConversion ? 'rotate-180' : ''} />
              </button>

              <button
                onClick={() => setCurrentPage('tro-converter')}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-orange-100 hover:bg-orange-500 hover:text-white text-orange-700 font-semibold rounded-xl transition-all duration-300 border border-orange-300 hover:border-orange-500"
              >
                <ShoppingCart size={16} />
                <span className="text-sm sm:text-base">Tro to Gralats</span>
              </button>

              <button
                onClick={resetAll}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-700 font-semibold rounded-xl transition-all duration-300 border border-slate-300 hover:border-red-500"
              >
                <RotateCcw size={16} />
                <span className="text-sm sm:text-base">Reset All</span>
              </button>
            </div>
          </div>

          {showTroConversion && (
            <div className="pt-6 border-t border-slate-200">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row items-stretch gap-6">
                  <div className="flex-1 bg-gradient-to-br from-slate-50 to-amber-50 rounded-xl p-4 sm:p-6 border border-amber-200">
                    <label className="block text-sm font-semibold text-slate-600 mb-4">
                      Conversion Ratio (Gralats ÷ Ratio = Tro)
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={decrementTroRatio}
                        disabled={troRatio <= 1}
                        className="w-10 h-10 bg-white hover:bg-slate-200 border-2 border-slate-300 text-slate-700 rounded-xl transition-all duration-300 flex items-center justify-center font-bold shadow-sm disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="10"
                        value={troRatio}
                        onChange={(e) => handleTroRatioChange(e.target.value)}
                        className="flex-1 text-center text-xl sm:text-2xl font-bold text-slate-900 bg-white border-2 border-slate-300 rounded-xl py-2 sm:py-3 px-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        onClick={incrementTroRatio}
                        disabled={troRatio >= 10}
                        className="w-10 h-10 bg-white hover:bg-slate-200 border-2 border-slate-300 text-slate-700 rounded-xl transition-all duration-300 flex items-center justify-center font-bold shadow-sm disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="lg:w-80 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 rounded-xl p-4 sm:p-6 shadow-lg border-2 border-amber-300">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <img src={sellablesIcons.tro} alt="Tro" className="w-6 h-6 object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-amber-900 uppercase">Tro Value</p>
                        <p className="text-3xl sm:text-4xl font-bold text-white">
                          {calculateTroValue()}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-amber-200/30">
                      <p className="text-xs text-amber-900 font-medium text-center">
                        {total.toLocaleString()} ÷ {troRatio} = {calculateTroValue()} Tro
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setCurrentPage('tro-converter')}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <ShoppingCart size={16} />
                    <span>Open Tro to Gralats Converter</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 mb-20">
          {Object.entries(categories).map(([categoryKey, category]) => {
            const categoryTotal = sellableItems[categoryKey].reduce((sum, item) => 
              sum + (item.price * (quantities[item.name] || 0)), 0
            );

            return (
              <div key={categoryKey} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => toggleCategory(categoryKey)}
                  className={`w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between hover:bg-slate-50 ${category.bgColor}`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                      <img src={category.icon} alt={category.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-800">{category.name}</h2>
                      <p className="text-xs sm:text-sm text-slate-500">{sellableItems[categoryKey].length} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <p className="text-base sm:text-lg font-bold text-slate-800">
                      {categoryTotal.toLocaleString()} <span className="text-xs sm:text-sm text-slate-500">Gralats</span>
                    </p>
                    <ChevronDown className="text-slate-500" size={18} style={{ transform: expandedCategories[categoryKey] ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                </button>

                {expandedCategories[categoryKey] && (
                  <div className="px-4 sm:px-6 py-4 border-t border-slate-200">
                    <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${
                      sellableItems[categoryKey].length === 1 
                        ? 'sm:grid-cols-1 sm:max-w-md sm:mx-auto' 
                        : 'sm:grid-cols-2'
                    }`}>
                      {sellableItems[categoryKey].map((item) => {
                        const currentQty = quantities[item.name] || 0;
                        const currentInput = inputValues[item.name] !== undefined ? inputValues[item.name] : '';
                        const isExpression = currentInput && /[+\-*/()]/.test(currentInput);
                        
                        return (
                          <div
                            key={item.name}
                            className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200 hover:border-slate-300 transition-all"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-lg border border-slate-200">
                                <img 
                                  src={item.icon} 
                                  alt={item.name}
                                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{item.name}</p>
                                <p className="text-xs sm:text-sm text-emerald-600 font-medium">
                                  {item.displayPrice || `${item.price} Gralats${item.unit === 'flowers' ? '/pc' : ''}`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => decrementQuantity(item.name)}
                                className="w-8 h-8 sm:w-9 sm:h-9 bg-white hover:bg-red-100 border-2 border-slate-300 hover:border-red-400 text-slate-700 hover:text-red-600 rounded-lg transition-all duration-300 flex items-center justify-center font-bold shadow-sm"
                              >
                                <Minus size={14} />
                              </button>
                              
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  value={currentInput}
                                  onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                                  onBlur={() => handleQuantityBlur(item.name)}
                                  onKeyPress={(e) => handleQuantityKeyPress(e, item.name)}
                                  className="w-full text-center text-base sm:text-lg font-bold rounded-lg py-1.5 sm:py-2 px-2 focus:outline-none focus:ring-2 border-2 transition-colors text-slate-900 bg-white border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="0"
                                />
                                {isExpression && currentQty > 0 && (
                                  <div className="absolute -bottom-5 left-0 right-0">
                                    <p className="text-xs text-green-600 text-center font-medium">
                                      = {currentQty}
                                    </p>
                                  </div>
                                )}
                              </div>
                              
                              <button
                                onClick={() => incrementQuantity(item.name)}
                                className="w-8 h-8 sm:w-9 sm:h-9 bg-white hover:bg-green-100 border-2 border-slate-300 hover:border-green-400 text-slate-700 hover:text-green-600 rounded-lg transition-all duration-300 flex items-center justify-center font-bold shadow-sm"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-200">
                              <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-slate-500 font-medium">Subtotal:</span>
                                <span className="font-bold text-slate-800">
                                  {(item.price * currentQty).toLocaleString()} Gralats
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">Made with ❤️ for Graal players</p>
        </div>
      </div>
    </div>
  );
}
