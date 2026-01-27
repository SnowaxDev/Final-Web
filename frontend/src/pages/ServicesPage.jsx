import { Link } from 'react-router-dom';
import { 
  Scissors, TreeDeciduous, Sprout, Package, Leaf, Sparkles,
  CheckCircle, ArrowRight, Truck, Sun, Snowflake, Flower2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const ServicesPage = () => {
  const services = [
    {
      id: 'lawn_mowing',
      icon: Scissors,
      title: '✂️ Sekání trávy',
      description: 'Profesionální sekání trávníků všech velikostí. Nabízíme sekání bez hnojení i s hnojením, včetně možnosti mulčování.',
      price: 'od 2 Kč/m²',
      features: [
        'Sekání bez hnojení: 2 Kč/m²',
        'Sekání s hnojením: 3,33 Kč/m²',
        'Hrubé sekání (přerostlá): 3-4 Kč/m²',
        'Mulčování: +0,5 Kč/m²',
      ],
      duration: '1-3 hodiny (dle velikosti)',
      bestFor: 'Rodinné domy, zahrady, parky',
    },
    {
      id: 'debris_removal',
      icon: Truck,
      title: '🚛 Odvoz odpadu',
      description: 'Odvezeme veškerý zahradní odpad. Nabízíme flexibilní účtování podle váhy nebo času.',
      price: 'od 5 Kč/kg',
      features: [
        'Odvoz dle váhy: od 5 Kč/kg',
        'Odvoz dle času: 400 Kč/hod',
        'Likvidace zahradního odpadu',
        'Odvoz listí, větví, trávy',
      ],
      duration: 'Dle množství odpadu',
      bestFor: 'Po velkém úklidu, sezónní práce',
    },
    {
      id: 'garden_work',
      icon: TreeDeciduous,
      title: '🛠️ Zahradnické práce',
      description: 'Ruční zahradní práce včetně pletí, výsadby a údržby záhonů. Odstranění překážek a úprava terénu.',
      price: '300-450 Kč/hod',
      features: [
        'Pletí a údržba záhonů',
        'Výsadba rostlin',
        'Odstranění kořenů, obrub',
        'Úprava starých záhonů',
      ],
      duration: 'Dle rozsahu práce',
      bestFor: 'Údržba záhonů, renovace zahrad',
    },
    {
      id: 'spring_package',
      icon: Flower2,
      title: '🌸 Jarní balíček',
      description: 'Restart trávníku po zimě. Obsahuje vertikutaci, první hnojení s dusíkem, první sekání a ošetření proti mechu.',
      price: 'od 12 Kč/m²',
      popular: true,
      features: [
        'Vertikutace (provzdušnění)',
        'První hnojení s dusíkem',
        'První sekání + vyhrabání',
        'Ošetření proti mechu a plevelům',
      ],
      duration: '3-5 hodin (dle velikosti)',
      bestFor: 'Všechny zahrady na jaře',
    },
    {
      id: 'summer_package',
      icon: Sun,
      title: '☀️ Letní balíček',
      description: 'Pravidelná letní údržba pro hustý a zdravý trávník. Obsahuje sekání 2× měsíčně, hnojení NPK a mulčování.',
      price: 'od 3 Kč/m²',
      features: [
        'Pravidelné sekání (2× měsíčně)',
        'Hnojení NPK',
        'Mulčování na přání',
        'Kontrola stavu trávníku',
      ],
      duration: 'Pravidelné návštěvy',
      bestFor: 'Letní období (červen-srpen)',
    },
    {
      id: 'autumn_package',
      icon: Leaf,
      title: '🍂 Podzimní balíček',
      description: 'Připravte trávník na zimu. Vertikutace, podzimní hnojení a kompletní shrabání a odvoz listí.',
      price: 'od 14 Kč/m²',
      features: [
        'Vertikutace + podzimní hnojení',
        'Shrabání listí',
        'Odvoz odpadu',
        'Příprava na zimu',
      ],
      duration: '3-5 hodin (dle velikosti)',
      bestFor: 'Všechny zahrady na podzim',
    },
    {
      id: 'winter_snow',
      icon: Snowflake,
      title: '❄️ Zimní balíček',
      description: 'Úklid sněhu z chodníků, příjezdových cest a ploch. Ruční i plošné odklízení včetně solení.',
      price: 'od 8 Kč/m²',
      features: [
        'Ruční odklízení: od 25 Kč/bm',
        'Plošné odklízení: od 8 Kč/m²',
        'Dočištění sněhu: 2 Kč/m²',
        'Solení/posyp: +0,5 Kč/m²',
        'Paušál: od 1 500 Kč/měsíc',
      ],
      duration: 'Dle potřeby',
      bestFor: 'Zimní období, firmy, domácnosti',
    },
    {
      id: 'vip_annual',
      icon: Package,
      title: '🌀 Celoroční VIP servis',
      description: 'Komplexní roční péče o vaši zahradu. Všechny sezónní služby v jednom balíčku - žádné starosti po celý rok.',
      price: 'od 6 900 Kč/rok',
      features: [
        '2× vertikutace',
        '4× sezónní hnojení',
        '10× sekání + mulčování',
        'Jarní a podzimní balíček',
        '2× odvoz odpadu',
        'Zimní úklid sněhu',
      ],
      duration: 'Celoroční péče',
      bestFor: 'Zákazníci bez starostí (do 100 m²)',
    },
  ];

  const additionalServices = [
    { name: 'Mulčování', price: '+0,5 Kč/m²', icon: Leaf },
    { name: 'Solení/posyp', price: '+0,5 Kč/m²', icon: Snowflake },
    { name: 'Odvoz odpadu', price: '400 Kč/hod', icon: Truck },
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
            Kompletní nabídka zahradnických služeb od sekání trávy po celoroční péči. 
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
