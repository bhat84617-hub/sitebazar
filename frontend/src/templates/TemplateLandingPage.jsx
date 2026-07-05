import { Rocket, Quote } from 'lucide-react';

export default function TemplateLandingPage({ content }) {
  return (
    <div className="bg-base text-ink font-body">
      <section className="text-center py-24 px-6 animate-fadeInUp">
        <span className="neu-icon-circle w-14 h-14 flex items-center justify-center mx-auto mb-5 text-accent">
          <Rocket size={22} />
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 max-w-2xl mx-auto">{content.heroHeading}</h1>
        <p className="text-ink-soft text-lg max-w-xl mx-auto mb-8">{content.heroSubheading}</p>
        <button className="neu-button px-8 py-3.5 font-semibold text-accent text-base">{content.ctaText}</button>
      </section>

      <section className="max-w-5xl mx-auto px-6 mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.features.map((f, i) => (
            <div key={i} className="neu-card p-6 animate-fadeInUp" style={{ animationDelay: `${i * 100}ms` }}>
              <h3 className="font-display font-semibold mb-2">{f.title}</h3>
              <p className="text-ink-soft text-sm">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 mb-16">
        <div className="neu-card p-8 text-center">
          <Quote className="mx-auto mb-3 text-accent" size={22} />
          <p className="text-ink-soft italic mb-4">"{content.testimonial.quote}"</p>
          <p className="font-display font-semibold">{content.testimonial.name}</p>
          <p className="text-ink-soft text-sm">{content.testimonial.role}</p>
        </div>
      </section>

      <section className="text-center py-16 px-6 mb-6">
        <div className="max-w-xl mx-auto neu-flat p-10">
          <h2 className="font-display text-2xl font-bold mb-5">Ready to get started?</h2>
          <button className="neu-button px-8 py-3.5 font-semibold text-accent text-base">{content.ctaText}</button>
        </div>
      </section>

      <footer className="text-center py-8 text-ink-soft text-sm">{content.footerText}</footer>
    </div>
  );
}
