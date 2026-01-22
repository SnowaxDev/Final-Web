import { Link } from 'react-router-dom';
import { 
  Scissors, TreeDeciduous, Sprout, Package, Leaf, Sparkles,
  CheckCircle, ArrowRight, Truck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const ServicesPage = () => {
  const services = [
    {
      id: 'lawn_mowing',
      icon: Scissors,
      title: 'Běžné sekání trávy',
      description: 'Profesionální sekání trávníků všech velikostí. Používáme kvalitní techniku pro perfektní výsledek. Tráva je posekána na optimální výšku pro zdravý růst.',
      price: 'od 15 Kč/m²',
      features: [
        'Sekání na správnou výšku (3-5 cm)',
        'Kvalitní profesionální technika',
        'Čisté okraje a přechody',
        'Možnost pravidelné údržby',
      ],
      duration: '1-3 hodiny (dle velikosti)',
      bestFor: 'Rodinné domy, zahrady, parky',
    },
    {
      id: 'lawn_with_fertilizer',
      icon: Sprout,
      title: 'Sekání s hnojením',
      description: 'Kompletní péče o trávník zahrnující sekání a aplikaci kvalitního hnojiva. Váš trávník bude zdravější, zelenější a odolnější.',
      price: 'od 20 Kč/m²',
      popular: true,
      features: [
        'Sekání + aplikace hnojiva',
        'Profesionální granulované hnojivo',
        'Podpora zdravého růstu',
        'Prevence proti plísním',
      ],
      duration: '2-4 hodiny (dle velikosti)',
      bestFor: 'Náročné zahrady, reprezentativní prostory',
    },
    {
      id: 'overgrown',
      icon: Leaf,
      title: 'Přerostlá tráva',
      description: 'Speciální služba pro zahrady, které potřebují extra péči. Zvládneme i silně zanedbanou trávu a vrátíme vaší zahradě původní krásu.',
      price: 'od 25 Kč/m²',
      features: [
        'Sekání vysoké trávy',
        'Odstranění plevele',
        'Mulčování nebo odvoz',
        'Úprava terénu',
      ],
      duration: '3-6 hodin (dle stavu)',
      bestFor: 'Zanedbané zahrady, pozemky po stavbě',
    },
    {
      id: 'hedge_trimming',
      icon: TreeDeciduous,
      title: 'Stříhání živých plotů',
      description: 'Profesionální tvarování a údržba živých plotů. Přesné řezy pro zdravý růst a krásný vzhled. Zvládáme všechny typy plotů.',
      price: 'od 50 Kč/bm',
      features: [
        'Formování do požadovaného tvaru',
        'Stříhání na přesnou výšku',
        'Údržba boků a vrchu',
        'Odvoz větví',
      ],
      duration: '2-5 hodin (dle délky)',
      bestFor: 'Živé ploty, ozdobné keře',
    },
    {
      id: 'vertikutace',
      icon: Sparkles,
      title: 'Vertikutace trávníku',
      description: 'Provzdušnění trávníku pro lepší příjem živin a vody. Odstraníme plsť a mech, váš trávník bude dýchat a lépe růst.',
      price: 'od 8 Kč/m²',
      features: [
        'Odstranění mechové vrstvy',
        'Provzdušnění půdy',
        'Podpora kořenového systému',
        'Lepší vstřebávání vody',
      ],
      duration: '1-3 hodiny (dle velikosti)',
      bestFor: 'Trávníky s mechem, zhutněná půda',
    },
    {
      id: 'vip_annual',
      icon: Package,
      title: 'Celoroční VIP balíček',
      description: 'Komplexní roční péče o vaši zahradu. Zahrnuje pravidelné sekání, hnojení, vertikutaci a sezónní údržbu. Žádné starosti po celý rok.',
      price: 'od 6.900 Kč/rok',
      features: [
        'Pravidelné sekání (10-15x ročně)',
        'Jarní a podzimní hnojení',
        'Vertikutace 1x ročně',
        'Sezónní úklid listí',
        'Prioritní termíny',
        'Sleva 15% na další služby',
      ],
      duration: 'Celoroční péče',
      bestFor: 'Zákazníci bez starostí',
    },
  ];

  const additionalServices = [
    { name: 'Odvoz odpadu', price: '+ 500 Kč', icon: Truck },
    { name: 'Mulčování', price: '+ 300 Kč', icon: Leaf },
    { name: 'Hnojení extra', price: '+ 400 Kč', icon: Sprout },
  ];

  return (
    <div className="min-h-screen pt-20" data-testid="services-page">
      {/* Hero */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#F0FDF4] via-white to-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#222222] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Naše služby
          </h1>
          <p className="text-lg text-[#4B5563] max-w-2xl mx-auto">
            Kompletní nabídka zahradnických služeb pro vaši dokonalou zahradu. 
            Vyberte si, co potřebujete, nebo nám napište pro individuální nabídku.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card 
                key={service.id}
                className={`relative card-hover rounded-2xl border ${
                  service.popular ? 'border-[#3FA34D] shadow-lg' : 'border-gray-100'
                }`}
                data-testid={`service-${service.id}`}
              >
                {service.popular && (
                  <div className="badge-popular">Nejoblíbenější</div>
                )}
                <CardContent className="p-6 md:p-8 pt-8">
                  <div className="w-14 h-14 bg-[#F0FDF4] rounded-xl flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-[#3FA34D]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#222222] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {service.title}
                  </h3>
                  
                  <p className="text-[#4B5563] text-sm mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-2xl font-bold text-[#3FA34D]">{service.price}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#4B5563]">
                        <CheckCircle className="w-4 h-4 text-[#3FA34D] flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-gray-100 space-y-2 text-sm text-[#4B5563] mb-6">
                    <p><strong>Doba trvání:</strong> {service.duration}</p>
                    <p><strong>Vhodné pro:</strong> {service.bestFor}</p>
                  </div>

                  <Link to="/rezervace">
                    <Button 
                      className={`w-full rounded-lg ${
                        service.popular 
                          ? 'bg-[#3FA34D] hover:bg-[#2d7a38] text-white' 
                          : 'bg-white border-2 border-[#3FA34D] text-[#3FA34D] hover:bg-[#F0FDF4]'
                      }`}
                    >
                      Objednat službu
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-12 md:py-20 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#222222] text-center mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Doplňkové služby
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-4">
            {additionalServices.map((service, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm"
                data-testid={`additional-service-${idx}`}
              >
                <service.icon className="w-8 h-8 text-[#3FA34D] mx-auto mb-3" />
                <h4 className="font-semibold text-[#222222] mb-1">{service.name}</h4>
                <p className="text-[#3FA34D] font-bold">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#222222] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Nevíte, jakou službu vybrat?
          </h2>
          <p className="text-[#4B5563] mb-8">
            Napište nám nebo zavolejte. Rádi vám poradíme a připravíme nabídku na míru.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rezervace">
              <Button 
                className="bg-[#3FA34D] hover:bg-[#2d7a38] text-white rounded-full px-8"
                data-testid="services-cta-rezervace"
              >
                Nezávazná poptávka
              </Button>
            </Link>
            <Link to="/kontakt">
              <Button 
                variant="outline"
                className="border-2 border-[#2d7a38] text-[#2d7a38] hover:bg-[#F0FDF4] rounded-full px-8"
                data-testid="services-cta-kontakt"
              >
                Kontaktovat nás
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
