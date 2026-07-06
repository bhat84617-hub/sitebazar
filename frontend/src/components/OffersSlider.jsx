import { useEffect, useState } from 'react';
import { Sparkles, Zap, Crown } from 'lucide-react';

const OFFERS = [
  {
    icon: Sparkles,
    title: 'Your first Landing Page is FREE',
    subtitle: 'Generate and download — no card needed'
  },
  {
    icon: Zap,
    title: 'Full Website for just ₹399',
    subtitle: 'Business, portfolio or restaurant — one-time payment'
  },
  {
    icon: Zap,
    title: 'Extra Landing Pages at ₹49',
    subtitle: 'The cheapest way to launch a campaign page'
  },
  {
    icon: Crown,
    title: '₹999/month — Unlimited everything',
    subtitle: 'Unlimited websites & landing pages, best value'
  }
];

export default function OffersSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % OFFERS.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-5 pt-4">
      <div className="neu-flat relative overflow-hidden h-16 flex items-center px-5">
        {OFFERS.map((offer, i) => {
          const Icon = offer.icon;
          const active = i === index;
          return (
            <div
              key={offer.title}
              className={`absolute inset-0 flex items-center gap-3 px-5 transition-all duration-500 ${
                active ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
              }`}
            >
              <span className="neu-icon-circle w-9 h-9 flex items-center justify-center text-accent shrink-0">
                <Icon size={16} />
              </span>
              <p className="text-sm text-ink">
                <span className="font-semibold">{offer.title}</span>
                <span className="hidden sm:inline text-ink-soft"> — {offer.subtitle}</span>
              </p>
            </div>
          );
        })}

        <div className="absolute right-4 bottom-2 flex gap-1.5">
          {OFFERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-accent w-4' : 'bg-ink-soft/40'}`}
              aria-label={`Show offer ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
