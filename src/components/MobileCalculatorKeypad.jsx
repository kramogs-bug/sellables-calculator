import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Delete as BackspaceIcon, X } from 'lucide-react';

const QUANTITY_KEYS = [
  { label: 'C', action: 'clear', tone: 'utility' },
  { label: '(', value: '(', tone: 'utility' },
  { label: ')', value: ')', tone: 'utility' },
  { label: 'Backspace', action: 'backspace', icon: BackspaceIcon, tone: 'utility' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: 'Divide', display: '\u00F7', value: '/', tone: 'operator' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: 'Multiply', display: '\u00D7', value: '*', tone: 'operator' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: 'Subtract', display: '\u2212', value: '-', tone: 'operator' },
  { label: '0', value: '0' },
  { label: 'Double zero', display: '00', value: '00' },
  { label: 'Decimal point', display: '.', value: '.' },
  { label: 'Add', display: '+', value: '+', tone: 'operator' },
];

const RATIO_KEYS = [
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: 'Double zero', display: '00', value: '00' },
  { label: '0', value: '0' },
  { label: 'Decimal point', display: '.', value: '.' },
];

function KeyButton({ button, onPress }) {
  const Icon = button.icon;
  const toneClass = button.tone === 'operator'
    ? 'bg-[#E6F2DD] text-[#527A70] hover:bg-[#D7E9D7]'
    : button.tone === 'utility'
      ? 'bg-[#F2F8ED] text-[#527A70] hover:bg-[#E6F2DD]'
      : 'bg-white text-[#29453E] hover:bg-[#F2F8ED]';

  return (
    <button
      type="button"
      onClick={() => onPress(button)}
      className={`flex min-h-12 items-center justify-center rounded-xl border border-[#D7E9D7] text-lg font-bold shadow-sm active:scale-[0.97] ${toneClass}`}
      aria-label={button.label}
    >
      {Icon ? <Icon size={21} aria-hidden="true" /> : (button.display || button.label)}
    </button>
  );
}

export default function MobileCalculatorKeypad({
  open,
  mode,
  title,
  subtitle,
  expression,
  expressionStatus,
  total,
  equivalent,
  canGoPrevious,
  canGoNext,
  onKey,
  onClear,
  onBackspace,
  onPrevious,
  onNext,
  onApply,
  onClose,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const keys = mode === 'ratio' ? RATIO_KEYS : QUANTITY_KEYS;
  const press = (button) => {
    navigator.vibrate?.(8);
    if (button.action === 'clear') onClear();
    else if (button.action === 'backspace') onBackspace();
    else onKey(button.value);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end bg-[#29453E]/45 lg:hidden" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-keypad-title"
        onKeyDown={(event) => { if (event.key === 'Escape') onClose(); }}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border-t border-[#B1D3B9] bg-[#F8FBF5] px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 text-[#29453E] shadow-[0_-18px_50px_rgba(41,69,62,0.28)] sm:mx-auto sm:max-w-lg sm:px-5"
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#B1D3B9]" aria-hidden="true" />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#659287]">{mode === 'ratio' ? 'Ratio keypad' : 'Quantity calculator'}</p>
            <h2 id="mobile-keypad-title" className="mt-1 truncate text-lg font-bold">{title}</h2>
            <p className="text-xs text-[#659287]">{subtitle}</p>
          </div>
          <button type="button" onClick={onClose} className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E6F2DD] text-[#527A70]" aria-label="Close calculator keypad"><X size={19} /></button>
        </div>

        <div className="mt-3 rounded-2xl bg-[#29453E] p-4 text-right text-white">
          <p className="min-h-7 break-all font-mono text-lg text-[#E6F2DD]" aria-label="Current expression">{expression || '0'}</p>
          <p className="mt-1 text-2xl font-bold" aria-live="polite">{expressionStatus}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-white/15 pt-3 text-left">
            <div><p className="text-[10px] uppercase tracking-wide text-[#B1D3B9]">Total value</p><p className="mt-0.5 truncate text-sm font-semibold">{total}</p></div>
            <div className="text-right"><p className="text-[10px] uppercase tracking-wide text-[#B1D3B9]">Equivalent</p><p className="mt-0.5 truncate text-sm font-semibold">{equivalent}</p></div>
          </div>
        </div>

        {mode === 'ratio' ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => { navigator.vibrate?.(8); onClear(); }} className="min-h-11 rounded-xl bg-[#E6F2DD] text-sm font-bold text-[#527A70]">Clear</button>
            <button type="button" onClick={() => { navigator.vibrate?.(8); onBackspace(); }} className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#E6F2DD] text-sm font-bold text-[#527A70]"><BackspaceIcon size={18} aria-hidden="true" /> Backspace</button>
          </div>
        ) : null}

        <div className={`mt-3 grid gap-2 ${mode === 'ratio' ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {keys.map((button) => <KeyButton key={`${button.action || button.value}-${button.label}`} button={button} onPress={press} />)}
        </div>

        {mode === 'quantity' ? (
          <div className="mt-3 grid grid-cols-[1fr_1.4fr_1fr] gap-2">
            <button type="button" disabled={!canGoPrevious} onClick={onPrevious} className="flex min-h-12 items-center justify-center gap-1 rounded-xl border border-[#B1D3B9] bg-white text-xs font-bold text-[#527A70] disabled:opacity-40"><ChevronLeft size={17} aria-hidden="true" /> Previous</button>
            <button type="button" onClick={onApply} className="min-h-12 rounded-xl bg-[#659287] text-sm font-bold text-white hover:bg-[#527A70]">Apply</button>
            <button type="button" disabled={!canGoNext} onClick={onNext} className="flex min-h-12 items-center justify-center gap-1 rounded-xl border border-[#B1D3B9] bg-white text-xs font-bold text-[#527A70] disabled:opacity-40">Next <ChevronRight size={17} aria-hidden="true" /></button>
          </div>
        ) : (
          <button type="button" onClick={onApply} className="mt-3 min-h-12 w-full rounded-xl bg-[#659287] text-sm font-bold text-white hover:bg-[#527A70]">Done</button>
        )}
      </section>
    </div>
  );
}
