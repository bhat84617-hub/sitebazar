import { Palette, ArrowUpRight } from 'lucide-react';
import Reveal from '../components/Reveal';

export default function TemplatePortfolio({ content, businessName }) {
  return (
    <div className="bg-base text-ink font-body relative overflow-hidden">
      <div className="blob w-72 h-72 bg-[#a78bfa] -top-10 -left-16 float-slower" />

      <section className="relative z-10 text-center pt-20 pb-16 px-6">
        <Reveal>
          <span className="neu-icon-circle w-14 h-14 flex items-center justify-center mx-auto mb-5 text-accent">
            <Palette size={22} />
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 max-w-2xl mx-auto gradient-text">
            {content.heroHeading}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-ink-soft text-lg max-w-xl mx-auto">{content.heroSubheading}</p>
        </Reveal>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-16">
        <Reveal>
          <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-8 text-center">Selected Work</p>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-6">
          {content.services.map((s, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="neu-card neu-card-hover p-6 h-full group">
                <div className="w-full h-32 neu-inset mb-4 flex items-center justify-center text-ink-soft text-xs overflow-hidden">
                  <span className="opacity-60 group-hover:scale-110 transition-transform duration-500">Project preview</span>
                </div>
                <h3 className="font-display font-semibold mb-2 flex items-center gap-1">
                  {s.title} <ArrowUpRight size={14} className="text-ink-soft" />
                </h3>
                <p className="text-ink-soft text-sm">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative z-10 max-w-3xl mx-auto px-6 mb-16">
        <Reveal>
          <div className="neu-card p-8">
            <p className="text-xs font-semibold tracking-wide text-accent mb-2 uppercase">About {businessName}</p>
            <p className="text-ink-soft leading-relaxed text-[15px]">{content.aboutText}</p>
          </div>
        </Reveal>
      </section>

      <footer className="relative z-10 text-center py-8 text-ink-soft text-sm">{content.footerText}</footer>
    </div>
  );
}
