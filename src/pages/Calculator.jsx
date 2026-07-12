import { useEffect, useState } from 'react';
import { Calculator as CalculatorIcon, ChevronDown, Minus, Plus, RotateCcw, Search } from 'lucide-react';
import { SELLABLE_CATEGORIES, SELLABLE_ITEMS } from './sellablesData.js';
import { calculateTotal, formatNumber, loadCalculatorState, parseQuantity, saveCalculatorState } from './calculatorBackend.js';

export default function Calculator() {
  const [state, setState] = useState(loadCalculatorState);
  const [query, setQuery] = useState('');
  const [quantityInputs, setQuantityInputs] = useState(() => Object.fromEntries(Object.entries(state.quantities).map(([name, value]) => [name, String(value)])));
  const [ratioInput, setRatioInput] = useState(() => String(state.ratio));
  const [openCategories, setOpenCategories] = useState(() => Object.fromEntries(SELLABLE_CATEGORIES.map(({ key }) => [key, true])));
  const { quantities, ratio } = state;

  useEffect(() => { saveCalculatorState(state); }, [state]);

  const updateQuantity = (name, rawValue) => {
    const cleaned = String(rawValue).replace(/[^\d+\-*/().\s]/g, '');
    setQuantityInputs((current) => ({ ...current, [name]: cleaned }));
    const value = parseQuantity(cleaned);
    if (value === null) return;
    setState((current) => ({ ...current, quantities: { ...current.quantities, [name]: value } }));
  };

  const changeQuantity = (name, amount) => updateQuantity(name, String(Math.max(0, (quantities[name] || 0) + amount)));
  const commitQuantity = (name) => {
    const value = parseQuantity(quantityInputs[name]);
    const committedValue = value === null ? (quantities[name] || 0) : value;
    setQuantityInputs((current) => ({ ...current, [name]: committedValue === 0 ? '' : String(committedValue) }));
  };
  const updateRatio = (rawValue) => {
    const cleaned = rawValue.replace(/[^\d.]/g, '');
    setRatioInput(cleaned);
    const value = Number(cleaned);
    if (cleaned !== '' && Number.isFinite(value) && value > 0) {
      setState((current) => ({ ...current, ratio: value }));
    }
  };
  const commitRatio = () => {
    const value = Number(ratioInput);
    const nextRatio = Number.isFinite(value) && value > 0 ? value : ratio;
    setState((current) => ({ ...current, ratio: nextRatio }));
    setRatioInput(String(nextRatio));
  };
  const total = calculateTotal(quantities, SELLABLE_ITEMS);
  const troValue = ratio > 0 ? total / ratio : 0;
  const normalizedQuery = query.trim().toLowerCase();
  const categories = SELLABLE_CATEGORIES.map((category) => ({
    ...category,
    items: category.items.filter((item) => item.name.toLowerCase().includes(normalizedQuery)),
  })).filter((category) => category.items.length > 0);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E6F2DD] text-[#29453E]">
      <section className="mx-auto max-w-7xl px-3 pb-32 pt-6 sm:px-6 sm:pt-10 lg:px-8 lg:pb-10">
        <header className="flex flex-col gap-4 border-b border-[#B1D3B9] pb-6 sm:gap-6 sm:pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#659287]">Sellables calculator</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">Calculate your total</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#527A70] sm:mt-3 sm:text-base">Enter a quantity or expression like 100+200. Totals update live and stay saved on this device.</p>
          </div>
          <button type="button" onClick={() => { setState((current) => ({ ...current, quantities: {} })); setQuantityInputs({}); }} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#88BDA4] bg-white px-4 py-2.5 text-sm font-semibold text-[#527A70] hover:bg-[#D7E9D7]">
            <RotateCcw size={16} aria-hidden="true" /> Reset quantities
          </button>
        </header>

        <div className="mt-5 grid gap-6 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <label className="relative block">
              <span className="sr-only">Search items</span>
              <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#659287]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sellable items" className="w-full rounded-lg border border-[#B1D3B9] bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-[#659287]" />
            </label>

            <div className="mt-5 space-y-4">
              {categories.map((category) => {
                const isOpen = normalizedQuery ? true : openCategories[category.key];
                return (
                  <section key={category.key} className="overflow-hidden rounded-xl border border-[#B1D3B9] bg-white">
                    <button type="button" onClick={() => setOpenCategories((current) => ({ ...current, [category.key]: !current[category.key] }))} className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[#F2F8ED]" aria-expanded={isOpen}>
                      <span><span className="font-semibold">{category.label}</span><span className="ml-2 text-xs text-[#659287]">{category.items.length} items</span></span>
                      <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen ? (
                      <div className="grid border-t border-[#D7E9D7] sm:grid-cols-2">
                        {category.items.map((item) => (
                          <div key={item.name} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 border-b border-[#E6F2DD] p-3 sm:flex sm:p-4 sm:odd:border-r">
                            <img src={item.icon} alt="" className="size-10 object-contain" />
                            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.name}</p><p className="text-xs text-[#659287]">{formatNumber(item.price)} G each</p></div>
                            <div className="col-span-2 grid grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center overflow-hidden rounded-lg border border-[#B1D3B9] sm:ml-auto sm:flex">
                              <button type="button" onClick={() => changeQuantity(item.name, -1)} className="flex size-9 items-center justify-center text-[#527A70] hover:bg-[#E6F2DD]" aria-label={`Decrease ${item.name}`}><Minus size={14} /></button>
                              <input type="text" inputMode="text" value={quantityInputs[item.name] || ''} onChange={(event) => updateQuantity(item.name, event.target.value)} onBlur={() => commitQuantity(item.name)} onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }} placeholder="0 or 100+200" className="min-w-0 border-x border-[#B1D3B9] py-2 text-center text-sm outline-none sm:w-24" aria-label={`${item.name} quantity or expression`} />
                              <button type="button" onClick={() => changeQuantity(item.name, 1)} className="flex size-9 items-center justify-center text-[#527A70] hover:bg-[#E6F2DD]" aria-label={`Increase ${item.name}`}><Plus size={14} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </section>
                );
              })}
              {categories.length === 0 ? <p className="rounded-xl border border-[#B1D3B9] bg-white p-8 text-center text-sm text-[#527A70]">No matching items found.</p> : null}
            </div>
          </div>

          <aside className="hidden h-fit rounded-xl bg-[#659287] p-6 text-white lg:sticky lg:top-24 lg:block">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white/15"><CalculatorIcon size={20} /></span>
            <p className="mt-6 text-sm text-[#E6F2DD]">Total value</p>
            <p className="mt-1 text-4xl font-bold">{formatNumber(total)} G</p>
            <div className="my-6 border-t border-white/20" />
            <label className="block text-sm font-medium text-[#E6F2DD]" htmlFor="tro-ratio">Gralats per Tro</label>
            <input id="tro-ratio" type="text" inputMode="decimal" value={ratioInput} onChange={(event) => updateRatio(event.target.value)} onBlur={commitRatio} className="mt-2 w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-white outline-none focus:bg-white/20" />
            <div className="mt-5 rounded-lg bg-white/10 p-4"><p className="text-xs text-[#E6F2DD]">Equivalent value</p><p className="mt-1 text-xl font-semibold">{formatNumber(troValue)} Tro</p></div>
          </aside>
        </div>
      </section>

      <aside className="fixed inset-x-0 bottom-0 z-40 border-t border-[#88BDA4] bg-[#659287] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 text-white shadow-[0_-8px_24px_rgba(41,69,62,0.18)] lg:hidden" aria-label="Current calculator total">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#E6F2DD]">Total value</p>
            <p className="truncate text-2xl font-bold" aria-live="polite">{formatNumber(total)} G</p>
          </div>
          <div className="h-10 w-px bg-white/20" aria-hidden="true" />
          <div className="grid grid-cols-[auto_auto] items-end gap-x-3">
            <label className="text-left text-[11px] font-medium text-[#E6F2DD]" htmlFor="mobile-tro-ratio">
              Ratio
              <input id="mobile-tro-ratio" type="text" inputMode="decimal" value={ratioInput} onChange={(event) => updateRatio(event.target.value)} onBlur={commitRatio} className="mt-1 block w-16 rounded-md border border-white/30 bg-white/10 px-2 py-1.5 text-center text-sm font-semibold text-white outline-none focus:bg-white/20" />
            </label>
            <div className="min-w-0 text-right">
              <p className="text-[11px] font-medium text-[#E6F2DD]">Equivalent</p>
              <p className="mt-1 truncate text-base font-semibold" aria-live="polite">{formatNumber(troValue)} Tro</p>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
