import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/cars';
import { useState } from 'react';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const luxuryTax = totalPrice * 0.28;
  const discount = couponApplied ? totalPrice * 0.05 : 0;
  const grandTotal = totalPrice + luxuryTax - discount;

  const applyCoupon = () => {
    if (coupon.toLowerCase() === 'velocity5') setCouponApplied(true);
  };

  if (items.length === 0) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-display text-2xl mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Explore our collection and add your dream car.</p>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link to="/shop" className="text-muted-foreground text-sm flex items-center gap-1 hover:text-primary mb-2">
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
              <h1 className="font-display text-3xl font-bold">Your Cart</h1>
            </div>
            <button onClick={clearCart} className="text-xs text-muted-foreground hover:text-accent uppercase tracking-wider">Clear All</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map(({ car, quantity }) => (
                  <motion.div
                    key={car.id}
                    layout
                    exit={{ opacity: 0, x: -100 }}
                    className="glass-panel p-4 flex gap-4"
                  >
                    <img src={car.image} alt={car.name} className="w-28 h-20 md:w-36 md:h-24 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-primary tracking-wider uppercase">{car.brand}</p>
                      <h3 className="font-display text-base truncate">{car.name}</h3>
                      <p className="gold-text font-display text-sm mt-1">{formatPrice(car.price)}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeFromCart(car.id)} className="text-muted-foreground hover:text-accent transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(car.id, quantity - 1)} className="p-1 glass-panel"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm w-6 text-center">{quantity}</span>
                        <button onClick={() => updateQuantity(car.id, quantity + 1)} className="p-1 glass-panel"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="glass-panel p-6 h-fit sticky top-24">
              <h3 className="font-display text-lg mb-6">Order Summary</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST (28%)</span><span>{formatPrice(luxuryTax)}</span></div>
                {couponApplied && <div className="flex justify-between text-primary"><span>Discount (5%)</span><span>-{formatPrice(discount)}</span></div>}
                <div className="border-t border-border pt-3 flex justify-between font-display text-lg">
                  <span>Total</span><span className="gold-text">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-6">
                <input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button onClick={applyCoupon} className="px-4 py-2 text-xs uppercase tracking-wider border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                  Apply
                </button>
              </div>
              {couponApplied && <p className="text-xs text-primary mb-4">✓ Coupon VELOCITY5 applied!</p>}

              <Link
                to="/checkout"
                className="block text-center w-full py-3.5 gold-gradient text-primary-foreground font-semibold text-sm tracking-wider uppercase rounded-lg"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
