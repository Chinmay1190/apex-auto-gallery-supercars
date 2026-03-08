import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/data/cars';
import { Check, CreditCard, Smartphone, Building2, Wallet, ChevronRight, Download, Package, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    const invoiceHTML = generateInvoiceHTML();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateInvoiceHTML = () => {
    const orderItems = placedOrder.items || items;
    return `<!DOCTYPE html>
<html><head><title>Invoice - ${placedOrder.order_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; background: #fff; max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #c8a45a; padding-bottom: 20px; margin-bottom: 30px; }
  .logo { font-size: 28px; font-weight: bold; color: #c8a45a; letter-spacing: 4px; }
  .logo-sub { font-size: 10px; color: #666; letter-spacing: 3px; margin-top: 4px; }
  .invoice-title { font-size: 12px; color: #666; text-align: right; }
  .invoice-title h2 { font-size: 24px; color: #1a1a1a; margin-bottom: 4px; }
  .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
  .detail-block h4 { font-size: 10px; letter-spacing: 2px; color: #999; text-transform: uppercase; margin-bottom: 8px; }
  .detail-block p { font-size: 13px; color: #333; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
  th { background: #f8f6f0; padding: 12px 16px; text-align: left; font-size: 10px; letter-spacing: 2px; color: #666; text-transform: uppercase; border-bottom: 2px solid #e8e0cc; }
  td { padding: 14px 16px; border-bottom: 1px solid #f0ece4; font-size: 13px; }
  .amount { text-align: right; }
  .totals { margin-left: auto; width: 300px; }
  .totals .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #555; }
  .totals .row.gst { color: #c8a45a; }
  .totals .row.total { border-top: 2px solid #c8a45a; padding-top: 12px; margin-top: 8px; font-size: 18px; font-weight: bold; color: #1a1a1a; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e8e0cc; text-align: center; font-size: 11px; color: #999; }
  .payment-badge { display: inline-block; padding: 4px 12px; background: #f8f6f0; border: 1px solid #e8e0cc; border-radius: 4px; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
  @media print { body { padding: 20px; } }
</style></head><body>
  <div class="header">
    <div><div class="logo">VELOCITY</div><div class="logo-sub">LUXURY SUPERCARS</div></div>
    <div class="invoice-title"><h2>INVOICE</h2><p>${placedOrder.order_number}</p><p>${new Date(placedOrder.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
  </div>
  <div class="details-grid">
    <div class="detail-block"><h4>Bill To</h4><p><strong>${placedOrder.shipping_name}</strong><br>${placedOrder.shipping_email}<br>${placedOrder.shipping_phone}</p></div>
    <div class="detail-block"><h4>Ship To</h4><p>${placedOrder.shipping_address}<br>${placedOrder.shipping_city}, ${placedOrder.shipping_state}<br>PIN: ${placedOrder.shipping_pincode}</p></div>
  </div>
  <div style="margin-bottom: 20px;"><span class="payment-badge">Payment: ${placedOrder.payment_method.toUpperCase()}</span></div>
  <table>
    <thead><tr><th>Item</th><th>Brand</th><th>Qty</th><th class="amount">Price</th><th class="amount">Total</th></tr></thead>
    <tbody>${orderItems.map((item: any) => `<tr><td>${item.car?.name || item.car_name}</td><td>${item.car?.brand || item.car_brand}</td><td>${item.quantity}</td><td class="amount">${formatPrice(item.car?.price || item.price)}</td><td class="amount">${formatPrice((item.car?.price || item.price) * item.quantity)}</td></tr>`).join('')}</tbody>
  </table>
  <div class="totals">
    <div class="row"><span>Subtotal</span><span>${formatPrice(placedOrder.subtotal)}</span></div>
    <div class="row gst"><span>GST (28%)</span><span>${formatPrice(placedOrder.gst_amount)}</span></div>
    ${placedOrder.discount > 0 ? `<div class="row"><span>Discount</span><span>-${formatPrice(placedOrder.discount)}</span></div>` : ''}
    <div class="row total"><span>Grand Total</span><span>${formatPrice(placedOrder.total)}</span></div>
  </div>
  <div class="footer">
    <p>GSTIN: 27AADCV1234A1ZB &nbsp;|&nbsp; Velocity Supercars Pvt. Ltd.</p>
    <p style="margin-top: 4px;">Worli Sea Face Road, Mumbai, Maharashtra 400018</p>
    <p style="margin-top: 8px;">Thank you for choosing Velocity. Drive the extraordinary.</p>
  </div>
</body></html>`;
  };

  if (orderPlaced && placedOrder) return (
    <div className="min-h-screen pt-24 flex items-center justify-center section-padding">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg w-full">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h1 className="font-display text-3xl mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-1">Your supercar order has been placed successfully.</p>
        <p className="text-primary font-display text-lg mb-2">#{placedOrder.order_number}</p>
        <p className="text-muted-foreground text-sm mb-8">Total: <span className="gold-text font-display">{formatPrice(placedOrder.total)}</span> (incl. 28% GST)</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Link to={`/orders/${placedOrder.id}`}
            className="glass-panel p-4 hover-lift flex flex-col items-center gap-2 text-sm">
            <Package className="w-5 h-5 text-primary" />
            <span>Track Order</span>
          </Link>
          <button onClick={handleDownloadInvoice}
            className="glass-panel p-4 hover-lift flex flex-col items-center gap-2 text-sm">
            <Download className="w-5 h-5 text-primary" />
            <span>Download Invoice</span>
          </button>
          <Link to="/orders"
            className="glass-panel p-4 hover-lift flex flex-col items-center gap-2 text-sm">
            <FileText className="w-5 h-5 text-primary" />
            <span>All Orders</span>
          </Link>
        </div>

        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 gold-gradient text-primary-foreground font-semibold text-sm rounded-lg uppercase tracking-wider">
          Back to Home
        </Link>
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
      <label className="block text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="section-padding py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>

          {!isAuthenticated && (
            <div className="glass-panel p-4 mb-6 border-primary/30">
              <p className="text-sm text-muted-foreground">
                <Link to="/auth" className="text-primary font-semibold hover:underline">Sign in</Link> to save your order and track it later.
              </p>
            </div>
          )}

          {/* Steps */}
          <div className="flex items-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i <= step ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs tracking-wider uppercase hidden md:block ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
                {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-panel p-6 space-y-4">
                    <h3 className="font-display text-lg mb-4">Personal Details</h3>
                    <InputField label="Full Name" value={form.name} onChange={(v: string) => updateForm('name', v)} placeholder="John Doe" required />
                    <InputField label="Email" value={form.email} onChange={(v: string) => updateForm('email', v)} type="email" placeholder="john@example.com" required />
                    <InputField label="Phone" value={form.phone} onChange={(v: string) => updateForm('phone', v)} placeholder="+91 98765 43210" required />
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-panel p-6 space-y-4">
                    <h3 className="font-display text-lg mb-4">Delivery Address</h3>
                    <InputField label="Address" value={form.address} onChange={(v: string) => updateForm('address', v)} placeholder="123 Luxury Lane" required />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="City" value={form.city} onChange={(v: string) => updateForm('city', v)} placeholder="Mumbai" required />
                      <InputField label="State" value={form.state} onChange={(v: string) => updateForm('state', v)} placeholder="Maharashtra" required />
                    </div>
                    <InputField label="PIN Code" value={form.pincode} onChange={(v: string) => updateForm('pincode', v)} placeholder="400001" required />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-panel p-6">
                    <h3 className="font-display text-lg mb-6">Payment Method</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
                        { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
                        { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' },
                        { id: 'wallet', label: 'Wallet', icon: Wallet, desc: 'Amazon Pay, Mobikwik' },
                      ].map(method => (
                        <button key={method.id} onClick={() => updateForm('paymentMethod', method.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
                            form.paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                          }`}>
                          <method.icon className={`w-5 h-5 ${form.paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div className="text-left">
                            <p className="text-sm font-medium">{method.label}</p>
                            <p className="text-xs text-muted-foreground">{method.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-panel p-6">
                    <h3 className="font-display text-lg mb-6">Review Order</h3>
                    <div className="space-y-3 mb-6">
                      {items.map(({ car, quantity }) => (
                        <div key={car.id} className="flex items-center gap-3 py-2">
                          <img src={car.image} alt={car.name} className="w-16 h-12 object-cover rounded" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{car.brand} {car.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {quantity}</p>
                          </div>
                          <p className="text-sm gold-text">{formatPrice(car.price * quantity)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border pt-4 space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Delivering to</span><span>{form.name}, {form.city}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="capitalize">{form.paymentMethod}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                      <div className="flex justify-between text-primary"><span>GST (28%)</span><span>{formatPrice(gstAmount)}</span></div>
                      <div className="flex justify-between font-display text-lg border-t border-border pt-2 mt-2">
                        <span>Grand Total</span><span className="gold-text">{formatPrice(grandTotal)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(Math.max(0, step - 1))}
                  className={`px-6 py-2.5 text-sm border border-border rounded-lg hover:border-primary/50 transition-colors ${step === 0 ? 'invisible' : ''}`}>
                  Back
                </button>
                {step < 3 ? (
                  <button onClick={() => setStep(step + 1)} className="px-6 py-2.5 text-sm gold-gradient text-primary-foreground rounded-lg font-semibold uppercase tracking-wider">
                    Continue
                  </button>
                ) : (
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="px-8 py-2.5 text-sm gold-gradient text-primary-foreground rounded-lg font-semibold uppercase tracking-wider animate-pulse-gold disabled:opacity-50">
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="glass-panel p-6 h-fit">
              <h3 className="font-display text-sm tracking-wider uppercase mb-4">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Items ({items.length})</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST (28%)</span><span>{formatPrice(gstAmount)}</span></div>
                <div className="border-t border-border pt-2 flex justify-between font-display text-base">
                  <span>Total</span><span className="gold-text">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
