import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, CheckCircle, ArrowRight, Info,
  Scissors, Sprout, TreeDeciduous, Package
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const PricingPage = () => {
  const [service, setService] = useState('lawn_mowing');
  const [size, setSize] = useState(100);
  const [condition, setCondition] = useState('normal');
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  const pricingTiers = [
    {
      id: 'basic',
      icon: Scissors,
      title: 'Běžné sekání',
      price: '15',
      unit: 'Kč/m²',
      description: 'Ideální pro pravidelnou údržbu',
      features: [
        'Sekání na optimální výšku',
        'Čisté okraje',
        'Bez skrytých poplatků',
      ],
      cta: 'Vybrat',
    },
    {
      id: 'premium',
      icon: Sprout,
      title: 'S hnojením',
      price: '20',
      unit: 'Kč/m²',
      popular: true,
      description: 'Kompletní péče o trávník',
      features: [
        'Sekání + hnojení',
        'Kvalitnější trávník',
        'Prevence chorob',
        'Doporučeno pro léto',
      ],
      cta: 'Vybrat',
    },
    {
      id: 'vip',
      icon: Package,
      title: 'Celoroční VIP',
      price: 'od 6.900',
      unit: 'Kč/rok',
      description: 'Žádné starosti po celý rok',
      features: [
        '10-15 návštěv ročně',
        'Jarní + podzimní hnojení',
        'Vertikutace zdarma',
        'Prioritní termíny',
        '15% sleva na další',
      ],
      cta: 'Zjistit více',
    },
  ];

  const additionalPricing = [
    { service: 'Přerostlá tráva', price: 'od 25 Kč/m²' },
    { service: 'Stříhání plotů', price: 'od 50 Kč/bm' },
    { service: 'Vertikutace', price: 'od 8 Kč/m²' },
    { service: 'Odvoz odpadu', price: '+ 500 Kč' },
    { service: 'Mulčování', price: '+ 300 Kč' },
    { service: 'Extra hnojení', price: '+ 400 Kč' },
  ];

  const servicePrices = {
    lawn_mowing: 15,
    lawn_with_fertilizer: 20,
    overgrown: 25,
    hedge_trimming: 50,
  };

  const conditionMultipliers = {
    normal: 1,
    overgrown: 1.5,
    very_neglected: 2,
  };

  const calculatePrice = () => {
    const basePrice = servicePrices[service] || 15;
    const multiplier = conditionMultipliers[condition] || 1;
    const total = Math.round(basePrice * size * multiplier);
    setCalculatedPrice(total);
  };

  return (
    <div className="min-h-screen pt-20" data-testid="pricing-page">
      {/* Hero */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#F0FDF4] via-white to-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#222222] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ceník služeb
          </h1>
          <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
            Transparentní ceny bez skrytých poplatků. 
            Vyberte si balíček nebo si spočítejte cenu v kalkulačce.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.id}
                className={`relative card-hover rounded-2xl ${
                  tier.popular 
                    ? 'border-2 border-[#3FA34D] shadow-xl scale-105' 
                    : 'border border-gray-100'
                }`}
                data-testid={`pricing-tier-${tier.id}`}
              >
                {tier.popular && (
                  <div className="badge-popular">Nejoblíbenější</div>
                )}
                <CardContent className="p-8 pt-10 text-center">
                  <div className="w-16 h-16 bg-[#F0FDF4] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <tier.icon className="w-8 h-8 text-[#3FA34D]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {tier.title}
                  </h3>
                  
                  <p className="text-[#4B5563] text-sm mb-6">
                    {tier.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-[#222222]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {tier.price}
                    </span>
                    <span className="text-[#4B5563] ml-1">{tier.unit}</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-left">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#4B5563]">
                        <CheckCircle className="w-5 h-5 text-[#3FA34D] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to="/rezervace">
                    <Button 
                      className={`w-full rounded-full ${
                        tier.popular 
                          ? 'bg-[#3FA34D] hover:bg-[#2d7a38] text-white' 
                          : 'bg-white border-2 border-[#3FA34D] text-[#3FA34D] hover:bg-[#F0FDF4]'
                      }`}
                    >
                      {tier.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Price Calculator */}
      <section className="py-12 md:py-20 bg-[#F9FAFB]" data-testid="price-calculator-section">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#3FA34D] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#222222] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Kalkulačka ceny
            </h2>
            <p className="text-[#4B5563]">
              Spočítejte si orientační cenu pro vaši zahradu
            </p>
          </div>

          <Card className="rounded-2xl border-gray-100 shadow-lg">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                {/* Service Selection */}
                <div>
                  <Label htmlFor="service" className="text-sm font-medium text-[#222222]">
                    Typ služby
                  </Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger id="service" className="mt-2 h-12" data-testid="calc-service-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lawn_mowing">Běžné sekání (15 Kč/m²)</SelectItem>
                      <SelectItem value="lawn_with_fertilizer">Sekání s hnojením (20 Kč/m²)</SelectItem>
                      <SelectItem value="overgrown">Přerostlá tráva (25 Kč/m²)</SelectItem>
                      <SelectItem value="hedge_trimming">Stříhání plotů (50 Kč/bm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Size Input */}
                <div>
                  <Label htmlFor="size" className="text-sm font-medium text-[#222222]">
                    Velikost plochy (m² / běžné metry pro ploty)
                  </Label>
                  <Input
                    id="size"
                    type="number"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value) || 0)}
                    className="mt-2 h-12"
                    min="1"
                    data-testid="calc-size-input"
                  />
                </div>

                {/* Condition Selection */}
                <div>
                  <Label htmlFor="condition" className="text-sm font-medium text-[#222222]">
                    Stav trávníku / plochy
                  </Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger id="condition" className="mt-2 h-12" data-testid="calc-condition-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Běžný stav (×1)</SelectItem>
                      <SelectItem value="overgrown">Přerostlý (×1.5)</SelectItem>
                      <SelectItem value="very_neglected">Velmi zanedbaný (×2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Calculate Button */}
                <Button 
                  onClick={calculatePrice}
                  className="w-full bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-lg h-12"
                  data-testid="calc-button"
                >
                  Spočítat cenu
                </Button>

                {/* Result */}
                {calculatedPrice !== null && (
                  <div className="mt-6 p-6 bg-[#F0FDF4] rounded-xl text-center" data-testid="calc-result">
                    <p className="text-sm text-[#4B5563] mb-2">Odhadovaná cena:</p>
                    <p className="text-4xl font-bold text-[#3FA34D]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {calculatedPrice.toLocaleString('cs-CZ')} Kč
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-2 flex items-center justify-center gap-1">
                      <Info className="w-3 h-3" />
                      Finální cena může být upravena po prohlídce
                    </p>
                    <Link to="/rezervace" className="block mt-4">
                      <Button className="bg-[#222222] hover:bg-[#333333] text-white rounded-full px-8">
                        Objednat za tuto cenu
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Pricing Table */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#222222] text-center mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Další služby a příplatky
          </h2>
          
          <div className="bg-[#F9FAFB] rounded-2xl overflow-hidden">
            {additionalPricing.map((item, idx) => (
              <div 
                key={idx}
                className={`flex justify-between items-center p-4 ${
                  idx !== additionalPricing.length - 1 ? 'border-b border-gray-200' : ''
                }`}
                data-testid={`additional-price-${idx}`}
              >
                <span className="text-[#222222] font-medium">{item.service}</span>
                <span className="text-[#3FA34D] font-bold">{item.price}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-[#9CA3AF] mt-6">
            * Ceny jsou orientační. Finální cena bude upřesněna po konzultaci.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-[#222222]">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Máte nestandardní požadavek?
          </h2>
          <p className="text-gray-400 mb-8">
            Kontaktujte nás pro individuální cenovou nabídku. Rádi vám připravíme řešení na míru.
          </p>
          <Link to="/kontakt">
            <Button 
              className="bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-full px-8 h-12"
              data-testid="pricing-cta"
            >
              Kontaktovat nás
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
