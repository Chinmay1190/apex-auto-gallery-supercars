import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cars, brandLogos } from '@/data/cars';
import { MapPin, Calendar, ChevronRight, ArrowRight, Sparkles, Search, Globe2 } from 'lucide-react';
import { useMemo, useState } from 'react';


const brandData = [
  { name: 'Lamborghini', country: 'Italy', founded: '1963', tagline: 'Expect the unexpected', description: 'Bold, angular supercars with naturally aspirated V10 and V12 engines.', color: '#FFD700', gradient: 'from-yellow-500/20 via-amber-500/5 to-transparent' },
  { name: 'Ferrari', country: 'Italy', founded: '1947', tagline: 'We are the competition', description: 'The prancing horse — synonymous with speed, passion, and racing heritage.', color: '#FF2800', gradient: 'from-red-500/20 via-red-500/5 to-transparent' },
  { name: 'McLaren', country: 'United Kingdom', founded: '1963', tagline: 'Fearlessly forward', description: 'Formula 1 DNA meets road car technology for ultimate driver engagement.', color: '#FF6600', gradient: 'from-orange-500/20 via-orange-500/5 to-transparent' },
  { name: 'Porsche', country: 'Germany', founded: '1931', tagline: 'There is no substitute', description: 'Precision engineering and iconic design from Stuttgart, Germany.', color: '#C0C0C0', gradient: 'from-zinc-400/20 via-zinc-400/5 to-transparent' },
  { name: 'Bugatti', country: 'France', founded: '1909', tagline: 'Art, Forme, Technique', description: 'The absolute pinnacle of automotive luxury and speed.', color: '#003399', gradient: 'from-blue-600/20 via-blue-600/5 to-transparent' },
  { name: 'Aston Martin', country: 'United Kingdom', founded: '1913', tagline: 'Power, Beauty and Soul', description: 'British elegance meets grand touring excellence. The gentleman\'s supercar.', color: '#006633', gradient: 'from-emerald-600/20 via-emerald-600/5 to-transparent' },
  { name: 'Rolls-Royce', country: 'United Kingdom', founded: '1904', tagline: 'Strive for perfection', description: 'The spirit of ecstasy. Unparalleled luxury, craftsmanship, and prestige.', color: '#1a1a2e', gradient: 'from-purple-900/20 via-purple-900/5 to-transparent' },
  { name: 'Maserati', country: 'Italy', founded: '1914', tagline: 'Audaci per vocazione', description: 'The trident of Modena. Italian elegance with a racing soul.', color: '#0033A0', gradient: 'from-blue-700/20 via-blue-700/5 to-transparent' },
  { name: 'Bentley', country: 'United Kingdom', founded: '1919', tagline: 'Be Extraordinary', description: 'Hand-crafted British grand tourers blending power with refinement.', color: '#004225', gradient: 'from-green-800/20 via-green-800/5 to-transparent' },
  { name: 'Koenigsegg', country: 'Sweden', founded: '1994', tagline: 'A factory of dreams', description: 'Swedish hypercar pioneers redefining the limits of speed and engineering.', color: '#C0C0C0', gradient: 'from-slate-400/20 via-slate-400/5 to-transparent' },
  { name: 'Pagani', country: 'Italy', founded: '1992', tagline: 'Science and art', description: 'Where automotive engineering becomes rolling sculpture.', color: '#8B0000', gradient: 'from-red-900/20 via-red-900/5 to-transparent' },
  { name: 'Mercedes-AMG', country: 'Germany', founded: '1967', tagline: 'Driving Performance', description: 'Hand-built thunder from Affalterbach. One man, one engine.', color: '#000000', gradient: 'from-zinc-700/20 via-zinc-700/5 to-transparent' },
  { name: 'Rimac', country: 'Croatia', founded: '2009', tagline: 'The future is electric', description: 'Croatian electric hypercar pioneers shattering performance records.', color: '#00C2A8', gradient: 'from-teal-500/20 via-teal-500/5 to-transparent' },
  { name: 'Lotus', country: 'United Kingdom', founded: '1952', tagline: 'For the drivers', description: 'Simplify, then add lightness. British driver-focused engineering.', color: '#FFD700', gradient: 'from-yellow-600/20 via-yellow-600/5 to-transparent' },
  { name: 'Alfa Romeo', country: 'Italy', founded: '1910', tagline: 'La meccanica delle emozioni', description: 'The mechanics of emotion. Italian passion since 1910.', color: '#B71C1C', gradient: 'from-red-700/20 via-red-700/5 to-transparent' },
  { name: 'Lexus', country: 'Japan', founded: '1989', tagline: 'Experience Amazing', description: 'Japanese precision meets uncompromising luxury.', color: '#1a1a2e', gradient: 'from-zinc-500/20 via-zinc-500/5 to-transparent' },
  { name: 'BMW M', country: 'Germany', founded: '1972', tagline: 'The Most Powerful Letter In The World', description: 'Motorsport-bred precision from Munich. Three colours, one obsession.', color: '#0066FF', gradient: 'from-blue-600/20 via-blue-600/5 to-transparent' },
  { name: 'Audi', country: 'Germany', founded: '1909', tagline: 'Vorsprung durch Technik', description: 'Four rings. Quattro grip. Engineering as art form.', color: '#BB0A30', gradient: 'from-red-600/20 via-red-600/5 to-transparent' },
  { name: 'Ford', country: 'United States', founded: '1903', tagline: 'Built Ford Tough', description: 'Le Mans royalty. American muscle and GT heritage in one badge.', color: '#003478', gradient: 'from-blue-700/20 via-blue-700/5 to-transparent' },
  { name: 'Chevrolet', country: 'United States', founded: '1911', tagline: 'Find New Roads', description: 'Home of the Corvette — America\'s sports car for seven decades.', color: '#FFD700', gradient: 'from-amber-500/20 via-amber-500/5 to-transparent' },
  { name: 'Nissan', country: 'Japan', founded: '1933', tagline: 'Innovation that excites', description: 'Godzilla territory. Skyline GT-R lineage and Z-car icons.', color: '#C3002F', gradient: 'from-red-600/20 via-red-600/5 to-transparent' },
  { name: 'Hennessey', country: 'United States', founded: '1991', tagline: 'World\'s Fastest', description: 'Texas tuning legends. From Venom hypercars to 1000-HP trucks.', color: '#000000', gradient: 'from-zinc-800/20 via-zinc-800/5 to-transparent' },
  { name: 'SSC', country: 'United States', founded: '1998', tagline: 'Pure Performance', description: 'American hypercar challengers. Tuatara, Bonneville record-breaker.', color: '#C0C0C0', gradient: 'from-slate-400/20 via-slate-400/5 to-transparent' },
  { name: 'Czinger', country: 'United States', founded: '2019', tagline: '3D-printed revolution', description: 'Tandem-seat hypercars built with AI-driven 3D printing.', color: '#FF6600', gradient: 'from-orange-500/20 via-orange-500/5 to-transparent' },
  { name: 'Gordon Murray', country: 'United Kingdom', founded: '2017', tagline: 'Driver-first engineering', description: 'McLaren F1 designer\'s ultimate driver-focused supercars.', color: '#1a1a2e', gradient: 'from-blue-900/20 via-blue-900/5 to-transparent' },
  { name: 'Jaguar', country: 'United Kingdom', founded: '1935', tagline: 'The Art of Performance', description: 'British grace with a sporting bite. E-Type to F-Type heritage.', color: '#006633', gradient: 'from-emerald-600/20 via-emerald-600/5 to-transparent' },
  { name: 'Tesla', country: 'United States', founded: '2003', tagline: 'Accelerating sustainable transport', description: 'Plaid speed. The brand that electrified the supercar world.', color: '#CC0000', gradient: 'from-red-600/20 via-red-600/5 to-transparent' },
  { name: 'Lucid', country: 'United States', founded: '2007', tagline: 'Air, made luxurious', description: 'California-built EV grand tourers with quad-digit horsepower.', color: '#1a1a2e', gradient: 'from-slate-700/20 via-slate-700/5 to-transparent' },
  { name: 'Pininfarina', country: 'Italy', founded: '1930', tagline: 'Designed in Italy', description: 'Iconic Italian design house turned electric hypercar maker.', color: '#003B6F', gradient: 'from-blue-800/20 via-blue-800/5 to-transparent' },
  { name: 'Maybach', country: 'Germany', founded: '1909', tagline: 'Beyond luxury', description: 'The ultimate expression of Mercedes-Benz craftsmanship.', color: '#1a1a2e', gradient: 'from-zinc-800/20 via-zinc-800/5 to-transparent' },
  { name: 'Acura', country: 'Japan', founded: '1986', tagline: 'Precision Crafted Performance', description: 'Honda\'s premium arm — home of the NSX supercar.', color: '#CC0000', gradient: 'from-red-600/20 via-red-600/5 to-transparent' },
  { name: 'Polestar', country: 'Sweden', founded: '2017', tagline: 'Pure progressive performance', description: 'Scandinavian-minimalist EV performance cars.', color: '#00C2A8', gradient: 'from-teal-500/20 via-teal-500/5 to-transparent' },
  { name: 'Apollo', country: 'Germany', founded: '2016', tagline: 'Pure intensity', description: 'Hand-crafted carbon-fibre hypercars built for analogue thrills.', color: '#FFB200', gradient: 'from-amber-500/20 via-amber-500/5 to-transparent' },
  { name: 'Spyker', country: 'Netherlands', founded: '1999', tagline: 'Nulla tenaci invia est via', description: 'Dutch aviation-inspired luxury supercars — exposed gearchanges and propeller motifs.', color: '#C0C0C0', gradient: 'from-slate-400/20 via-slate-400/5 to-transparent' },
  { name: 'Zenvo', country: 'Denmark', founded: '2007', tagline: 'Engineered to thrill', description: 'Danish hypercar maker producing track-savage limited runs.', color: '#00FF7F', gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent' },
  { name: 'W Motors', country: 'United Arab Emirates', founded: '2012', tagline: 'Driven by passion', description: 'Arabian hypercars with jewel-encrusted headlights and 7-figure tags.', color: '#FFD700', gradient: 'from-yellow-500/20 via-yellow-500/5 to-transparent' },
  { name: 'De Tomaso', country: 'Italy', founded: '1959', tagline: 'A vision reborn', description: 'Italian-American mid-engined GTs — Pantera heritage, modern flair.', color: '#B8860B', gradient: 'from-amber-700/20 via-amber-700/5 to-transparent' },
  { name: 'Rezvani', country: 'United States', founded: '2014', tagline: 'Beyond the impossible', description: 'California specialists in extreme road cars and armoured SUVs.', color: '#000000', gradient: 'from-zinc-900/20 via-zinc-900/5 to-transparent' },
  { name: 'Noble', country: 'United Kingdom', founded: '1999', tagline: 'Pure analogue thrill', description: 'British boutique supercar maker famed for the hand-built M600 and unfiltered driver feedback.', color: '#006633', gradient: 'from-emerald-700/20 via-emerald-700/5 to-transparent' },
  { name: 'Hispano-Suiza', country: 'Spain', founded: '1904', tagline: 'A century of elegance', description: 'Spanish luxury revived as a hand-built electric hypercar — art deco curves, modern silicon.', color: '#FFD700', gradient: 'from-amber-500/20 via-amber-500/5 to-transparent' },
];



const Brands = () => {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'founded' | 'models'>('default');

  const countries = useMemo(() => ['All', ...Array.from(new Set(brandData.map(b => b.country))).sort()], []);

  const modelCounts = useMemo(() => {
    const map: Record<string, number> = {};
    cars.forEach(c => { map[c.brand] = (map[c.brand] || 0) + 1; });
    return map;
  }, []);

  const filteredRest = useMemo(() => {
    let list = brandData.slice(1).filter(b => {
      const matchesQ = !query || b.name.toLowerCase().includes(query.toLowerCase()) || b.country.toLowerCase().includes(query.toLowerCase());
      const matchesC = country === 'All' || b.country === country;
      return matchesQ && matchesC;
    });
    if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'founded') list = [...list].sort((a, b) => parseInt(a.founded) - parseInt(b.founded));
    else if (sortBy === 'models') list = [...list].sort((a, b) => (modelCounts[b.name] || 0) - (modelCounts[a.name] || 0));
    return list;
  }, [query, country, sortBy, modelCounts]);



  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Hero Header */}
      <section className="section-padding py-20 md:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/3 rounded-full blur-[120px]" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary text-xs tracking-[0.2em] uppercase font-medium">World's Finest Marques</span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              The Art of
              <br />
              <span className="gold-text">Automotive Excellence</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Forty legendary manufacturers. 1,200 exclusive models. Thirty hand-picked masterpieces per marque.
              A complete atlas of the world's most desirable machines.
            </p>

            {/* Scrolling brand marquee */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex items-center justify-center gap-8 md:gap-12 flex-wrap"
            >
              {brandData.map((brand, i) => {
                const logo = brandLogos[brand.name];
                return (
                  <motion.div
                    key={brand.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 0.5, y: 0 }}
                    whileHover={{ opacity: 1, scale: 1.1 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    className="transition-all duration-300"
                  >
                    {logo && (
                      <img src={logo} alt={brand.name} className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500" />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Brand (first brand, large card) */}
      <section className="section-padding pb-8">
        <div className="max-w-7xl mx-auto">
          {(() => {
            const featured = brandData[0];
            const logo = brandLogos[featured.name];
            const brandCars = cars.filter(c => c.brand === featured.name);
            const heroCarImage = brandCars[0]?.image;

            return (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/shop?brand=${encodeURIComponent(featured.name)}`}
                  className="block group relative overflow-hidden rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm"
                >
                  <div className="grid md:grid-cols-2">
                    {/* Image side */}
                    <div className="relative h-64 md:h-[400px] overflow-hidden">
                      {heroCarImage && (
                        <img
                          src={heroCarImage}
                          alt={featured.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/90 hidden md:block" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:hidden" />

                      {/* Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold tracking-wider uppercase">
                        Featured
                      </div>
                    </div>

                    {/* Content side */}
                    <div className="p-8 md:p-12 flex flex-col justify-center relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${featured.gradient} opacity-50`} />
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                          {logo && (
                            <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center p-2">
                              <img src={logo} alt={featured.name} className="w-full h-full object-contain" />
                            </div>
                          )}
                          <div>
                            <h2 className="font-display text-3xl md:text-4xl font-bold group-hover:text-primary transition-colors">
                              {featured.name}
                            </h2>
                            <p className="text-primary/80 text-sm italic mt-0.5">"{featured.tagline}"</p>
                          </div>
                        </div>

                        <p className="text-muted-foreground text-base leading-relaxed mb-6">{featured.description}</p>

                        <div className="flex items-center gap-6 mb-8">
                          <div>
                            <p className="text-2xl font-display gold-text">{brandCars.length}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Models</p>
                          </div>
                          <div className="w-px h-10 bg-border/50" />
                          <div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{featured.country}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />Since {featured.founded}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                          Explore Collection <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })()}
        </div>
      </section>

      {/* Brand Grid */}
      <section className="section-padding py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 rounded-full gold-gradient" />
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold">The Collection</h2>
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase mt-1">All legendary marques</p>
              </div>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search brand or country..."
                  className="w-full pl-10 pr-4 py-2.5 bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2.5 bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="default">Sort: Curated</option>
                <option value="name">Sort: A → Z</option>
                <option value="founded">Sort: Oldest first</option>
                <option value="models">Sort: Most models</option>
              </select>
            </div>
          </div>

          {/* Country filter pills */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
            <Globe2 className="w-4 h-4 text-primary shrink-0" />
            {countries.map((c) => {
              const active = c === country;
              return (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap tracking-wider transition-all border ${
                    active
                      ? 'gold-gradient text-primary-foreground border-transparent shadow-lg shadow-primary/20'
                      : 'bg-card/30 border-border/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {filteredRest.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No brands match your filters.
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRest.map((brand, i) => {

              const brandCars = cars.filter(c => c.brand === brand.name);
              const startingPrice = brandCars.length > 0 ? Math.min(...brandCars.map(c => c.price)) : 0;
              const logo = brandLogos[brand.name];
              const isHovered = hoveredBrand === brand.name;
              const heroCarImage = brandCars[0]?.image;

              return (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                    className="block group h-full relative overflow-hidden rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-500"
                    onMouseEnter={() => setHoveredBrand(brand.name)}
                    onMouseLeave={() => setHoveredBrand(null)}
                  >
                    {/* Car image background with overlay */}
                    <div className="relative h-44 overflow-hidden">
                      {heroCarImage && (
                        <img
                          src={heroCarImage}
                          alt={brand.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                      {/* Brand color accent */}
                      <div
                        className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
                        style={{
                          background: `linear-gradient(90deg, ${brand.color}, ${brand.color}60, transparent)`,
                          opacity: isHovered ? 1 : 0.6,
                        }}
                      />

                      {/* Logo floating on image */}
                      {logo && (
                        <div className="absolute bottom-3 left-4">
                          <div className="w-12 h-12 rounded-xl bg-background/80 backdrop-blur-md border border-border/50 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform duration-300">
                            <img src={logo} alt={brand.name} className="w-full h-full object-contain" />
                          </div>
                        </div>
                      )}

                      {/* Model count badge */}
                      <div className="absolute bottom-3 right-4 px-2.5 py-1 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 text-xs font-medium">
                        {brandCars.length} {brandCars.length === 1 ? 'Model' : 'Models'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors duration-300">
                            {brand.name}
                          </h3>
                          <p className="text-primary/60 text-[11px] italic">"{brand.tagline}"</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <MapPin className="w-3 h-3" />{brand.country}
                        </span>
                        <span className="text-border">•</span>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar className="w-3 h-3" />{brand.founded}
                        </span>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{brand.description}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-border/30">
                        {startingPrice > 0 && (
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Starting at</p>
                            <p className="font-display text-sm gold-text font-semibold">₹{(startingPrice / 10000000).toFixed(1)} Cr</p>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-primary text-xs font-medium group-hover:gap-2 transition-all">
                          Explore <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          )}
        </div>
      </section>


      {/* Stats Bar */}
      <section className="section-padding py-16 mt-8 border-t border-border/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3" />
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {[
            { value: '40', label: 'Premium Brands', icon: '🏎️' },
            { value: '1,200', label: 'Exclusive Models', icon: '⚡' },
            { value: '30', label: 'Models per Marque', icon: '🏁' },
            { value: '120+', label: 'Years of Legacy', icon: '👑' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-6 text-center group hover:border-primary/20 transition-colors duration-300"
            >
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className="font-display text-3xl md:text-4xl gold-text mb-1 group-hover:scale-110 transition-transform">{stat.value}</p>
              <p className="text-muted-foreground text-xs tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your <span className="gold-text">Dream Car</span>?
          </h2>
          <p className="text-muted-foreground mb-8">
            Browse our complete collection of luxury supercars and find the perfect machine that matches your style.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 gold-gradient text-primary-foreground rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-primary/20 transition-all"
          >
            Browse All Cars <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Brands;
