const STORAGE_KEY = 'graalCalculatorDataV2';
const LEGACY_NAME_MAP = { NewsPaper: 'Newspaper', Crabshells: 'Crab Shell', Minerals: 'Mineral' };

function normalizeQuantities(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const quantities = {};
  for (const [rawName, rawQuantity] of Object.entries(value)) {
    const name = LEGACY_NAME_MAP[rawName] || rawName;
    const quantity = Number(rawQuantity);
    if (Number.isFinite(quantity) && quantity >= 0) quantities[name] = Math.floor(quantity);
  }
  return quantities;
}

export function parseQuantity(value) {
  const normalized = String(value ?? '').replaceAll(',', '').trim();
  if (!normalized) return 0;
  if (!/^[\d+\-*/().\s]+$/.test(normalized)) return null;
  let index = 0;
  const skipSpaces = () => { while (normalized[index] === ' ') index += 1; };
  const parsePrimary = () => {
    skipSpaces();
    if (normalized[index] === '(') {
      index += 1;
      const value = parseSum();
      skipSpaces();
      if (normalized[index] !== ')') throw new Error('Missing parenthesis');
      index += 1;
      return value;
    }
    const match = normalized.slice(index).match(/^\d+(?:\.\d+)?/);
    if (!match) throw new Error('Expected number');
    index += match[0].length;
    return Number(match[0]);
  };
  const parseProduct = () => {
    let value = parsePrimary();
    while (true) {
      skipSpaces();
      const operator = normalized[index];
      if (operator !== '*' && operator !== '/') return value;
      index += 1;
      const right = parsePrimary();
      if (operator === '/' && right === 0) throw new Error('Division by zero');
      value = operator === '*' ? value * right : value / right;
    }
  };
  function parseSum() {
    let value = parseProduct();
    while (true) {
      skipSpaces();
      const operator = normalized[index];
      if (operator !== '+' && operator !== '-') return value;
      index += 1;
      const right = parseProduct();
      value = operator === '+' ? value + right : value - right;
    }
  }
  try {
    const number = parseSum();
    skipSpaces();
    if (index !== normalized.length || !Number.isFinite(number) || number < 0) return null;
    return Math.floor(number);
  } catch { return null; }
}

export function appendQuantityKey(currentValue, key, maximumLength = 40) {
  const current = String(currentValue ?? '');
  if (!key || current.length >= maximumLength) return current;
  const trimmed = current.trimEnd();
  const lastCharacter = trimmed.at(-1) || '';
  const operators = ['+', '-', '*', '/'];

  if (operators.includes(key)) {
    if (!trimmed || lastCharacter === '(' || lastCharacter === '.') return current;
    return operators.includes(lastCharacter)
      ? `${trimmed.slice(0, -1)}${key}`
      : `${trimmed}${key}`;
  }

  if (key === '.') {
    if (lastCharacter === ')') return current;
    const currentNumber = trimmed.split(/[+\-*/()]/).at(-1) || '';
    if (currentNumber.includes('.')) return current;
    return `${trimmed}${currentNumber ? '.' : '0.'}`;
  }

  if (key === '(') {
    if (trimmed && /[\d.)]/.test(lastCharacter)) return current;
    return `${trimmed}(`;
  }

  if (key === ')') {
    const openCount = (trimmed.match(/\(/g) || []).length;
    const closeCount = (trimmed.match(/\)/g) || []).length;
    if (openCount <= closeCount || !/[\d)]/.test(lastCharacter)) return current;
    return `${trimmed})`;
  }

  if (!/^\d{1,2}$/.test(key) || lastCharacter === ')' || current.length + key.length > maximumLength) return current;
  return `${current}${key}`;
}

export function appendDecimalKey(currentValue, key, maximumLength = 10) {
  const current = String(currentValue ?? '');
  if (!/^\d{1,2}$/.test(key) && key !== '.') return current;
  if (current.length + key.length > maximumLength || (key === '.' && current.includes('.'))) return current;
  return key === '.' && !current ? '0.' : `${current}${key}`;
}

export function formatNumber(value, maximumFractionDigits = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString('en-US', { maximumFractionDigits }) : '0';
}

export function calculateTotal(quantities, items) {
  return items.reduce((total, item) => total + item.price * (quantities[item.name] || 0), 0);
}

export function loadCalculatorState() {
  const fallback = { quantities: {}, ratio: 3.8 };
  try {
    const currentValue = localStorage.getItem(STORAGE_KEY);
    const stored = currentValue ? JSON.parse(currentValue) : null;
    if (!stored || typeof stored !== 'object') {
      const legacyQuantities = JSON.parse(localStorage.getItem('graalCalculatorData') || '{}');
      const legacyRatio = Number(localStorage.getItem('graalTroRatio'));
      return {
        quantities: normalizeQuantities(legacyQuantities),
        ratio: Number.isFinite(legacyRatio) && legacyRatio > 0 ? legacyRatio : fallback.ratio,
      };
    }
    const ratio = Number(stored.ratio);
    return {
      quantities: normalizeQuantities(stored.quantities),
      ratio: Number.isFinite(ratio) && ratio > 0 ? ratio : 3.8,
    };
  } catch {
    return fallback;
  }
}

export function saveCalculatorState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Storage may be unavailable. */ }
}
