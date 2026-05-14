import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, ChevronRight, ShoppingBag, Truck, CheckCircle2,
  Clock, RefreshCw, Calendar, CreditCard, MapPin, Hash,
  Search, ArrowUpDown, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/data/cars';

const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  confirmed: { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/15', label: 'Confirmed' },
  processing: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/15', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-sky-400', bg: 'bg-sky-500/15', label: 'Shipped' },
  delivered: { icon: Package, color: 'text-emerald-400', bg: 'bg-emerald-500/15', label: 'Delivered' },
};

const Orders = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/auth');
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (user) {
      Promise.all([
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('order_items').select('*'),
      ]).then(([{ data: ordersData }, { data: itemsData }]) => {
        setOrders(ordersData || []);
        const grouped: Record<string, any[]> = {};
        (itemsData || []).forEach((item) => {
          if (!grouped[item.order_id]) grouped[item.order_id] = [];
          grouped[item.order_id].push(item);
        });
        setOrderItems(grouped);
        setLoading(false);
      });
    }
  }, [user]);

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const stats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    inTransit: orders.filter((o) => o.status === 'shipped').length,
    totalSpent: orders.reduce((sum, o) => sum + (o.total || 0), 0),
  };

  if (authLoading || loading)
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <RefreshCw className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="section-padding py-8 md:py-12">
        <div className="max-w-5xl mx-auto">

          {/* Hero Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold">My Orders</h1>
                <p className="text-sm text-muted-foreground">Track and manage your luxury purchases</p>
              </div>
            </div>
          </motion.div>

          {orders.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Your order history will appear here once you make your first purchase.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3 gold-gradient text-primary-foreground font-semibold text-sm rounded-lg uppercase tracking-wider shadow-lg hover:shadow-xl transition-shadow"
              >
                Browse Collection
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
              >
                {[
                  { label: 'Total Orders', value: stats.total, icon: Hash, accent: 'text-primary' },
                  { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, accent: 'text-emerald-400' },
                  { label: 'In Transit', value: stats.inTransit, icon: Truck, accent: 'text-sky-400' },
                  { label: 'Total Spent', value: formatPrice(stats.totalSpent), icon: CreditCard, accent: 'text-primary' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className="glass-panel p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary/60 flex items-center justify-center flex-shrink-0">
                      <stat.icon className={`w-5 h-5 ${stat.accent}`} />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      <p className="font-display text-lg font-bold">{stat.value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Filter Tabs */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-2 mb-6 overflow-x-auto pb-1"
              >
                {[
                  { key: 'all', label: 'All Orders' },
                  { key: 'confirmed', label: 'Confirmed' },
                  { key: 'processing', label: 'Processing' },
                  { key: 'shipped', label: 'Shipped' },
                  { key: 'delivered', label: 'Delivered' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                      filter === tab.key
                        ? 'gold-gradient text-primary-foreground shadow-lg'
                        : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {tab.label}
                    {tab.key !== 'all' && (
                      <span className="ml-1.5 opacity-70">
                        ({orders.filter((o) => o.status === tab.key).length})
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <p className="text-muted-foreground">No orders with status "{filter}"</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order, i) => {
                    const items = orderItems[order.id] || [];
                    const cfg = statusConfig[order.status] || statusConfig.confirmed;
                    const StatusIcon = cfg.icon;

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          to={`/orders/${order.id}`}
                          className="glass-panel p-5 md:p-6 block hover-lift group transition-all duration-300 border border-transparent hover:border-primary/20"
                        >
                          {/* Top row: order number + status */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center`}>
                                <StatusIcon className={`w-5 h-5 ${cfg.color}`} />
                              </div>
                              <div>
                                <p className="font-display text-base font-semibold group-hover:text-primary transition-colors">
                                  #{order.order_number}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${cfg.bg} ${cfg.color}`}>
                                {cfg.label}
                              </span>
                              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </div>

                          {/* Item thumbnails */}
                          {items.length > 0 && (
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex -space-x-3">
                                {items.slice(0, 3).map((item, idx) => (
                                  <div
                                    key={item.id}
                                    className="w-12 h-12 rounded-lg overflow-hidden border-2 border-background bg-secondary flex-shrink-0"
                                    style={{ zIndex: 3 - idx }}
                                  >
                                    <img src={item.car_image} alt={item.car_name} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                                {items.length > 3 && (
                                  <div className="w-12 h-12 rounded-lg border-2 border-background bg-secondary/80 flex items-center justify-center flex-shrink-0 text-xs font-bold text-muted-foreground">
                                    +{items.length - 3}
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {items.map((it) => it.car_name).slice(0, 2).join(', ')}
                                {items.length > 2 && ` +${items.length - 2} more`}
                              </div>
                            </div>
                          )}

                          {/* Bottom row: details */}
                          <div className="flex items-center justify-between pt-3 border-t border-border/30">
                            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                {order.payment_method}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {order.shipping_city}, {order.shipping_state}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                {items.length} item{items.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <p className="font-display text-lg font-bold gold-text">{formatPrice(order.total)}</p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
