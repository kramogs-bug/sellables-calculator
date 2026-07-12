const STORAGE_KEY = 'graalTrackerData:v3';
const PREVIOUS_STORAGE_KEY = 'graalTrackerDataV2';
const BACKUP_HISTORY_KEY = 'graalTrackerBackupHistory:v1';
const BACKUP_TYPE = 'graal-sellables-tracker-backup';
const BACKUP_VERSION = 1;
const MAX_LOCAL_BACKUPS = 5;
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
    const itemName = typeof entry.itemName === 'string' ? (LEGACY_NAME_MAP[entry.itemName] || entry.itemName).slice(0, 80) : '';
    if (!itemName) return [];
    return [{
      id: typeof entry.id === 'string' && entry.id ? entry.id.slice(0, 100) : `${date.getTime()}-${itemName}`,
      itemName,
      quantity,
      price,
      total: quantity * price,
      date: date.toISOString(),
      note: typeof entry.note === 'string' ? entry.note.slice(0, 120) : '',
    }];
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

function normalizeTrackerState(value) {
  return {
    entries: normalizeEntries(value?.entries),
    goal: normalizeGoal(value?.goal),
  };
}

function readBackupHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(BACKUP_HISTORY_KEY) || '[]');
    if (!Array.isArray(stored)) return [];
    return stored.flatMap((backup) => {
      const createdAt = new Date(backup?.createdAt);
      if (Number.isNaN(createdAt.getTime()) || !backup?.state) return [];
      return [{ id: String(backup.id || createdAt.getTime()), createdAt: createdAt.toISOString(), state: normalizeTrackerState(backup.state) }];
    }).slice(0, MAX_LOCAL_BACKUPS);
  } catch {
    return [];
  }
}

function saveBackupHistory(history) {
  try { localStorage.setItem(BACKUP_HISTORY_KEY, JSON.stringify(history)); } catch { /* Storage may be unavailable. */ }
}

export function loadTrackerBackups() {
  return readBackupHistory();
}

export function createTrackerBackup(state) {
  return JSON.stringify({
    type: BACKUP_TYPE,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: normalizeTrackerState(state),
  }, null, 2);
}

export function parseTrackerBackup(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('This file is not valid JSON.');
  }

  const source = parsed?.type === BACKUP_TYPE ? parsed.data : parsed;
  if (!source || !Array.isArray(source.entries)) throw new Error('This is not a valid tracker backup.');
  const state = normalizeTrackerState(source);
  if (source.entries.length !== state.entries.length) throw new Error('The backup contains invalid or incomplete entries.');
  return state;
}

function escapeCsv(value) {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function createTrackerCsv(entries) {
  const rows = [['Date', 'Item', 'Quantity', 'Price', 'Total', 'Note']];
  normalizeEntries(entries).forEach((entry) => {
    rows.push([entry.date, entry.itemName, entry.quantity, entry.price, entry.total, entry.note]);
  });
  return rows.map((row) => row.map(escapeCsv).join(',')).join('\r\n');
}

export function loadTrackerState() {
  const fallback = { entries: [], goal: { amount: 0, targetDate: '', active: false } };
  try {
    const currentValue = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(PREVIOUS_STORAGE_KEY);
    const stored = currentValue ? JSON.parse(currentValue) : null;
    if (!stored || !Array.isArray(stored.entries)) {
      return {
        entries: normalizeEntries(JSON.parse(localStorage.getItem('graalSellablesEntries') || '[]')),
        goal: normalizeGoal(JSON.parse(localStorage.getItem('graalSellablesGoal') || 'null')),
      };
    }
    return normalizeTrackerState(stored);
  } catch { return fallback; }
}

export function saveTrackerState(state) {
  const normalized = normalizeTrackerState(state);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)); } catch { /* Storage may be unavailable. */ }

  if (!normalized.entries.length && !normalized.goal.active) return readBackupHistory();
  const history = readBackupHistory();
  const serializedState = JSON.stringify(normalized);
  if (history[0] && JSON.stringify(history[0].state) === serializedState) return history;

  const createdAt = new Date().toISOString();
  const nextHistory = [{ id: `${Date.now()}`, createdAt, state: normalized }, ...history].slice(0, MAX_LOCAL_BACKUPS);
  saveBackupHistory(nextHistory);
  return nextHistory;
}
