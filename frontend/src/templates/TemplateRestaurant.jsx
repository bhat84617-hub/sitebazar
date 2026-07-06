import { UtensilsCrossed } from 'lucide-react';
import Reveal from '../components/Reveal';
import { pickIcon } from '../utils/iconPicker';

// Restaurant gets a warm terracotta accent instead of the platform's default
// indigo — food feels warmer, and it helps this template not feel identical
// to the business/portfolio ones.
const WARM = '#c2703d';

export default function TemplateRestaurant({ content, businessName }) {
  return (
    <div className="bg-base text-ink font-body relative overflow-hidden">
      <div className="blob w-80 h-80 -top-14 -right-16 float-slow" style={{ background: WARM }} />

      <section className="relative z-10 text-center pt-20 pb-16 px-6">
        <Reveal>
          <span className="neu-icon-circle w-14 h-14 flex items-center justify-center mx-auto mb-5" style={{ color: WARM }}>
            <UtensilsCrossed size={22} />
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 max-w-2xl mx-auto">{content.heroHeading}</h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-ink-soft text-lg max-w-xl mx-auto">{content.heroSubheading}</p>
        </Reveal>
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 mb-16">
        <Reveal>
          <div className="neu-card p-8 text-center">
            <p className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: WARM }}>
              About {businessName}
            </p>
            <p className="text-ink-soft leading-relaxed text-[15px]">{content.aboutText}</p>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-20">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-center mb-10">Menu Highlights</h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-6">
          {content.services.map((s, i) => {
            const Icon = pickIcon(s.title, UtensilsCrossed);
            return (
              <Reveal key={i} delay={i * 100}>
                <div className="neu-card neu-card-hover p-7 h-full">
                  <span className="neu-icon-circle w-11 h-11 flex items-center justify-center mb-4" style={{ color: WARM }}>
                    <Icon size={18} />
                  </span>
                  <h3 className="font-display font-semibold mb-2">{s.title}</h3>
                  <p className="text-ink-soft text-sm">{s.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 text-center py-8 text-ink-soft text-sm">{content.footerText}</footer>
    </div>
  );
}
