import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, RefreshCcw, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';
import { buildStandaloneHtml, downloadHtmlFile } from '../utils/exportHtml';
import TemplateBusiness from '../templates/TemplateBusiness';
import TemplatePortfolio from '../templates/TemplatePortfolio';
import TemplateRestaurant from '../templates/TemplateRestaurant';
import TemplateLandingPage from '../templates/TemplateLandingPage';

const TEMPLATE_MAP = {
  business: TemplateBusiness,
  portfolio: TemplatePortfolio,
  restaurant: TemplateRestaurant,
  'landing-page': TemplateLandingPage
};

export default function Preview() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token, showToast, openPricingModal } = useApp();
  const [downloading, setDownloading] = useState(false);

  const website = state?.website;

  if (!website) {
    return (
      <div className="max-w-lg mx-auto px-5 py-20 text-center">
        <p className="text-ink-soft mb-6">No website to preview yet.</p>
        <button onClick={() => navigate('/build')} className="neu-button px-6 py-3 font-semibold text-accent">
          Start Building
        </button>
      </div>
    );
  }

  const Template = TEMPLATE_MAP[website.businessType] || TemplateBusiness;

  const attemptDownload = async () => {
    setDownloading(true);
    try {
      const res = await api.downloadWebsite({ websiteId: website.id, businessType: website.businessType }, token);
      const html = buildStandaloneHtml(website.businessName, website.businessType, res.content);
      downloadHtmlFile(`${website.businessName.replace(/\s+/g, '-').toLowerCase()}.html`, html);
      showToast('Source code downloaded!', 'success');
    } catch (err) {
      if (err.statusCode === 402) {
        openPricingModal(() => attemptDownload(), { websiteId: website.id, businessType: website.businessType });
      } else {
        showToast(err.message || 'Download failed.', 'error');
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <div className="sticky top-[72px] z-30 max-w-6xl mx-auto px-5">
        <div className="neu-flat flex flex-wrap items-center justify-between gap-3 px-5 py-3 mb-4">
          <p className="text-sm font-medium text-ink">{website.businessName} — {website.businessType.replace('-', ' ')}</p>
          <div className="flex gap-2">
            <button onClick={() => navigate('/build')} className="neu-button px-4 py-2 text-sm font-medium flex items-center gap-1.5">
              <RefreshCcw size={14} /> Regenerate
            </button>
            <button
              onClick={attemptDownload}
              disabled={downloading}
              className="neu-button px-4 py-2 text-sm font-semibold text-accent flex items-center gap-1.5"
            >
              {downloading ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
              Download Source Code
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5">
        <div className="neu-card overflow-hidden">
          <Template content={website.content} businessName={website.businessName} />
        </div>
      </div>
    </div>
  );
}
