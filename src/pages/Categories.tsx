import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cars, categories } from '@/data/cars';
import { ChevronRight } from 'lucide-react';

const Categories = () => {
  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Header */}
      <section className="section-padding py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-4">Browse by Type</p>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-5">
              Car <span className="gold-text">Categories</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              From hypercars to luxury sedans, find the perfect supercar that matches your style.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section-padding py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const categoryCars = cars.filter(c => c.category === cat);
            const coverCar = categoryCars[0];
            
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className="block group relative rounded-xl overflow-hidden h-72 hover-lift"
                >
                  {/* Background Image */}
                  {coverCar ? (
                    <img 
                      src={coverCar.image} 
                      alt={cat}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-card" />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {cat}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {categoryCars.length} model{categoryCars.length !== 1 ? 's' : ''} available
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                        <ChevronRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Categories;
