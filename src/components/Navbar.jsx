import { createElement, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Calculator, Home, Info, Layers3, Menu, X } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/calculator', label: 'Calculator', icon: Calculator },
  { to: '/tracker', label: 'Tracker', icon: BarChart3 },
  { to: '/body-generator', label: 'Body Upload Generator', icon: Layers3 },
  { to: '/about', label: 'About', icon: Info },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#B1D3B9] bg-white" aria-label="Main navigation">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-lg bg-[#659287] text-white">
            <Calculator size={19} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-[#29453E]">Graal Calculator</span>
            <span className="block text-xs text-[#659287]">by kramogss</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ to, label, icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? 'bg-[#659287] text-white' : 'text-[#527A70] hover:bg-[#E6F2DD] hover:text-[#29453E]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {createElement(icon, { size: 17, 'aria-hidden': true })}
                {label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg text-[#527A70] hover:bg-[#E6F2DD] md:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-[#B1D3B9] bg-white px-4 py-3 md:hidden">
          {navItems.map(({ to, label, icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  active ? 'bg-[#659287] text-white' : 'text-[#527A70] hover:bg-[#E6F2DD]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {createElement(icon, { size: 18, 'aria-hidden': true })}
                {label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </nav>
  );
}
