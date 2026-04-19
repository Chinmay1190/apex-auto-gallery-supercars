import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Gauge, Zap, Fuel, Settings, Timer, Wind, Award } from 'lucide-react';
import { getCarById, formatPrice, getCarImageForColor, colorName } from '@/data/cars';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState } from 'react';

const CarDetail = () => {
  const { id } = useParams();
  const car = getCarById(id || '');
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(0);

  if (!car) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-3xl mb-4">Car Not Found</h1>
        <Link to="/shop" className="text-primary hover:underline">Back to Collection</Link>
      </div>
    </div>
  );

  const specs = [
    { icon: Settings, label: 'Engine', value: car.engine },
    { icon: Zap, label: 'Horsepower', value: `${car.horsepower} HP` },
    { icon: Timer, label: '0-100 km/h', value: car.acceleration },
    { icon: Gauge, label: 'Top Speed', value: `${car.topSpeed} km/h` },
    { icon: Wind, label: 'Torque', value: car.torque },
    { icon: Fuel, label: 'Mileage', value: car.mileage },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Breadcrumb */}
      <div className="section-padding py-4 border-b border-border/30">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Collection
          </Link>
          <span>/</span>
          <span className="text-foreground">{car.brand} {car.name}</span>
        </div>
      </div>

      <div className="section-padding py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden glass-panel relative">
                <img
                  src={car.image}
                  alt={`${car.brand} ${car.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
              </div>
              {car.trending && (
                <span className="absolute top-4 left-4 px-4 py-1.5 text-xs tracking-wider uppercase font-bold gold-gradient text-primary-foreground rounded-full">
                  Trending
                </span>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-primary text-sm tracking-[0.3em] uppercase mb-2">{car.brand}</p>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-2">{car.name}</h1>
              {car.tagline && (
                <p className="text-foreground/80 italic text-sm md:text-base mb-3">"{car.tagline}"</p>
              )}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                <span>{car.year}</span>
                <span className="text-border">•</span>
                <span>{car.category}</span>
                <span className="text-border">•</span>
                <span>{car.fuel}</span>
                {car.available === false && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-semibold uppercase tracking-wider text-[10px]">
                    Sold Out
                  </span>
                )}
              </div>
              <p className="font-display text-3xl md:text-4xl gold-text mb-6">{formatPrice(car.price)}</p>
              <p className="text-muted-foreground leading-relaxed mb-6">{car.description}</p>

              {car.awards && car.awards.length > 0 && (
                <div className="mb-8 space-y-1.5">
                  {car.awards.map((award) => (
                    <div key={award} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Award className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span>{award}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => addToCart(car)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 gold-gradient text-primary-foreground font-semibold text-sm tracking-wider uppercase rounded-lg"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(car)}
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 border rounded-lg font-semibold text-sm tracking-wider uppercase transition-all ${
                    isInWishlist(car.id) ? 'border-accent text-accent bg-accent/10' : 'border-border text-foreground hover:border-primary/50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(car.id) ? 'fill-current' : ''}`} />
                  {isInWishlist(car.id) ? 'Wishlisted' : 'Wishlist'}
                </button>
              </div>

              <Link
                to="/contact"
                className="block text-center w-full py-3 border border-border text-muted-foreground text-sm tracking-wider uppercase rounded-lg hover:border-primary/50 hover:text-primary transition-colors"
              >
                Schedule Test Drive
              </Link>
            </motion.div>
          </div>

          {/* Specs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {specs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-4 text-center"
                >
                  <spec.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">{spec.label}</p>
                  <p className="font-display text-sm text-foreground font-semibold">{spec.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Transmission', value: car.transmission },
              { label: 'Drivetrain', value: car.drivetrain },
              { label: 'Fuel Tank', value: car.fuelTank },
            ].map(info => (
              <div key={info.label} className="glass-panel p-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{info.label}</span>
                <span className="text-sm font-semibold text-foreground">{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
