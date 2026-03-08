import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/cars';

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-2xl mb-2">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground mb-6">Save your favorite cars for later.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 gold-gradient text-primary-foreground font-semibold text-sm rounded-lg uppercase tracking-wider">
          Browse Collection
        </Link>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="section-padding py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-3xl font-bold mb-8">Your Wishlist</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {items.map((car, i) => (
                <motion.div
                  key={car.id}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel overflow-hidden group"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary tracking-wider uppercase">{car.brand}</p>
                    <h3 className="font-display text-lg">{car.name}</h3>
                    <p className="gold-text font-display mt-1">{formatPrice(car.price)}</p>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => addToCart(car)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 gold-gradient text-primary-foreground text-xs tracking-wider uppercase rounded-lg font-semibold"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(car.id)}
                        className="p-2 border border-border rounded-lg text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
