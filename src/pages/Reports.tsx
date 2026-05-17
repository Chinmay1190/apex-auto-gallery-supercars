import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, Calendar as CalendarIcon, Download, TrendingUp, TrendingDown, Package,
  CreditCard, Layers, RefreshCw, ArrowRight, Car as CarIcon, Crown, Sparkles, Activity,
  Wallet, PieChart, Flame, Target, Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cars, brandLogos } from '@/data/cars';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { generateReportPDF } from '@/utils/generateReportPDF';
import { toast } from 'sonner';

type Period = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'range';

const formatINR = (n: number): string =>
  `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0)}`;

const carById = new Map(cars.map((c) => [c.id, c] as const));
const carCategoryById = new Map(cars.map((c) => [c.id, c.category] as const));

// Animated number that counts up on mount/value change
const AnimatedNumber = ({ value, format: fmt }: { value: number; format?: (n: number) => string }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    const from = 0;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{fmt ? fmt(display) : display.toLocaleString('en-IN')}</>;
};

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
      const diff = (day + 6) % 7;
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
    if (fromDate && toDate) {
      return { from: startOf(fromDate), to: endOf(toDate), label: `${format(fromDate, 'd MMM yyyy')} → ${format(toDate, 'd MMM yyyy')}` };
    }
    return { from: startOf(now), to: endOf(now), label: 'Select range' };
  }, [period, selectedDate, fromDate, toDate]);

  // Previous-period comparison range (same length, immediately preceding)
  const prevRange = useMemo(() => {
    const span = range.to.getTime() - range.from.getTime();
    const to = new Date(range.from.getTime() - 1);
    const from = new Date(range.from.getTime() - span - 1);
    return { from, to };
  }, [range]);

  const filtered = useMemo(
    () => orders.filter((o) => {
      const d = new Date(o.created_at).getTime();
      return d >= range.from.getTime() && d <= range.to.getTime();
    }),
    [orders, range],
  );

  const prevFiltered = useMemo(
    () => orders.filter((o) => {
      const d = new Date(o.created_at).getTime();
      return d >= prevRange.from.getTime() && d <= prevRange.to.getTime();
    }),
    [orders, prevRange],
  );

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

  const prevRevenue = useMemo(() => prevFiltered.reduce((s, o) => s + (o.total || 0), 0), [prevFiltered]);
  const revenueDelta = useMemo(() => {
    if (!prevRevenue) return stats.revenue > 0 ? 100 : 0;
    return ((stats.revenue - prevRevenue) / prevRevenue) * 100;
  }, [stats.revenue, prevRevenue]);
  const ordersDelta = useMemo(() => {
    if (!prevFiltered.length) return stats.orders > 0 ? 100 : 0;
    return ((stats.orders - prevFiltered.length) / prevFiltered.length) * 100;
  }, [stats.orders, prevFiltered.length]);

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

  const carsPurchased = useMemo(() => {
    const map = new Map<string, { name: string; brand: string; image: string; units: number; revenue: number }>();
    filteredItems.forEach((it) => {
      const car = carById.get(it.car_id);
      const key = it.car_id;
      const cur = map.get(key) || {
        name: car?.name || it.car_name || 'Vehicle',
        brand: car?.brand || it.car_brand || '-',
        image: car?.image || it.car_image || '',
        units: 0,
        revenue: 0,
      };
      cur.units += it.quantity || 0;
      cur.revenue += (it.price || 0) * (it.quantity || 0);
      map.set(key, cur);
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filteredItems]);

  const topCar = carsPurchased[0];

  // Brand performance
  const brandStats = useMemo(() => {
    const map = new Map<string, { units: number; revenue: number }>();
    filteredItems.forEach((it) => {
      const car = carById.get(it.car_id);
      const brand = car?.brand || it.car_brand || 'Other';
      const cur = map.get(brand) || { units: 0, revenue: 0 };
      cur.units += it.quantity || 0;
      cur.revenue += (it.price || 0) * (it.quantity || 0);
      map.set(brand, cur);
    });
    return Array.from(map.entries())
      .map(([brand, v]) => ({ brand, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredItems]);

  // Daily trend buckets across the selected range (max 14 buckets) + previous-period overlay
  const dailyTrend = useMemo(() => {
    const dayMs = 24 * 60 * 60 * 1000;
    const totalDays = Math.max(1, Math.ceil((range.to.getTime() - range.from.getTime()) / dayMs));
    const buckets = Math.min(14, totalDays);
    const bucketMs = (range.to.getTime() - range.from.getTime()) / buckets;
    const data = Array.from({ length: buckets }, () => 0);
    const prev = Array.from({ length: buckets }, () => 0);
    filtered.forEach((o) => {
      const t = new Date(o.created_at).getTime();
      const idx = Math.min(buckets - 1, Math.max(0, Math.floor((t - range.from.getTime()) / bucketMs)));
      data[idx] += o.total || 0;
    });
    prevFiltered.forEach((o) => {
      const t = new Date(o.created_at).getTime();
      const idx = Math.min(buckets - 1, Math.max(0, Math.floor((t - prevRange.from.getTime()) / bucketMs)));
      prev[idx] += o.total || 0;
    });
    const max = Math.max(1, ...data, ...prev);
    // bucket date labels
    const labels = Array.from({ length: buckets }, (_, i) => {
      const d = new Date(range.from.getTime() + bucketMs * i + bucketMs / 2);
      return format(d, buckets > 7 ? 'd MMM' : 'EEE d');
    });
    return { data, prev, max, labels };
  }, [filtered, prevFiltered, range, prevRange]);

  // Status distribution
  const statusStats = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((o) => map.set(o.status, (map.get(o.status) || 0) + 1));
    return Array.from(map.entries()).map(([key, count]) => ({ key, count }));
  }, [filtered]);

  // Payment method split (by revenue)
  const paymentStats = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((o) => map.set(o.payment_method || 'other', (map.get(o.payment_method || 'other') || 0) + (o.total || 0)));
    return Array.from(map.entries())
      .map(([method, revenue]) => ({ method, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  // Insights: best day, best brand, peak revenue bucket, repeat buyer ratio
  const insights = useMemo(() => {
    const peakIdx = dailyTrend.data.reduce((best, v, i, arr) => (v > arr[best] ? i : best), 0);
    const peakAmount = dailyTrend.data[peakIdx] || 0;
    const peakLabel = dailyTrend.labels[peakIdx] || '—';
    const avgPerDay = dailyTrend.data.length ? Math.round(dailyTrend.data.reduce((a, b) => a + b, 0) / dailyTrend.data.length) : 0;
    const topBrand = brandStats[0]?.brand || '—';
    const completionRate = filtered.length
      ? Math.round((filtered.filter((o) => o.status === 'delivered').length / filtered.length) * 100)
      : 0;
    return { peakAmount, peakLabel, avgPerDay, topBrand, completionRate };
  }, [dailyTrend, brandStats, filtered]);

  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);

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
        carsPurchased: carsPurchased.map(({ image, ...rest }) => rest),
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

  const statCards = [
    { label: 'Total Orders', value: stats.orders, icon: Package, accent: 'text-primary', delta: ordersDelta, isCurrency: false },
    { label: 'Revenue', value: stats.revenue, icon: TrendingUp, accent: 'text-emerald-400', delta: revenueDelta, isCurrency: true },
    { label: 'Avg Order', value: stats.avg, icon: CreditCard, accent: 'text-sky-400', delta: null as number | null, isCurrency: true },
    { label: 'Units Sold', value: stats.units, icon: Layers, accent: 'text-amber-400', delta: null as number | null, isCurrency: false },
  ];

  return (
    <div className="min-h-screen pt-20 md:pt-24 relative overflow-hidden">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[420px] h-[420px] rounded-full bg-amber-500/10 blur-[140px]" />
      </div>

      <div className="section-padding py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-8 p-6 md:p-8 rounded-3xl overflow-hidden border border-primary/20 glass-panel"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-500/5 pointer-events-none" />
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
            <div className="relative flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.4)]">
                    <BarChart3 className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Live Performance Suite
                  </p>
                  <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                    Reports & <span className="gold-text">Analytics</span>
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Premium intelligence on your supercar acquisitions
                  </p>
                </div>
              </div>
              <button
                onClick={downloadPDF}
                className="group relative inline-flex items-center gap-2 px-6 py-3 gold-gradient text-primary-foreground font-semibold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_hsl(var(--primary)/0.35)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.55)] transition-all hover:scale-[1.03]"
              >
                <Download className="w-4 h-4" /> Export PDF Report
              </button>
            </div>
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
                    ? 'gold-gradient text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)]'
                    : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/40',
                )}
              >
                {t.label}
              </button>
            ))}
          </motion.div>

          {/* Date controls */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-5 mb-8 flex flex-wrap items-center gap-4 border border-border/40">
            {period !== 'range' ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm hover:border-primary/50 transition-colors">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span className="font-medium">{range.label}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} initialFocus className="p-3 pointer-events-auto" />
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
                    <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="p-3 pointer-events-auto" />
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
                    <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              Showing data for <span className="text-foreground font-semibold">{range.label}</span>
            </span>
          </motion.div>

          {/* Premium stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s, i) => {
              const positive = s.delta != null && s.delta >= 0;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="group relative p-5 rounded-2xl border border-border/40 bg-gradient-to-br from-secondary/40 to-secondary/10 backdrop-blur hover:border-primary/40 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="relative flex items-start justify-between mb-3">
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center bg-secondary/70 border border-border/50', s.accent)}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    {s.delta != null && (
                      <span className={cn(
                        'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full',
                        positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400',
                      )}>
                        {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(s.delta).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <p className="relative text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-1">{s.label}</p>
                  <p className="relative font-display text-2xl md:text-3xl font-bold">
                    <AnimatedNumber value={s.value} format={s.isCurrency ? formatINR : undefined} />
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Top car spotlight + Daily trend */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Top car spotlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1 relative rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent group"
            >
              {topCar ? (
                <>
                  <div className="aspect-[4/3] overflow-hidden bg-secondary/40 relative">
                    {topCar.image ? (
                      <img src={topCar.image} alt={topCar.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><CarIcon className="w-10 h-10 text-muted-foreground" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full gold-gradient text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                      <Crown className="w-3 h-3" /> Top Performer
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">{topCar.brand}</p>
                    <h3 className="font-display text-xl font-bold mb-2">{topCar.name}</h3>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</p>
                        <p className="font-display gold-text text-lg font-bold">{formatINR(topCar.revenue)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Units</p>
                        <p className="font-display text-lg font-bold">{topCar.units}</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <Crown className="w-8 h-8 text-primary/50 mx-auto mb-2" />
                  No top performer yet for this period.
                </div>
              )}
            </motion.div>

            {/* Daily trend chart — SVG area + previous-period overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="lg:col-span-2 glass-panel p-6 border border-border/40"
            >
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> Revenue Pulse
                  </h2>
                  <p className="text-xs text-muted-foreground">Current vs previous period</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-primary">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.7)]" /> Current
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" /> Previous
                  </span>
                  <span className="text-muted-foreground">Peak {formatINR(dailyTrend.max)}</span>
                </div>
              </div>

              {(() => {
                const W = 600, H = 180, P = 8;
                const n = dailyTrend.data.length;
                const stepX = n > 1 ? (W - P * 2) / (n - 1) : 0;
                const yFor = (v: number) => H - P - (v / dailyTrend.max) * (H - P * 2);
                const xFor = (i: number) => P + i * stepX;
                const linePath = dailyTrend.data
                  .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`)
                  .join(' ');
                const areaPath = `${linePath} L ${xFor(Math.max(0, n - 1))} ${H - P} L ${xFor(0)} ${H - P} Z`;
                const prevPath = dailyTrend.prev
                  .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(v)}`)
                  .join(' ');

                return (
                  <div className="relative">
                    <svg
                      ref={chartRef}
                      viewBox={`0 0 ${W} ${H}`}
                      preserveAspectRatio="none"
                      className="w-full h-44 cursor-crosshair"
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const px = ((e.clientX - rect.left) / rect.width) * W;
                        const idx = Math.max(0, Math.min(n - 1, Math.round((px - P) / Math.max(1, stepX))));
                        setHoverIdx(idx);
                      }}
                      onMouseLeave={() => setHoverIdx(null)}
                    >
                      <defs>
                        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {[0.25, 0.5, 0.75].map((g) => (
                        <line key={g} x1={P} x2={W - P}
                          y1={P + g * (H - P * 2)} y2={P + g * (H - P * 2)}
                          stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />
                      ))}

                      {dailyTrend.prev.some((v) => v > 0) && (
                        <motion.path d={prevPath} fill="none" stroke="hsl(var(--muted-foreground))"
                          strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 3"
                          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
                      )}

                      <motion.path d={areaPath} fill="url(#areaFill)"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
                      <motion.path d={linePath} fill="none" stroke="hsl(var(--primary))"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeInOut' }}
                        style={{ filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.5))' }} />

                      {dailyTrend.data.map((v, i) => (
                        <circle key={i} cx={xFor(i)} cy={yFor(v)}
                          r={hoverIdx === i ? 4 : 2.5}
                          fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="1.5"
                          style={{ transition: 'r 0.2s' }} />
                      ))}

                      {hoverIdx != null && (
                        <line x1={xFor(hoverIdx)} x2={xFor(hoverIdx)} y1={P} y2={H - P}
                          stroke="hsl(var(--primary))" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
                      )}
                    </svg>

                    {hoverIdx != null && (
                      <div
                        className="absolute -top-2 pointer-events-none px-3 py-2 rounded-lg bg-background/95 backdrop-blur border border-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.3)] text-[11px]"
                        style={{ left: `calc(${(xFor(hoverIdx) / W) * 100}% - 60px)` }}
                      >
                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider">{dailyTrend.labels[hoverIdx]}</p>
                        <p className="font-display gold-text font-bold">{formatINR(dailyTrend.data[hoverIdx])}</p>
                        {dailyTrend.prev[hoverIdx] > 0 && (
                          <p className="text-muted-foreground text-[10px]">prev: {formatINR(dailyTrend.prev[hoverIdx])}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                <span>{format(range.from, 'd MMM')}</span>
                <span>{format(range.to, 'd MMM')}</span>
              </div>
            </motion.div>
          </div>

          {/* Insights strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {[
              { icon: Flame, label: 'Peak Bucket', value: insights.peakLabel, sub: formatINR(insights.peakAmount), accent: 'text-rose-400' },
              { icon: Target, label: 'Avg / Bucket', value: formatINR(insights.avgPerDay), sub: 'across period', accent: 'text-sky-400' },
              { icon: Crown, label: 'Lead Brand', value: insights.topBrand, sub: brandStats[0] ? formatINR(brandStats[0].revenue) : '—', accent: 'text-primary' },
              { icon: Zap, label: 'Fulfilment', value: `${insights.completionRate}%`, sub: 'delivered', accent: 'text-emerald-400' },
            ].map((it, i) => (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative group p-4 rounded-2xl border border-border/40 bg-gradient-to-br from-secondary/30 to-transparent hover:border-primary/40 transition-all overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/10 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/60 border border-border/40', it.accent)}>
                    <it.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{it.label}</p>
                    <p className="font-display text-base font-bold truncate">{it.value}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{it.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Status donut + Payment split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 border border-border/40">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">Order Status Mix</h2>
                  <p className="text-xs text-muted-foreground">Pipeline distribution</p>
                </div>
                <PieChart className="w-5 h-5 text-primary" />
              </div>
              {statusStats.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No orders in this period.</p>
              ) : (() => {
                const total = statusStats.reduce((s, x) => s + x.count, 0) || 1;
                const colors: Record<string, string> = {
                  confirmed: 'hsl(var(--primary))',
                  processing: '#f59e0b',
                  shipped: '#38bdf8',
                  delivered: '#34d399',
                };
                let cumulative = 0;
                const R = 60, C = 80;
                return (
                  <div className="flex items-center gap-6 flex-wrap">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle cx={C} cy={C} r={R} fill="none" stroke="hsl(var(--secondary))" strokeWidth="20" />
                      {statusStats.map((s, i) => {
                        const frac = s.count / total;
                        const circumference = 2 * Math.PI * R;
                        const dash = frac * circumference;
                        const offset = -cumulative * circumference;
                        cumulative += frac;
                        return (
                          <motion.circle key={s.key} cx={C} cy={C} r={R} fill="none"
                            stroke={colors[s.key] || 'hsl(var(--muted))'} strokeWidth="20"
                            strokeDasharray={`${dash} ${circumference}`} strokeDashoffset={offset}
                            transform={`rotate(-90 ${C} ${C})`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} />
                        );
                      })}
                      <text x={C} y={C - 4} textAnchor="middle" className="fill-foreground font-display font-bold" fontSize="22">{total}</text>
                      <text x={C} y={C + 14} textAnchor="middle" className="fill-muted-foreground" fontSize="9">ORDERS</text>
                    </svg>
                    <ul className="flex-1 min-w-[140px] space-y-2">
                      {statusStats.map((s) => {
                        const pct = (s.count / total) * 100;
                        return (
                          <li key={s.key} className="flex items-center gap-2 text-sm">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors[s.key] || 'hsl(var(--muted))' }} />
                            <span className="capitalize flex-1">{s.key}</span>
                            <span className="text-muted-foreground text-xs">{s.count}</span>
                            <span className="font-semibold text-xs w-12 text-right">{pct.toFixed(0)}%</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel p-6 border border-border/40">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">Payment Mix</h2>
                  <p className="text-xs text-muted-foreground">Revenue by method</p>
                </div>
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              {paymentStats.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No payments in this period.</p>
              ) : (() => {
                const total = paymentStats.reduce((s, p) => s + p.revenue, 0) || 1;
                const tones = ['gold-gradient', 'bg-sky-400/80', 'bg-emerald-400/80', 'bg-rose-400/80', 'bg-violet-400/80'];
                const dots = ['bg-primary', 'bg-sky-400', 'bg-emerald-400', 'bg-rose-400', 'bg-violet-400'];
                return (
                  <>
                    <div className="flex h-3 rounded-full overflow-hidden mb-4 border border-border/30">
                      {paymentStats.map((p, i) => (
                        <motion.div key={p.method}
                          initial={{ width: 0 }} animate={{ width: `${(p.revenue / total) * 100}%` }}
                          transition={{ duration: 0.7, delay: i * 0.08 }}
                          className={tones[i % tones.length]}
                          title={`${p.method}: ${formatINR(p.revenue)}`} />
                      ))}
                    </div>
                    <ul className="space-y-2">
                      {paymentStats.map((p, i) => {
                        const pct = (p.revenue / total) * 100;
                        return (
                          <li key={p.method} className="flex items-center gap-3 text-sm p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                            <span className={cn('w-2.5 h-2.5 rounded-full', dots[i % dots.length])} />
                            <span className="capitalize flex-1">{p.method}</span>
                            <span className="font-display gold-text font-semibold text-xs">{formatINR(p.revenue)}</span>
                            <span className="text-xs text-muted-foreground w-12 text-right">{pct.toFixed(0)}%</span>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                );
              })()}
            </motion.div>
          </div>

          {/* Category + Brand performance row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Category breakdown */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 border border-border/40">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">Category Performance</h2>
                  <p className="text-xs text-muted-foreground">How segments compare</p>
                </div>
                <Layers className="w-5 h-5 text-primary" />
              </div>
              {categoryStats.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No sales in this period.</p>
              ) : (
                <div className="space-y-3.5">
                  {categoryStats.map((c, i) => {
                    const pct = stats.revenue ? (c.revenue / stats.revenue) * 100 : 0;
                    return (
                      <div key={c.category} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {c.category}
                          </span>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{c.units} unit{c.units !== 1 ? 's' : ''}</span>
                            <span className="font-display gold-text font-semibold">{formatINR(c.revenue)}</span>
                            <span className="w-12 text-right">{pct.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="h-2.5 bg-secondary/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.7, delay: i * 0.05 }}
                            className="h-full gold-gradient rounded-full shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Brand leaderboard */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-panel p-6 border border-border/40">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display text-lg font-semibold">Brand Leaderboard</h2>
                  <p className="text-xs text-muted-foreground">Top marques by revenue</p>
                </div>
                <Crown className="w-5 h-5 text-primary" />
              </div>
              {brandStats.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No brand data in this period.</p>
              ) : (
                <ul className="space-y-2.5">
                  {(() => {
                    const topRev = brandStats[0]?.revenue || 1;
                    return brandStats.map((b, i) => {
                      const pct = (b.revenue / topRev) * 100;
                      const logo = brandLogos[b.brand];
                      return (
                        <motion.li
                          key={b.brand}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="relative flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/40 transition-colors overflow-hidden"
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: i * 0.05 }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent pointer-events-none"
                          />
                          <div className={cn(
                            'relative w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-xs shrink-0',
                            i === 0 ? 'gold-gradient text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.5)]' : 'bg-secondary text-muted-foreground',
                          )}>
                            {i + 1}
                          </div>
                          {logo && (
                            <div className="relative w-9 h-9 rounded-lg bg-background/80 border border-border/40 flex items-center justify-center p-1 shrink-0">
                              <img src={logo} alt={b.brand} className="w-full h-full object-contain" loading="lazy" />
                            </div>
                          )}
                          <div className="relative flex-1 min-w-0">
                            <p className="font-display font-semibold text-sm truncate">{b.brand}</p>
                            <p className="text-[11px] text-muted-foreground">{b.units} unit{b.units !== 1 ? 's' : ''} • {pct.toFixed(0)}%</p>
                          </div>
                          <p className="relative font-display gold-text font-bold text-sm">{formatINR(b.revenue)}</p>
                        </motion.li>
                      );
                    });
                  })()}
                </ul>
              )}
            </motion.div>
          </div>

          {/* Cars Purchased */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 mb-8 border border-border/40">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-lg font-semibold">Cars Purchased</h2>
                <p className="text-xs text-muted-foreground">Unique vehicles in this period</p>
              </div>
              <CarIcon className="w-5 h-5 text-primary" />
            </div>
            {carsPurchased.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No cars purchased in this period.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {carsPurchased.map((c, i) => (
                  <motion.div
                    key={`${c.name}-${i}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group relative overflow-hidden rounded-xl border border-border/40 bg-secondary/20 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-secondary/40 relative">
                      {c.image ? (
                        <img src={c.image} alt={`${c.brand} ${c.name}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><CarIcon className="w-8 h-8" /></div>
                      )}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-background/80 backdrop-blur text-[10px] font-bold text-primary border border-primary/30">
                        {c.units} unit{c.units !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] uppercase tracking-wider text-primary mb-0.5">{c.brand}</p>
                      <p className="font-display text-sm font-semibold truncate">{c.name}</p>
                      <p className="font-display gold-text text-sm font-bold mt-1">{formatINR(c.revenue)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Orders list in period */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 border border-border/40">
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
