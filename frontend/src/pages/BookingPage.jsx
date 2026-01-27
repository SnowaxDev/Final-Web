import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon,
  Scissors, Sprout, Leaf, TreeDeciduous, Package, HelpCircle,
  User, Phone, Mail, MapPin, FileText, Loader2, Tag, CheckCircle, XCircle,
  Sun, Snowflake, Flower2, Truck, Info
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Calendar } from '../components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';
import { cs } from 'date-fns/locale';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BookingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponValid, setCouponValid] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [tierInfo, setTierInfo] = useState(null);
  
  const [formData, setFormData] = useState({
    service: '',
    property_size: 100,
    condition: 'normal',
    additional_services: [],
    preferred_date: null,
    preferred_time: 'anytime',
    alternative_date: null,
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    property_address: '',
    notes: '',
    estimated_price: 0,
    gdpr_consent: false,
    coupon_code: '',
  });

  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    fetchAvailability();
    const savedCoupon = localStorage.getItem('seknuto_coupon');
    if (savedCoupon) {
      setCouponCode(savedCoupon);
      validateCoupon(savedCoupon);
    }
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [formData.service, formData.property_size, formData.condition, formData.additional_services]);

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`${API}/availability`);
      setAvailableDates(response.data.available_dates);
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    }
  };

  const calculatePrice = async () => {
    if (!formData.service || formData.property_size <= 0) return;
    
    try {
      const response = await axios.post(`${API}/pricing/calculate`, {
        service: formData.service,
        property_size: formData.property_size,
        condition: formData.condition,
        additional_services: formData.additional_services,
      });
      setFormData(prev => ({ ...prev, estimated_price: response.data.estimated_price }));
      setTierInfo(response.data.tier_info);
    } catch (error) {
      console.error('Failed to calculate price:', error);
    }
  };

  const validateCoupon = async (code) => {
    if (!code) {
      setCouponValid(null);
      setCouponDiscount(0);
      return;
    }
    
    setIsValidatingCoupon(true);
    try {
      const response = await axios.post(`${API}/coupons/validate`, { code: code.toUpperCase() });
      setCouponValid(true);
      setCouponDiscount(response.data.discount_percent);
      setFormData(prev => ({ ...prev, coupon_code: code.toUpperCase() }));
      toast.success(`Kupón platný! Sleva ${response.data.discount_percent}%`);
    } catch (error) {
      setCouponValid(false);
      setCouponDiscount(0);
      setFormData(prev => ({ ...prev, coupon_code: '' }));
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const getFinalPrice = () => {
    if (couponDiscount > 0 && formData.estimated_price > 0) {
      return Math.round(formData.estimated_price * (1 - couponDiscount / 100));
    }
    return formData.estimated_price;
  };

  // SLUŽBY - základní jednotlivé služby
  const basicServices = [
    { 
      id: 'lawn_mowing', 
      icon: Scissors, 
      title: 'Sekání trávy (bez hnojení)', 
      price: '2 Kč/m²',
      description: 'Základní sekání trávníku'
    },
    { 
      id: 'lawn_with_fertilizer', 
      icon: Sprout, 
      title: 'Sekání trávy (s hnojením)', 
      price: '3,33 Kč/m²',
      description: 'Sekání + aplikace hnojiva'
    },
    { 
      id: 'overgrown', 
      icon: Leaf, 
      title: 'Hrubé sekání (přerostlá)', 
      price: '3-4 Kč/m²',
      description: 'Pro zanedbanou trávu'
    },
    { 
      id: 'garden_work', 
      icon: TreeDeciduous, 
      title: 'Zahradnické práce', 
      price: '300-450 Kč/hod',
      description: 'Pletí, výsadba, údržba záhonů'
    },
    { 
      id: 'debris_hourly', 
      icon: Truck, 
      title: 'Odvoz odpadu', 
      price: '400 Kč/hod',
      description: 'Odvoz zahradního odpadu'
    },
  ];

  // BALÍČKY - sezónní a kompletní péče
  const packages = [
    { 
      id: 'spring_package', 
      icon: Flower2, 
      title: '🌸 Jarní balíček', 
      subtitle: 'Restart trávníku',
      price: '8,5-12 Kč/m²',
      color: 'bg-pink-50 border-pink-200',
      includes: [
        'Vertikutace (provzdušnění)',
        'Jarní hnojení (dusík)',
        'První sekání + vyhrabání',
        'Ošetření proti mechu a plevelům'
      ],
      pricing: [
        { size: 'do 200 m²', price: '12 Kč/m²' },
        { size: '200-500 m²', price: '10 Kč/m²' },
        { size: '500+ m²', price: '8,5 Kč/m²' },
      ],
      savings: 'Úspora ~20% oproti jednotlivým službám'
    },
    { 
      id: 'summer_package', 
      icon: Sun, 
      title: '☀️ Letní balíček', 
      subtitle: 'Údržba a hustota (měsíčně)',
      price: '3-4 Kč/m²/měsíc',
      color: 'bg-yellow-50 border-yellow-200',
      includes: [
        'Sekání trávníku 2× měsíčně',
        'Hnojení NPK',
        'Mulčování'
      ],
      pricing: [
        { size: 'do 200 m²', price: '4 Kč/m²/měsíc' },
        { size: '200-500 m²', price: '3,5 Kč/m²/měsíc' },
        { size: '500+ m²', price: '3 Kč/m²/měsíc' },
      ],
      savings: 'Úspora ~25% oproti jednotlivým službám'
    },
    { 
      id: 'autumn_package', 
      icon: Leaf, 
      title: '🍂 Podzimní balíček', 
      subtitle: 'Příprava na zimu',
      price: '10-14 Kč/m²',
      color: 'bg-orange-50 border-orange-200',
      includes: [
        'Vertikutace',
        'Podzimní hnojení',
        'Shrabání listí + odvoz'
      ],
      pricing: [
        { size: 'do 200 m²', price: '14 Kč/m²' },
        { size: '200-500 m²', price: '12 Kč/m²' },
        { size: '500+ m²', price: '10 Kč/m²' },
      ],
      savings: 'Úspora ~20% oproti jednotlivým službám'
    },
    { 
      id: 'winter_snow', 
      icon: Snowflake, 
      title: '❄️ Zimní balíček', 
      subtitle: 'Úklid sněhu',
      price: '8-10 Kč/m²',
      color: 'bg-blue-50 border-blue-200',
      includes: [
        'Odklízení sněhu',
        'Odrhnování / dočištění: 2 Kč/m²',
        'Solení (posyp): +0,5 Kč/m²',
        'Ruční úklid chodníků: 25 Kč/bm'
      ],
      pricing: [
        { size: 'Paušál', price: '10-15 Kč/m²/měsíc' },
      ],
      savings: 'Paušál = klid po celou zimu'
    },
    { 
      id: 'vip_annual', 
      icon: Package, 
      title: '🌀 Celoroční VIP servis', 
      subtitle: 'Nejvýhodnější volba',
      price: '18-22 Kč/m²/rok',
      color: 'bg-green-50 border-green-300',
      popular: true,
      includes: [
        'Jarní + podzimní balíček',
        'Pravidelné letní sekání + hnojení',
        'Mulčování',
        'Odvoz odpadu',
        'Zimní údržba sněhu'
      ],
      pricing: [
        { size: 'do 200 m²', price: '22 Kč/m²/rok' },
        { size: '200-500 m²', price: '20 Kč/m²/rok' },
        { size: '500+ m²', price: '18 Kč/m²/rok' },
      ],
      savings: 'Úspora 25-35% oproti jednotlivým službám'
    },
  ];

  const additionalServices = [
    { id: 'mulching', label: 'Mulčování (+0,5 Kč/m²)' },
    { id: 'salting', label: 'Solení/posyp (+0,5 Kč/m²)' },
    { id: 'debris_removal', label: 'Odvoz odpadu (+400 Kč)' },
  ];

  const timeOptions = [
    { id: 'morning', label: 'Dopoledne (8-12h)' },
    { id: 'afternoon', label: 'Odpoledne (12-16h)' },
    { id: 'anytime', label: 'Kdykoliv' },
  ];

  const steps = [
    { num: 1, title: 'Služba' },
    { num: 2, title: 'Detaily' },
    { num: 3, title: 'Termín' },
    { num: 4, title: 'Kontakt' },
    { num: 5, title: 'Hotovo' },
  ];

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.service) {
          toast.error('Vyberte prosím službu nebo balíček');
          return false;
        }
        return true;
      case 2:
        if (formData.property_size <= 0) {
          toast.error('Zadejte prosím velikost plochy');
          return false;
        }
        return true;
      case 3:
        if (!formData.preferred_date) {
          toast.error('Vyberte prosím preferovaný termín');
          return false;
        }
        return true;
      case 4:
        if (!formData.customer_name || !formData.customer_phone || !formData.customer_email || !formData.property_address) {
          toast.error('Vyplňte prosím všechna povinná pole');
          return false;
        }
        if (!formData.gdpr_consent) {
          toast.error('Pro odeslání musíte souhlasit se zpracováním osobních údajů');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        preferred_date: formData.preferred_date ? formData.preferred_date.toISOString().split('T')[0] : null,
        alternative_date: formData.alternative_date ? formData.alternative_date.toISOString().split('T')[0] : null,
      };
      
      const response = await axios.post(`${API}/bookings`, payload);
      setBookingId(response.data.id);
      setCurrentStep(5);
      toast.success('Rezervace byla úspěšně odeslána!');
    } catch (error) {
      console.error('Booking failed:', error);
      toast.error('Při odesílání došlo k chybě. Zkuste to prosím znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAdditionalService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      additional_services: prev.additional_services.includes(serviceId)
        ? prev.additional_services.filter(s => s !== serviceId)
        : [...prev.additional_services, serviceId]
    }));
  };

  const getServiceName = (id) => {
    const service = [...basicServices, ...packages].find(s => s.id === id);
    return service ? service.title : id;
  };

  const getTimeName = (id) => {
    const time = timeOptions.find(t => t.id === id);
    return time ? time.label : id;
  };

  const selectedPackage = packages.find(p => p.id === formData.service);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-[#F9FAFB] to-white" data-testid="booking-page">
      {/* Header */}
      <section className="py-8 md:py-12 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#222222] text-center mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Rezervace online
          </h1>
          <p className="text-[#4B5563] text-center">
            Vyberte službu nebo balíček a získejte nezávaznou cenovou kalkulaci
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          {steps.map((step, idx) => (
            <div key={step.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div 
                  className={`step-circle ${
                    currentStep > step.num ? 'step-completed' :
                    currentStep === step.num ? 'step-active' : 'step-inactive'
                  }`}
                  data-testid={`step-indicator-${step.num}`}
                >
                  {currentStep > step.num ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.num
                  )}
                </div>
                <span className={`text-xs mt-2 hidden sm:block font-medium ${
                  currentStep >= step.num ? 'text-[#3FA34D]' : 'text-[#9CA3AF]'
                }`}>
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-8 sm:w-16 md:w-24 h-1 mx-2 rounded-full ${
                  currentStep > step.num ? 'bg-[#3FA34D]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div data-testid="step-1-content">
                {/* ZÁKLADNÍ SLUŽBY */}
                <div className="bg-gray-50 px-6 md:px-8 py-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-[#222222] mb-1 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <Scissors className="w-5 h-5 text-[#3FA34D]" />
                    Základní služby
                  </h2>
                  <p className="text-sm text-[#4B5563]">Jednotlivé služby pro konkrétní potřeby</p>
                </div>
                
                <div className="p-6 md:p-8 space-y-3">
                  {basicServices.map((service) => (
                    <label
                      key={service.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.service === service.id 
                          ? 'border-[#3FA34D] bg-[#F0FDF4] shadow-md' 
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                      data-testid={`service-option-${service.id}`}
                    >
                      <input 
                        type="radio" 
                        name="service" 
                        value={service.id}
                        checked={formData.service === service.id}
                        onChange={() => updateFormData('service', service.id)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        formData.service === service.id ? 'bg-[#3FA34D]' : 'bg-gray-100'
                      }`}>
                        <service.icon className={`w-6 h-6 ${
                          formData.service === service.id ? 'text-white' : 'text-[#4B5563]'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#222222]">{service.title}</p>
                        <p className="text-sm text-[#4B5563]">{service.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-[#3FA34D]">{service.price}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* SEZÓNNÍ BALÍČKY */}
                <div className="bg-[#F0FDF4] px-6 md:px-8 py-6 border-t border-b border-[#3FA34D]/20">
                  <h2 className="text-lg font-bold text-[#222222] mb-1 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <Package className="w-5 h-5 text-[#3FA34D]" />
                    Sezónní balíčky
                    <span className="ml-2 text-xs font-medium bg-[#3FA34D] text-white px-2 py-0.5 rounded-full">VÝHODNÉ</span>
                  </h2>
                  <p className="text-sm text-[#4B5563]">Komplexní péče s úsporou 20-35%</p>
                </div>
                
                <div className="p-6 md:p-8 space-y-4 bg-gradient-to-b from-[#F0FDF4]/50 to-white">
                  {packages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.service === pkg.id 
                          ? 'border-[#3FA34D] bg-white shadow-lg ring-2 ring-[#3FA34D]/20' 
                          : `${pkg.color} hover:shadow-md`
                      } ${pkg.popular ? 'relative' : ''}`}
                      data-testid={`service-option-${pkg.id}`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-6 bg-gradient-to-r from-[#3FA34D] to-[#2d7a38] text-white text-xs font-bold px-3 py-1 rounded-full">
                          NEJOBLÍBENĚJŠÍ
                        </div>
                      )}
                      <input 
                        type="radio" 
                        name="service" 
                        value={pkg.id}
                        checked={formData.service === pkg.id}
                        onChange={() => updateFormData('service', pkg.id)}
                        className="sr-only"
                      />
                      
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          formData.service === pkg.id ? 'bg-[#3FA34D]' : 'bg-white shadow-sm'
                        }`}>
                          <pkg.icon className={`w-7 h-7 ${
                            formData.service === pkg.id ? 'text-white' : 'text-[#3FA34D]'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <p className="font-bold text-[#222222] text-lg">{pkg.title}</p>
                              <p className="text-sm text-[#4B5563]">{pkg.subtitle}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[#3FA34D] text-lg">{pkg.price}</p>
                            </div>
                          </div>
                          
                          {/* Package Contents */}
                          <div className="mt-3 pt-3 border-t border-gray-200/50">
                            <p className="text-xs font-semibold text-[#4B5563] uppercase tracking-wide mb-2">Co balíček obsahuje:</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                              {pkg.includes.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-[#4B5563]">
                                  <CheckCircle className="w-4 h-4 text-[#3FA34D] flex-shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Tiered Pricing */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {pkg.pricing.map((tier, idx) => (
                              <span key={idx} className="text-xs bg-white/80 border border-gray-200 rounded-full px-3 py-1 text-[#4B5563]">
                                <strong>{tier.size}:</strong> {tier.price}
                              </span>
                            ))}
                          </div>
                          
                          {/* Savings Badge */}
                          <p className="mt-2 text-xs text-[#166534] font-medium bg-[#DCFCE7] inline-block px-2 py-1 rounded">
                            💰 {pkg.savings}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Other */}
                <div className="p-6 md:p-8 border-t border-gray-100">
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.service === 'other' 
                        ? 'border-[#3FA34D] bg-[#F0FDF4]' 
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                    data-testid="service-option-other"
                  >
                    <input 
                      type="radio" 
                      name="service" 
                      value="other"
                      checked={formData.service === 'other'}
                      onChange={() => updateFormData('service', 'other')}
                      className="sr-only"
                    />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      formData.service === 'other' ? 'bg-[#3FA34D]' : 'bg-gray-100'
                    }`}>
                      <HelpCircle className={`w-6 h-6 ${
                        formData.service === 'other' ? 'text-white' : 'text-[#4B5563]'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#222222]">Jiná služba</p>
                      <p className="text-sm text-[#4B5563]">Specifikujte v poznámce, co potřebujete</p>
                    </div>
                    <p className="font-bold text-[#4B5563]">Dle dohody</p>
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Property Details */}
            {currentStep === 2 && (
              <div className="p-6 md:p-8" data-testid="step-2-content">
                <h2 className="text-xl font-bold text-[#222222] mb-6 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <MapPin className="w-6 h-6 text-[#3FA34D]" />
                  Informace o ploše
                </h2>
                
                {/* Selected Service Summary */}
                {formData.service && (
                  <div className="mb-6 p-4 bg-[#F0FDF4] rounded-xl border border-[#3FA34D]/20">
                    <p className="text-sm text-[#4B5563] mb-1">Vybraná služba:</p>
                    <p className="font-bold text-[#222222]">{getServiceName(formData.service)}</p>
                  </div>
                )}
                
                <div className="space-y-6">
                  {/* Property Size */}
                  <div>
                    <Label htmlFor="property_size" className="text-sm font-semibold text-[#222222]">
                      Velikost plochy (m²) *
                    </Label>
                    <Input
                      id="property_size"
                      type="number"
                      value={formData.property_size}
                      onChange={(e) => updateFormData('property_size', parseInt(e.target.value) || 0)}
                      className="mt-2 h-14 text-lg font-medium border-2 focus:border-[#3FA34D]"
                      min="1"
                      data-testid="input-property-size"
                    />
                    <p className="text-xs text-[#9CA3AF] mt-1">Přibližná velikost stačí - upřesníme při prohlídce</p>
                    
                    {/* Tier Info for Packages */}
                    {tierInfo && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <Info className="w-4 h-4 inline mr-1" />
                          Vaše plocha spadá do kategorie <strong>{tierInfo.tier_label}</strong> = <strong>{tierInfo.price_per_m2} Kč/m²</strong>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Condition - only for basic services */}
                  {['lawn_mowing', 'lawn_with_fertilizer', 'overgrown'].includes(formData.service) && (
                    <div>
                      <Label htmlFor="condition" className="text-sm font-semibold text-[#222222]">
                        Aktuální stav trávy
                      </Label>
                      <Select value={formData.condition} onValueChange={(value) => updateFormData('condition', value)}>
                        <SelectTrigger id="condition" className="mt-2 h-14 border-2" data-testid="select-condition">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Běžný stav (pravidelně udržovaná)</SelectItem>
                          <SelectItem value="overgrown">Přerostlá (+50% k ceně)</SelectItem>
                          <SelectItem value="very_neglected">Velmi zanedbaná (+100% k ceně)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Additional Services */}
                  <div>
                    <Label className="text-sm font-semibold text-[#222222] mb-3 block">
                      Doplňkové služby (volitelné)
                    </Label>
                    <div className="space-y-3">
                      {additionalServices.map((service) => (
                        <label
                          key={service.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.additional_services.includes(service.id)
                              ? 'border-[#3FA34D] bg-[#F0FDF4]'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                          data-testid={`additional-${service.id}`}
                        >
                          <Checkbox
                            checked={formData.additional_services.includes(service.id)}
                            onCheckedChange={() => toggleAdditionalService(service.id)}
                          />
                          <span className="text-[#222222] font-medium">{service.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Preview */}
                  {formData.estimated_price > 0 && (
                    <div className="p-6 bg-gradient-to-r from-[#3FA34D] to-[#2d7a38] rounded-2xl text-white" data-testid="price-preview">
                      <p className="text-sm text-white/80 mb-1">Odhadovaná cena:</p>
                      <p className="text-4xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ~{formData.estimated_price.toLocaleString('cs-CZ')} Kč
                      </p>
                      <p className="text-xs text-white/70 mt-2">
                        Finální cena bude upřesněna po prohlídce
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {currentStep === 3 && (
              <div className="p-6 md:p-8" data-testid="step-3-content">
                <h2 className="text-xl font-bold text-[#222222] mb-6 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <CalendarIcon className="w-6 h-6 text-[#3FA34D]" />
                  Kdy vám to vyhovuje?
                </h2>
                
                <div className="space-y-6">
                  {/* Date Picker */}
                  <div>
                    <Label className="text-sm font-semibold text-[#222222] mb-3 block">
                      Preferovaný termín *
                    </Label>
                    <div className="flex justify-center bg-gray-50 rounded-2xl p-4">
                      <Calendar
                        mode="single"
                        selected={formData.preferred_date}
                        onSelect={(date) => updateFormData('preferred_date', date)}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today || date.getDay() === 0;
                        }}
                        locale={cs}
                        className="rounded-xl border border-gray-200 bg-white shadow-sm"
                        data-testid="calendar-preferred"
                      />
                    </div>
                    {formData.preferred_date && (
                      <p className="text-center text-sm text-[#3FA34D] font-medium mt-3 p-2 bg-[#F0FDF4] rounded-lg">
                        ✓ Vybráno: {formData.preferred_date.toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                    )}
                  </div>

                  {/* Time Preference */}
                  <div>
                    <Label className="text-sm font-semibold text-[#222222] mb-3 block">
                      Preferovaný čas
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {timeOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                            formData.preferred_time === option.id 
                              ? 'border-[#3FA34D] bg-[#F0FDF4]' 
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                          data-testid={`time-option-${option.id}`}
                        >
                          <input 
                            type="radio"
                            name="time"
                            value={option.id}
                            checked={formData.preferred_time === option.id}
                            onChange={() => updateFormData('preferred_time', option.id)}
                            className="sr-only"
                          />
                          <span className="text-sm font-medium text-[#222222]">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <div className="p-6 md:p-8" data-testid="step-4-content">
                <h2 className="text-xl font-bold text-[#222222] mb-6 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <User className="w-6 h-6 text-[#3FA34D]" />
                  Kontaktní údaje
                </h2>
                
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <Label htmlFor="customer_name" className="text-sm font-semibold text-[#222222]">
                        Jméno a příjmení *
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                        <Input
                          id="customer_name"
                          value={formData.customer_name}
                          onChange={(e) => updateFormData('customer_name', e.target.value)}
                          className="h-14 pl-12 border-2 focus:border-[#3FA34D]"
                          placeholder="Jan Novák"
                          data-testid="input-customer-name"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="customer_phone" className="text-sm font-semibold text-[#222222]">
                        Telefon *
                      </Label>
                      <div className="relative mt-2">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                        <Input
                          id="customer_phone"
                          type="tel"
                          value={formData.customer_phone}
                          onChange={(e) => updateFormData('customer_phone', e.target.value)}
                          className="h-14 pl-12 border-2 focus:border-[#3FA34D]"
                          placeholder="+420 123 456 789"
                          data-testid="input-customer-phone"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="customer_email" className="text-sm font-semibold text-[#222222]">
                      Email *
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                      <Input
                        id="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => updateFormData('customer_email', e.target.value)}
                        className="h-14 pl-12 border-2 focus:border-[#3FA34D]"
                        placeholder="jan@email.cz"
                        data-testid="input-customer-email"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="property_address" className="text-sm font-semibold text-[#222222]">
                      Adresa zahrady *
                    </Label>
                    <div className="relative mt-2">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                      <Input
                        id="property_address"
                        value={formData.property_address}
                        onChange={(e) => updateFormData('property_address', e.target.value)}
                        className="h-14 pl-12 border-2 focus:border-[#3FA34D]"
                        placeholder="Ulice 123, Dvůr Králové nad Labem"
                        data-testid="input-property-address"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-sm font-semibold text-[#222222]">
                      Poznámka (volitelné)
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => updateFormData('notes', e.target.value)}
                      className="mt-2 min-h-[100px] border-2 focus:border-[#3FA34D]"
                      placeholder="Speciální požadavky, přístup k zahradě, atd."
                      data-testid="input-notes"
                    />
                  </div>

                  {/* Coupon Code */}
                  <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
                    <Label htmlFor="coupon_code" className="text-sm font-semibold text-[#222222] flex items-center gap-2">
                      <Tag className="w-4 h-4 text-amber-600" />
                      Slevový kupón
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="coupon_code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="h-12 uppercase border-2 bg-white"
                        placeholder="SEKNU5OFF"
                        data-testid="input-coupon-code"
                      />
                      <Button
                        type="button"
                        onClick={() => validateCoupon(couponCode)}
                        disabled={isValidatingCoupon || !couponCode}
                        className="h-12 px-6 bg-amber-500 hover:bg-amber-600 text-white"
                        data-testid="btn-validate-coupon"
                      >
                        {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ověřit'}
                      </Button>
                    </div>
                    {couponValid === true && (
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-1 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Kupón platný! Sleva {couponDiscount}%
                      </p>
                    )}
                    {couponValid === false && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Neplatný nebo již použitý kupón
                      </p>
                    )}
                  </div>

                  {/* GDPR Consent */}
                  <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl" data-testid="gdpr-consent">
                    <Checkbox
                      checked={formData.gdpr_consent}
                      onCheckedChange={(checked) => updateFormData('gdpr_consent', checked)}
                      className="mt-0.5"
                    />
                    <span className="text-sm text-[#4B5563]">
                      Souhlasím se zpracováním osobních údajů podle{' '}
                      <a href="/gdpr" className="text-[#3FA34D] underline font-medium">
                        zásad ochrany osobních údajů
                      </a>
                      . *
                    </span>
                  </label>

                  {/* Final Price Summary */}
                  {formData.estimated_price > 0 && (
                    <div className="p-6 bg-[#222222] rounded-2xl text-white" data-testid="final-price-summary">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Shrnutí objednávky:</p>
                          <p className="font-medium">{getServiceName(formData.service)}</p>
                          <p className="text-sm text-gray-400">{formData.property_size} m² • {formData.preferred_date?.toLocaleDateString('cs-CZ')}</p>
                        </div>
                        <div className="text-right">
                          {couponDiscount > 0 ? (
                            <>
                              <p className="text-sm text-gray-400 line-through">
                                {formData.estimated_price.toLocaleString('cs-CZ')} Kč
                              </p>
                              <p className="text-3xl font-bold text-[#3FA34D]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                ~{getFinalPrice().toLocaleString('cs-CZ')} Kč
                              </p>
                              <p className="text-xs text-[#3FA34D]">Sleva {couponDiscount}% aplikována</p>
                            </>
                          ) : (
                            <p className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                              ~{formData.estimated_price.toLocaleString('cs-CZ')} Kč
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <div className="p-8 md:p-12 text-center" data-testid="step-5-content">
                <div className="w-24 h-24 bg-gradient-to-r from-[#3FA34D] to-[#2d7a38] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Check className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Děkujeme! 🎉
                </h2>
                <p className="text-lg text-[#4B5563] mb-8">
                  Vaše rezervace byla úspěšně odeslána.
                </p>

                <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 max-w-md mx-auto">
                  <h3 className="font-bold text-[#222222] mb-4 text-center">Shrnutí rezervace</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-[#4B5563]">Služba:</span>
                      <span className="font-medium text-[#222222]">{getServiceName(formData.service)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-[#4B5563]">Plocha:</span>
                      <span className="font-medium text-[#222222]">{formData.property_size} m²</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-[#4B5563]">Termín:</span>
                      <span className="font-medium text-[#222222]">{formData.preferred_date?.toLocaleDateString('cs-CZ')}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-[#4B5563]">Čas:</span>
                      <span className="font-medium text-[#222222]">{getTimeName(formData.preferred_time)}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-[#F0FDF4] -mx-2 px-2 rounded-lg">
                      <span className="font-medium text-[#222222]">Odhadovaná cena:</span>
                      <span className="font-bold text-[#3FA34D] text-lg">
                        {getFinalPrice().toLocaleString('cs-CZ')} Kč
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[#4B5563] mb-8">
                  📞 Brzy vás budeme kontaktovat na čísle <strong>{formData.customer_phone}</strong> pro potvrzení termínu.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="border-2 border-[#3FA34D] text-[#3FA34D] rounded-full px-8 h-12"
                    data-testid="btn-go-home"
                  >
                    Zpět na hlavní stránku
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentStep(1);
                      setFormData({
                        service: '',
                        property_size: 100,
                        condition: 'normal',
                        additional_services: [],
                        preferred_date: null,
                        preferred_time: 'anytime',
                        alternative_date: null,
                        customer_name: '',
                        customer_phone: '',
                        customer_email: '',
                        property_address: '',
                        notes: '',
                        estimated_price: 0,
                        gdpr_consent: false,
                        coupon_code: '',
                      });
                      setCouponCode('');
                      setCouponValid(null);
                      setCouponDiscount(0);
                    }}
                    className="bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-full px-8 h-12"
                    data-testid="btn-new-booking"
                  >
                    Vytvořit další rezervaci
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex justify-between p-6 md:p-8 bg-gray-50 border-t border-gray-100">
                {currentStep > 1 ? (
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="border-2 border-gray-300 text-[#4B5563] rounded-full px-6 h-12"
                    data-testid="btn-back"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Zpět
                  </Button>
                ) : (
                  <div />
                )}
                
                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-full px-8 h-12 font-semibold shadow-lg"
                    data-testid="btn-next"
                  >
                    Pokračovat
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-full px-10 h-12 font-semibold shadow-lg"
                    data-testid="btn-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Odesílám...
                      </>
                    ) : (
                      <>
                        Odeslat rezervaci
                        <Check className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingPage;
