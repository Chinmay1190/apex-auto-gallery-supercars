import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Car, formatPrice } from '@/data/cars';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { motion } from 'framer-motion';

interface CarCardProps {
  car: Car;
  index?: number;
}

const CarCard = ({ car, index = 0 }: CarCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(car.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group glass-panel overflow-hidden hover-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        
        {/* Actions overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(car); }}
            className={`p-2 rounded-full glass-panel-strong transition-all ${wishlisted ? 'text-accent' : 'text-foreground/70 hover:text-accent'}`}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(car); }}
            className="p-2 rounded-full glass-panel-strong text-foreground/70 hover:text-primary transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {car.trending && (
          <span className="absolute top-3 left-3 px-3 py-1 text-[10px] tracking-wider uppercase font-bold gold-gradient text-primary-foreground rounded-full">
            Trending
          </span>
        )}
      </div>

      <div className="p-4 md:p-5">
        <p className="text-xs text-primary tracking-wider uppercase mb-1">{car.brand}</p>
        <h3 className="font-display text-lg text-foreground mb-1">{car.name}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <span>{car.horsepower} HP</span>
          <span>•</span>
          <span>{car.topSpeed} km/h</span>
          <span>•</span>
          <span>{car.fuel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg gold-text">{formatPrice(car.price)}</span>
          <Link
            to={`/car/${car.id}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
          >
            <Eye className="w-3.5 h-3.5" />
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
