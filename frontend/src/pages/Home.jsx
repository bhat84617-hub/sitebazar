import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, Rocket, Briefcase, Palette, UtensilsCrossed, Check, Crown } from 'lucide-react';

const TYPES = [
  { id: 'business', label: 'Business Website', icon: Briefcase },
  { id: 'portfolio', label: 'Portfolio Website', icon: Palette },
  { id: 'restaurant', label: 'Restaurant Website', icon: UtensilsCrossed },
  { id: 'landing-page', label: 'Landing Page', icon: Rocket }
];

const PLANS = [
  { label: 'Landing Page', price: '₹49', note: 'per landing page' },
  { label: 'Website', price: '₹399', note: 'per website' },
  { label: 'Unlimited', price: '₹999', note: 'per month', highlight: true }
];

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === 'pricing') {
      setTimeout(() => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  return (
    <div>
      <section className="text-center pt-16 pb-20 px-6 animate-fadeInUp">
        <span className="neu-icon-circle w-16 h-16 flex items-center justify-center mx-auto mb-6 text-accent">
          <Globe size={26} />
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold max-w-2xl mx-auto mb-4">
          Your website, written and built by AI — in minutes.
        </h1>
        <p className="text-ink-soft text-lg max-w-xl mx-auto mb-8">
          Describe your business, pick a style, and SiteBazar generates ready-to-use content and a clean, modern layout. Your first landing page is on us.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/build?type=landing-page')} className="neu-button px-7 py-3.5 font-semibold text-accent">
            Try a Free Landing Page →
          </button>
          <button onClick={() => navigate('/build')} className="neu-button px-7 py-3.5 font-semibold text-ink">
            Build a Website
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mb-20">
        <h2 className="font-display text-2xl font-bold text-center mb-8">Choose what you want to build</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TYPES.map(({ id, label, icon: Icon }, i) => (
            <button
              key={id}
              onClick={() => navigate(`/build?type=${id}`)}
              className="neu-card p-6 text-left animate-fadeInUp"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="neu-icon-circle w-11 h-11 flex items-center justify-center mb-4 text-accent">
                <Icon size={18} />
              </span>
              <h3 className="font-display font-semibold">{label}</h3>
              <p className="text-ink-soft text-xs mt-1">Generate now →</p>
            </button>
          ))}
        </div>
      </section>

      <section id="pricing" className="max-w-4xl mx-auto px-6 mb-20 scroll-mt-20">
        <h2 className="font-display text-2xl font-bold text-center mb-2">Simple, honest pricing</h2>
        <p className="text-ink-soft text-center text-sm mb-8">First landing page is always free. Pay only when you're ready to download.</p>
        <div className="grid sm:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <div key={p.label} className={`neu-card p-6 text-center ${p.highlight ? 'ring-2 ring-accent' : ''}`}>
              {p.highlight && (
                <span className="flex items-center justify-center gap-1 text-xs font-semibold text-accent mb-2">
                  <Crown size={13} /> BEST VALUE
                </span>
              )}
              <h3 className="font-display font-semibold text-lg">{p.label}</h3>
              <p className="text-3xl font-bold my-2">{p.price}</p>
              <p className="text-ink-soft text-xs">{p.note}</p>
              <p className="flex items-center justify-center gap-1 text-xs text-ink-soft mt-4">
                <Check size={13} className="text-accent" /> Full source code, yours to keep
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
