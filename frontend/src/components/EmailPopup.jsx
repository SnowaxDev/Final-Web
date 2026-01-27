import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Gift, Mail, Loader2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EmailPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    // Check if popup was already shown
    const popupShown = localStorage.getItem('seknuto_popup_shown');
    const popupDismissed = localStorage.getItem('seknuto_popup_dismissed');
    
    // Don't show on booking page
    if (window.location.pathname === '/rezervace') {
      return;
    }
    
    if (!popupShown && !popupDismissed) {
      // Show popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('seknuto_popup_shown', 'true');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('seknuto_popup_dismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Zadejte prosím platný email');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API}/subscribe`, { email });
      setCouponCode(response.data.coupon_code);
      setIsSuccess(true);
      localStorage.setItem('seknuto_coupon', response.data.coupon_code);
      toast.success('Slevový kupón byl odeslán na váš email!');
    } catch (error) {
      console.error('Subscription failed:', error);
      toast.error('Něco se pokazilo. Zkuste to prosím znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" data-testid="email-popup">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Zavřít"
          data-testid="popup-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-[#3FA34D] to-[#2d7a38] px-8 pt-10 pb-16 text-center relative">
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                <Gift className="w-8 h-8 text-[#3FA34D]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Získejte 5% slevu!
              </h3>
              <p className="text-white/90 text-sm">
                Na první objednávku
              </p>
            </div>

            {/* Content */}
            <div className="px-8 pt-12 pb-8">
              <p className="text-center text-[#4B5563] mb-6">
                Přihlaste se k odběru novinek a získejte <span className="font-bold text-[#3FA34D]">slevový kupón 5%</span> na vaši první službu!
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Váš email"
                    className="h-14 pl-12 rounded-xl border-gray-200 focus:border-[#3FA34D] focus:ring-[#3FA34D]"
                    data-testid="popup-email-input"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-xl font-semibold text-base"
                  data-testid="popup-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Odesílám...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 mr-2" />
                      Získat slevový kupón
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-center text-[#9CA3AF] mt-4">
                Žádný spam. Můžete se kdykoliv odhlásit.
              </p>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="px-8 py-12 text-center">
            <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#3FA34D]" />
            </div>
            
            <h3 className="text-2xl font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Děkujeme!
            </h3>
            <p className="text-[#4B5563] mb-6">
              Váš slevový kupón byl odeslán na email.
            </p>

            <div className="bg-[#F0FDF4] rounded-xl p-6 mb-6">
              <p className="text-sm text-[#4B5563] mb-2">Váš slevový kód:</p>
              <p className="text-3xl font-bold text-[#3FA34D] tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {couponCode}
              </p>
              <p className="text-xs text-[#9CA3AF] mt-2">Sleva 5% na první objednávku</p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full h-12 bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-xl"
              data-testid="popup-continue-btn"
            >
              Pokračovat na web
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailPopup;
