import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Login() {
  const { identify, showToast, user } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) return showToast('Enter a valid email address.', 'error');
    setLoading(true);
    try {
      await identify(email);
      showToast('Signed in!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Could not sign in.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <div className="neu-card p-8 text-center animate-fadeInUp">
        <span className="neu-icon-circle w-14 h-14 flex items-center justify-center mx-auto mb-5 text-accent">
          <LogIn size={22} />
        </span>
        <h1 className="font-display text-2xl font-bold mb-2">Login / Sign up</h1>
        <p className="text-ink-soft text-sm mb-6">
          No password, no Google sign-in needed — just your email. We use it to save your free generation, your
          websites, and any purchases.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="neu-inset w-full px-4 py-3 mb-5 outline-none text-ink text-center"
          />
          <button
            type="submit"
            disabled={loading}
            className="neu-button w-full py-3 font-semibold text-accent flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <>Continue <ArrowRight size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
