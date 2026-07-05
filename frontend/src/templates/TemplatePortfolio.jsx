import { Palette } from 'lucide-react';

export default function TemplatePortfolio({ content, businessName }) {
  return (
    <div className="bg-base text-ink font-body">
      <section className="text-center py-20 px-6 animate-fadeInUp">
        <span className="neu-icon-circle w-14 h-14 flex items-center justify-center mx-auto mb-5 text-accent">
          <Palette size={22} />
        </span>
        <h1 className="font-display text-4xl font-bold mb-3">{content.heroHeading}</h1>
        <p className="text-ink-soft text-lg max-w-xl mx-auto">{content.heroSubheading}</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 mb-16">
        <h2 className="font-display text-2xl font-bold text-center mb-8">Selected Work</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {content.services.map((s, i) => (
            <div key={i} className="neu-card p-6 animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-full h-32 neu-inset mb-4 flex items-center justify-center text-ink-soft text-xs">
                Project preview
              </div>
              <h3 className="font-display font-semibold mb-2">{s.title}</h3>
              <p className="text-ink-soft text-sm">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="neu-card p-8">
          <h2 className="font-display text-xl font-semibold mb-3">About {businessName}</h2>
          <p className="text-ink-soft leading-relaxed">{content.aboutText}</p>
        </div>
      </section>

      <footer className="text-center py-8 text-ink-soft text-sm">{content.footerText}</footer>
    </div>
  );
}
