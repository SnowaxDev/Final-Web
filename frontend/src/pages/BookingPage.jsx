import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon,
  Scissors, Sprout, Leaf, TreeDeciduous, Package, HelpCircle,
  User, Phone, Mail, MapPin, FileText, Loader2, Tag, CheckCircle, XCircle
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
    // Check for saved coupon
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

  const services = [
    { id: 'lawn_mowing', icon: Scissors, title: 'Sekání trávy (bez hnojení)', price: '2 Kč/m²' },
    { id: 'lawn_with_fertilizer', icon: Sprout, title: 'Sekání trávy (s hnojením)', price: '3,33 Kč/m²' },
    { id: 'overgrown', icon: Leaf, title: 'Hrubé sekání (přerostlá)', price: '3-4 Kč/m²' },
    { id: 'spring_package', icon: Sprout, title: '🌸 Jarní balíček', price: 'od 12 Kč/m²' },
    { id: 'summer_package', icon: Sprout, title: '☀️ Letní balíček', price: 'od 3 Kč/m²' },
    { id: 'autumn_package', icon: Leaf, title: '🍂 Podzimní balíček', price: 'od 14 Kč/m²' },
    { id: 'winter_snow', icon: Package, title: '❄️ Zimní úklid sněhu', price: 'od 8 Kč/m²' },
    { id: 'vip_annual', icon: Package, title: 'Celoroční VIP servis', price: 'od 6 900 Kč/rok' },
    { id: 'garden_work', icon: TreeDeciduous, title: 'Zahradnické práce', price: '300-450 Kč/hod' },
    { id: 'other', icon: HelpCircle, title: 'Jiné (specifikujte v poznámce)', price: 'Dle dohody' },
  ];

  const additionalServices = [
    { id: 'mulching', label: 'Mulčování (+0,5 Kč/m²)' },
    { id: 'debris_removal', label: 'Odvoz odpadu (+400 Kč/hod)' },
    { id: 'vertikutace', label: 'Vertikutace (+500 Kč)' },
    { id: 'salting', label: 'Solení/posyp (+0,5 Kč/m²)' },
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
          toast.error('Vyberte prosím službu');
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

  const isDateAvailable = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availableDates.includes(dateStr);
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
    const service = services.find(s => s.id === id);
    return service ? service.title : id;
  };

  const getTimeName = (id) => {
    const time = timeOptions.find(t => t.id === id);
    return time ? time.label : id;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-[#F9FAFB]" data-testid="booking-page">
      {/* Header */}
      <section className="py-8 md:py-12 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#222222] text-center mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Rezervace online
          </h1>
          <p className="text-[#4B5563] text-center">
            Vyplňte formulář a my se vám brzy ozveme
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
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
                <span className={`text-xs mt-2 hidden sm:block ${
                  currentStep >= step.num ? 'text-[#3FA34D]' : 'text-[#9CA3AF]'
                }`}>
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-8 sm:w-16 md:w-24 h-0.5 mx-2 ${
                  currentStep > step.num ? 'bg-[#3FA34D]' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card className="rounded-2xl border-gray-100 shadow-lg">
          <CardContent className="p-6 md:p-8">
            
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div data-testid="step-1-content">
                <h2 className="text-xl font-bold text-[#222222] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Jakou službu potřebujete?
                </h2>
                
                <RadioGroup 
                  value={formData.service} 
                  onValueChange={(value) => updateFormData('service', value)}
                  className="space-y-4"
                >
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.service === service.id 
                          ? 'border-[#3FA34D] bg-[#F0FDF4]' 
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                      data-testid={`service-option-${service.id}`}
                    >
                      <RadioGroupItem value={service.id} id={service.id} className="sr-only" />
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        formData.service === service.id ? 'bg-[#3FA34D]' : 'bg-[#F0FDF4]'
                      }`}>
                        <service.icon className={`w-6 h-6 ${
                          formData.service === service.id ? 'text-white' : 'text-[#3FA34D]'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-[#222222]">{service.title}</p>
                        <p className="text-sm text-[#4B5563]">{service.price}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.service === service.id 
                          ? 'border-[#3FA34D] bg-[#3FA34D]' 
                          : 'border-gray-300'
                      }`}>
                        {formData.service === service.id && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Property Details */}
            {currentStep === 2 && (
              <div data-testid="step-2-content">
                <h2 className="text-xl font-bold text-[#222222] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Informace o zahradě
                </h2>
                
                <div className="space-y-6">
                  {/* Property Size */}
                  <div>
                    <Label htmlFor="property_size" className="text-sm font-medium text-[#222222]">
                      Velikost plochy (m² / bm pro ploty) *
                    </Label>
                    <Input
                      id="property_size"
                      type="number"
                      value={formData.property_size}
                      onChange={(e) => updateFormData('property_size', parseInt(e.target.value) || 0)}
                      className="mt-2 h-12"
                      min="1"
                      data-testid="input-property-size"
                    />
                    <p className="text-xs text-[#9CA3AF] mt-1">Přibližná velikost stačí</p>
                  </div>

                  {/* Condition */}
                  <div>
                    <Label htmlFor="condition" className="text-sm font-medium text-[#222222]">
                      Stav trávy / plochy
                    </Label>
                    <Select value={formData.condition} onValueChange={(value) => updateFormData('condition', value)}>
                      <SelectTrigger id="condition" className="mt-2 h-12" data-testid="select-condition">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Běžná údržba</SelectItem>
                        <SelectItem value="overgrown">Přerostlá</SelectItem>
                        <SelectItem value="very_neglected">Velmi zanedbaná</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Additional Services */}
                  <div>
                    <Label className="text-sm font-medium text-[#222222] mb-3 block">
                      Doplňkové služby (volitelné)
                    </Label>
                    <div className="space-y-3">
                      {additionalServices.map((service) => (
                        <label
                          key={service.id}
                          className="flex items-center gap-3 cursor-pointer"
                          data-testid={`additional-${service.id}`}
                        >
                          <Checkbox
                            checked={formData.additional_services.includes(service.id)}
                            onCheckedChange={() => toggleAdditionalService(service.id)}
                          />
                          <span className="text-[#4B5563]">{service.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Preview */}
                  {formData.estimated_price > 0 && (
                    <div className="p-4 bg-[#F0FDF4] rounded-xl" data-testid="price-preview">
                      <p className="text-sm text-[#4B5563]">Odhadovaná cena:</p>
                      <p className="text-2xl font-bold text-[#3FA34D]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        ~{formData.estimated_price.toLocaleString('cs-CZ')} Kč
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {currentStep === 3 && (
              <div data-testid="step-3-content">
                <h2 className="text-xl font-bold text-[#222222] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Kdy vám to vyhovuje?
                </h2>
                
                <div className="space-y-6">
                  {/* Date Picker */}
                  <div>
                    <Label className="text-sm font-medium text-[#222222] mb-3 block">
                      Preferovaný termín *
                    </Label>
                    <div className="flex justify-center">
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
                        className="rounded-xl border border-gray-100"
                        data-testid="calendar-preferred"
                      />
                    </div>
                    {formData.preferred_date && (
                      <p className="text-center text-sm text-[#3FA34D] mt-2">
                        Vybráno: {formData.preferred_date.toLocaleDateString('cs-CZ')}
                      </p>
                    )}
                  </div>

                  {/* Time Preference */}
                  <div>
                    <Label className="text-sm font-medium text-[#222222] mb-3 block">
                      Preferovaný čas
                    </Label>
                    <RadioGroup 
                      value={formData.preferred_time} 
                      onValueChange={(value) => updateFormData('preferred_time', value)}
                      className="flex flex-wrap gap-3"
                    >
                      {timeOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.preferred_time === option.id 
                              ? 'border-[#3FA34D] bg-[#F0FDF4]' 
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                          data-testid={`time-option-${option.id}`}
                        >
                          <RadioGroupItem value={option.id} className="sr-only" />
                          <span className="text-sm font-medium text-[#222222]">{option.label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Alternative Date */}
                  <div>
                    <Label className="text-sm font-medium text-[#222222] mb-3 block">
                      Náhradní termín (volitelné)
                    </Label>
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={formData.alternative_date}
                        onSelect={(date) => updateFormData('alternative_date', date)}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today || date.getDay() === 0;
                        }}
                        locale={cs}
                        className="rounded-xl border border-gray-100"
                        data-testid="calendar-alternative"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <div data-testid="step-4-content">
                <h2 className="text-xl font-bold text-[#222222] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Kontaktní údaje
                </h2>
                
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <Label htmlFor="customer_name" className="text-sm font-medium text-[#222222]">
                      Jméno a příjmení *
                    </Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                      <Input
                        id="customer_name"
                        value={formData.customer_name}
                        onChange={(e) => updateFormData('customer_name', e.target.value)}
                        className="h-12 pl-11"
                        placeholder="Jan Novák"
                        data-testid="input-customer-name"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="customer_phone" className="text-sm font-medium text-[#222222]">
                      Telefon *
                    </Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                      <Input
                        id="customer_phone"
                        type="tel"
                        value={formData.customer_phone}
                        onChange={(e) => updateFormData('customer_phone', e.target.value)}
                        className="h-12 pl-11"
                        placeholder="+420 123 456 789"
                        data-testid="input-customer-phone"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="customer_email" className="text-sm font-medium text-[#222222]">
                      Email *
                    </Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                      <Input
                        id="customer_email"
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => updateFormData('customer_email', e.target.value)}
                        className="h-12 pl-11"
                        placeholder="jan@email.cz"
                        data-testid="input-customer-email"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Label htmlFor="property_address" className="text-sm font-medium text-[#222222]">
                      Adresa zahrady *
                    </Label>
                    <div className="relative mt-2">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                      <Input
                        id="property_address"
                        value={formData.property_address}
                        onChange={(e) => updateFormData('property_address', e.target.value)}
                        className="h-12 pl-11"
                        placeholder="Ulice 123, Dvůr Králové nad Labem"
                        data-testid="input-property-address"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium text-[#222222]">
                      Poznámka (volitelné)
                    </Label>
                    <div className="relative mt-2">
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-[#9CA3AF]" />
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => updateFormData('notes', e.target.value)}
                        className="pl-11 min-h-[100px]"
                        placeholder="Speciální požadavky, přístup k zahradě, atd."
                        data-testid="input-notes"
                      />
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="pt-4 border-t border-gray-100">
                    <Label htmlFor="coupon_code" className="text-sm font-medium text-[#222222]">
                      Slevový kupón (volitelné)
                    </Label>
                    <div className="flex gap-2 mt-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                        <Input
                          id="coupon_code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="h-12 pl-11 uppercase"
                          placeholder="SEKNU5OFF"
                          data-testid="input-coupon-code"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => validateCoupon(couponCode)}
                        disabled={isValidatingCoupon || !couponCode}
                        variant="outline"
                        className="h-12 px-6 border-[#3FA34D] text-[#3FA34D] hover:bg-[#F0FDF4]"
                        data-testid="btn-validate-coupon"
                      >
                        {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ověřit'}
                      </Button>
                    </div>
                    {couponValid === true && (
                      <p className="text-sm text-[#3FA34D] mt-2 flex items-center gap-1">
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
                  <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-start gap-3 cursor-pointer" data-testid="gdpr-consent">
                      <Checkbox
                        checked={formData.gdpr_consent}
                        onCheckedChange={(checked) => updateFormData('gdpr_consent', checked)}
                        className="mt-0.5"
                      />
                      <span className="text-sm text-[#4B5563]">
                        Souhlasím se zpracováním osobních údajů podle{' '}
                        <a href="/gdpr" className="text-[#3FA34D] underline">
                          zásad ochrany osobních údajů
                        </a>
                        . *
                      </span>
                    </label>
                  </div>

                  {/* Price Summary */}
                  {formData.estimated_price > 0 && (
                    <div className="p-4 bg-[#F0FDF4] rounded-xl mt-6" data-testid="final-price-summary">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-[#4B5563]">Služba: {getServiceName(formData.service)}</p>
                          <p className="text-sm text-[#4B5563]">Plocha: {formData.property_size} m²</p>
                          {couponDiscount > 0 && (
                            <p className="text-sm text-[#3FA34D] font-medium">Sleva: -{couponDiscount}%</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-[#4B5563]">Odhadovaná cena:</p>
                          {couponDiscount > 0 ? (
                            <>
                              <p className="text-sm text-[#9CA3AF] line-through">
                                {formData.estimated_price.toLocaleString('cs-CZ')} Kč
                              </p>
                              <p className="text-2xl font-bold text-[#3FA34D]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                ~{getFinalPrice().toLocaleString('cs-CZ')} Kč
                              </p>
                            </>
                          ) : (
                            <p className="text-2xl font-bold text-[#3FA34D]" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
              <div className="text-center py-8" data-testid="step-5-content">
                <div className="w-20 h-20 bg-[#3FA34D] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Děkujeme! Vaše rezervace byla odeslána.
                </h2>
                <p className="text-[#4B5563] mb-8">
                  Brzy vás budeme kontaktovat na čísle {formData.customer_phone} pro potvrzení.
                </p>

                <div className="bg-[#F9FAFB] rounded-xl p-6 text-left mb-8 max-w-md mx-auto">
                  <h3 className="font-semibold text-[#222222] mb-4">Shrnutí rezervace:</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Služba:</strong> {getServiceName(formData.service)}</p>
                    <p><strong>Datum:</strong> {formData.preferred_date?.toLocaleDateString('cs-CZ')}</p>
                    <p><strong>Čas:</strong> {getTimeName(formData.preferred_time)}</p>
                    <p><strong>Adresa:</strong> {formData.property_address}</p>
                    <p className="pt-2 border-t border-gray-200">
                      <strong>Odhadovaná cena:</strong>{' '}
                      <span className="text-[#3FA34D] font-bold">
                        {formData.estimated_price.toLocaleString('cs-CZ')} Kč
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="border-2 border-[#3FA34D] text-[#3FA34D] rounded-full px-6"
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
                      });
                    }}
                    className="bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-full px-6"
                    data-testid="btn-new-booking"
                  >
                    Vytvořit další rezervaci
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                {currentStep > 1 ? (
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="border-gray-200 text-[#4B5563] rounded-full px-6"
                    data-testid="btn-back"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Zpět
                  </Button>
                ) : (
                  <div />
                )}
                
                {currentStep < 4 ? (
                  <Button
                    onClick={handleNext}
                    className="bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-full px-6"
                    data-testid="btn-next"
                  >
                    Další krok
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-full px-8"
                    data-testid="btn-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Odesílám...
                      </>
                    ) : (
                      <>
                        Odeslat rezervaci
                        <Check className="w-4 h-4 ml-2" />
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
