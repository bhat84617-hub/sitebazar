import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import OffersSlider from './components/OffersSlider';
import Footer from './components/Footer';
import ToastContainer from './components/Toast';
import PricingModal from './components/PricingModal';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Preview from './pages/Preview';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-5 py-24 text-center">
      <h1 className="font-display text-3xl font-bold mb-3">Page not found</h1>
      <p className="text-ink-soft">The page you're looking for doesn't exist. Head back to the homepage to keep building.</p>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <OffersSlider />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/build" element={<Builder />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
        <PricingModal />
      </div>
    </AppProvider>
  );
}
