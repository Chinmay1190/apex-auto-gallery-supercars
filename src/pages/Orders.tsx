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
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

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

  // Filter + search + sort
  const filteredOrders = useMemo(() => {
    let list = filter === 'all' ? [...orders] : orders.filter((o) => o.status === filter);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((o) => {
        const items = orderItems[o.id] || [];
        const inItems = items.some((it) =>
          it.car_name?.toLowerCase().includes(q) || it.car_brand?.toLowerCase().includes(q)
        );
        return (
          o.order_number?.toLowerCase().includes(q) ||
          o.shipping_city?.toLowerCase().includes(q) ||
          o.shipping_state?.toLowerCase().includes(q) ||
          inItems
        );
      });
    }

    switch (sortBy) {
      case 'oldest':
        list.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
        break;
      case 'highest':
        list.sort((a, b) => (b.total || 0) - (a.total || 0));
        break;
      case 'lowest':
        list.sort((a, b) => (a.total || 0) - (b.total || 0));
        break;
      default:
        list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    }
    return list;
  }, [orders, orderItems, filter, search, sortBy]);

  // Group by month
  const groupedOrders = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredOrders.forEach((o) => {
      const d = new Date(o.created_at);
      const key = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(o);
    });
    return groups;
  }, [filteredOrders]);

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

              {/* Search + Sort */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22 }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by order #, car, brand or city..."
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-secondary/50 border border-border/40 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:bg-secondary/70 transition-colors"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-background/50"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none pl-10 pr-8 py-2.5 rounded-lg bg-secondary/50 border border-border/40 text-sm focus:outline-none focus:border-primary/40 cursor-pointer min-w-[180px]"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="highest">Highest amount</option>
                    <option value="lowest">Lowest amount</option>
                  </select>
                </div>
              </motion.div>

              {/* Orders List grouped by month */}
              {filteredOrders.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 glass-panel">
                  <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {search ? `No orders matching "${search}"` : `No orders with status "${filter}"`}
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="mt-3 text-xs text-primary hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </motion.div>
              ) : (
                <div className="space-y-8">
                  <AnimatePresence mode="popLayout">
                  {Object.entries(groupedOrders).map(([month, monthOrders]) => (
                    <motion.div
                      key={month}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-sm uppercase tracking-[0.2em] text-muted-foreground">
                          {month}
                        </h3>
                        <div className="flex-1 h-px bg-border/40" />
                        <span className="text-[11px] text-muted-foreground/70">
                          {monthOrders.length} order{monthOrders.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {monthOrders.map((order, i) => {
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
                    </motion.div>
                  ))}
                  </AnimatePresence>
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
