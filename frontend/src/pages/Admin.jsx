import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Globe2, Crown, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

export default function Admin() {
  const { user, token, showToast } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!user.isAdmin) {
      showToast('You do not have admin access.', 'error');
      navigate('/dashboard');
      return;
    }
    (async () => {
      try {
        const [s, u, w] = await Promise.all([
          api.adminStats(token),
          api.adminUsers(token),
          api.adminWebsites(token)
        ]);
        setStats(s.stats);
        setUsers(u.users);
        setWebsites(w.websites);
      } catch (err) {
        showToast(err.message || 'Could not load admin data.', 'error');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || !user.isAdmin) return null;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-accent" size={24} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <div className="flex items-center gap-3 mb-8">
        <span className="neu-icon-circle w-12 h-12 flex items-center justify-center text-accent">
          <ShieldCheck size={20} />
        </span>
        <h1 className="font-display text-xl font-bold">Admin Panel</h1>
      </div>

      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers ?? 0} />
        <StatCard icon={Globe2} label="Websites Generated" value={stats?.totalWebsites ?? 0} />
        <StatCard icon={Crown} label="Active Subscriptions" value={stats?.activeSubscriptions ?? 0} />
        <StatCard icon={Globe2} label="Paid Downloads" value={stats?.paidDownloads ?? 0} />
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab('users')}
          className={`neu-button px-4 py-2 text-sm font-medium ${tab === 'users' ? 'is-active text-accent' : ''}`}
        >
          Users
        </button>
        <button
          onClick={() => setTab('websites')}
          className={`neu-button px-4 py-2 text-sm font-medium ${tab === 'websites' ? 'is-active text-accent' : ''}`}
        >
          Websites
        </button>
      </div>

      {tab === 'users' && (
        <div className="neu-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-soft border-b border-white/40">
                <th className="p-4">Email</th>
                <th className="p-4">Free Used</th>
                <th className="p-4">Subscription</th>
                <th className="p-4">Unlocked</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/30 last:border-0">
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.freeLandingPageUsed ? 'Yes' : 'No'}</td>
                  <td className="p-4">{u.subscription?.active ? `Active (${u.subscription.plan})` : '—'}</td>
                  <td className="p-4">{u.unlockedCount}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-ink-soft">No users yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'websites' && (
        <div className="neu-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-soft border-b border-white/40">
                <th className="p-4">Business Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Free Gen</th>
              </tr>
            </thead>
            <tbody>
              {websites.map((w) => (
                <tr key={w.id} className="border-b border-white/30 last:border-0">
                  <td className="p-4">{w.businessName}</td>
                  <td className="p-4 capitalize">{w.businessType.replace('-', ' ')}</td>
                  <td className="p-4">{w.isPaid ? 'Yes' : 'No'}</td>
                  <td className="p-4">{w.isFreeGeneration ? 'Yes' : 'No'}</td>
                </tr>
              ))}
              {websites.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-ink-soft">No websites yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="neu-flat p-5">
      <Icon size={16} className="text-accent mb-2" />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-ink-soft text-xs">{label}</p>
    </div>
  );
}
