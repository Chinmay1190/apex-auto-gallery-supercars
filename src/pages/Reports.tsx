import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, Calendar as CalendarIcon, Download, TrendingUp, Package,
  CreditCard, Layers, RefreshCw, ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cars } from '@/data/cars';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { generateReportPDF } from '@/utils/generateReportPDF';
import { toast } from 'sonner';

type Period = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'range';

const formatINR = (n: number): string =>
  `INR ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0)}`;

const carCategoryById = new Map(cars.map((c) => [c.id, c.category] as const));

const Reports = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [period, setPeriod] = useState<Period>('daily');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const [orders, setOrders] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/auth');
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('order_items').select('*'),
    ]).then(([{ data: o }, { data: it }]) => {
      const userOrders = o || [];
      const userOrderIds = new Set(userOrders.map((x) => x.id));
      setOrders(userOrders);
      setItems((it || []).filter((i) => userOrderIds.has(i.order_id)));
      setLoading(false);
    });
  }, [user]);

  const range = useMemo(() => {
    const now = new Date();
    const startOf = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
    const endOf = (d: Date) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };

    if (period === 'daily') {
      return { from: startOf(selectedDate), to: endOf(selectedDate), label: format(selectedDate, 'PPP') };
    }
    if (period === 'weekly') {
      const day = selectedDate.getDay();
      const diff = (day + 6) % 7; // Monday start
      const from = startOf(new Date(selectedDate)); from.setDate(from.getDate() - diff);
      const to = endOf(new Date(from)); to.setDate(to.getDate() + 6); to.setHours(23, 59, 59, 999);
      return { from, to, label: `${format(from, 'd MMM')} - ${format(to, 'd MMM yyyy')}` };
    }
    if (period === 'monthly') {
      const from = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      const to = endOf(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0));
      return { from, to, label: format(from, 'MMMM yyyy') };
    }
    if (period === 'quarterly') {
      const q = Math.floor(selectedDate.getMonth() / 3);
      const from = new Date(selectedDate.getFullYear(), q * 3, 1);
      const to = endOf(new Date(selectedDate.getFullYear(), q * 3 + 3, 0));
      return { from, to, label: `Q${q + 1} ${selectedDate.getFullYear()}` };
    }
    // range
    if (fromDate && toDate) {
      return { from: startOf(fromDate), to: endOf(toDate), label: `${format(fromDate, 'd MMM yyyy')} → ${format(toDate, 'd MMM yyyy')}` };
    }
    return { from: startOf(now), to: endOf(now), label: 'Select range' };
  }, [period, selectedDate, fromDate, toDate]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const d = new Date(o.created_at).getTime();
      return d >= range.from.getTime() && d <= range.to.getTime();
    });
  }, [orders, range]);

  const filteredItems = useMemo(() => {
    const ids = new Set(filtered.map((o) => o.id));
    return items.filter((i) => ids.has(i.order_id));
  }, [items, filtered]);

  const stats = useMemo(() => {
    const revenue = filtered.reduce((s, o) => s + (o.total || 0), 0);
    const totalItems = filteredItems.reduce((s, i) => s + (i.quantity || 0), 0);
    return {
      orders: filtered.length,
      revenue,
      avg: filtered.length ? Math.round(revenue / filtered.length) : 0,
      units: totalItems,
    };
  }, [filtered, filteredItems]);

  const categoryStats = useMemo(() => {
    const map = new Map<string, { units: number; revenue: number }>();
    filteredItems.forEach((it) => {
      const cat = carCategoryById.get(it.car_id) || 'Other';
      const cur = map.get(cat) || { units: 0, revenue: 0 };
      cur.units += it.quantity || 0;
      cur.revenue += (it.price || 0) * (it.quantity || 0);
      map.set(cat, cur);
    });
    return Array.from(map.entries())
      .map(([category, v]) => ({ category, ...v }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredItems]);

  const downloadPDF = async () => {
    if (period === 'range' && (!fromDate || !toDate)) {
      toast.error('Please select both From and To dates');
      return;
    }
    try {
      await generateReportPDF({
        title: period === 'range' ? 'Date Range Report' : `${period.charAt(0).toUpperCase() + period.slice(1)} Report`,
        subtitle: range.label,
        orders: filtered.map((o) => ({
          order_number: o.order_number,
          created_at: o.created_at,
          total: o.total,
          status: o.status,
          payment_method: o.payment_method,
        })),
        categoryBreakdown: categoryStats,
      });
      toast.success('Report downloaded');
    } catch (e) {
      toast.error('Failed to generate report');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <RefreshCw className="w-6 h-6 text-primary" />
        </motion.div>
      </div>
    );
  }

  const periodTabs: { key: Period; label: string }[] = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'quarterly', label: 'Quarterly' },
    { key: 'range', label: 'Custom Range' },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <div className="section-padding py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl gold-gradient flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold">Reports & Analytics</h1>
                <p className="text-sm text-muted-foreground">Track your purchase trends across periods and categories</p>
              </div>
            </div>
            <button
              onClick={downloadPDF}
              className="inline-flex items-center gap-2 px-5 py-2.5 gold-gradient text-primary-foreground font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </motion.div>

          {/* Period tabs */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 mb-6">
            {periodTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setPeriod(t.key)}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all',
                  period === t.key
                    ? 'gold-gradient text-primary-foreground shadow-lg'
                    : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary',
                )}
              >
                {t.label}
              </button>
            ))}
          </motion.div>

          {/* Date controls */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-5 mb-8 flex flex-wrap items-center gap-4">
            {period !== 'range' ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn('inline-flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm hover:border-primary/50 transition-colors')}>
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span className="font-medium">{range.label}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => d && setSelectedDate(d)}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm hover:border-primary/50 transition-colors">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">From:</span>
                      <span className="font-medium">{fromDate ? format(fromDate, 'PPP') : 'Pick date'}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className={cn('p-3 pointer-events-auto')} />
                  </PopoverContent>
                </Popover>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm hover:border-primary/50 transition-colors">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">To:</span>
                      <span className="font-medium">{toDate ? format(toDate, 'PPP') : 'Pick date'}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className={cn('p-3 pointer-events-auto')} />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <span className="text-xs text-muted-foreground ml-auto">Showing data for <span className="text-foreground font-semibold">{range.label}</span></span>
          </motion.div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Orders', value: stats.orders, icon: Package, accent: 'text-primary' },
              { label: 'Revenue', value: formatINR(stats.revenue), icon: TrendingUp, accent: 'text-emerald-400' },
              { label: 'Avg Order', value: formatINR(stats.avg), icon: CreditCard, accent: 'text-sky-400' },
              { label: 'Units Sold', value: stats.units, icon: Layers, accent: 'text-amber-400' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-panel p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/60 flex items-center justify-center flex-shrink-0">
                  <s.icon className={`w-5 h-5 ${s.accent}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider truncate">{s.label}</p>
                  <p className="font-display text-lg font-bold truncate">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Category breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-lg font-semibold">Category-wise Sales</h2>
                <p className="text-xs text-muted-foreground">How different supercar categories performed</p>
              </div>
              <Layers className="w-5 h-5 text-primary" />
            </div>
            {categoryStats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No sales in this period.</p>
            ) : (
              <div className="space-y-3">
                {categoryStats.map((c) => {
                  const pct = stats.revenue ? (c.revenue / stats.revenue) * 100 : 0;
                  return (
                    <div key={c.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{c.category}</span>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{c.units} unit{c.units !== 1 ? 's' : ''}</span>
                          <span className="font-display gold-text font-semibold">{formatINR(c.revenue)}</span>
                          <span className="w-12 text-right">{pct.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
                          className="h-full gold-gradient rounded-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Orders list in period */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-lg font-semibold">Orders in Period</h2>
                <p className="text-xs text-muted-foreground">{filtered.length} order{filtered.length !== 1 ? 's' : ''} found</p>
              </div>
              <Package className="w-5 h-5 text-primary" />
            </div>
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No orders during this period.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border/40">
                      <th className="py-2 pr-3">Order</th>
                      <th className="py-2 pr-3">Date</th>
                      <th className="py-2 pr-3">Payment</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((o) => (
                      <tr key={o.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/20 transition-colors">
                        <td className="py-3 pr-3 font-semibold">#{o.order_number}</td>
                        <td className="py-3 pr-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="py-3 pr-3 capitalize text-muted-foreground">{o.payment_method}</td>
                        <td className="py-3 pr-3"><span className="capitalize text-xs px-2 py-0.5 rounded-full bg-secondary/60">{o.status}</span></td>
                        <td className="py-3 text-right font-display gold-text font-semibold">{formatINR(o.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
