// Function to safely evaluate mathematical expressions and validate input
export const evaluateExpression = (expression) => {
  if (!expression || expression === '') return { value: 0, isValid: true };
  
  // Remove commas and spaces before evaluation
  const expr = String(expression).replace(/\s+/g, '').replace(/,/g, '');
  
  if (expr === '') return { value: 0, isValid: true };
  
  // Check if it's a simple number (not an expression)
  const isSimpleNumber = /^-?\d*\.?\d+$/.test(expr);
  
  try {
    let result;
    if (isSimpleNumber) {
      // For simple numbers, parse directly
      result = parseFloat(expr);
    } else {
      // For expressions, evaluate
      result = new Function(`return ${expr}`)();
    }
    
    // Handle NaN, Infinity, and other invalid results
    if (isNaN(result) || !isFinite(result)) {
      return { value: 0, isValid: false };
    }
    
    const finalValue = Math.max(0, Math.floor(Number(result))) || 0;
    return { value: finalValue, isValid: true };
  } catch (error) {
    return { value: 0, isValid: false };
  }
};

// Format number with commas (only for display, not for expressions)
export const formatNumberWithCommas = (number) => {
  if (number === null || number === undefined || number === '') return '';
  
  // If it contains operators, don't add commas to avoid breaking expressions
  const str = number.toString();
  if (/[+\-*/().]/.test(str)) {
    return str; // Return expression as-is without commas
  }
  
  try {
    const num = typeof number === 'string' ? number.replace(/,/g, '') : number;
    const parsed = parseFloat(num);
    if (isNaN(parsed)) return str; // Return original if not a valid number
    return parsed.toLocaleString('en-US');
  } catch (error) {
    return str; // Return original on error
  }
};

// Parse number by removing commas
export const parseNumberWithCommas = (formattedNumber) => {
  if (!formattedNumber) return '';
  return formattedNumber.toString().replace(/,/g, '');
};

// Check if input is an expression (contains operators)
export const isExpression = (input) => {
  if (!input) return false;
  const cleanInput = input.toString().replace(/,/g, '').replace(/\s+/g, '');
  return /[+\-*/().]/.test(cleanInput);
};

// Handle quantity changes with comma formatting
export const handleQuantityChange = (itemName, value, quantities, setQuantities, inputValues, setInputValues) => {
  // For expressions, don't add commas to avoid breaking the expression
  let formattedValue;
  if (isExpression(value)) {
    formattedValue = value; // Keep expression as-is
  } else {
    formattedValue = formatNumberWithCommas(value);
  }
  
  setInputValues(prev => ({
    ...prev,
    [itemName]: formattedValue
  }));
  
  if (value === '' || value === null || value === undefined) {
    setQuantities(prev => ({
      ...prev,
      [itemName]: 0
    }));
  } else {
    // Remove commas before evaluation
    const valueWithoutCommas = parseNumberWithCommas(value);
    const { value: evaluatedValue, isValid } = evaluateExpression(valueWithoutCommas);
    
    if (isValid) {
      setQuantities(prev => ({
        ...prev,
        [itemName]: evaluatedValue
      }));
    } else {
      // If expression is invalid, keep the current quantity but still update input
      setQuantities(prev => ({
        ...prev,
        [itemName]: prev[itemName] || 0
      }));
    }
  }
};

// Handle quantity blur with comma formatting
export const handleQuantityBlur = (itemName, inputValues, setInputValues, quantities, setQuantities) => {
  const value = inputValues[itemName] || '';
  if (value === '') return;

  // Remove commas before evaluation
  const valueWithoutCommas = parseNumberWithCommas(value);
  const { value: evaluatedValue, isValid } = evaluateExpression(valueWithoutCommas);
  
  if (isValid && evaluatedValue > 0) {
    // Format the final value with commas (only if it's a simple number)
    const formattedValue = formatNumberWithCommas(evaluatedValue.toString());
    setInputValues(prev => ({
      ...prev,
      [itemName]: formattedValue
    }));
    setQuantities(prev => ({
      ...prev,
      [itemName]: evaluatedValue
    }));
  } else if (!isValid) {
    // If expression is invalid, revert to current quantity
    const currentQty = quantities[itemName] || 0;
    const formattedValue = currentQty > 0 ? formatNumberWithCommas(currentQty.toString()) : '';
    setInputValues(prev => ({
      ...prev,
      [itemName]: formattedValue
    }));
  }
};

// Increment quantity with comma formatting
export const incrementQuantity = (itemName, quantities, setQuantities, inputValues, setInputValues) => {
  const currentValue = quantities[itemName] || 0;
  const newValue = currentValue + 1;
  setQuantities(prev => ({
    ...prev,
    [itemName]: newValue
  }));
  // Format the new value with commas
  const formattedValue = formatNumberWithCommas(newValue.toString());
  setInputValues(prev => ({
    ...prev,
    [itemName]: formattedValue
  }));
};

// Decrement quantity with comma formatting
export const decrementQuantity = (itemName, quantities, setQuantities, inputValues, setInputValues) => {
  const currentValue = quantities[itemName] || 0;
  const newValue = Math.max(0, currentValue - 1);
  setQuantities(prev => ({
    ...prev,
    [itemName]: newValue
  }));
  // Format the new value with commas (or empty string if 0)
  const formattedValue = newValue > 0 ? formatNumberWithCommas(newValue.toString()) : '';
  setInputValues(prev => ({
    ...prev,
    [itemName]: formattedValue
  }));
};

// Calculate total value from quantities and items
export const calculateTotal = (quantities, sellableItems) => {
  let total = 0;
  Object.entries(sellableItems).forEach(([category, items]) => {
    items.forEach(item => {
      total += item.price * (quantities[item.name] || 0);
    });
  });
  return total;
};

// Calculate category totals
export const calculateCategoryTotals = (quantities, sellableItems) => {
  const categoryTotals = {};
  Object.entries(sellableItems).forEach(([category, items]) => {
    categoryTotals[category] = items.reduce((sum, item) => 
      sum + (item.price * (quantities[item.name] || 0)), 0
    );
  });
  return categoryTotals;
};

// Calculate Tro value
export const calculateTroValue = (total, ratio) => {
  return (total / ratio).toFixed(2);
};

// Calculate ratio difference
export const calculateRatioDifference = (currentRatio, originalRatio, total) => {
  const originalTroValue = parseFloat(calculateTroValue(total, originalRatio));
  const currentTroValue = parseFloat(calculateTroValue(total, currentRatio));
  const difference = currentTroValue - originalTroValue;
  const percentChange = originalRatio !== 0 ? ((currentRatio - originalRatio) / originalRatio * 100) : 0;
  
  return {
    difference: difference.toFixed(2),
    percentChange: percentChange.toFixed(1),
    isIncrease: difference > 0,
    hasChanged: Math.abs(currentRatio - originalRatio) > 0.01
  };
};

// Handle Tro ratio change
export const handleTroRatioChange = (value, setTroRatio) => {
  let ratio = parseFloat(value) || 1;
  ratio = Math.max(1, Math.min(10, ratio));
  setTroRatio(ratio);
};

// Increment Tro ratio
export const incrementTroRatio = (troRatio, setTroRatio) => {
  setTroRatio(prev => {
    const newValue = parseFloat((prev + 0.1).toFixed(1));
    return Math.min(10, newValue);
  });
};

// Decrement Tro ratio
export const decrementTroRatio = (troRatio, setTroRatio) => {
  setTroRatio(prev => {
    const newValue = parseFloat((prev - 0.1).toFixed(1));
    return Math.max(1, newValue);
  });
};

// Reset all quantities
export const resetAll = (setQuantities, setInputValues, troRatio, setOriginalRatio) => {
  setQuantities({});
  setInputValues({});
  setOriginalRatio(troRatio);
  localStorage.setItem('graalOriginalTroRatio', troRatio.toString());
  localStorage.removeItem('graalCalculatorData');
  localStorage.removeItem('graalInputValues');
};

// Reset ratio to original
export const resetRatioToOriginal = (originalRatio, setTroRatio) => {
  setTroRatio(originalRatio);
};

// Initialize state from localStorage
export const initializeState = () => {
  const savedQuantities = localStorage.getItem('graalCalculatorData');
  const savedExpandedCategories = localStorage.getItem('graalExpandedCategories');
  const savedTroRatio = localStorage.getItem('graalTroRatio');
  const savedShowTroConversion = localStorage.getItem('graalShowTroConversion');
  const savedInputValues = localStorage.getItem('graalInputValues');
  const savedOriginalRatio = localStorage.getItem('graalOriginalTroRatio');
  const savedPosition = localStorage.getItem('graalTotalPosition');
  const savedCurrentPage = localStorage.getItem('graalCurrentPage');

  return {
    quantities: savedQuantities ? JSON.parse(savedQuantities) : {},
    expandedCategories: savedExpandedCategories ? JSON.parse(savedExpandedCategories) : {
      shells: true,
      trash: true,
      crabshells: true,
      minerals: true,
      rareminerals: true,
      flowers: true
    },
    troRatio: savedTroRatio ? parseFloat(savedTroRatio) : 3.8,
    showTroConversion: savedShowTroConversion ? JSON.parse(savedShowTroConversion) : false,
    inputValues: savedInputValues ? JSON.parse(savedInputValues) : {},
    originalRatio: savedOriginalRatio ? parseFloat(savedOriginalRatio) : (savedTroRatio ? parseFloat(savedTroRatio) : 3.8),
    position: savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 80 },
    currentPage: savedCurrentPage ? savedCurrentPage : 'main'
  };
};

// Save state to localStorage
export const saveState = (state) => {
  const {
    quantities,
    expandedCategories,
    troRatio,
    showTroConversion,
    inputValues,
    originalRatio,
    position,
    currentPage
  } = state;

  localStorage.setItem('graalCalculatorData', JSON.stringify(quantities));
  localStorage.setItem('graalExpandedCategories', JSON.stringify(expandedCategories));
  localStorage.setItem('graalTroRatio', troRatio.toString());
  localStorage.setItem('graalShowTroConversion', JSON.stringify(showTroConversion));
  localStorage.setItem('graalInputValues', JSON.stringify(inputValues));
  localStorage.setItem('graalOriginalTroRatio', originalRatio.toString());
  localStorage.setItem('graalTotalPosition', JSON.stringify(position));
  localStorage.setItem('graalCurrentPage', currentPage);
};

// Drag and drop handlers
export const handleDragStart = (e, setIsDragging, setDragOffset, position) => {
  setIsDragging(true);
  setDragOffset({
    x: e.clientX - position.x,
    y: e.clientY - position.y
  });
};

export const handleTouchStart = (e, setIsDragging, setDragOffset, position) => {
  setIsDragging(true);
  const touch = e.touches[0];
  setDragOffset({
    x: touch.clientX - position.x,
    y: touch.clientY - position.y
  });
};

export const handleDragMove = (e, isDragging, dragOffset, setPosition) => {
  if (isDragging) {
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  }
};

export const handleTouchMove = (e, isDragging, dragOffset, setPosition) => {
  if (isDragging) {
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragOffset.x,
      y: touch.clientY - dragOffset.y
    });
  }
};

export const handleDragEnd = (setIsDragging) => {
  setIsDragging(false);
};

// Tro Calculator specific functions
export const calculateMaxAffordableQuantity = (itemPrice, availableTro, troRatio, currentTotalCost, currentItemCost, currentQty) => {
  if (itemPrice <= 0) return 0;
  
  const remainingBeforeThisItem = availableTro - currentTotalCost;
  
  if (remainingBeforeThisItem <= 0) return 0;
  
  const troCostPerItem = itemPrice / troRatio;
  const maxAffordable = Math.floor(remainingBeforeThisItem / troCostPerItem);
  
  return Math.max(0, maxAffordable);
};

export const calculateTotalTroCost = (troQuantities, sellableItems, troRatio) => {
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

export const calculateGralatsNeeded = (troQuantities, sellableItems) => {
  let total = 0;
  Object.entries(sellableItems).forEach(([category, items]) => {
    items.forEach(item => {
      total += item.price * (troQuantities[item.name] || 0);
    });
  });
  return total.toFixed(2);
};

export const calculateRemainingTro = (availableTro, totalTroCost) => {
  return (availableTro - totalTroCost).toFixed(2);
};
