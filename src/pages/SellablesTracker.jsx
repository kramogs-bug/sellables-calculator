// SellablesTracker.jsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, TrendingUp, TrendingDown, Target, Calendar, Clock, DollarSign, BarChart3, ChevronDown, History, AlertTriangle } from 'lucide-react';
import { sellablesIcons } from "../assets/assets.js";
import {
  formatNumber,
  formatCurrency,
  handleNumberInputChange,
  parseFormattedNumber,
  calculateStatistics,
  groupEntriesByDate,
  calculateGoalProgress,
  createEntry,
  updateEntry,
  deleteEntry as deleteEntryUtil,
  calculatePreviewTotal,
  setGoalHandler,
  clearGoal,
  initializeState,
  saveState
} from './sellablesBackend.js';

const sellableItemsList = {
  shells: [
    { name: "Tro", price: 3, icon: sellablesIcons.tro },
    { name: "Aero", price: 3, icon: sellablesIcons.aero },
    { name: "Sand Dollar", price: 5, icon: sellablesIcons.sandDollar },
    { name: "Scallop", price: 5, icon: sellablesIcons.scallop },
    { name: "Starfish", price: 7, icon: sellablesIcons.star },
  ],
  mushrooms: [
    { name: "Mushroom", price: 5, icon: sellablesIcons.mushrooms }
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
    { name: "Mum", price: 0.3, icon: sellablesIcons.mum },
    { name: "Tulip", price: 0.4, icon: sellablesIcons.tulip },
    { name: "Carnation", price: 0.5, icon: sellablesIcons.carnation },
    { name: "Aster", price: 0.6, icon: sellablesIcons.aster },
    { name: "Rose", price: 0.7, icon: sellablesIcons.rose },
  ],
};

export default function SellablesTracker() {
  // State initialization
  const [state, setState] = useState(() => initializeState());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('shells');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalAmount, setGoalAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [expandedDates, setExpandedDates] = useState({});
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    entryId: null,
    entryName: '',
    entryQuantity: 0,
    entryTotal: 0
  });

  const { entries, goal } = state;

  // Effects for saving state
  useEffect(() => {
    saveState(entries, goal);
  }, [entries, goal]);

  // Helper functions
  const getItemDetails = (itemName) => {
    for (const category of Object.values(sellableItemsList)) {
      const item = category.find(i => i.name === itemName);
      if (item) return item;
    }
    return null;
  };

  // Event handlers
  const addEntry = () => {
    const newEntry = createEntry(selectedItem, quantity, note, getItemDetails);
    if (newEntry) {
      setState(prev => ({ ...prev, entries: [newEntry, ...prev.entries] }));
      resetForm();
    }
  };

  const updateEntryHandler = () => {
    const updatedEntries = updateEntry(entries, editingId, selectedItem, quantity, note, getItemDetails);
    setState(prev => ({ ...prev, entries: updatedEntries }));
    resetForm();
  };

  const deleteEntry = (id) => {
    setState(prev => ({ ...prev, entries: deleteEntryUtil(prev.entries, id) }));
    closeDeleteModal();
  };

  const openDeleteModal = (entry) => {
    setDeleteModal({
      isOpen: true,
      entryId: entry.id,
      entryName: entry.itemName,
      entryQuantity: entry.quantity,
      entryTotal: entry.total
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      entryId: null,
      entryName: '',
      entryQuantity: 0,
      entryTotal: 0
    });
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setSelectedItem(entry.itemName);
    setQuantity(formatNumber(entry.quantity));
    setNote(entry.note || '');
    setShowAddForm(true);

    for (const [category, items] of Object.entries(sellableItemsList)) {
      if (items.find(item => item.name === entry.itemName)) {
        setSelectedCategory(category);
        break;
      }
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setSelectedItem(null);
    setQuantity('');
    setNote('');
    setSelectedCategory('shells');
  };

  const handleSetGoal = () => {
    const newGoal = setGoalHandler(goalAmount, targetDate);
    if (newGoal) {
      setState(prev => ({ ...prev, goal: newGoal }));
      setShowGoalForm(false);
      setGoalAmount('');
      setTargetDate('');
    }
  };

  const handleClearGoal = () => {
    setState(prev => ({ ...prev, goal: clearGoal() }));
  };

  const toggleDateExpand = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // Calculations
  const statistics = calculateStatistics(entries);
  const dailyTotals = groupEntriesByDate(entries);
  const goalProgress = calculateGoalProgress(goal, statistics.totalEarned);
  const previewTotal = calculatePreviewTotal(selectedItem, quantity, getItemDetails);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Delete Entry</h3>
                  <p className="text-slate-600">Are you sure you want to delete this entry?</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-200 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{deleteModal.entryName}</p>
                    <p className="text-sm text-slate-600">Quantity: {formatNumber(deleteModal.entryQuantity)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{formatNumber(deleteModal.entryTotal)} G</p>
                    <p className="text-xs text-slate-500">Total Value</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => deleteEntry(deleteModal.entryId)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Entry
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/25 mb-4">
            <img 
              src={sellablesIcons.tracker_icon} 
              alt="Tracker Icon" 
              className="w-12 h-12" 
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
            Sellables Tracker
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
            Track your daily earnings, set goals, and maximize your profits
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Earned */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <DollarSign className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total Earned</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatNumber(statistics.totalEarned)}
                </p>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              <p className="text-xs text-emerald-700 font-medium text-center">
                All time earnings
              </p>
            </div>
          </div>

          {/* Today's Earnings */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Today's Total</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatNumber(statistics.todayTotal)}
                </p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="flex items-center justify-center gap-2">
                {statistics.dailyChange !== 0 && (
                  <>
                    {statistics.dailyChange > 0 ? (
                      <TrendingUp className="text-green-600" size={16} />
                    ) : (
                      <TrendingDown className="text-red-600" size={16} />
                    )}
                    <p className="text-xs font-medium text-blue-700">
                      {statistics.dailyChange > 0 ? '+' : ''}{formatNumber(statistics.dailyChange)} ({statistics.dailyChangePercent}%) vs yesterday
                    </p>
                  </>
                )}
                {statistics.dailyChange === 0 && (
                  <p className="text-xs font-medium text-blue-700">Same as yesterday</p>
                )}
              </div>
            </div>
          </div>

          {/* Average Daily */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">7-Day Average</p>
                <p className="text-2xl font-bold text-slate-800">
                  {formatCurrency(statistics.avgDaily)}
                </p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
              <p className="text-xs text-purple-700 font-medium text-center">
                Average daily earnings
              </p>
            </div>
          </div>
        </div>

        {/* Goal Tracker */}
        {goal.active ? (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-200 p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-1">Goal Progress</h2>
                  <p className="text-sm text-slate-600">Target: {formatNumber(goal.amount)} Gralats by {new Date(goal.targetDate).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={handleClearGoal}
                className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 border border-red-200 hover:border-red-300"
              >
                <X size={16} />
                Clear Goal
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700">Progress</span>
                <span className="text-sm font-bold text-slate-800">{formatNumber(goalProgress.goalProgress)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000 ease-out shadow-md"
                  style={{ width: `${goalProgress.goalProgress}%` }}
                />
              </div>
            </div>

            {/* Goal Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-amber-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-amber-600" size={18} />
                  <p className="text-xs font-semibold text-amber-700 uppercase">Days Left</p>
                </div>
                <p className="text-2xl font-bold text-slate-800">{formatNumber(goalProgress.daysRemaining)}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-blue-600" size={18} />
                  <p className="text-xs font-semibold text-blue-700 uppercase">Per Day</p>
                </div>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(goalProgress.neededPerDay)}</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-purple-600" size={18} />
                  <p className="text-xs font-semibold text-purple-700 uppercase">Per Hour</p>
                </div>
                <p className="text-2xl font-bold text-slate-800">{formatCurrency(goalProgress.neededPerHour)}</p>
              </div>
            </div>
          </div>
        ) : (
          !showGoalForm && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="text-amber-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Set a Goal</h3>
              <p className="text-slate-600 mb-6">Track your progress and stay motivated</p>
              <button
                onClick={() => setShowGoalForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Set Goal
              </button>
            </div>
          )
        )}

        {/* Goal Form */}
        {showGoalForm && !goal.active && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Set Your Goal</h2>
              <button
                onClick={() => setShowGoalForm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Goal Amount (Gralats)
                </label>
                <input
                  type="text"
                  value={goalAmount}
                  onChange={(e) => handleNumberInputChange(e.target.value, setGoalAmount)}
                  placeholder="e.g., 10,000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-semibold transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">Enter amount without commas - they will be added automatically</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 font-semibold transition-all"
                />
              </div>

              <button
                onClick={handleSetGoal}
                disabled={!goalAmount || !targetDate}
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Set Goal
              </button>
            </div>
          </div>
        )}

        {/* Add Entry Button */}
        {!showAddForm && (
          <div className="mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-105"
            >
              <Plus size={24} />
              Add New Entry
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Entry' : 'Add New Entry'}
              </h2>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries({
                    shells: "Shells",
                    mushrooms: "Mushrooms",
                    trash: "Trash", 
                    crabshells: "Crabshells",
                    minerals: "Minerals",
                    rareminerals: "Rare Minerals",
                    flowers: "Flowers"
                  }).map(([key, name]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedCategory(key);
                        setSelectedItem(null);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 font-semibold ${
                        selectedCategory === key
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-105'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Item Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Item
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {sellableItemsList[selectedCategory]?.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => setSelectedItem(item.name)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                        selectedItem === item.name
                          ? 'border-green-500 bg-green-50 shadow-md scale-105'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-lg">
                          <img 
                            src={item.icon} 
                            alt={item.name}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                          <p className="text-xs text-emerald-600 font-medium">{formatNumber(item.price)} G</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Note */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => handleNumberInputChange(e.target.value, setQuantity)}
                    placeholder="Enter quantity"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-semibold transition-all"
                  />
                  <p className="text-xs text-slate-500 mt-1">Enter numbers</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 transition-all"
                  />
                </div>
              </div>

              {/* Preview */}
              {selectedItem && quantity && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Preview:</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-slate-200">
                        <img 
                          src={getItemDetails(selectedItem)?.icon} 
                          alt={selectedItem}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{selectedItem}</p>
                        <p className="text-sm text-slate-500">× {formatNumber(quantity)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">
                        {formatNumber(previewTotal)} G
                      </p>
                      <p className="text-xs text-slate-500">Total</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={editingId ? updateEntryHandler : addEntry}
                  disabled={!selectedItem || !quantity}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingId ? 'Update Entry' : 'Add Entry'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Entries List */}
        <div className="space-y-4">
          {dailyTotals.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <History className="text-slate-300 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">No entries yet</h3>
              <p className="text-slate-400">Start tracking your sellables to see your progress!</p>
            </div>
          ) : (
            dailyTotals.map(({ date, total, entries: dayEntries }) => (
              <div key={date} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => toggleDateExpand(date)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                      <Calendar className="text-white" size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-slate-800">{date}</h3>
                      <p className="text-sm text-slate-500">{formatNumber(dayEntries.length)} {dayEntries.length === 1 ? 'entry' : 'entries'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-500 font-medium">Daily Total</p>
                      <p className="text-xl font-bold text-slate-800">
                        {formatNumber(total)} G
                      </p>
                    </div>
                    <ChevronDown 
                      className={`text-slate-400 transition-transform duration-300 ${
                        expandedDates[date] ? 'rotate-180' : ''
                      }`}
                      size={20}
                    />
                  </div>
                </button>

                {expandedDates[date] && (
                  <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
                    <div className="space-y-3">
                      {dayEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200 flex-shrink-0">
                                <img 
                                  src={entry.icon} 
                                  alt={entry.itemName}
                                  className="w-8 h-8 object-contain"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-slate-800 truncate">{entry.itemName}</h4>
                                  <span className="text-sm text-slate-500">×{formatNumber(entry.quantity)}</span>
                                </div>
                                {entry.note && (
                                  <p className="text-xs text-slate-500 italic truncate">{entry.note}</p>
                                )}
                                <p className="text-xs text-slate-400">
                                  {new Date(entry.date).toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className="text-lg font-bold text-emerald-600">
                                  {formatNumber(entry.total)} G
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEdit(entry)}
                                  className="w-10 h-10 bg-blue-100 hover:bg-blue-500 hover:text-white text-blue-600 rounded-xl transition-all duration-300 flex items-center justify-center"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => openDeleteModal(entry)}
                                  className="w-10 h-10 bg-red-100 hover:bg-red-500 hover:text-white text-red-600 rounded-xl transition-all duration-300 flex items-center justify-center"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
