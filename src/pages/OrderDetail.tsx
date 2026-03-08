import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Download, Package, Truck, CheckCircle2, Clock,
  MapPin, RefreshCw, Calendar, Activity, Shield, CreditCard,
  Mail, Phone, Hash
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/data/cars';
import { generateInvoicePDF } from '@/utils/generateInvoicePDF';

const statusSteps = [
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, note: 'Order received & verified', daysFromOrder: 0 },
  { key: 'processing', label: 'Processing', icon: Clock, note: 'Vehicle preparation & inspection', daysFromOrder: 2 },
  { key: 'shipped', label: 'Shipped', icon: Truck, note: 'In transit to your location', daysFromOrder: 5 },
  { key: 'delivered', label: 'Delivered', icon: Package, note: 'Delivered to shipping address', daysFromOrder: 10 },
];

const getEstimatedDate = (orderDate: string, daysToAdd: number) => {
  const date = new Date(orderDate);
  date.setDate(date.getDate() + daysToAdd);
  return date;
};

const formatDateShort = (date: Date) =>
  date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const formatDateFull = (date: Date) =>
  date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

const OrderDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/auth');
  }, [authLoading, isAuthenticated]);

  // Initial fetch
  useEffect(() => {
    if (user && id) {
      Promise.all([
        supabase.from('orders').select('*').eq('id', id).eq('user_id', user.id).single(),
        supabase.from('order_items').select('*').eq('order_id', id),
      ]).then(([{ data: o }, { data: items }]) => {
        setOrder(o);
        setOrderItems(items || []);
        setLoading(false);
        setLastUpdated(new Date());
      });
    }
  }, [user, id]);

  // Realtime subscription for live status updates
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`order-${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setOrder((prev: any) => prev ? { ...prev, ...payload.new } : payload.new);
          setLastUpdated(new Date());
          setIsLive(true);
          setTimeout(() => setIsLive(false), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleDownloadInvoice = async () => {
    if (!order) return;
    await generateInvoicePDF(order, orderItems);
  };

  const normalizedStatus = useMemo(() => {
    if (!order) return 'confirmed';
    return statusSteps.some((s) => s.key === order.status) ? order.status : 'confirmed';
  }, [order]);

  const currentStepIndex = statusSteps.findIndex((s) => s.key === normalizedStatus);
  const progressPercent = Math.max(0, Math.min(100, (currentStepIndex / (statusSteps.length - 1)) * 100));

  // Activity timeline events
  const activityEvents = useMemo(() => {
    if (!order) return [];
    const events: { icon: any; title: string; time: string; description: string; status: string }[] = [];

    events.push({
      icon: CheckCircle2,
      title: 'Order Confirmed',
      time: order.created_at,
      description: `Order #${order.order_number} placed successfully`,
      status: 'completed',
    });

    if (currentStepIndex >= 1) {
      const processingDate = getEstimatedDate(order.created_at, 1);
      events.push({
        icon: Shield,
        title: 'Payment Verified',
        time: processingDate.toISOString(),
        description: `Payment via ${order.payment_method} confirmed`,
        status: 'completed',
      });
      events.push({
        icon: Clock,
        title: 'Processing Started',
        time: getEstimatedDate(order.created_at, 2).toISOString(),
        description: 'Vehicle inspection & preparation underway',
        status: 'completed',
      });
    }

    if (currentStepIndex >= 2) {
      events.push({
        icon: Truck,
        title: 'Shipped',
        time: getEstimatedDate(order.created_at, 5).toISOString(),
        description: `In transit to ${order.shipping_city}, ${order.shipping_state}`,
        status: 'completed',
      });
    }

    if (currentStepIndex >= 3) {
      events.push({
        icon: Package,
        title: 'Delivered',
        time: getEstimatedDate(order.created_at, 10).toISOString(),
        description: `Delivered to ${order.shipping_address}`,
        status: 'completed',
      });
    }

    return events.reverse();
  }, [order, currentStepIndex]);

  const estimatedDelivery = useMemo(() => {
    if (!order) return null;
    return getEstimatedDate(order.created_at, 10);
  }, [order]);

  if (authLoading || loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
        <RefreshCw className="w-6 h-6 text-primary" />
      </motion.div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-2xl mb-4">Order Not Found</h1>
        <Link to="/orders" className="text-primary hover:underline">View All Orders</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="section-padding py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Back + Header */}
          <Link to="/orders" className="text-muted-foreground text-sm flex items-center gap-1 hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> All Orders
          </Link>

          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl sm:text-3xl font-bold">#{order.order_number}</h1>
                {/* Live indicator */}
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] text-emerald-500 font-medium uppercase tracking-wider">Live</span>
                </div>
                <AnimatePresence>
                  {isLive && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full"
                    >
                      Updated!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-muted-foreground text-sm mt-1">
                Placed on {formatDateFull(new Date(order.created_at))} at {formatTime(order.created_at)}
              </p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                Last synced: {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
            <button onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-2 px-5 py-2.5 gold-gradient text-primary-foreground rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow">
              <Download className="w-4 h-4" /> Download Invoice
            </button>
          </div>

          {/* Estimated Delivery Banner */}
          {estimatedDelivery && normalizedStatus !== 'delivered' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-4 mb-6 flex items-center gap-3 border border-primary/20"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Estimated Delivery: <span className="gold-text">{formatDateFull(estimatedDelivery)}</span></p>
                <p className="text-xs text-muted-foreground">Delivery times may vary based on location and vehicle availability</p>
              </div>
            </motion.div>
          )}

          {normalizedStatus === 'delivered' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-4 mb-6 flex items-center gap-3 border border-emerald-500/20 bg-emerald-500/5"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-400">Order Delivered Successfully!</p>
                <p className="text-xs text-muted-foreground">Your vehicle has been delivered. Enjoy the drive!</p>
              </div>
            </motion.div>
          )}

          {/* Order Tracking Timeline */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg">Order Tracking</h3>
                  <p className="text-xs text-muted-foreground">Real-time status updates</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${
                normalizedStatus === 'delivered'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'bg-primary/15 text-primary'
              }`}>
                {normalizedStatus}
              </span>
            </div>

            {/* Desktop horizontal timeline */}
            <div className="hidden sm:block">
              <div className="relative">
                {/* Track background */}
                <div className="absolute top-6 left-[6%] right-[6%] h-1 bg-border rounded-full" />
                {/* Track progress */}
                <motion.div
                  className="absolute top-6 left-[6%] h-1 rounded-full gold-gradient"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercent * 0.88}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />

                <div className="grid grid-cols-4 relative">
                  {statusSteps.map((s, i) => {
                    const isCompleted = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    const estDate = getEstimatedDate(order.created_at, s.daysFromOrder);

                    return (
                      <motion.div
                        key={s.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex flex-col items-center text-center"
                      >
                        {/* Node */}
                        <div className="relative">
                          {isCurrent && normalizedStatus !== 'delivered' && (
                            <span className="absolute inset-0 rounded-full gold-gradient animate-ping opacity-30" />
                          )}
                          <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isCompleted
                              ? 'gold-gradient text-primary-foreground shadow-lg'
                              : 'bg-secondary text-muted-foreground border-2 border-border'
                          }`}>
                            <s.icon className="w-5 h-5" />
                          </div>
                        </div>

                        {/* Label */}
                        <span className={`text-xs font-semibold mt-3 ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {s.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground/70 mt-0.5 max-w-[100px]">
                          {s.note}
                        </span>
                        <span className={`text-[10px] mt-1 font-medium ${
                          isCompleted ? 'text-primary' : 'text-muted-foreground/50'
                        }`}>
                          {isCompleted && i === 0 ? formatDateShort(new Date(order.created_at)) : formatDateShort(estDate)}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile vertical timeline */}
            <div className="sm:hidden space-y-0">
              {statusSteps.map((s, i) => {
                const isCompleted = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                const estDate = getEstimatedDate(order.created_at, s.daysFromOrder);

                return (
                  <div key={s.key} className="flex gap-4">
                    {/* Vertical line + node */}
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        {isCurrent && normalizedStatus !== 'delivered' && (
                          <span className="absolute inset-0 rounded-full gold-gradient animate-ping opacity-30" />
                        )}
                        <div className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'gold-gradient text-primary-foreground'
                            : 'bg-secondary text-muted-foreground border-2 border-border'
                        }`}>
                          <s.icon className="w-4 h-4" />
                        </div>
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`w-0.5 h-12 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-6 pt-1.5">
                      <p className={`text-sm font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</p>
                      <p className="text-[11px] text-muted-foreground/70">{s.note}</p>
                      <p className={`text-[11px] mt-0.5 ${isCompleted ? 'text-primary' : 'text-muted-foreground/50'}`}>
                        {formatDateShort(estDate)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Items + Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6">
                <h3 className="font-display text-lg mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" /> Items ({orderItems.length})
                </h3>
                <div className="space-y-3">
                  {orderItems.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border/30">
                        <img src={item.car_image} alt={item.car_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.car_name}</p>
                        <p className="text-xs text-muted-foreground">{item.car_brand} • Qty: {item.quantity}</p>
                      </div>
                      <p className="gold-text font-display text-sm sm:text-base whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Activity Timeline */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6">
                <h3 className="font-display text-lg mb-5 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Activity Timeline
                </h3>
                <div className="space-y-0">
                  {activityEvents.map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <event.icon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        {idx < activityEvents.length - 1 && (
                          <div className="w-px h-full min-h-[28px] bg-border" />
                        )}
                      </div>
                      <div className="pb-5 pt-0.5">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-[11px] text-muted-foreground">{event.description}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                          {formatDateFull(new Date(event.time))} • {formatTime(event.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right column: Summary + Shipping + Order Info */}
            <div className="space-y-6">
              {/* Summary */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel p-6">
                <h3 className="font-display text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" /> Summary
                </h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                  <div className="flex justify-between text-primary"><span>GST (28%)</span><span>{formatPrice(order.gst_amount)}</span></div>
                  {order.discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-emerald-400">-{formatPrice(order.discount)}</span></div>}
                  <div className="border-t border-border pt-3 flex justify-between font-display text-base">
                    <span>Total</span><span className="gold-text">{formatPrice(order.total)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Payment Method</p>
                  <p className="text-sm capitalize font-medium">{order.payment_method}</p>
                </div>
              </motion.div>

              {/* Shipping */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6">
                <h3 className="font-display text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Shipping Address
                </h3>
                <div className="text-sm space-y-1.5">
                  <p className="font-medium">{order.shipping_name}</p>
                  <p className="text-muted-foreground">{order.shipping_address}</p>
                  <p className="text-muted-foreground">{order.shipping_city}, {order.shipping_state} {order.shipping_pincode}</p>
                  <div className="pt-2 space-y-1">
                    <p className="text-muted-foreground flex items-center gap-2 text-xs">
                      <Phone className="w-3 h-3" /> {order.shipping_phone}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2 text-xs">
                      <Mail className="w-3 h-3" /> {order.shipping_email}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Order Info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-panel p-6">
                <h3 className="font-display text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary" /> Order Info
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono text-foreground/80">{order.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number</span>
                    <span className="font-medium">{order.order_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Placed</span>
                    <span>{formatDateFull(new Date(order.created_at))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span>{orderItems.length}</span>
                  </div>
                  {estimatedDelivery && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Delivery</span>
                      <span className="text-primary font-medium">{formatDateShort(estimatedDelivery)}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
