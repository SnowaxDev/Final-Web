import { Link } from 'react-router-dom';
import { 
  Leaf, Phone, MessageCircle, CheckCircle, ArrowRight, 
  Scissors, TreeDeciduous, Sprout, Package, Truck, Calendar,
  Star, Clock, MapPin, Shield
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';

const HomePage = () => {
  const services = [
    {
      icon: Scissors,
      title: 'Sekání trávy',
      description: 'Profesionální sekání trávníků a zahradních ploch. Pravidelná údržba nebo jednorázová služba.',
      price: 'od 15 Kč/m²',
      features: ['Sekání na správnou výšku', 'Pravidelný plán údržby', 'Ekologické stříhání'],
    },
    {
      icon: TreeDeciduous,
      title: 'Stříhání plotů & keřů',
      description: 'Formování živých plotů a zahradních keřů pro dokonalý vzhled.',
      price: 'od 50 Kč/bm',
      features: ['Formování do tvaru', 'Údržba existujících plotů', 'Přesné dokončení'],
    },
    {
      icon: Sprout,
      title: 'Zahradnické práce',
      description: 'Kompletní zahradnické služby včetně úklidu listí, údržby záhonů a sezónního úklidu.',
      price: 'od 300 Kč',
      features: ['Úklid listí a větví', 'Údržba záhonů', 'Sezónní vyčištění'],
    },
  ];

  const steps = [
    { icon: MessageCircle, title: 'Napište nám', description: 'Přes WhatsApp nebo formulář' },
    { icon: Calendar, title: 'Domluva termínu', description: 'Vybereme vhodný čas' },
    { icon: Truck, title: 'Přijedeme', description: 'S profesionálním vybavením' },
    { icon: CheckCircle, title: 'Hotovo!', description: 'Krásná zahrada bez starostí' },
  ];

  const stats = [
    { value: '500+', label: 'Spokojených zákazníků' },
    { value: '98%', label: 'Úspěšnost' },
    { value: '24h', label: 'Rychlá odpověď' },
    { value: '5★', label: 'Průměrné hodnocení' },
  ];

  const faqItems = [
    {
      question: 'Jak často byste doporučovali sekat trávník?',
      answer: 'Doporučujeme sekat trávník jednou týdně během vegetačního období (duben-říjen). V horkém létě můžete frekvenci snížit na jednou za dva týdny.',
    },
    {
      question: 'Jaké oblasti pokrýváte vašimi službami?',
      answer: 'Působíme v Dvoře Králové nad Labem a okolí do vzdálenosti 30 km. Zahrnuje to např. Trutnov, Jaroměř, Náchod a okolní vesnice.',
    },
    {
      question: 'Jak dlouho dopředu je nutné objednat službu?',
      answer: 'Ideálně 3-5 dní předem, ale v případě volných kapacit jsme schopni dojet i do 24 hodin. Kontaktujte nás pro aktuální dostupnost.',
    },
    {
      question: 'Co je zahrnuto v ceně základní služby?',
      answer: 'V základní ceně je zahrnuto sekání trávníku na požadovanou výšku. Odvoz odpadu a další služby (hnojení, vertikutace) jsou za příplatek.',
    },
  ];

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 pb-16 md:pb-24 overflow-hidden" data-testid="hero-section">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0FDF4] via-white to-[#F9FAFB]" />
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233FA34D' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-white border border-[#3FA34D]/20 rounded-full px-4 py-2 mb-6 shadow-sm">
                <Star className="w-4 h-4 text-[#3FA34D]" />
                <span className="text-sm font-medium text-[#4B5563]">
                  Mladý brigádnický tým s chutí do práce
                </span>
              </div>
              
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#222222] leading-tight mb-6"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Perfektní sekání{' '}
                <span className="text-[#3FA34D]">vašeho trávníku</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[#4B5563] mb-8 leading-relaxed max-w-xl">
                Sekání, stříhání, úklid – rychle a za férové ceny. 
                Spoléhejte na mladý, energický tým z Dvora Králové nad Labem.
              </p>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: CheckCircle, text: 'Rychlost a spolehlivost' },
                  { icon: Shield, text: 'Transparentní ceny' },
                  { icon: MapPin, text: 'Místní firma, známe region' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-[#4B5563]">
                    <item.icon className="w-4 h-4 text-[#3FA34D]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/rezervace">
                  <Button 
                    size="lg" 
                    className="bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-full px-8 h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                    data-testid="hero-cta-rezervace"
                  >
                    Rezervovat online
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a href="https://wa.me/420730588372" target="_blank" rel="noopener noreferrer">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-[#2d7a38] text-[#2d7a38] hover:bg-[#F0FDF4] rounded-full px-8 h-14 text-base font-semibold w-full sm:w-auto"
                    data-testid="hero-cta-whatsapp"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp: 730 588 372
                  </Button>
                </a>
              </div>
            </div>

            {/* Right - Stats Card */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#F0FDF4] rounded-2xl flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-[#3FA34D]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-[#222222]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Pěkně udržovaný trávník
                    </h3>
                    <p className="text-[#4B5563]">Profesionální sekání a péče</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-gray-100">
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-[#3FA34D]" style={{ fontFamily: 'Poppins, sans-serif' }}>15 Kč</p>
                    <p className="text-sm text-[#4B5563]">od / m²</p>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <p className="text-2xl md:text-3xl font-bold text-[#3FA34D]" style={{ fontFamily: 'Poppins, sans-serif' }}>30 km</p>
                    <p className="text-sm text-[#4B5563]">Dosah služeb</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-[#3FA34D]" style={{ fontFamily: 'Poppins, sans-serif' }}>Zdarma</p>
                    <p className="text-sm text-[#4B5563]">Kalkulace</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Link to="/rezervace">
                    <Button 
                      className="w-full bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-xl h-12 font-semibold"
                      data-testid="hero-card-cta"
                    >
                      Získat cenovou nabídku zdarma
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-white" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Naše služby
            </h2>
            <p className="text-[#4B5563] max-w-2xl mx-auto">
              Kompletní zahradnické služby pro sekání trávníků po údržbu záhonů. 
              Spoléhejte se na náš profesionální přístup a zkušené zahradníky.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Card 
                key={idx} 
                className="card-hover bg-white border border-gray-100 rounded-2xl overflow-hidden"
                data-testid={`service-card-${idx}`}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="w-14 h-14 bg-[#F0FDF4] rounded-xl flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-[#3FA34D]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#222222] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {service.title}
                  </h3>
                  <p className="text-[#4B5563] mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-sm text-[#4B5563]">
                        <CheckCircle className="w-4 h-4 text-[#3FA34D] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-[#4B5563]">Cena:</span>
                    <span className="text-lg font-bold text-[#3FA34D]">{service.price}</span>
                  </div>
                  <Link to="/rezervace" className="block mt-4">
                    <Button 
                      variant="outline" 
                      className="w-full border-[#3FA34D] text-[#3FA34D] hover:bg-[#F0FDF4] rounded-lg"
                    >
                      Více informací
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/sluzby">
              <Button 
                className="bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-full px-8"
                data-testid="view-all-services-btn"
              >
                Zobrazit všechny služby
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-[#F9FAFB]" data-testid="why-us-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Proč si vybrat naše zahradnické služby?
            </h2>
            <p className="text-[#4B5563] max-w-2xl mx-auto">
              Kombinujeme moderní technologie s tradičním řemeslnickým přístupem, 
              což znamená skvělé efektivitu výsledků.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {steps.map((step, idx) => (
              <div key={idx} className="text-center" data-testid={`step-${idx}`}>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md border border-gray-100">
                  <step.icon className="w-7 h-7 text-[#3FA34D]" />
                </div>
                <p className="text-sm text-[#9CA3AF] mb-1">{idx + 1}.</p>
                <h4 className="font-semibold text-[#222222] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {step.title}
                </h4>
                <p className="text-sm text-[#4B5563]">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100"
                data-testid={`stat-${idx}`}
              >
                <p className="text-3xl md:text-4xl font-bold text-[#3FA34D] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {stat.value}
                </p>
                <p className="text-sm text-[#4B5563]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white" data-testid="faq-section">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Často kladené otázky
            </h2>
            <p className="text-[#4B5563]">
              Odpovědi na nejčastější otázky o našich službách a praktické rady pro vaši zahradu.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, idx) => (
              <AccordionItem 
                key={idx} 
                value={`item-${idx}`}
                className="bg-[#F9FAFB] rounded-xl border-none px-6"
                data-testid={`faq-item-${idx}`}
              >
                <AccordionTrigger className="text-left font-medium text-[#222222] hover:no-underline py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#4B5563] pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#222222]" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Chcete zahradu jako z katalogu?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Objednejte se ještě dnes a svěřte péči o trávník profesionálům. 
            Rychle, spolehlivě a za férové ceny.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rezervace">
              <Button 
                size="lg"
                className="bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-full px-10 h-14 text-base font-semibold"
                data-testid="cta-rezervace"
              >
                Rezervovat online
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a href="tel:+420730588372">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 rounded-full px-10 h-14 text-base font-semibold"
                data-testid="cta-phone"
              >
                <Phone className="w-5 h-5 mr-2" />
                730 588 372
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
