import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../utils/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sb_token') || null);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('sb_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [toasts, setToasts] = useState([]);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // fn to retry after payment
  const [pendingMeta, setPendingMeta] = useState(null); // { websiteId } needed for verify-payment

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const identify = useCallback(async (email) => {
    const res = await api.identify(email);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('sb_token', res.token);
    localStorage.setItem('sb_user', JSON.stringify(res.user));
    return res;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sb_token');
    localStorage.removeItem('sb_user');
  }, []);

  const openPricingModal = useCallback((retryFn, meta = null) => {
    setPendingAction(() => retryFn);
    setPendingMeta(meta);
    setPricingModalOpen(true);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('sb_user', JSON.stringify(user));
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        setUser,
        identify,
        logout,
        showToast,
        toasts,
        pricingModalOpen,
        setPricingModalOpen,
        openPricingModal,
        pendingAction,
        setPendingAction,
        pendingMeta
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
