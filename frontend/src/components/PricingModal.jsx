import { useState } from 'react';
import { X, Check, Crown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';

const PLANS = [
  { id: 'landing-page', label: 'One Landing Page', price: 49, note: 'Unlock source code for one landing page' },
  { id: 'website', label: 'One Website', price: 399, note: 'Business, portfolio or restaurant site' },
  {
    id: 'monthly',
    label: 'Unlimited Monthly',
    price: 999,
    note: 'Unlimited websites & landing pages for 30 days',
    highlight: true
  }
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PricingModal() {
  const { pricingModalOpen, setPricingModalOpen, token, showToast, pendingAction, pendingMeta } = useApp();
  const [loadingPlan, setLoadingPlan] = useState(null);

  if (!pricingModalOpen) return null;

  const handlePay = async (plan) => {
    setLoadingPlan(plan.id);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showToast('Could not load payment gateway. Check your connection.', 'error');
        return;
      }

      const { order, keyId } = await api.createOrder(plan.id, token);

      const rzp = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'SiteBazar',
        description: plan.label,
        theme: { color: '#6c63ff' },
        handler: async (response) => {
          try {
            await api.verifyPayment(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planType: plan.id,
                websiteId: pendingMeta?.websiteId
              },
              token
            );
            showToast('Payment successful! Access unlocked.', 'success');
            setPricingModalOpen(false);
            if (pendingAction) pendingAction();
          } catch (err) {
            showToast(err.message || 'Payment verification failed.', 'error');
          }
        },
        modal: { ondismiss: () => setLoadingPlan(null) }
      });
      rzp.open();
    } catch (err) {
      showToast(err.message || 'Could not start payment.', 'error');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
      <div className="neu-card max-w-3xl w-full p-6 sm:p-8 relative animate-fadeInUp">
        <button
          onClick={() => setPricingModalOpen(false)}
          className="absolute top-4 right-4 neu-icon-circle w-9 h-9 flex items-center justify-center"
        >
          <X size={16} />
        </button>
        <h2 className="font-display text-2xl font-bold text-center mb-1">Unlock this download</h2>
        <p className="text-ink-soft text-center text-sm mb-6">Your first landing page was free. Choose a plan to continue.</p>

        <div className="grid sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`neu-flat p-5 flex flex-col ${plan.highlight ? 'ring-2 ring-accent' : ''}`}
            >
              {plan.highlight && (
                <span className="flex items-center gap-1 text-xs font-semibold text-accent mb-2">
                  <Crown size={13} /> BEST VALUE
                </span>
              )}
              <h3 className="font-display font-semibold text-lg">{plan.label}</h3>
              <p className="text-2xl font-bold my-2">
                ₹{plan.price}
                {plan.id === 'monthly' && <span className="text-sm font-normal text-ink-soft">/mo</span>}
              </p>
              <p className="text-xs text-ink-soft mb-4 flex-1">{plan.note}</p>
              <button
                onClick={() => handlePay(plan)}
                disabled={loadingPlan === plan.id}
                className={`neu-button py-2.5 text-sm font-semibold flex items-center justify-center gap-1 ${
                  plan.highlight ? 'text-accent' : 'text-ink'
                }`}
              >
                {loadingPlan === plan.id ? 'Opening...' : (
                  <>
                    <Check size={14} /> Choose
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
