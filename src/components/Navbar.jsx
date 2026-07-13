import { createElement, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Calculator, Download, Home, Info, Layers3, Menu, X } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home, preload: () => import('../pages/Home') },
  { to: '/calculator', label: 'Calculator', icon: Calculator, preload: () => import('../pages/Calculator') },
  { to: '/tracker', label: 'Tracker', icon: BarChart3, preload: () => import('../pages/SellablesTracker') },
  { to: '/body-generator', label: 'Upload Preview', icon: Layers3, preload: () => import('../pages/BodyUploadGenerator') },
  { to: '/about', label: 'About', icon: Info, preload: () => import('../pages/About') },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleInstalled = () => setInstallPrompt(null);
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

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

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map(({ to, label, icon, preload }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onMouseEnter={preload}
                onFocus={preload}
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
          {installPrompt ? <button type="button" onClick={installApp} className="ml-1 flex items-center gap-2 rounded-lg border border-[#88BDA4] px-3 py-2 text-sm font-semibold text-[#527A70] hover:bg-[#E6F2DD]"><Download size={16} aria-hidden="true" /> Install</button> : null}
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-lg text-[#527A70] hover:bg-[#E6F2DD] lg:hidden"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-[#B1D3B9] bg-white px-4 py-3 lg:hidden">
          {navItems.map(({ to, label, icon, preload }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                onFocus={preload}
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
          {installPrompt ? <button type="button" onClick={installApp} className="mt-2 flex w-full items-center gap-3 rounded-lg border border-[#88BDA4] px-3 py-2.5 text-sm font-semibold text-[#527A70] hover:bg-[#E6F2DD]"><Download size={18} aria-hidden="true" /> Install app</button> : null}
        </div>
      ) : null}
    </nav>
  );
}
