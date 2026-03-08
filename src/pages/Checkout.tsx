import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/data/cars';
import { Check, CreditCard, Smartphone, Building2, Wallet, ChevronRight, Download, Package, FileText, ShieldCheck, Truck, ArrowRight, PartyPopper } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';

const steps = ['Details', 'Delivery', 'Payment', 'Review'];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    pincode: profile?.pincode || '',
    paymentMethod: 'upi'
  });

  const subtotal = totalPrice;
  const gstRate = 0.28;
  const gstAmount = Math.round(subtotal * gstRate);
  const grandTotal = subtotal + gstAmount;

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const generateOrderNumber = () => 'VEL' + Date.now().toString().slice(-8);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated || !user) {
      toast({ title: 'Please sign in', description: 'You need to be logged in to place an order.', variant: 'destructive' });
      navigate('/auth');
      return;
    }

    setLoading(true);
    const orderNumber = generateOrderNumber();

    try {
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        order_number: orderNumber,
        subtotal,
        gst_amount: gstAmount,
        total: grandTotal,
        payment_method: form.paymentMethod,
        shipping_name: form.name,
        shipping_email: form.email,
        shipping_phone: form.phone,
        shipping_address: form.address,
        shipping_city: form.city,
        shipping_state: form.state,
        shipping_pincode: form.pincode,
      }).select().single();

      if (orderError) throw orderError;

      const orderItems = items.map(({ car, quantity }) => ({
        order_id: order.id,
        car_id: car.id,
        car_name: `${car.brand} ${car.name}`,
        car_brand: car.brand,
        car_image: car.image,
        price: car.price,
        quantity,
      }));

      await supabase.from('order_items').insert(orderItems);

      setPlacedOrder({ ...order, items: items.map(i => ({ ...i })) });
      setOrderPlaced(true);
      clearCart();
    } catch (err: any) {
      toast({ title: 'Order failed', description: err.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!placedOrder) return;
    generateInvoicePDF(placedOrder, placedOrder.items || items);
  };

  // Success page
  if (orderPlaced && placedOrder) return (
    <div className="min-h-screen pt-20 flex items-center justify-center section-padding relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} transition={{ duration: 2 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 100, x: Math.random() * 400 - 200 }}
          animate={{ opacity: [0, 1, 0], y: -200, x: Math.random() * 400 - 200 }}
          transition={{ duration: 3 + Math.random() * 3, delay: Math.random() * 2, repeat: Infinity, repeatDelay: Math.random() * 4 }}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
          style={{ left: `${Math.random() * 100}%`, top: `${50 + Math.random() * 40}%` }}
        />
      ))}

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="text-center max-w-xl w-full relative z-10">
        {/* Animated success icon with rings */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2, stiffness: 180 }}
          className="relative mx-auto mb-10 w-28 h-28">
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-full border border-dashed border-primary/20" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-6 rounded-full border border-dashed border-primary/10" />
          <div className="relative w-28 h-28 rounded-full gold-gradient flex items-center justify-center gold-glow shadow-2xl">
            <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.5, type: 'spring' }}>
              <Check className="w-14 h-14 text-primary-foreground" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <PartyPopper className="w-6 h-6 text-primary" />
            <h1 className="font-display text-4xl md:text-5xl font-bold">Order Confirmed!</h1>
            <PartyPopper className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg mb-6">Your supercar is on its way to you.</p>

          {/* Order number badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
            className="inline-flex items-center gap-3 glass-panel px-6 py-3 mb-2 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-primary font-display text-xl tracking-wider">#{placedOrder.order_number}</p>
          </motion.div>

          <p className="text-muted-foreground text-sm mt-4 mb-10">
            Total Paid: <span className="gold-text font-display text-2xl ml-1">{formatPrice(placedOrder.total)}</span>
            <span className="text-xs ml-2 text-muted-foreground/60">(incl. 28% GST)</span>
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { to: `/orders/${placedOrder.id}`, icon: Package, label: 'Track Order', desc: 'Live updates', isLink: true },
            { action: handleDownloadInvoice, icon: Download, label: 'Download PDF', desc: 'Tax invoice', isLink: false },
            { to: '/orders', icon: FileText, label: 'All Orders', desc: 'Order history', isLink: true },
          ].map((item, i) => {
            const content = (
              <div className="glass-panel p-6 hover-lift flex flex-col items-center gap-3 text-sm group border border-border/50 hover:border-primary/30 transition-all cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <span className="font-display font-semibold block">{item.label}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </div>
              </div>
            );
            return item.isLink ? (
              <Link key={i} to={item.to!}>{content}</Link>
            ) : (
              <button key={i} onClick={item.action}>{content}</button>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="space-y-4">
          <Link to="/shop" className="inline-flex items-center gap-2 px-10 py-4 gold-gradient text-primary-foreground font-semibold text-sm rounded-xl uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-muted-foreground">A confirmation email has been sent to your registered email address.</p>
        </motion.div>
      </motion.div>
    </div>
  );

  if (items.length === 0) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-2xl mb-4">No items to checkout</h1>
        <Link to="/shop" className="text-primary hover:underline">Browse Collection</Link>
      </div>
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'text', placeholder = '', required = false }: any) => (
    <div>
      <label className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full px-4 py-3.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="section-padding py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground text-sm mb-8">Complete your order in a few simple steps</p>

          {!isAuthenticated && (
            <div className="glass-panel p-4 mb-6 border-primary/30 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                <Link to="/auth" className="text-primary font-semibold hover:underline">Sign in</Link> to save your order and track it later.
              </p>
            </div>
          )}

          {/* Steps */}
          <div className="flex items-center gap-1 mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className="flex items-center gap-2 flex-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                    i < step ? 'gold-gradient text-primary-foreground' : i === step ? 'border-2 border-primary text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs tracking-wider uppercase hidden md:block ${i <= step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-[2px] flex-1 mx-2 rounded-full transition-colors ${i < step ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-panel p-7 space-y-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">1</span>
                      </div>
                      <h3 className="font-display text-lg">Personal Details</h3>
                    </div>
                    <InputField label="Full Name" value={form.name} onChange={(v: string) => updateForm('name', v)} placeholder="John Doe" required />
                    <InputField label="Email" value={form.email} onChange={(v: string) => updateForm('email', v)} type="email" placeholder="john@example.com" required />
                    <InputField label="Phone" value={form.phone} onChange={(v: string) => updateForm('phone', v)} placeholder="+91 98765 43210" required />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-panel p-7 space-y-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-display text-lg">Delivery Address</h3>
                    </div>
                    <InputField label="Address" value={form.address} onChange={(v: string) => updateForm('address', v)} placeholder="123 Luxury Lane" required />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="City" value={form.city} onChange={(v: string) => updateForm('city', v)} placeholder="Mumbai" required />
                      <InputField label="State" value={form.state} onChange={(v: string) => updateForm('state', v)} placeholder="Maharashtra" required />
                    </div>
                    <InputField label="PIN Code" value={form.pincode} onChange={(v: string) => updateForm('pincode', v)} placeholder="400001" required />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-panel p-7">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-display text-lg">Payment Method</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
                        { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
                        { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' },
                        { id: 'wallet', label: 'Wallet', icon: Wallet, desc: 'Amazon Pay, Mobikwik' },
                      ].map(method => (
                        <button key={method.id} onClick={() => updateForm('paymentMethod', method.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                            form.paymentMethod === method.id ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:border-primary/30'
                          }`}>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            form.paymentMethod === method.id ? 'bg-primary/15' : 'bg-secondary'
                          }`}>
                            <method.icon className={`w-5 h-5 ${form.paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium">{method.label}</p>
                            <p className="text-xs text-muted-foreground">{method.desc}</p>
                          </div>
                          {form.paymentMethod === method.id && (
                            <div className="ml-auto w-5 h-5 rounded-full gold-gradient flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-panel p-7">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-display text-lg">Review Order</h3>
                    </div>
                    <div className="space-y-3 mb-6">
                      {items.map(({ car, quantity }) => (
                        <div key={car.id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30">
                          <img src={car.image} alt={car.name} className="w-20 h-14 object-cover rounded-lg" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{car.brand} {car.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                          </div>
                          <p className="text-sm gold-text font-display">{formatPrice(car.price * quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-4 space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Delivering to</span><span className="font-medium">{form.name}, {form.city}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="capitalize font-medium">{form.paymentMethod}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                      <div className="flex justify-between text-primary"><span>GST (28%)</span><span>{formatPrice(gstAmount)}</span></div>
                      <div className="flex justify-between font-display text-lg border-t border-border pt-3 mt-3">
                        <span>Grand Total</span><span className="gold-text">{formatPrice(grandTotal)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(Math.max(0, step - 1))}
                  className={`px-6 py-2.5 text-sm border border-border rounded-xl hover:border-primary/50 transition-colors ${step === 0 ? 'invisible' : ''}`}>
                  Back
                </button>
                {step < 3 ? (
                  <button onClick={() => setStep(step + 1)} className="px-6 py-2.5 text-sm gold-gradient text-primary-foreground rounded-xl font-semibold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="px-8 py-2.5 text-sm gold-gradient text-primary-foreground rounded-xl font-semibold uppercase tracking-wider animate-pulse-gold disabled:opacity-50 flex items-center gap-2">
                    {loading ? 'Processing...' : 'Place Order'}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="glass-panel p-6 h-fit sticky top-28">
              <h3 className="font-display text-sm tracking-wider uppercase mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map(({ car, quantity }) => (
                  <div key={car.id} className="flex items-center gap-3">
                    <img src={car.image} alt={car.name} className="w-12 h-9 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{car.brand} {car.name}</p>
                      <p className="text-xs text-muted-foreground">×{quantity}</p>
                    </div>
                    <p className="text-xs gold-text">{formatPrice(car.price * quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-primary"><span>GST (28%)</span><span>{formatPrice(gstAmount)}</span></div>
                <div className="border-t border-border pt-2 flex justify-between font-display text-base">
                  <span>Total</span><span className="gold-text">{formatPrice(grandTotal)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Secure checkout with 256-bit encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
