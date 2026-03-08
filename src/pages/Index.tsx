import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, ChevronRight, Zap, Shield, Gauge, Wrench, Car, Headphones, CalendarCheck } from 'lucide-react';
import heroImg from '@/assets/hero-car.jpg';
import CarCard from '@/components/CarCard';
import { cars, marqueBrands, categories, formatPrice, getCategoryImage } from '@/data/cars';

const Index = () => {
  const featuredCars = cars.filter(c => c.featured);
  const trendingCars = cars.filter(c => c.trending);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Luxury supercar showroom" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>
        <div className="relative z-10 section-padding max-w-7xl mx-auto w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }} className="max-w-2xl">
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="text-primary text-sm tracking-[0.3em] uppercase mb-4">The Ultimate Showroom</motion.p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-6">
              <span className="block text-foreground">Unleash</span>
              <span className="block gold-text">the Beast.</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
              Drive the extraordinary. Explore the world's most exclusive collection of hypercars and luxury supercars.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 gold-gradient text-primary-foreground font-semibold text-sm tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity">
                Explore Collection <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 border border-primary/30 text-primary font-semibold text-sm tracking-wider uppercase rounded-lg hover:bg-primary/10 transition-colors">
                Book a Test Drive
              </Link>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/30 bg-card/30 section-padding py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '50+', label: 'Exclusive Models' },
            { value: '12', label: 'Luxury Brands' },
            { value: '2,500+', label: 'Cars Delivered' },
            { value: '₹500 Cr+', label: 'Total Value' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="font-display text-2xl md:text-3xl gold-text mb-1">{stat.value}</p>
              <p className="text-muted-foreground text-xs tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Categories</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Find Your Class</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <motion.div key={cat} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link to={`/shop?category=${encodeURIComponent(cat)}`} className="block glass-panel p-6 md:p-8 text-center hover-lift group cursor-pointer">
                  <Zap className="w-6 h-6 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-display text-sm md:text-base text-foreground tracking-wider">{cat}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Cars */}
      <section className="section-padding py-16 md:py-24 bg-card/20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Trending Now</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold">Most Desired</h2>
            </div>
            <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-primary text-sm tracking-wider uppercase hover:opacity-80 transition-opacity">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingCars.slice(0, 3).map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <section className="border-y border-border/30 py-8 overflow-hidden">
        <div className="flex marquee whitespace-nowrap">
          {[...marqueBrands, ...marqueBrands].map((brand, i) => (
            <span key={i} className="mx-8 md:mx-12 text-muted-foreground/40 font-display text-xl md:text-2xl tracking-wider uppercase">{brand}</span>
          ))}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="section-padding py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Handpicked</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Featured Collection</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCars.slice(0, 4).map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding py-16 md:py-24 bg-card/20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">Our Services</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Premium Automotive Services</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CalendarCheck, title: 'Test Drive Booking', desc: 'Schedule a private test drive experience at our luxury showroom or at your preferred location.', color: 'text-primary' },
              { icon: Car, title: 'Custom Orders', desc: 'Configure your dream car with bespoke specifications, colors, and exclusive factory options.', color: 'text-primary' },
              { icon: Wrench, title: 'After-Sales Care', desc: 'Comprehensive maintenance, detailing, and performance upgrades by certified technicians.', color: 'text-primary' },
              { icon: Headphones, title: 'Concierge Service', desc: '24/7 dedicated support for all your luxury automotive needs, from purchase to ownership.', color: 'text-primary' },
            ].map((service, i) => (
              <motion.div key={service.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 hover-lift group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className={`w-7 h-7 ${service.color}`} />
                </div>
                <h3 className="font-display text-lg mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding py-20 md:py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            Ready to <span className="gold-text">Experience</span> Luxury?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Schedule a private viewing at our Mumbai showroom or explore our collection online.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 gold-gradient text-primary-foreground font-semibold text-sm tracking-wider uppercase rounded-lg">
              Browse Collection
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 border border-border text-foreground font-semibold text-sm tracking-wider uppercase rounded-lg hover:border-primary/50 transition-colors">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
