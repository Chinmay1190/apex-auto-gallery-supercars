import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Gauge, Zap, Fuel, Settings2, ArrowRight, RotateCcw } from 'lucide-react';
import { cars, Car } from '@/data/cars';
import { Link } from 'react-router-dom';

const specRows: { label: string; key: keyof Car | 'priceFormatted'; icon: any; format?: (v: any) => string }[] = [
  { label: 'Price', key: 'priceFormatted', icon: null, format: (v) => v },
  { label: 'Engine', key: 'engine', icon: Settings2 },
  { label: 'Horsepower', key: 'horsepower', icon: Zap, format: (v) => `${v} HP` },
  { label: 'Top Speed', key: 'topSpeed', icon: Gauge, format: (v) => `${v} km/h` },
  { label: '0-100 km/h', key: 'acceleration', icon: null },
  { label: 'Torque', key: 'torque', icon: null },
  { label: 'Fuel', key: 'fuel', icon: Fuel },
  { label: 'Transmission', key: 'transmission', icon: null },
  { label: 'Drivetrain', key: 'drivetrain', icon: null },
  { label: 'Body Type', key: 'bodyType', icon: null },
  { label: 'Seats', key: 'seats', icon: null },
  { label: 'Mileage', key: 'mileage', icon: null },
  { label: 'Fuel Tank', key: 'fuelTank', icon: null },
];

const formatPrice = (p: number) => `₹${(p / 10000000).toFixed(1)} Cr`;

const MAX_COMPARE = 3;

const Compare = () => {
  const [selected, setSelected] = useState<Car[]>([]);
  const [searchOpen, setSearchOpen] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const selectedIds = new Set(selected.map(c => c.id));
    return cars.filter(c => !selectedIds.has(c.id) && (
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.brand.toLowerCase().includes(query.toLowerCase())
    ));
  }, [query, selected]);

  const addCar = (car: Car) => {
    if (searchOpen !== null && searchOpen < selected.length) {
      setSelected(prev => prev.map((c, i) => i === searchOpen ? car : c));
    } else {
      setSelected(prev => [...prev, car]);
    }
    setSearchOpen(null);
    setQuery('');
  };

  const removeCar = (index: number) => setSelected(prev => prev.filter((_, i) => i !== index));
  const reset = () => { setSelected([]); setSearchOpen(null); setQuery(''); };

  const getBest = (key: keyof Car) => {
    if (selected.length < 2) return -1;
    const vals = selected.map(c => Number(c[key]));
    if (vals.some(isNaN)) return -1;
    const max = Math.max(...vals);
    return vals.indexOf(max);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 text-primary text-xs tracking-[0.2em] uppercase mb-6">
              Comparison Tool
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Compare <span className="text-primary">Supercars</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Select up to {MAX_COMPARE} cars for a side-by-side spec comparison.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Selection Slots */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Selected Cars</h2>
          {selected.length > 0 && (
            <button onClick={reset} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: MAX_COMPARE }).map((_, i) => {
            const car = selected[i];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-300 min-h-[220px] ${
                  car ? 'border-primary/30 bg-card/80' : 'border-dashed border-border/50 bg-card/30 hover:border-primary/20 cursor-pointer'
                }`}
                onClick={() => !car && setSearchOpen(i)}>
                {car ? (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); removeCar(i); }}
                      className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-background/80 border border-border/50 text-muted-foreground hover:text-accent transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="h-36 overflow-hidden">
                      <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="text-xs text-primary tracking-wider uppercase">{car.brand}</div>
                      <div className="font-semibold text-foreground">{car.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{formatPrice(car.price)}</div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 p-6">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-border/50 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">Add Car {i + 1}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center pt-32"
            onClick={() => { setSearchOpen(null); setQuery(''); }}>
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-lg mx-4 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-border/30">
                <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search by name or brand..."
                  className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg" autoFocus />
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filtered.slice(0, 10).map(car => (
                  <button key={car.id} onClick={() => addCar(car)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-primary/5 transition-colors text-left">
                    <img src={car.image} alt={car.name} className="w-16 h-12 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-primary">{car.brand}</div>
                      <div className="font-medium text-foreground truncate">{car.name}</div>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatPrice(car.price)}</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">No cars found</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison Table */}
      {selected.length >= 2 && (
        <section className="max-w-7xl mx-auto px-4 mb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8 text-center">
              Spec <span className="text-primary">Comparison</span>
            </h2>
            <div className="rounded-2xl border border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
              {specRows.map((spec, i) => {
                const bestIdx = spec.key === 'horsepower' || spec.key === 'topSpeed' ? getBest(spec.key as keyof Car) : -1;
                return (
                  <div key={spec.label} className={`grid ${selected.length === 2 ? 'grid-cols-3' : 'grid-cols-4'} ${i % 2 === 0 ? 'bg-card/30' : ''}`}>
                    <div className="p-4 flex items-center gap-2 border-r border-border/20">
                      {spec.icon && <spec.icon className="w-4 h-4 text-primary" />}
                      <span className="text-sm font-medium text-muted-foreground">{spec.label}</span>
                    </div>
                    {selected.map((car, ci) => {
                      let val: string;
                      if (spec.key === 'priceFormatted') {
                        val = formatPrice(car.price);
                      } else {
                        const raw = car[spec.key as keyof Car];
                        val = spec.format ? spec.format(raw) : String(raw);
                      }
                      const isBest = ci === bestIdx;
                      return (
                        <div key={car.id} className={`p-4 text-sm text-center font-medium ${ci < selected.length - 1 ? 'border-r border-border/20' : ''} ${isBest ? 'text-primary' : 'text-foreground/80'}`}>
                          {val} {isBest && <span className="text-xs">★</span>}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* Verdict */}
      {selected.length >= 2 && (
        <section className="max-w-4xl mx-auto px-4 mb-20">
          <div className="grid md:grid-cols-2 gap-4">
            {selected.map(car => (
              <Link key={car.id} to={`/car/${car.id}`}
                className="group p-6 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/30 transition-all flex items-center gap-4">
                <img src={car.image} alt={car.name} className="w-20 h-14 object-cover rounded-xl" />
                <div className="flex-1">
                  <div className="text-xs text-primary">{car.brand}</div>
                  <div className="font-semibold text-foreground">{car.name}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {selected.length < 2 && (
        <section className="max-w-3xl mx-auto px-4 text-center py-12">
          <div className="p-10 rounded-3xl border border-border/30 bg-card/30">
            <Gauge className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold mb-2 text-foreground">Select at least 2 cars</h3>
            <p className="text-muted-foreground text-sm">Click the slots above to add cars and see a detailed comparison.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default Compare;
