// sellablesBackend.js

// Helper function to format numbers with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined || num === '') return '0';
  if (typeof num === 'string') {
    const parsed = num.replace(/,/g, '');
    if (parsed === '') return '0';
    return Number(parsed).toLocaleString('en-US');
  }
  return Number(num).toLocaleString('en-US');
};

// Helper function to format currency (for prices and totals)
export const formatCurrency = (num) => {
  if (num === null || num === undefined || num === '') return '0';
  if (typeof num === 'string') {
    const parsed = num.replace(/,/g, '');
    if (parsed === '') return '0';
    return Number(parsed).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Helper function to parse formatted numbers back to raw numbers
export const parseFormattedNumber = (formattedNum) => {
  if (!formattedNum) return '';
  return formattedNum.replace(/,/g, '');
};

// Helper function to handle input changes with formatting
export const handleNumberInputChange = (value, setter) => {
  const cleaned = value.replace(/[^\d.]/g, '');
  
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  } else {
    value = cleaned;
  }
  
  if (value === '' || value === '.') {
    setter(value);
  } else {
    const formatted = formatNumber(value);
    setter(formatted);
  }
};

// Calculate statistics
export const calculateStatistics = (entries) => {
  const totalEarned = entries.reduce((sum, entry) => sum + entry.total, 0);
  
  const todayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date).toDateString();
    const today = new Date().toDateString();
    return entryDate === today;
  });
  const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.total, 0);

  const yesterdayEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date).toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    return entryDate === yesterday;
  });
  const yesterdayTotal = yesterdayEntries.reduce((sum, entry) => sum + entry.total, 0);

  const dailyChange = todayTotal - yesterdayTotal;
  const dailyChangePercent = yesterdayTotal > 0 ? ((dailyChange / yesterdayTotal) * 100).toFixed(1) : 0;

  // Calculate average daily earnings (last 7 days)
  const last7Days = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    return entryDate >= weekAgo;
  });
  
  const avgDaily = last7Days.length > 0 
    ? (last7Days.reduce((sum, entry) => sum + entry.total, 0) / 7).toFixed(2)
    : 0;

  return {
    totalEarned,
    todayTotal,
    yesterdayTotal,
    dailyChange,
    dailyChangePercent,
    avgDaily,
    todayEntries,
    yesterdayEntries
  };
};

// Group entries by date
export const groupEntriesByDate = (entries) => {
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = new Date(entry.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});

  // Calculate daily totals
  const dailyTotals = Object.entries(entriesByDate).map(([date, dayEntries]) => ({
    date,
    total: dayEntries.reduce((sum, entry) => sum + entry.total, 0),
    entries: dayEntries,
  }));

  return dailyTotals;
};

// Calculate goal progress
export const calculateGoalProgress = (goal, totalEarned) => {
  const daysRemaining = goal.active && goal.targetDate
    ? Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const neededPerDay = goal.active && daysRemaining > 0
    ? ((goal.amount - totalEarned) / daysRemaining).toFixed(2)
    : 0;
  
  const neededPerHour = goal.active && daysRemaining > 0
    ? ((goal.amount - totalEarned) / (daysRemaining * 24)).toFixed(2)
    : 0;
  
  const goalProgress = goal.active && goal.amount > 0
    ? Math.min(((totalEarned / goal.amount) * 100).toFixed(1), 100)
    : 0;

  return {
    daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
    neededPerDay: neededPerDay > 0 ? neededPerDay : 0,
    neededPerHour: neededPerHour > 0 ? neededPerHour : 0,
    goalProgress
  };
};

// Create new entry
export const createEntry = (selectedItem, quantity, note, getItemDetails) => {
  if (!selectedItem || !quantity) return null;

  const itemDetails = getItemDetails(selectedItem);
  if (!itemDetails) return null;

  return {
    id: Date.now(),
    itemName: selectedItem,
    quantity: parseInt(parseFormattedNumber(quantity)),
    price: itemDetails.price,
    total: itemDetails.price * parseInt(parseFormattedNumber(quantity)),
    icon: itemDetails.icon,
    note: note,
    date: new Date().toISOString(),
  };
};

// Update existing entry
export const updateEntry = (entries, editingId, selectedItem, quantity, note, getItemDetails) => {
  if (!selectedItem || !quantity || !editingId) return entries;

  const itemDetails = getItemDetails(selectedItem);
  if (!itemDetails) return entries;

  return entries.map(entry => 
    entry.id === editingId 
      ? {
          ...entry,
          itemName: selectedItem,
          quantity: parseInt(parseFormattedNumber(quantity)),
          price: itemDetails.price,
          total: itemDetails.price * parseInt(parseFormattedNumber(quantity)),
          icon: itemDetails.icon,
          note: note,
        }
      : entry
  );
};

// Delete entry
export const deleteEntry = (entries, entryId) => {
  return entries.filter(entry => entry.id !== entryId);
};

// Calculate preview total
export const calculatePreviewTotal = (selectedItem, quantity, getItemDetails) => {
  if (!selectedItem || !quantity) return 0;
  const itemDetails = getItemDetails(selectedItem);
  const parsedQuantity = parseInt(parseFormattedNumber(quantity)) || 0;
  return (itemDetails?.price || 0) * parsedQuantity;
};

// Set goal handler
export const setGoalHandler = (goalAmount, targetDate) => {
  if (!goalAmount || !targetDate) return null;
  
  return {
    amount: parseFloat(parseFormattedNumber(goalAmount)),
    targetDate: targetDate,
    active: true,
    startDate: new Date().toISOString(),
  };
};

// Clear goal
export const clearGoal = () => {
  return { amount: 0, targetDate: '', active: false };
};

// Initialize state from localStorage
export const initializeState = () => {
  const savedEntries = localStorage.getItem('graalSellablesEntries');
  const savedGoal = localStorage.getItem('graalSellablesGoal');
  
  return {
    entries: savedEntries ? JSON.parse(savedEntries) : [],
    goal: savedGoal ? JSON.parse(savedGoal) : { amount: 0, targetDate: '', active: false }
  };
};

// Save state to localStorage
export const saveState = (entries, goal) => {
  localStorage.setItem('graalSellablesEntries', JSON.stringify(entries));
  localStorage.setItem('graalSellablesGoal', JSON.stringify(goal));
};
