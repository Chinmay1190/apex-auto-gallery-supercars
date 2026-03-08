import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cars } from '@/data/cars';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';

const brandData = [
  { name: 'Lamborghini', country: 'Italy', founded: '1963', description: 'Bold, angular supercars with naturally aspirated V10 and V12 engines.', color: '#FFD700', logo: '🐂' },
  { name: 'Ferrari', country: 'Italy', founded: '1947', description: 'The prancing horse — synonymous with speed, passion, and racing heritage.', color: '#FF2800', logo: '🐴' },
  { name: 'McLaren', country: 'United Kingdom', founded: '1963', description: 'Formula 1 DNA meets road car technology for ultimate driver engagement.', color: '#FF6600', logo: '🏎️' },
  { name: 'Porsche', country: 'Germany', founded: '1931', description: 'Precision engineering and iconic design from Stuttgart, Germany.', color: '#C0C0C0', logo: '🛡️' },
  { name: 'Bugatti', country: 'France', founded: '1909', description: 'The absolute pinnacle of automotive luxury and speed.', color: '#003399', logo: '🏆' },
  { name: 'Aston Martin', country: 'United Kingdom', founded: '1913', description: 'British elegance meets grand touring excellence. The gentleman\'s supercar.', color: '#006633', logo: '🪶' },
  { name: 'Rolls-Royce', country: 'United Kingdom', founded: '1904', description: 'The spirit of ecstasy. Unparalleled luxury, craftsmanship, and prestige.', color: '#1a1a2e', logo: '👑' },
];

const Brands = () => {
  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Hero Header */}
      <section className="section-padding py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">Our Partners</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-5">
              Legendary <span className="gold-text">Marques</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Curating the world's most prestigious automotive brands, each representing decades of engineering excellence and uncompromising luxury.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Grid */}
      <section className="section-padding py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandData.map((brand, i) => {
            const brandCars = cars.filter(c => c.brand === brand.name);
            const startingPrice = brandCars.length > 0 ? Math.min(...brandCars.map(c => c.price)) : 0;
            return (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                  className="glass-panel p-0 hover-lift block group h-full overflow-hidden relative"
                >
                  {/* Top accent bar */}
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${brand.color}, ${brand.color}80, transparent)` }} />
                  
                  <div className="p-7">
                    {/* Brand header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: brand.color + '15', border: `1px solid ${brand.color}30` }}
                        >
                          {brand.logo}
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">{brand.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />{brand.country}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />Est. {brand.founded}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">{brand.description}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 py-4 border-t border-border/30">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Models</p>
                        <p className="font-display text-lg text-foreground">{brandCars.length}</p>
                      </div>
                      {startingPrice > 0 && (
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Starting</p>
                          <p className="font-display text-lg gold-text">₹{(startingPrice / 10000000).toFixed(1)}Cr</p>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Explore <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding py-16 border-t border-border/30 bg-card/20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '7', label: 'Premium Brands' },
            { value: '50+', label: 'Exclusive Models' },
            { value: '5', label: 'Countries' },
            { value: '100+', label: 'Years of Legacy' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-panel p-6">
              <p className="font-display text-3xl md:text-4xl gold-text mb-2">{stat.value}</p>
              <p className="text-muted-foreground text-xs tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Brands;
