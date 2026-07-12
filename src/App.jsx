import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';

const Home = lazy(() => import('./pages/Home'));
const Calculator = lazy(() => import('./pages/Calculator'));
const SellablesTracker = lazy(() => import('./pages/SellablesTracker'));
const About = lazy(() => import('./pages/About'));
const BodyUploadGenerator = lazy(() => import('./pages/BodyUploadGenerator'));

function PageFallback() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#E6F2DD] px-4 text-[#29453E]" role="status">
      <div className="text-center">
        <span className="mx-auto block size-8 animate-spin rounded-full border-2 border-[#B1D3B9] border-t-[#659287]" aria-hidden="true" />
        <p className="mt-3 text-sm font-semibold">Loading page...</p>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#E6F2DD] px-4 text-[#29453E]">
      <section className="w-full max-w-md rounded-2xl border border-[#B1D3B9] bg-white p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#659287]">404</p>
        <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-[#527A70]">The page may have moved or the address may be incorrect.</p>
        <Link to="/" className="mt-6 inline-flex rounded-lg bg-[#659287] px-5 py-3 text-sm font-semibold text-white hover:bg-[#527A70]">Return home</Link>
      </section>
    </main>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/tracker" element={<SellablesTracker />} />
          <Route path="/about" element={<About />} />
          <Route path="/body-generator" element={<BodyUploadGenerator />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
