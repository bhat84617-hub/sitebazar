import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

const ICONS = {
  success: <CheckCircle2 size={18} className="text-green-600" />,
  error: <XCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-accent" />
};

export default function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-80 max-w-[90vw]">
      {toasts.map((t) => (
        <div key={t.id} className="neu-card px-4 py-3 flex items-start gap-2 animate-fadeInUp">
          {ICONS[t.type] || ICONS.info}
          <p className="text-sm text-ink">{t.message}</p>
        </div>
      ))}
    </div>
  );
}
