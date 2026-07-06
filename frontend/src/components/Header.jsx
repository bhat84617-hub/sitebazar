import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Snowflake, Menu, X, ChevronDown, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CATEGORIES = [
  {
    label: 'Website',
    description: 'Business, portfolio & restaurant sites',
    types: [
      { id: 'business', label: 'Business Website' },
      { id: 'portfolio', label: 'Portfolio Website' },
      { id: 'restaurant', label: 'Restaurant Website' }
    ]
  },
  {
    label: 'Landing Page',
    description: 'Single-page, conversion focused',
    types: [{ id: 'landing-page', label: 'Landing Page' }]
  }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null); // click-toggled, works on touch too
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const goToBuilder = (typeId) => {
    setOpen(false);
    setDropdown(null);
    navigate(`/build?type=${typeId}`);
  };

  const goToPricing = () => {
    setOpen(false);
    setDropdown(null);
    if (location.pathname === '/') {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: 'pricing' } });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-base/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between" ref={wrapRef}>
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-ink">
          <span className="neu-icon-circle w-9 h-9 flex items-center justify-center text-accent">
            <Snowflake size={18} />
          </span>
          SiteBazar
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="relative">
              <button
                onClick={() => setDropdown(dropdown === cat.label ? null : cat.label)}
                className={`neu-button px-4 py-2 text-sm font-medium flex items-center gap-1 ${
                  dropdown === cat.label ? 'is-active' : ''
                }`}
              >
                {cat.label} <ChevronDown size={14} />
              </button>
              {dropdown === cat.label && (
                <div className="absolute top-full left-0 mt-2 w-64 neu-card p-3 animate-fadeInUp z-50">
                  <p className="text-xs text-ink-soft px-2 pb-2">{cat.description}</p>
                  {cat.types.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => goToBuilder(t.id)}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm text-ink hover:bg-white/60 transition"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button onClick={goToPricing} className="neu-button px-4 py-2 text-sm font-medium">
            Pricing
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <button onClick={() => navigate('/build')} className="neu-button px-5 py-2.5 text-sm font-semibold text-accent">
            Build Free →
          </button>
          <button
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="neu-icon-circle w-10 h-10 flex items-center justify-center text-ink"
            title={user ? 'My Dashboard' : 'Login / Sign up'}
          >
            <User size={16} />
          </button>
        </div>

        <button className="md:hidden neu-icon-circle w-10 h-10 flex items-center justify-center" onClick={() => setOpen(!open)}>
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-3 animate-fadeInUp">
          {CATEGORIES.flatMap((cat) => cat.types).map((t) => (
            <button key={t.id} onClick={() => goToBuilder(t.id)} className="neu-button px-4 py-3 text-sm font-medium text-left">
              {t.label}
            </button>
          ))}
          <button onClick={goToPricing} className="neu-button px-4 py-3 text-sm font-medium text-center">
            Pricing
          </button>
          <button
            onClick={() => {
              setOpen(false);
              navigate(user ? '/dashboard' : '/login');
            }}
            className="neu-button px-4 py-3 text-sm font-medium text-center"
          >
            {user ? 'My Dashboard' : 'Login / Sign up'}
          </button>
        </div>
      )}
    </header>
  );
}
