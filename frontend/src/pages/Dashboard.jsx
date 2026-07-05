import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Crown, LogOut, Loader2, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

export default function Dashboard() {
  const { user, token, logout, showToast } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    (async () => {
      try {
        const res = await api.myDashboard(token);
        setData(res);
      } catch (err) {
        showToast(err.message || 'Could not load dashboard.', 'error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) return null;

  const handleOpen = async (id) => {
    try {
      const res = await api.getWebsite(id, token);
      navigate('/preview', { state: { website: res.website } });
    } catch (err) {
      showToast(err.message || 'Could not open this website.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-accent" size={24} />
      </div>
    );
  }

  const subscriptionActive = data?.user?.subscriptionActive;
  const websites = data?.websites || [];

  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="neu-icon-circle w-12 h-12 flex items-center justify-center text-accent">
            <LayoutDashboard size={20} />
          </span>
          <div>
            <h1 className="font-display text-xl font-bold">My Dashboard</h1>
            <p className="text-ink-soft text-sm">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="neu-button px-4 py-2 text-sm font-medium flex items-center gap-1.5"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className={`neu-flat p-5 mb-8 flex items-center justify-between ${subscriptionActive ? 'ring-2 ring-accent' : ''}`}>
        <div>
          <p className="font-display font-semibold flex items-center gap-1.5">
            {subscriptionActive && <Crown size={15} className="text-accent" />}
            {subscriptionActive ? 'Unlimited Monthly — Active' : 'Free Plan'}
          </p>
          <p className="text-ink-soft text-xs mt-1">
            {subscriptionActive
              ? `Renews/expires ${new Date(data.user.subscription.expiresAt).toLocaleDateString()}`
              : data?.user?.freeLandingPageUsed
              ? 'Free landing page already used — pay per download or go unlimited'
              : 'Your first landing page download is free'}
          </p>
        </div>
        {!subscriptionActive && (
          <button onClick={() => navigate('/', { state: { scrollTo: 'pricing' } })} className="neu-button px-4 py-2 text-sm font-semibold text-accent shrink-0">
            Upgrade
          </button>
        )}
      </div>

      <h2 className="font-display text-lg font-semibold mb-4">Your Websites</h2>
      {websites.length === 0 ? (
        <div className="neu-flat p-8 text-center">
          <p className="text-ink-soft text-sm mb-4">You haven't generated anything yet.</p>
          <button onClick={() => navigate('/build')} className="neu-button px-5 py-2.5 text-sm font-semibold text-accent">
            Build your first website
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {websites.map((w) => (
            <div key={w.id} className="neu-card p-5 flex flex-col">
              <h3 className="font-display font-semibold mb-1">{w.businessName}</h3>
              <p className="text-ink-soft text-xs mb-4 capitalize">{w.businessType.replace('-', ' ')}</p>
              <p className="text-xs mb-4">
                {w.isPaid ? (
                  <span className="text-accent font-medium">Unlocked</span>
                ) : (
                  <span className="text-ink-soft">Not downloaded yet</span>
                )}
              </p>
              <button
                onClick={() => handleOpen(w.id)}
                className="neu-button px-4 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 mt-auto"
              >
                Open <ExternalLink size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
