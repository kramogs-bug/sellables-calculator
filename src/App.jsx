import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import SellablesTracker from './pages/SellablesTracker';
import About from './pages/About';
import './index.css';
import GraalCodesModern from './pages/GraalCodesModern.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/tracker" element={<SellablesTracker />} />
        <Route path="/about" element={<About />} />
        <Route path="/codes" element={<GraalCodesModern />} />
      </Routes>
    </Router>
  );
}

export default App;