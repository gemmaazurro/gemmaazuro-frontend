import { MessageCircle } from 'lucide-react';
import { WA_PHONE } from '@/lib/data';
import { CSSProperties } from 'react';

export default function WhatsAppCTA({ productName, style }: { productName?: string; style?: CSSProperties }) {
  const msg = productName
    ? `Hi, I'm interested in the ${productName}.`
    : "Hi, I'd like to inquire about your jewelry.";
  const href = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="ga-btn ga-btn-whatsapp"
      style={{
        height: 54, padding: '0 32px', fontSize: 15, gap: 10,
        background: 'var(--color-whatsapp)', color: '#fff',
        borderRadius: 'var(--rounded-button)', ...style,
      }}>
      <MessageCircle size={18} />
      Customize via WhatsApp
    </a>
  );
}
