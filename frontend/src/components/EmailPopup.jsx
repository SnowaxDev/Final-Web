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
    // Check if user already subscribed (has coupon saved)
    const savedCoupon = localStorage.getItem('seknuto_coupon');
    const popupClosed = sessionStorage.getItem('seknuto_popup_closed');
    
    // Don't show on booking page
    if (window.location.pathname === '/rezervace') {
      return;
    }
    
    // If user already has coupon, don't show popup
    if (savedCoupon) {
      return;
    }
    
    // If user closed popup in this session, don't show again
    if (popupClosed) {
      return;
    }
    
    // Show popup immediately (with small delay for page load)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Remember that user closed popup (only for this session)
    sessionStorage.setItem('seknuto_popup_closed', 'true');
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
      // Save coupon permanently so popup won't show again
      localStorage.setItem('seknuto_coupon', response.data.coupon_code);
      localStorage.setItem('seknuto_email', email);
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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        {/* Close button - more visible */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 hover:text-gray-800 transition-all z-10 shadow-sm"
          aria-label="Zavřít"
          data-testid="popup-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <>
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-[#3FA34D] to-[#1e5a25] px-8 pt-12 pb-20 text-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-20 h-20 border-4 border-white rounded-full" />
                <div className="absolute bottom-8 right-8 w-32 h-32 border-4 border-white rounded-full" />
              </div>
              
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                <Gift className="w-10 h-10 text-[#3FA34D]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Získejte 5% slevu!
              </h3>
              <p className="text-white/90 text-base">
                Na vaši první objednávku
              </p>
            </div>

            {/* Content */}
            <div className="px-8 pt-14 pb-8">
              <p className="text-center text-[#4B5563] mb-6 text-base leading-relaxed">
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
                    className="h-14 pl-12 text-base rounded-xl border-2 border-gray-200 focus:border-[#3FA34D] focus:ring-[#3FA34D]"
                    data-testid="popup-email-input"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all"
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
              
              {/* Skip link */}
              <button 
                onClick={handleClose}
                className="block w-full text-center text-sm text-[#9CA3AF] hover:text-[#4B5563] mt-4 underline"
              >
                Pokračovat bez slevy
              </button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="px-8 py-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#3FA34D] to-[#2d7a38] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Děkujeme! 🎉
            </h3>
            <p className="text-[#4B5563] mb-6 text-base">
              Váš slevový kupón byl odeslán na email.
            </p>

            <div className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] rounded-2xl p-6 mb-6 border-2 border-dashed border-[#3FA34D]">
              <p className="text-sm text-[#4B5563] mb-2">Váš slevový kód:</p>
              <p className="text-4xl font-black text-[#3FA34D] tracking-widest" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {couponCode}
              </p>
              <p className="text-sm text-[#166534] mt-3 font-medium">💰 Sleva 5% na první objednávku</p>
            </div>

            <Button
              onClick={handleClose}
              className="w-full h-14 bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-xl font-bold text-base"
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
