import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, Palette, UtensilsCrossed, Rocket, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

const TYPES = [
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'portfolio', label: 'Portfolio', icon: Palette },
  { id: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
  { id: 'landing-page', label: 'Landing Page', icon: Rocket }
];

export default function Builder() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, token, identify, showToast } = useApp();

  const [step, setStep] = useState(user ? 1 : 0);
  const [email, setEmail] = useState('');
  const [businessType, setBusinessType] = useState(params.get('type') || 'business');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const progress = useMemo(() => Math.round((step / 3) * 100), [step]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) return showToast('Enter a valid email address.', 'error');
    setLoading(true);
    try {
      await identify(email);
      setStep(1);
    } catch (err) {
      showToast(err.message || 'Could not verify email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!businessName.trim()) return showToast('Please enter a business/product name.', 'error');
    setLoading(true);
    try {
      const currentToken = token || localStorage.getItem('sb_token');
      const res = await api.generateWebsite({ businessName, businessType, description }, currentToken);
      navigate('/preview', { state: { website: res.website } });
    } catch (err) {
      showToast(err.message || 'Generation failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-5 py-14">
      <div className="neu-flat h-2 mb-8 overflow-hidden">
        <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {step === 0 && (
        <form onSubmit={handleEmailSubmit} className="neu-card p-8 animate-fadeInUp">
          <h2 className="font-display text-2xl font-bold mb-2">Let's get started</h2>
          <p className="text-ink-soft text-sm mb-6">We use your email to save your free generation and any purchases — no password needed.</p>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="neu-inset w-full px-4 py-3 mb-5 outline-none text-ink"
          />
          <button type="submit" disabled={loading} className="neu-button w-full py-3 font-semibold text-accent flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <>Continue <ArrowRight size={16} /></>}
          </button>
        </form>
      )}

      {step === 1 && (
        <div className="neu-card p-8 animate-fadeInUp">
          <h2 className="font-display text-2xl font-bold mb-2">What are you building?</h2>
          <p className="text-ink-soft text-sm mb-6">Choose the type of site you need.</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {TYPES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setBusinessType(id)}
                className={`neu-flat p-5 flex flex-col items-center gap-2 ${businessType === id ? 'ring-2 ring-accent' : ''}`}
              >
                <Icon size={20} className="text-accent" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} className="neu-button w-full py-3 font-semibold text-accent flex items-center justify-center gap-2">
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="neu-card p-8 animate-fadeInUp">
          <h2 className="font-display text-2xl font-bold mb-2">Tell us about it</h2>
          <p className="text-ink-soft text-sm mb-6">A short, honest description gives the AI more to work with.</p>
          <input
            type="text"
            placeholder="Business or product name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="neu-inset w-full px-4 py-3 mb-4 outline-none"
          />
          <label className="text-xs font-semibold text-ink-soft mb-1 block">Your prompt — describe it</label>
          <textarea
            rows={4}
            placeholder="e.g. A cozy Italian restaurant in Delhi known for wood-fired pizza and pasta, family-friendly, mid-range prices"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="neu-inset w-full px-4 py-3 mb-6 outline-none resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="neu-button w-full py-3 font-semibold text-accent flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Crafting your website...
              </>
            ) : (
              <>Generate Website <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
