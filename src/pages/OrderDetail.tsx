import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Package, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/data/cars';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';

const statusSteps = [
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, note: 'Order received successfully' },
  { key: 'processing', label: 'Processing', icon: Clock, note: 'Preparing your vehicle' },
  { key: 'shipped', label: 'Shipped', icon: Truck, note: 'In transit to your location' },
  { key: 'delivered', label: 'Delivered', icon: Package, note: 'Delivered to shipping address' },
];

const OrderDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/auth');
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (user && id) {
      Promise.all([
        supabase.from('orders').select('*').eq('id', id).eq('user_id', user.id).single(),
        supabase.from('order_items').select('*').eq('order_id', id),
      ]).then(([{ data: o }, { data: items }]) => {
        setOrder(o);
        setOrderItems(items || []);
        setLoading(false);
      });
    }
  }, [user, id]);

  const handleDownloadInvoice = () => {
    if (!order) return;
    generateInvoicePDF(order, orderItems);
  };

  if (authLoading || loading) return <div className="min-h-screen pt-24 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>;
  if (!order) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-2xl mb-4">Order Not Found</h1>
        <Link to="/orders" className="text-primary hover:underline">View All Orders</Link>
      </div>
    </div>
  );

  const normalizedStatus = statusSteps.some((s) => s.key === order.status) ? order.status : 'confirmed';
  const currentStepIndex = statusSteps.findIndex((s) => s.key === normalizedStatus);
  const currentStep = statusSteps[currentStepIndex] || statusSteps[0];
  const progressPercent = Math.max(0, Math.min(100, (currentStepIndex / (statusSteps.length - 1)) * 100));

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="section-padding py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/orders" className="text-muted-foreground text-sm flex items-center gap-1 hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> All Orders
          </Link>

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold">#{order.order_number}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-2 px-4 py-2 gold-gradient text-primary-foreground rounded-lg text-sm font-semibold">
              <Download className="w-4 h-4" /> Invoice
            </button>
          </div>

          {/* Order Tracking */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 mb-6">
            <h3 className="font-display text-lg mb-6">Order Tracking</h3>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
              <div className="absolute top-5 left-0 h-0.5 bg-primary transition-all" style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }} />
              {statusSteps.map((s, i) => (
                <div key={s.key} className="relative flex flex-col items-center z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    i <= currentStepIndex ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  }`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 ${i <= currentStepIndex ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 glass-panel p-6">
              <h3 className="font-display text-lg mb-4">Items</h3>
              <div className="space-y-4">
                {orderItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.car_name}</p>
                      <p className="text-xs text-muted-foreground">{item.car_brand} • Qty: {item.quantity}</p>
                    </div>
                    <p className="gold-text font-display">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary + Shipping */}
            <div className="space-y-6">
              <div className="glass-panel p-6">
                <h3 className="font-display text-sm tracking-wider uppercase mb-4">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                  <div className="flex justify-between text-primary"><span>GST (28%)</span><span>{formatPrice(order.gst_amount)}</span></div>
                  {order.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-{formatPrice(order.discount)}</span></div>}
                  <div className="border-t border-border pt-2 flex justify-between font-display text-base">
                    <span>Total</span><span className="gold-text">{formatPrice(order.total)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Payment Method</p>
                  <p className="text-sm capitalize">{order.payment_method}</p>
                </div>
              </div>

              <div className="glass-panel p-6">
                <h3 className="font-display text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Shipping
                </h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shipping_name}</p>
                  <p className="text-muted-foreground">{order.shipping_address}</p>
                  <p className="text-muted-foreground">{order.shipping_city}, {order.shipping_state} {order.shipping_pincode}</p>
                  <p className="text-muted-foreground">{order.shipping_phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
