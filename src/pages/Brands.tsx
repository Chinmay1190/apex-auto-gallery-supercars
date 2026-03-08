import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cars } from '@/data/cars';

const brandData = [
  { name: 'Lamborghini', country: 'Italy', founded: '1963', description: 'Bold, angular supercars with naturally aspirated V10 and V12 engines.', color: '#FFD700' },
  { name: 'Ferrari', country: 'Italy', founded: '1947', description: 'The prancing horse — synonymous with speed, passion, and racing heritage.', color: '#FF2800' },
  { name: 'McLaren', country: 'United Kingdom', founded: '1963', description: 'Formula 1 DNA meets road car technology for ultimate driver engagement.', color: '#FF6600' },
  { name: 'Porsche', country: 'Germany', founded: '1931', description: 'Precision engineering and iconic design from Stuttgart, Germany.', color: '#C0C0C0' },
  { name: 'Bugatti', country: 'France', founded: '1909', description: 'The absolute pinnacle of automotive luxury and speed.', color: '#003399' },
  { name: 'Aston Martin', country: 'United Kingdom', founded: '1913', description: 'British elegance meets grand touring excellence. The gentleman\'s supercar.', color: '#006633' },
  { name: 'Rolls-Royce', country: 'United Kingdom', founded: '1904', description: 'The spirit of ecstasy. Unparalleled luxury, craftsmanship, and prestige.', color: '#1a1a2e' },
];

const Brands = () => {
  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="section-padding py-12 md:py-16 border-b border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Our Partners</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">Luxury Brands</h1>
            <p className="text-muted-foreground text-lg">Curating the world's most prestigious automotive marques.</p>
          </motion.div>
        </div>
      </section>

      {/* Brand Grid */}
      <section className="section-padding py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandData.map((brand, i) => {
            const brandCars = cars.filter(c => c.name && c.brand === brand.name);
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
                  className="glass-panel p-8 hover-lift block group h-full"
                >
                  {/* Brand Logo Text */}
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-display font-bold"
                      style={{ backgroundColor: brand.color + '20', color: brand.color, border: `2px solid ${brand.color}40` }}
                    >
                      {brand.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-display text-xl group-hover:text-primary transition-colors">{brand.name}</h3>
                      <p className="text-xs text-muted-foreground">{brand.country} • Est. {brand.founded}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{brand.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/30">
                    <span className="text-xs text-muted-foreground">{brandCars.length} model{brandCars.length !== 1 ? 's' : ''} available</span>
                    <span className="text-xs text-primary tracking-wider uppercase group-hover:underline">View Collection →</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding py-12 border-t border-border/30 bg-card/20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '7', label: 'Premium Brands' },
            { value: '50+', label: 'Exclusive Models' },
            { value: '5', label: 'Countries' },
            { value: '100+', label: 'Years of Legacy' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="font-display text-2xl md:text-3xl gold-text mb-1">{stat.value}</p>
              <p className="text-muted-foreground text-xs tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Brands;
