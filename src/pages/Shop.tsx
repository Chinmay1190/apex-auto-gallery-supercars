import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import CarCard from '@/components/CarCard';
import { cars, brands, categories, fuelTypes, transmissions, drivetrains } from '@/data/cars';

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
  const [priceRange, setPriceRange] = useState<[number, number]>([20000000, 500000000]);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

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
    setPriceRange([20000000, 500000000]);
    setSearchQuery('');
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <h4 className="font-display text-xs tracking-wider uppercase text-foreground mb-3">{title}</h4>
      {children}
    </div>
  );

  const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick}
      className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
        active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
      }`}>{label}</button>
  );

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="section-padding py-8 md:py-12 border-b border-border/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-primary text-sm tracking-[0.3em] uppercase mb-2">Collection</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold">Our Supercars</h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 px-4 py-2 glass-panel text-sm text-foreground hover:border-primary/50 transition-colors md:hidden">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2 glass-panel text-sm bg-card border-border text-foreground rounded-xl">
                <option value="popular">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="speed">Top Speed</option>
                <option value="latest">Latest</option>
              </select>
            </div>
          </div>
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or brand..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
          </div>
        </div>
      </section>

      <div className="section-padding py-8">
        <div className="max-w-7xl mx-auto flex gap-8">
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-background p-6 overflow-y-auto' : 'hidden'} md:block md:relative md:w-64 md:flex-shrink-0`}>
            <div className="flex items-center justify-between mb-6 md:hidden">
              <h3 className="font-display text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-sm tracking-wider uppercase hidden md:block">Filters</h3>
              <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear All</button>
            </div>
            <FilterSection title="Brand">
              <div className="flex flex-wrap gap-2">
                {brands.map(b => <FilterChip key={b} label={b} active={selectedBrands.includes(b)} onClick={() => toggleBrand(b)} />)}
              </div>
            </FilterSection>
            <FilterSection title="Category">
              <div className="flex flex-wrap gap-2">
                {categories.map(c => <FilterChip key={c} label={c} active={selectedCategory === c} onClick={() => setSelectedCategory(selectedCategory === c ? '' : c)} />)}
              </div>
            </FilterSection>
            <FilterSection title="Fuel Type">
              <div className="flex flex-wrap gap-2">
                {fuelTypes.map(f => <FilterChip key={f} label={f} active={selectedFuel === f} onClick={() => setSelectedFuel(selectedFuel === f ? '' : f)} />)}
              </div>
            </FilterSection>
            <FilterSection title="Transmission">
              <div className="flex flex-wrap gap-2">
                {transmissions.map(t => <FilterChip key={t} label={t} active={selectedTransmission === t} onClick={() => setSelectedTransmission(selectedTransmission === t ? '' : t)} />)}
              </div>
            </FilterSection>
            <FilterSection title="Drivetrain">
              <div className="flex flex-wrap gap-2">
                {drivetrains.map(d => <FilterChip key={d} label={d} active={selectedDrivetrain === d} onClick={() => setSelectedDrivetrain(selectedDrivetrain === d ? '' : d)} />)}
              </div>
            </FilterSection>
            {showFilters && (
              <button onClick={() => setShowFilters(false)} className="w-full mt-4 py-3 gold-gradient text-primary-foreground font-semibold text-sm rounded-lg md:hidden">
                Show {filteredCars.length} Results
              </button>
            )}
          </aside>
          <div className="flex-1">
            <p className="text-muted-foreground text-sm mb-6">{filteredCars.length} supercar{filteredCars.length !== 1 ? 's' : ''} found</p>
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car, i) => <CarCard key={car.id} car={car} index={i} />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No cars match your criteria.</p>
                <button onClick={clearFilters} className="mt-4 text-primary text-sm hover:underline">Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
