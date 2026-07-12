import { useEffect, useRef, useState } from 'react';
import { Calendar, Edit2, Plus, Target, Trash2, X } from 'lucide-react';
import { SELLABLE_BY_NAME, SELLABLE_CATEGORIES, SELLABLE_ITEMS } from './sellablesData.js';
import { parseQuantity } from './calculatorBackend.js';
import { calculateGoalProgress, calculateStatistics, formatNumber, groupEntriesByDate, loadTrackerState, parsePositiveNumber, saveTrackerState } from './sellablesBackend.js';

const EMPTY_GOAL = { amount: 0, targetDate: '', active: false };

function createId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getLocalDateInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export default function SellablesTracker() {
  const [state, setState] = useState(loadTrackerState);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [itemName, setItemName] = useState(SELLABLE_ITEMS[0].name);
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState('');
  const [goalOpen, setGoalOpen] = useState(false);
  const [goalAmount, setGoalAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [deletingEntry, setDeletingEntry] = useState(null);
  const formRef = useRef(null);
  const { entries, goal } = state;

  useEffect(() => { saveTrackerState(state); }, [state]);

  const resetForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setItemName(SELLABLE_ITEMS[0].name);
    setQuantity('');
    setNote('');
    setFormError('');
  };

  const openNewEntryForm = () => {
    resetForm();
    setFormOpen(true);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const submitEntry = (event) => {
    event.preventDefault();
    const parsedQuantity = parseQuantity(quantity);
    const item = SELLABLE_BY_NAME.get(itemName);
    if (!parsedQuantity || !item) {
      setFormError('Enter a quantity greater than zero. You can also use an expression like 100+200.');
      return;
    }
    const previousEntry = editingId ? entries.find((entry) => entry.id === editingId) : null;
    const entry = {
      id: editingId || createId(),
      itemName,
      quantity: parsedQuantity,
      price: item.price,
      total: parsedQuantity * item.price,
      date: previousEntry?.date || new Date().toISOString(),
      note: note.trim(),
    };
    setState((current) => ({
      ...current,
      entries: editingId
        ? current.entries.map((value) => value.id === editingId ? entry : value)
        : [entry, ...current.entries],
    }));
    resetForm();
  };

  const editEntry = (entry) => {
    setEditingId(entry.id);
    setItemName(entry.itemName);
    setQuantity(String(entry.quantity));
    setNote(entry.note || '');
    setFormError('');
    setFormOpen(true);
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const confirmDelete = () => {
    if (!deletingEntry) return;
    setState((current) => ({ ...current, entries: current.entries.filter((entry) => entry.id !== deletingEntry.id) }));
    setDeletingEntry(null);
  };

  const openGoalForm = () => {
    setGoalAmount(goal.active ? String(goal.amount) : '');
    setTargetDate(goal.active ? goal.targetDate : '');
    setGoalOpen(true);
  };

  const submitGoal = (event) => {
    event.preventDefault();
    const amount = parsePositiveNumber(goalAmount);
    if (!amount || !targetDate) return;
    setState((current) => ({ ...current, goal: { amount, targetDate, active: true } }));
    setGoalOpen(false);
  };

  const parsedPreviewQuantity = parseQuantity(quantity) || 0;
  const previewTotal = (SELLABLE_BY_NAME.get(itemName)?.price || 0) * parsedPreviewQuantity;
  const statistics = calculateStatistics(entries);
  const progress = calculateGoalProgress(goal, statistics.totalEarned);
  const groups = groupEntriesByDate(entries);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E6F2DD] text-[#29453E]">
      {deletingEntry ? (
        <div className="fixed inset-0 z-[60] flex items-end bg-[#29453E]/50 p-3 sm:items-center sm:justify-center" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeletingEntry(null); }}>
          <section className="w-full rounded-2xl bg-white p-5 shadow-xl sm:max-w-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <div className="flex items-start justify-between gap-4">
              <div><h2 id="delete-title" className="text-lg font-semibold">Delete entry?</h2><p className="mt-2 text-sm leading-6 text-[#527A70]">{deletingEntry.itemName} · {formatNumber(deletingEntry.quantity)} items · {formatNumber(deletingEntry.total)} G</p></div>
              <button type="button" onClick={() => setDeletingEntry(null)} className="rounded-lg p-2 hover:bg-[#E6F2DD]" aria-label="Close delete confirmation"><X size={18} /></button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setDeletingEntry(null)} className="rounded-lg border border-[#B1D3B9] px-4 py-3 text-sm font-semibold hover:bg-[#E6F2DD]">Cancel</button>
              <button type="button" onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
            </div>
          </section>
        </div>
      ) : null}

      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-[#B1D3B9] pb-6 sm:gap-6 sm:pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#659287]">Earnings tracker</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-4xl">Track your sellables</h1>
            <p className="mt-2 text-sm leading-6 text-[#527A70] sm:mt-3 sm:text-base">Save sales, review daily totals, and monitor progress toward your goal.</p>
          </div>
          <button type="button" onClick={openNewEntryForm} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#659287] px-5 py-3 text-sm font-semibold text-white hover:bg-[#527A70]"><Plus size={17} /> Add entry</button>
        </header>

        {formOpen ? (
          <form ref={formRef} onSubmit={submitEntry} className="scroll-mt-20 mt-5 rounded-xl border border-[#B1D3B9] bg-white p-4 sm:mt-6 sm:p-6">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{editingId ? 'Edit entry' : 'New entry'}</h2><button type="button" onClick={resetForm} aria-label="Close form" className="rounded-lg p-2 hover:bg-[#E6F2DD]"><X size={18} /></button></div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="text-sm font-medium">Item<select value={itemName} onChange={(event) => setItemName(event.target.value)} className="mt-2 w-full rounded-lg border border-[#B1D3B9] bg-white px-3 py-3 outline-none focus:border-[#659287]">{SELLABLE_CATEGORIES.map((category) => <optgroup key={category.key} label={category.label}>{category.items.map((item) => <option key={item.name}>{item.name}</option>)}</optgroup>)}</select></label>
              <label className="text-sm font-medium">Quantity or expression<input required type="text" inputMode="text" placeholder="Example: 100+200" value={quantity} onChange={(event) => { setQuantity(event.target.value.replace(/[^\d+\-*/().\s]/g, '')); setFormError(''); }} className="mt-2 w-full rounded-lg border border-[#B1D3B9] px-3 py-3 outline-none focus:border-[#659287]" /></label>
              <label className="text-sm font-medium">Note <span className="font-normal text-[#659287]">(optional)</span><input value={note} maxLength={120} onChange={(event) => setNote(event.target.value)} className="mt-2 w-full rounded-lg border border-[#B1D3B9] px-3 py-3 outline-none focus:border-[#659287]" /></label>
            </div>
            {formError ? <p className="mt-3 text-sm font-medium text-red-700" role="alert">{formError}</p> : null}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-[#527A70]">Live preview: <strong>{formatNumber(previewTotal)} G</strong></p><button type="submit" className="rounded-lg bg-[#659287] px-5 py-3 text-sm font-semibold text-white hover:bg-[#527A70]">{editingId ? 'Save changes' : 'Save entry'}</button></div>
          </form>
        ) : null}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-4">
          {[['Total earned', statistics.totalEarned], ['Today', statistics.todayTotal], ['Yesterday', statistics.yesterdayTotal], ['Entries', statistics.entryCount]].map(([label, value]) => <article key={label} className="rounded-xl border border-[#B1D3B9] bg-white p-4 sm:p-5"><p className="text-xs text-[#659287] sm:text-sm">{label}</p><p className="mt-2 truncate text-xl font-bold sm:text-2xl">{formatNumber(value)}{label !== 'Entries' ? ' G' : ''}</p></article>)}
        </div>

        <section className="mt-5 rounded-xl bg-[#659287] p-5 text-white sm:mt-6 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm text-[#E6F2DD]">Earnings goal</p><h2 className="mt-1 text-lg font-semibold sm:text-xl">{goal.active ? `${formatNumber(progress.percentage)}% complete` : 'Set a target to track progress'}</h2></div>
            <div className="grid grid-cols-2 gap-2 sm:flex"><button type="button" onClick={openGoalForm} className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#527A70]"><Target size={16} className="mr-2 inline" />{goal.active ? 'Update' : 'Set goal'}</button>{goal.active ? <button type="button" onClick={() => { setState((current) => ({ ...current, goal: EMPTY_GOAL })); setGoalOpen(false); }} className="rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold hover:bg-white/20">Clear</button> : null}</div>
          </div>
          {goal.active ? <><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-[#E6F2DD]" style={{ width: `${progress.percentage}%` }} /></div><p className="mt-3 text-sm text-[#E6F2DD]">{formatNumber(progress.remaining)} G remaining · {progress.daysRemaining} days left</p></> : null}
          {goalOpen ? <form onSubmit={submitGoal} className="mt-5 grid gap-3 rounded-lg bg-white/10 p-3 sm:grid-cols-[1fr_1fr_auto] sm:p-4"><label className="text-xs text-[#E6F2DD]">Goal amount<input required type="number" min="1" step="any" value={goalAmount} onChange={(event) => setGoalAmount(event.target.value)} className="mt-1.5 w-full rounded-lg border border-white/30 bg-white px-3 py-2.5 text-[#29453E]" /></label><label className="text-xs text-[#E6F2DD]">Target date<input required type="date" min={getLocalDateInputValue()} value={targetDate} onChange={(event) => setTargetDate(event.target.value)} className="mt-1.5 w-full rounded-lg border border-white/30 bg-white px-3 py-2.5 text-[#29453E]" /></label><button className="rounded-lg bg-[#29453E] px-4 py-2.5 text-sm font-semibold sm:self-end">Save goal</button></form> : null}
        </section>

        <section className="mt-7 sm:mt-8" aria-labelledby="history-heading">
          <div className="flex items-center gap-2"><Calendar size={19} className="text-[#659287]" /><h2 id="history-heading" className="text-xl font-semibold">History</h2></div>
          <div className="mt-4 space-y-4">
            {groups.map((group) => (
              <article key={group.date} className="overflow-hidden rounded-xl border border-[#B1D3B9] bg-white">
                <div className="flex justify-between gap-3 bg-[#F2F8ED] px-4 py-3 sm:px-5"><span className="truncate text-sm font-semibold">{group.date}</span><span className="shrink-0 text-sm font-semibold text-[#527A70]">{formatNumber(group.total)} G</span></div>
                {group.entries.map((entry) => {
                  const item = SELLABLE_BY_NAME.get(entry.itemName);
                  return (
                    <div key={entry.id} className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 border-t border-[#E6F2DD] p-3 sm:grid-cols-[2.25rem_minmax(0,1fr)_auto_auto] sm:p-4">
                      {item?.icon ? <img src={item.icon} alt="" className="size-9 object-contain" /> : <span className="size-9 rounded-lg bg-[#E6F2DD]" />}
                      <div className="min-w-0"><p className="truncate text-sm font-semibold">{entry.itemName} · {formatNumber(entry.quantity)}</p>{entry.note ? <p className="truncate text-xs text-[#659287]">{entry.note}</p> : <p className="text-xs text-[#88BDA4]">{formatNumber(entry.price)} G each</p>}</div>
                      <strong className="whitespace-nowrap text-sm">{formatNumber(entry.total)} G</strong>
                      <div className="col-span-3 grid grid-cols-2 gap-2 sm:col-span-1 sm:flex"><button type="button" onClick={() => editEntry(entry)} className="inline-flex items-center justify-center gap-2 rounded-md bg-[#E6F2DD] px-3 py-2 text-xs font-semibold text-[#527A70]" aria-label={`Edit ${entry.itemName}`}><Edit2 size={14} /> Edit</button><button type="button" onClick={() => setDeletingEntry(entry)} className="inline-flex items-center justify-center gap-2 rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700" aria-label={`Delete ${entry.itemName}`}><Trash2 size={14} /> Delete</button></div>
                    </div>
                  );
                })}
              </article>
            ))}
            {entries.length === 0 ? <div className="rounded-xl border border-dashed border-[#88BDA4] bg-white/40 p-8 text-center text-sm text-[#527A70] sm:p-10">No entries yet. Add your first sellable above.</div> : null}
          </div>
        </section>
      </section>
    </main>
  );
}
