import { Briefcase, ArrowUpRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import { pickIcon } from '../utils/iconPicker';

export default function TemplateBusiness({ content, businessName }) {
  return (
    <div className="bg-base text-ink font-body relative overflow-hidden">
      <div className="blob w-80 h-80 bg-accent -top-16 -right-20 float-slow" />

      <section className="relative z-10 text-center pt-20 pb-16 px-6">
        <Reveal>
          <span className="neu-icon-circle w-14 h-14 flex items-center justify-center mx-auto mb-5 text-accent">
            <Briefcase size={22} />
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
          <div className="neu-card p-8">
            <p className="text-xs font-semibold tracking-wide text-accent mb-2 uppercase">About {businessName}</p>
            <p className="text-ink-soft leading-relaxed text-[15px]">{content.aboutText}</p>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-20">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-center mb-10 underline-sweep is-visible">Our Services</h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-6">
          {content.services.map((s, i) => {
            const Icon = pickIcon(s.title, Briefcase);
            return (
              <Reveal key={i} delay={i * 100}>
                <div className="neu-card neu-card-hover p-7 h-full flex flex-col">
                  <span className="neu-icon-circle w-11 h-11 flex items-center justify-center mb-4 text-accent">
                    <Icon size={18} />
                  </span>
                  <h3 className="font-display font-semibold mb-2 flex items-center gap-1">
                    {s.title} <ArrowUpRight size={14} className="text-ink-soft" />
                  </h3>
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
