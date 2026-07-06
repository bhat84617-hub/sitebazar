import { Rocket, Quote, ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import { pickIcon } from '../utils/iconPicker';

export default function TemplateLandingPage({ content }) {
  return (
    <div className="bg-base text-ink font-body relative overflow-hidden">
      {/* ambient floating shapes — signature touch for the landing template */}
      <div className="blob w-72 h-72 bg-accent -top-10 -left-16 float-slow" />
      <div className="blob w-96 h-96 bg-[#a78bfa] top-40 -right-24 float-slower" />

      <section className="relative z-10 text-center pt-24 pb-20 px-6">
        <Reveal>
          <span className="neu-icon-circle w-16 h-16 flex items-center justify-center mx-auto mb-6 text-accent pulse-glow">
            <Rocket size={26} />
          </span>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold mb-5 max-w-3xl mx-auto leading-tight gradient-text">
            {content.heroHeading}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="text-ink-soft text-lg max-w-xl mx-auto mb-9">{content.heroSubheading}</p>
        </Reveal>
        <Reveal delay={240}>
          <button className="neu-button px-9 py-4 font-semibold text-accent text-base inline-flex items-center gap-2">
            {content.ctaText} <ArrowRight size={16} />
          </button>
        </Reveal>
      </section>

      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.features.map((f, i) => {
            const Icon = pickIcon(f.title);
            return (
              <Reveal key={i} delay={i * 90}>
                <div className="neu-card neu-card-hover p-6 h-full">
                  <span className="neu-icon-circle w-11 h-11 flex items-center justify-center mb-4 text-accent">
                    <Icon size={18} />
                  </span>
                  <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                  <p className="text-ink-soft text-sm">{f.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 max-w-2xl mx-auto px-6 mb-20">
        <Reveal>
          <div className="neu-card p-9 text-center relative">
            <Quote className="mx-auto mb-4 text-accent" size={24} />
            <p className="text-ink-soft italic text-lg mb-5 leading-relaxed">"{content.testimonial.quote}"</p>
            <p className="font-display font-semibold">{content.testimonial.name}</p>
            <p className="text-ink-soft text-sm">{content.testimonial.role}</p>
          </div>
        </Reveal>
      </section>

      <section className="relative z-10 text-center pb-20 px-6">
        <Reveal>
          <div className="max-w-xl mx-auto neu-flat p-11">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">Ready to get started?</h2>
            <button className="neu-button px-9 py-4 font-semibold text-accent text-base inline-flex items-center gap-2">
              {content.ctaText} <ArrowRight size={16} />
            </button>
          </div>
        </Reveal>
      </section>

      <footer className="relative z-10 text-center py-8 text-ink-soft text-sm">{content.footerText}</footer>
    </div>
  );
}
