import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, Search, ChevronDown, LayoutGrid, Rows3, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import CarCard from '@/components/CarCard';
import { cars, brands, categories, fuelTypes, transmissions, drivetrains, formatPrice } from '@/data/cars';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand') || '';

  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedDrivetrain, setSelectedDrivetrain] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([5000000, 700000000]);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(24);

  const filteredCars = useMemo(() => {
    let result = [...cars];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q));
    }
    if (selectedBrands.length) result = result.filter(c => selectedBrands.includes(c.brand));
    if (selectedCategory) result = result.filter(c => c.category === selectedCategory);
    if (selectedFuel) result = result.filter(c => c.fuel === selectedFuel);
    if (selectedTransmission) result = result.filter(c => c.transmission === selectedTransmission);
    if (selectedDrivetrain) result = result.filter(c => c.drivetrain === selectedDrivetrain);
    result = result.filter(c => c.price >= priceRange[0] && c.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'speed': result.sort((a, b) => b.topSpeed - a.topSpeed); break;
      case 'latest': result.sort((a, b) => b.year - a.year); break;
    }
    return result;
  }, [selectedBrands, selectedCategory, selectedFuel, selectedTransmission, selectedDrivetrain, priceRange, sortBy, searchQuery]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategory('');
    setSelectedFuel('');
    setSelectedTransmission('');
    setSelectedDrivetrain('');
    setPriceRange([5000000, 700000000]);
    setSearchQuery('');
  };

  const activeFilterCount = [
    selectedBrands.length > 0,
    !!selectedCategory,
    !!selectedFuel,
    !!selectedTransmission,
    !!selectedDrivetrain,
    searchQuery.length > 0,
  ].filter(Boolean).length;

  const activeFilters: { label: string; clear: () => void }[] = [
    ...selectedBrands.map(b => ({ label: b, clear: () => toggleBrand(b) })),
    ...(selectedCategory ? [{ label: selectedCategory, clear: () => setSelectedCategory('') }] : []),
    ...(selectedFuel ? [{ label: selectedFuel, clear: () => setSelectedFuel('') }] : []),
    ...(selectedTransmission ? [{ label: selectedTransmission, clear: () => setSelectedTransmission('') }] : []),
    ...(selectedDrivetrain ? [{ label: selectedDrivetrain, clear: () => setSelectedDrivetrain('') }] : []),
  ];

  const FilterSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="border-b border-border/30 pb-5 mb-5 last:border-0 last:mb-0 last:pb-0">
        <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full group mb-3">
          <h4 className="font-display text-xs tracking-[0.2em] uppercase text-foreground/80 group-hover:text-foreground transition-colors">{title}</h4>
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick}
      className={`px-3 py-1.5 text-[11px] rounded-lg border transition-all duration-200 ${
        active
          ? 'border-primary bg-primary/15 text-primary shadow-[0_0_12px_hsl(var(--gold)/0.15)]'
          : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-card/50'
      }`}>{label}</button>
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="relative section-padding py-10 md:py-14">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <p className="text-primary text-xs tracking-[0.3em] uppercase font-medium">Curated Collection</p>
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">Our Supercars</h1>
                <p className="text-muted-foreground text-sm max-w-md">
                  Handpicked masterpieces from the world's most prestigious marques
                </p>
              </motion.div>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative w-full md:w-80"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by name or brand..."
                  className="w-full pl-11 pr-4 py-3 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="section-padding py-4 border-b border-border/20 bg-card/30 backdrop-blur-sm sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 glass-panel text-xs text-foreground hover:border-primary/50 transition-colors md:hidden relative">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full gold-gradient text-[9px] font-bold flex items-center justify-center text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <p className="text-muted-foreground text-xs">
              <span className="text-foreground font-semibold">{filteredCars.length}</span> supercar{filteredCars.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 mr-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('large')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'large' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Rows3 className="w-4 h-4" />
              </button>
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 glass-panel text-xs bg-card/60 border-border/50 text-foreground rounded-lg cursor-pointer focus:outline-none focus:border-primary/50">
              <option value="popular">Popularity</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="speed">Top Speed</option>
              <option value="latest">Latest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="section-padding py-8">
        <div className="max-w-7xl mx-auto flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-lg p-6 overflow-y-auto' : 'hidden'} md:block md:relative md:w-60 md:flex-shrink-0`}>
            <div className="flex items-center justify-between mb-6 md:hidden">
              <h3 className="font-display text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 rounded-lg hover:bg-card transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="md:sticky md:top-36">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xs tracking-[0.2em] uppercase hidden md:block text-foreground/70">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-[10px] text-primary hover:underline uppercase tracking-wider">
                    Clear All ({activeFilterCount})
                  </button>
                )}
              </div>

              <FilterSection title="Brand">
                <div className="flex flex-wrap gap-1.5">
                  {brands.map(b => <FilterChip key={b} label={b} active={selectedBrands.includes(b)} onClick={() => toggleBrand(b)} />)}
                </div>
              </FilterSection>

              <FilterSection title="Category">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map(c => <FilterChip key={c} label={c} active={selectedCategory === c} onClick={() => setSelectedCategory(selectedCategory === c ? '' : c)} />)}
                </div>
              </FilterSection>

              <FilterSection title="Fuel Type">
                <div className="flex flex-wrap gap-1.5">
                  {fuelTypes.map(f => <FilterChip key={f} label={f} active={selectedFuel === f} onClick={() => setSelectedFuel(selectedFuel === f ? '' : f)} />)}
                </div>
              </FilterSection>

              <FilterSection title="Transmission" defaultOpen={false}>
                <div className="flex flex-wrap gap-1.5">
                  {transmissions.map(t => <FilterChip key={t} label={t} active={selectedTransmission === t} onClick={() => setSelectedTransmission(selectedTransmission === t ? '' : t)} />)}
                </div>
              </FilterSection>

              <FilterSection title="Drivetrain" defaultOpen={false}>
                <div className="flex flex-wrap gap-1.5">
                  {drivetrains.map(d => <FilterChip key={d} label={d} active={selectedDrivetrain === d} onClick={() => setSelectedDrivetrain(selectedDrivetrain === d ? '' : d)} />)}
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price Range" defaultOpen={false}>
                <div className="space-y-3">
                  <input
                    type="range"
                    min={5000000}
                    max={700000000}
                    step={10000000}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-primary h-1 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </FilterSection>

              {showFilters && (
                <button onClick={() => setShowFilters(false)} className="w-full mt-6 py-3 gold-gradient text-primary-foreground font-semibold text-sm rounded-xl md:hidden">
                  Show {filteredCars.length} Results
                </button>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Active filter tags */}
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-2 mb-6"
              >
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-1">Active:</span>
                {activeFilters.map(f => (
                  <button
                    key={f.label}
                    onClick={f.clear}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px] hover:bg-primary/20 transition-colors group"
                  >
                    {f.label}
                    <X className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
                <button onClick={clearFilters} className="text-[10px] text-muted-foreground hover:text-accent transition-colors ml-1">
                  Clear all
                </button>
              </motion.div>
            )}

            {filteredCars.length > 0 ? (
              <motion.div
                layout
                className={`grid gap-5 ${
                  viewMode === 'large'
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {filteredCars.map((car, i) => <CarCard key={car.id} car={car} index={i} />)}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24"
              >
                <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center mx-auto mb-5">
                  <Search className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl mb-2 text-foreground">No Cars Found</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                  Try adjusting your filters or search query to discover more vehicles.
                </p>
                <button onClick={clearFilters} className="px-6 py-2.5 text-xs uppercase tracking-wider border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
                  Reset Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
