import { Snowflake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-5 py-10 mt-10 text-center text-ink-soft text-sm">
      <div className="flex items-center justify-center gap-2 mb-2 font-display font-semibold text-ink">
        <Snowflake size={16} className="text-accent" /> SiteBazar
      </div>
      <p>© {new Date().getFullYear()} SiteBazar. Websites and landing pages, generated in minutes.</p>
    </footer>
  );
}
