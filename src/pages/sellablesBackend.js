const STORAGE_KEY = 'graalTrackerDataV2';
const LEGACY_NAME_MAP = { NewsPaper: 'Newspaper', Crabshells: 'Crab Shell', Minerals: 'Mineral' };

function localDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeEntries(value) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const quantity = Number(entry?.quantity);
    const price = Number(entry?.price);
    const date = new Date(entry?.date);
    if (!entry || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(price) || price < 0 || Number.isNaN(date.getTime())) return [];
    return [{ ...entry, id: entry.id ?? `${date.getTime()}-${entry.itemName}`, itemName: LEGACY_NAME_MAP[entry.itemName] || entry.itemName, quantity, price, total: quantity * price, date: date.toISOString(), note: typeof entry.note === 'string' ? entry.note.slice(0, 120) : '' }];
  });
}

function normalizeGoal(value) {
  const amount = Number(value?.amount);
  return value?.active && Number.isFinite(amount) && amount > 0 && /^\d{4}-\d{2}-\d{2}$/.test(value.targetDate || '')
    ? { amount, targetDate: value.targetDate, active: true }
    : { amount: 0, targetDate: '', active: false };
}

export function formatNumber(value, maximumFractionDigits = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString('en-US', { maximumFractionDigits }) : '0';
}

export function parsePositiveNumber(value) {
  const normalized = String(value ?? '').replaceAll(',', '').trim();
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return null;
  const number = Number(normalized);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export function calculateStatistics(entries, now = new Date()) {
  const validEntries = entries.filter((entry) => Number.isFinite(entry.total));
  const todayKey = localDateKey(now);
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = localDateKey(yesterday);
  const totalEarned = validEntries.reduce((sum, entry) => sum + entry.total, 0);
  const todayTotal = validEntries.filter((entry) => localDateKey(entry.date) === todayKey).reduce((sum, entry) => sum + entry.total, 0);
  const yesterdayTotal = validEntries.filter((entry) => localDateKey(entry.date) === yesterdayKey).reduce((sum, entry) => sum + entry.total, 0);
  return { totalEarned, todayTotal, yesterdayTotal, entryCount: validEntries.length };
}

export function groupEntriesByDate(entries) {
  const groups = new Map();
  for (const entry of entries) {
    const key = new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  }
  return [...groups].map(([date, dayEntries]) => ({ date, entries: dayEntries, total: dayEntries.reduce((sum, entry) => sum + entry.total, 0) }));
}

export function calculateGoalProgress(goal, totalEarned) {
  if (!goal?.active || !(goal.amount > 0)) return { percentage: 0, remaining: 0, daysRemaining: 0 };
  const end = new Date(`${goal.targetDate}T23:59:59`);
  const daysRemaining = Number.isNaN(end.getTime()) ? 0 : Math.max(0, Math.ceil((end - new Date()) / 86400000));
  return { percentage: Math.min(100, (totalEarned / goal.amount) * 100), remaining: Math.max(0, goal.amount - totalEarned), daysRemaining };
}

export function loadTrackerState() {
  const fallback = { entries: [], goal: { amount: 0, targetDate: '', active: false } };
  try {
    const currentValue = localStorage.getItem(STORAGE_KEY);
    const stored = currentValue ? JSON.parse(currentValue) : null;
    if (!stored || !Array.isArray(stored.entries)) {
      return {
        entries: normalizeEntries(JSON.parse(localStorage.getItem('graalSellablesEntries') || '[]')),
        goal: normalizeGoal(JSON.parse(localStorage.getItem('graalSellablesGoal') || 'null')),
      };
    }
    return { entries: normalizeEntries(stored.entries), goal: normalizeGoal(stored.goal) };
  } catch { return fallback; }
}

export function saveTrackerState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Storage may be unavailable. */ }
}
