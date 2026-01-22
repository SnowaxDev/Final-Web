import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/420730588372?text=Dobrý%20den,%20mám%20zájem%20o%20vaše%20služby."
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Kontaktovat přes WhatsApp"
      data-testid="whatsapp-button"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default WhatsAppButton;
