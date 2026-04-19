import heroImg from '@/assets/hero-car.jpg';
import ferrariImg from '@/assets/car-ferrari.jpg';
import mclarenImg from '@/assets/car-mclaren.jpg';
import porscheImg from '@/assets/car-porsche.jpg';
import bugattiImg from '@/assets/car-bugatti.jpg';
import lamboImg from '@/assets/car-lambo.jpg';
import astonImg from '@/assets/car-aston.jpg';
import rollsImg from '@/assets/car-rolls.jpg';
import ferrari2Img from '@/assets/car-ferrari2.jpg';
import ferrari3Img from '@/assets/car-ferrari3.jpg';
import mclaren2Img from '@/assets/car-mclaren2.jpg';
import mclaren3Img from '@/assets/car-mclaren3.jpg';
import porsche2Img from '@/assets/car-porsche2.jpg';
import porsche3Img from '@/assets/car-porsche3.jpg';
import bugatti2Img from '@/assets/car-bugatti2.jpg';
import lambo2Img from '@/assets/car-lambo2.jpg';
import lambo3Img from '@/assets/car-lambo3.jpg';
import aston2Img from '@/assets/car-aston2.jpg';
import rolls2Img from '@/assets/car-rolls2.jpg';
import rolls3Img from '@/assets/car-rolls3.jpg';

// ============================================================
// Centralized exterior color names — single source of truth.
// Lookup is case-insensitive on the hex.
// ============================================================
const COLOR_NAMES: Record<string, string> = {
  '#FFD700': 'Giallo Gold',
  '#FF0000': 'Rosso Red',
  '#000000': 'Jet Black',
  '#FFFFFF': 'Pearl White',
  '#00FF00': 'Verde Mantis',
  '#0000FF': 'Royal Blue',
  '#0066FF': 'Azure Blue',
  '#FF6600': 'Papaya Orange',
  '#C0C0C0': 'Liquid Silver',
  '#006633': 'Racing Green',
  '#1A1A2E': 'Midnight Navy',
  '#8B0000': 'Maranello Maroon',
};

export const colorName = (hex: string): string => {
  if (!hex) return 'Custom';
  const upper = hex.toUpperCase();
  return COLOR_NAMES[upper] || COLOR_NAMES[hex] || upper;
};

// ============================================================
// Types
// ============================================================
export interface Car {
  id: string;
  name: string;
  brand: string;
  price: number;
  /** Default hero image (used when no per-color image is configured). */
  image: string;
  /** Optional gallery — extra angles for the detail page. */
  gallery?: string[];
  /** Optional per-color image map: hex → image. Detail page falls back
   *  to the layered tint overlay when a color is not in this map. */
  colorImages?: Record<string, string>;
  category: string;
  fuel: string;
  transmission: string;
  topSpeed: number;
  horsepower: number;
  seats: number;
  drivetrain: string;
  bodyType: string;
  engine: string;
  acceleration: string;
  torque: string;
  mileage: string;
  fuelTank: string;
  description: string;
  /** Short marketing line shown above the title. */
  tagline?: string;
  /** Notable awards / recognitions. */
  awards?: string[];
  /** Default true. False for sold-out / waitlist-only cars. */
  available?: boolean;
  /** Year the car was released (defaults to `year` when omitted). */
  releaseYear?: number;
  colors: string[];
  featured?: boolean;
  trending?: boolean;
  year: number;
}

// ============================================================
// Per-brand color-image presets.
// We reuse existing brand photos and assign each color a slightly
// different shot, so swapping colors actually swaps the image.
// ============================================================
const lamboColorImages: Record<string, string> = {
  '#FFD700': lamboImg,
  '#FF6600': lambo2Img,
  '#00FF00': lambo3Img,
  '#000000': lambo2Img,
  '#FFFFFF': lambo3Img,
};
const ferrariColorImages: Record<string, string> = {
  '#FF0000': ferrariImg,
  '#FFD700': ferrari2Img,
  '#000000': ferrari3Img,
  '#FFFFFF': ferrari2Img,
  '#0000FF': ferrari3Img,
};
const mclarenColorImages: Record<string, string> = {
  '#FF6600': mclarenImg,
  '#0066FF': mclaren2Img,
  '#000000': mclaren3Img,
  '#C0C0C0': mclaren2Img,
  '#FFFFFF': mclaren3Img,
};
const porscheColorImages: Record<string, string> = {
  '#C0C0C0': porscheImg,
  '#FFFFFF': porsche2Img,
  '#000000': porsche3Img,
  '#FF0000': porsche2Img,
  '#0066FF': porsche3Img,
};
const bugattiColorImages: Record<string, string> = {
  '#0066FF': bugattiImg,
  '#000000': bugatti2Img,
  '#C0C0C0': bugattiImg,
};
const astonColorImages: Record<string, string> = {
  '#006633': astonImg,
  '#000000': aston2Img,
  '#C0C0C0': astonImg,
  '#FF0000': aston2Img,
};
const rollsColorImages: Record<string, string> = {
  '#FFFFFF': rollsImg,
  '#000000': rolls2Img,
  '#1A1A2E': rolls3Img,
  '#8B0000': rolls2Img,
  '#FFD700': rolls3Img,
};

const colorImagesForBrand: Record<string, Record<string, string>> = {
  Lamborghini: lamboColorImages,
  Ferrari: ferrariColorImages,
  McLaren: mclarenColorImages,
  Porsche: porscheColorImages,
  Bugatti: bugattiColorImages,
  'Aston Martin': astonColorImages,
  'Rolls-Royce': rollsColorImages,
};

// ============================================================
// Cars
// ============================================================
const carsRaw: Car[] = [
  { id: "1", name: "Aventador SVJ", brand: "Lamborghini", price: 85000000, image: lamboImg, category: "Hypercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 350, horsepower: 770, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "6.5L V12", acceleration: "2.8s", torque: "720 Nm", mileage: "5.5 km/l", fuelTank: "90L", description: "The Lamborghini Aventador SVJ represents the pinnacle of Lamborghini's super sports car legacy.", tagline: "Naturally aspirated. Unapologetically loud.", awards: ["Nürburgring Production Lap Record", "Top Gear Hypercar of the Year"], colors: ["#FFD700", "#FF0000", "#000000", "#FFFFFF", "#00FF00"], featured: true, trending: true, year: 2024 },
  { id: "2", name: "SF90 Stradale", brand: "Ferrari", price: 75000000, image: ferrariImg, category: "Luxury Supercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 340, horsepower: 986, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "4.0L V8 Hybrid", acceleration: "2.5s", torque: "800 Nm", mileage: "6.5 km/l", fuelTank: "68L", description: "Ferrari's first plug-in hybrid, combining a twin-turbo V8 with three electric motors.", tagline: "Ferrari's first PHEV. Three motors. One legend.", awards: ["Robb Report Car of the Year"], colors: ["#FF0000", "#FFD700", "#000000", "#FFFFFF", "#0000FF"], featured: true, trending: true, year: 2024 },
  { id: "3", name: "720S", brand: "McLaren", price: 55000000, image: mclarenImg, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 341, horsepower: 710, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "4.0L Twin-Turbo V8", acceleration: "2.9s", torque: "770 Nm", mileage: "7.0 km/l", fuelTank: "72L", description: "The McLaren 720S redefines the supercar segment with breathtaking performance.", tagline: "Carbon fibre engineering, race-bred dynamics.", colors: ["#FF6600", "#000000", "#C0C0C0", "#FFFFFF", "#0066FF"], featured: true, trending: true, year: 2024 },
  { id: "4", name: "911 GT3 RS", brand: "Porsche", price: 38000000, image: porscheImg, category: "Track Edition", fuel: "Petrol", transmission: "Automatic", topSpeed: 312, horsepower: 518, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "4.0L Flat-6", acceleration: "3.2s", torque: "465 Nm", mileage: "8.0 km/l", fuelTank: "64L", description: "A track-focused masterpiece that brings motorsport technology to the road.", tagline: "Born on the Nürburgring. Bred for the road.", awards: ["Nürburgring Sub-7 Minute Lap"], colors: ["#C0C0C0", "#FFFFFF", "#000000", "#FF0000", "#00FF00"], featured: true, year: 2024 },
  { id: "5", name: "Chiron Super Sport", brand: "Bugatti", price: 350000000, image: bugattiImg, category: "Hypercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 440, horsepower: 1578, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "8.0L Quad-Turbo W16", acceleration: "2.4s", torque: "1600 Nm", mileage: "3.5 km/l", fuelTank: "100L", description: "The ultimate expression of speed and luxury.", tagline: "440 km/h. The fastest production car ever made.", colors: ["#0066FF", "#000000", "#C0C0C0", "#FF0000", "#FFFFFF"], featured: true, trending: true, year: 2024 },
  { id: "6", name: "Vantage V8", brand: "Aston Martin", price: 32000000, image: astonImg, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 314, horsepower: 503, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "4.0L Twin-Turbo V8", acceleration: "3.6s", torque: "685 Nm", mileage: "9.0 km/l", fuelTank: "73L", description: "British elegance meets raw performance in a stunning grand tourer.", tagline: "British muscle in a tailored suit.", colors: ["#006633", "#000000", "#C0C0C0", "#FF0000", "#0000FF"], trending: true, year: 2024 },
  { id: "7", name: "Ghost Black Badge", brand: "Rolls-Royce", price: 120000000, image: rollsImg, category: "Limited Editions", fuel: "Petrol", transmission: "Automatic", topSpeed: 250, horsepower: 592, seats: 5, drivetrain: "AWD", bodyType: "Sedan", engine: "6.75L Twin-Turbo V12", acceleration: "4.8s", torque: "900 Nm", mileage: "6.0 km/l", fuelTank: "82L", description: "The most powerful Ghost ever, wrapped in the darkest expression.", tagline: "The dark side of luxury.", colors: ["#FFFFFF", "#000000", "#1A1A2E", "#8B0000", "#FFD700"], featured: true, year: 2024 },
  { id: "8", name: "Huracán EVO", brand: "Lamborghini", price: 45000000, image: lambo3Img, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 325, horsepower: 630, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "5.2L V10", acceleration: "2.9s", torque: "600 Nm", mileage: "7.0 km/l", fuelTank: "83L", description: "The Huracán EVO takes the iconic V10 to new heights.", tagline: "Evolution of the iconic V10.", colors: ["#FFD700", "#FF6600", "#00FF00", "#000000", "#FFFFFF"], trending: true, year: 2024 },
  { id: "9", name: "F8 Tributo", brand: "Ferrari", price: 58000000, image: ferrari2Img, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 340, horsepower: 710, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "3.9L Twin-Turbo V8", acceleration: "2.9s", torque: "770 Nm", mileage: "7.2 km/l", fuelTank: "78L", description: "The F8 Tributo is the most powerful V8 in Ferrari history, a tribute to the brand's excellence.", tagline: "A tribute to Ferrari's most successful V8.", colors: ["#FF0000", "#FFD700", "#000000", "#FFFFFF"], featured: true, year: 2024 },
  { id: "10", name: "Roma", brand: "Ferrari", price: 42000000, image: ferrari3Img, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 320, horsepower: 612, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "3.9L Twin-Turbo V8", acceleration: "3.4s", torque: "760 Nm", mileage: "8.0 km/l", fuelTank: "80L", description: "La Nuova Dolce Vita. The Ferrari Roma embodies timeless Italian elegance.", tagline: "La Nuova Dolce Vita.", colors: ["#0000FF", "#FF0000", "#C0C0C0", "#FFFFFF"], trending: true, year: 2024 },
  { id: "11", name: "296 GTB", brand: "Ferrari", price: 52000000, image: ferrariImg, category: "Luxury Supercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 330, horsepower: 819, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "3.0L V6 Hybrid", acceleration: "2.9s", torque: "740 Nm", mileage: "7.5 km/l", fuelTank: "65L", description: "The 296 GTB introduces a new chapter with the first V6 hybrid.", tagline: "The fun-to-drive hybrid Ferrari.", colors: ["#FF0000", "#FFD700", "#000000"], year: 2024 },
  { id: "12", name: "Urus Performante", brand: "Lamborghini", price: 48000000, image: lambo2Img, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 306, horsepower: 666, seats: 5, drivetrain: "AWD", bodyType: "SUV", engine: "4.0L Twin-Turbo V8", acceleration: "3.3s", torque: "850 Nm", mileage: "6.5 km/l", fuelTank: "85L", description: "The world's first Super Sport Utility Vehicle gets even more extreme.", tagline: "The Super SUV, sharpened.", colors: ["#FFD700", "#000000", "#FFFFFF", "#FF0000"], featured: true, trending: true, year: 2024 },
  { id: "13", name: "Revuelto", brand: "Lamborghini", price: 95000000, image: lamboImg, category: "Hypercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 350, horsepower: 1001, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "6.5L V12 Hybrid", acceleration: "2.5s", torque: "725 Nm", mileage: "5.0 km/l", fuelTank: "82L", description: "The first HPEV (High Performance Electrified Vehicle) from Lamborghini.", tagline: "The V12 reborn — electrified.", awards: ["Best Hypercar 2024 — Top Gear"], colors: ["#00FF00", "#FFD700", "#000000", "#0000FF"], featured: true, year: 2025 },
  { id: "14", name: "Sián FKP 37", brand: "Lamborghini", price: 280000000, image: lambo3Img, category: "Limited Editions", fuel: "Hybrid", transmission: "Automatic", topSpeed: 350, horsepower: 819, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "6.5L V12 Hybrid", acceleration: "2.8s", torque: "720 Nm", mileage: "5.2 km/l", fuelTank: "90L", description: "Limited to just 63 units, the Sián is the rarest Lamborghini ever.", tagline: "63 units worldwide. None for sale to mortals.", available: false, colors: ["#00FF00", "#FFD700"], year: 2024 },
  { id: "15", name: "Artura", brand: "McLaren", price: 38000000, image: mclaren2Img, category: "Luxury Supercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 330, horsepower: 671, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "3.0L V6 Hybrid", acceleration: "3.0s", torque: "720 Nm", mileage: "8.5 km/l", fuelTank: "66L", description: "McLaren's all-new high-performance hybrid supercar.", tagline: "A new era for McLaren begins.", colors: ["#0066FF", "#FF6600", "#000000", "#FFFFFF"], trending: true, year: 2024 },
  { id: "16", name: "765LT Spider", brand: "McLaren", price: 65000000, image: mclaren3Img, category: "Convertible Series", fuel: "Petrol", transmission: "Automatic", topSpeed: 330, horsepower: 755, seats: 2, drivetrain: "RWD", bodyType: "Convertible", engine: "4.0L Twin-Turbo V8", acceleration: "2.8s", torque: "800 Nm", mileage: "6.8 km/l", fuelTank: "72L", description: "The most powerful LT convertible, engineered to thrill.", tagline: "Open the sky. Open the throttle.", colors: ["#FF6600", "#000000", "#C0C0C0"], featured: true, year: 2024 },
  { id: "17", name: "GT", brand: "McLaren", price: 45000000, image: mclarenImg, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 326, horsepower: 612, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "4.0L Twin-Turbo V8", acceleration: "3.2s", torque: "630 Nm", mileage: "8.2 km/l", fuelTank: "72L", description: "The McLaren GT redefines the grand touring segment.", tagline: "A McLaren you can take anywhere.", colors: ["#C0C0C0", "#000000", "#0066FF", "#FF0000"], year: 2024 },
  { id: "18", name: "750S", brand: "McLaren", price: 58000000, image: mclaren2Img, category: "Track Edition", fuel: "Petrol", transmission: "Automatic", topSpeed: 332, horsepower: 740, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "4.0L Twin-Turbo V8", acceleration: "2.8s", torque: "800 Nm", mileage: "7.0 km/l", fuelTank: "72L", description: "Successor to the 720S, the 750S raises the bar even further.", tagline: "The bar, raised again.", colors: ["#0066FF", "#FF6600", "#000000"], trending: true, year: 2025 },
  { id: "19", name: "911 Turbo S", brand: "Porsche", price: 35000000, image: porsche3Img, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 330, horsepower: 640, seats: 4, drivetrain: "AWD", bodyType: "Coupe", engine: "3.8L Twin-Turbo Flat-6", acceleration: "2.7s", torque: "800 Nm", mileage: "8.5 km/l", fuelTank: "68L", description: "The benchmark for everyday supercars. Brutal speed, daily usability.", tagline: "The benchmark, redefined.", colors: ["#FF0000", "#C0C0C0", "#000000", "#FFFFFF"], featured: true, year: 2024 },
  { id: "20", name: "Taycan Turbo S", brand: "Porsche", price: 25000000, image: porsche2Img, category: "Electric Supercars", fuel: "Electric", transmission: "Automatic", topSpeed: 260, horsepower: 750, seats: 4, drivetrain: "AWD", bodyType: "Sedan", engine: "Dual Electric Motors", acceleration: "2.8s", torque: "1050 Nm", mileage: "3.8 km/kWh", fuelTank: "93.4 kWh", description: "The electric Porsche that drives like a true sports car.", tagline: "Soul, electrified.", colors: ["#FFFFFF", "#000000", "#C0C0C0", "#0066FF"], trending: true, year: 2024 },
  { id: "21", name: "Cayenne Turbo GT", brand: "Porsche", price: 28000000, image: porscheImg, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 300, horsepower: 631, seats: 5, drivetrain: "AWD", bodyType: "SUV", engine: "4.0L Twin-Turbo V8", acceleration: "3.3s", torque: "850 Nm", mileage: "7.0 km/l", fuelTank: "90L", description: "The fastest SUV on the Nürburgring. Porsche DNA in SUV form.", tagline: "Family hauler. Track destroyer.", colors: ["#C0C0C0", "#000000", "#FFFFFF", "#FF0000"], year: 2024 },
  { id: "22", name: "718 Cayman GT4 RS", brand: "Porsche", price: 22000000, image: porsche3Img, category: "Track Edition", fuel: "Petrol", transmission: "Automatic", topSpeed: 315, horsepower: 493, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "4.0L Flat-6", acceleration: "3.4s", torque: "450 Nm", mileage: "9.0 km/l", fuelTank: "64L", description: "The purest mid-engine driving experience from Porsche.", tagline: "Mid-engine purity.", colors: ["#FFD700", "#000000", "#FFFFFF", "#FF0000"], year: 2024 },
  { id: "23", name: "Divo", brand: "Bugatti", price: 450000000, image: bugatti2Img, category: "Hypercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 380, horsepower: 1500, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "8.0L Quad-Turbo W16", acceleration: "2.4s", torque: "1600 Nm", mileage: "3.2 km/l", fuelTank: "100L", description: "Limited to 40 units. Focused on agility over top speed.", tagline: "Agility over absolute speed.", available: false, colors: ["#000000", "#0066FF", "#C0C0C0"], featured: true, year: 2024 },
  { id: "24", name: "Centodieci", brand: "Bugatti", price: 650000000, image: bugattiImg, category: "Limited Editions", fuel: "Petrol", transmission: "Automatic", topSpeed: 380, horsepower: 1600, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "8.0L Quad-Turbo W16", acceleration: "2.4s", torque: "1600 Nm", mileage: "3.0 km/l", fuelTank: "100L", description: "A tribute to the iconic EB110, limited to just 10 units worldwide.", tagline: "10 units. A tribute to the EB110.", available: false, colors: ["#FFFFFF", "#000000"], year: 2024 },
  { id: "25", name: "Mistral", brand: "Bugatti", price: 500000000, image: bugatti2Img, category: "Convertible Series", fuel: "Petrol", transmission: "Automatic", topSpeed: 420, horsepower: 1577, seats: 2, drivetrain: "AWD", bodyType: "Convertible", engine: "8.0L Quad-Turbo W16", acceleration: "2.4s", torque: "1600 Nm", mileage: "3.3 km/l", fuelTank: "100L", description: "The final W16 roadster — the ultimate open-top Bugatti.", tagline: "The final W16. The ultimate roadster.", colors: ["#0066FF", "#000000", "#C0C0C0"], year: 2024 },
  { id: "26", name: "DB11 AMR", brand: "Aston Martin", price: 40000000, image: aston2Img, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 334, horsepower: 630, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "5.2L Twin-Turbo V12", acceleration: "3.7s", torque: "700 Nm", mileage: "8.5 km/l", fuelTank: "78L", description: "The DB11 AMR delivers more power and more soul.", tagline: "More power. More soul.", colors: ["#C0C0C0", "#006633", "#000000", "#FFFFFF"], featured: true, year: 2024 },
  { id: "27", name: "DBS Superleggera", brand: "Aston Martin", price: 55000000, image: astonImg, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 340, horsepower: 715, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "5.2L Twin-Turbo V12", acceleration: "3.4s", torque: "900 Nm", mileage: "7.5 km/l", fuelTank: "78L", description: "The most powerful production Aston Martin ever.", tagline: "The most powerful production Aston ever.", colors: ["#006633", "#000000", "#FF0000", "#C0C0C0"], trending: true, year: 2024 },
  { id: "28", name: "Valkyrie", brand: "Aston Martin", price: 280000000, image: aston2Img, category: "Hypercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 402, horsepower: 1160, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "6.5L V12 Hybrid", acceleration: "2.5s", torque: "900 Nm", mileage: "4.0 km/l", fuelTank: "90L", description: "Formula 1 technology for the road. Born from Red Bull Racing partnership.", tagline: "F1 for the road.", available: false, colors: ["#006633", "#000000", "#C0C0C0"], year: 2024 },
  { id: "29", name: "DBX707", brand: "Aston Martin", price: 38000000, image: astonImg, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 310, horsepower: 697, seats: 5, drivetrain: "AWD", bodyType: "SUV", engine: "4.0L Twin-Turbo V8", acceleration: "3.3s", torque: "900 Nm", mileage: "7.8 km/l", fuelTank: "85L", description: "The world's most powerful luxury SUV.", tagline: "The world's most powerful luxury SUV.", colors: ["#000000", "#C0C0C0", "#006633", "#FFFFFF"], year: 2024 },
  { id: "30", name: "Spectre", brand: "Rolls-Royce", price: 95000000, image: rolls2Img, category: "Electric Supercars", fuel: "Electric", transmission: "Automatic", topSpeed: 250, horsepower: 577, seats: 4, drivetrain: "AWD", bodyType: "Coupe", engine: "Dual Electric Motors", acceleration: "4.5s", torque: "900 Nm", mileage: "3.2 km/kWh", fuelTank: "102 kWh", description: "The first fully electric Rolls-Royce. Silent luxury redefined.", tagline: "Silent luxury, redefined.", colors: ["#1A1A2E", "#FFFFFF", "#000000", "#FFD700"], featured: true, trending: true, year: 2024 },
  { id: "31", name: "Cullinan Black Badge", brand: "Rolls-Royce", price: 85000000, image: rolls3Img, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 250, horsepower: 592, seats: 5, drivetrain: "AWD", bodyType: "SUV", engine: "6.75L Twin-Turbo V12", acceleration: "5.0s", torque: "900 Nm", mileage: "5.5 km/l", fuelTank: "100L", description: "The most opulent SUV in the world gets the Black Badge treatment.", tagline: "The dark side of opulence.", colors: ["#FFFFFF", "#000000", "#1A1A2E"], year: 2024 },
  { id: "32", name: "Phantom Extended", brand: "Rolls-Royce", price: 130000000, image: rollsImg, category: "Limited Editions", fuel: "Petrol", transmission: "Automatic", topSpeed: 250, horsepower: 563, seats: 5, drivetrain: "AWD", bodyType: "Sedan", engine: "6.75L Twin-Turbo V12", acceleration: "5.3s", torque: "900 Nm", mileage: "5.8 km/l", fuelTank: "82L", description: "The pinnacle of Rolls-Royce. The best car in the world.", tagline: "The best car in the world.", colors: ["#FFFFFF", "#000000", "#FFD700", "#8B0000"], featured: true, year: 2024 },
  { id: "33", name: "Dawn Silver Bullet", brand: "Rolls-Royce", price: 110000000, image: rolls2Img, category: "Convertible Series", fuel: "Petrol", transmission: "Automatic", topSpeed: 250, horsepower: 563, seats: 4, drivetrain: "RWD", bodyType: "Convertible", engine: "6.75L Twin-Turbo V12", acceleration: "4.9s", torque: "820 Nm", mileage: "5.6 km/l", fuelTank: "82L", description: "Limited to 50 units. An open-top silver bullet of luxury.", tagline: "An open-top silver bullet.", available: false, colors: ["#C0C0C0", "#000000"], year: 2024 },
  { id: "34", name: "Huracán Tecnica", brand: "Lamborghini", price: 42000000, image: lamboImg, category: "Track Edition", fuel: "Petrol", transmission: "Automatic", topSpeed: 325, horsepower: 631, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "5.2L V10", acceleration: "3.2s", torque: "565 Nm", mileage: "7.2 km/l", fuelTank: "83L", description: "Next-gen rear-wheel drive Huracán designed for road and track.", tagline: "Road. Track. Both. Absolute.", colors: ["#FFD700", "#000000", "#FF6600", "#FFFFFF"], year: 2024 },
  { id: "35", name: "Huracán STO", brand: "Lamborghini", price: 55000000, image: lambo3Img, category: "Track Edition", fuel: "Petrol", transmission: "Automatic", topSpeed: 310, horsepower: 631, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "5.2L V10", acceleration: "3.0s", torque: "565 Nm", mileage: "6.8 km/l", fuelTank: "80L", description: "Super Trofeo Omologata — a race car for the road.", tagline: "A race car, road-legal.", colors: ["#0066FF", "#FFD700", "#000000"], trending: true, year: 2024 },
  { id: "36", name: "Urus S", brand: "Lamborghini", price: 42000000, image: lambo2Img, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 305, horsepower: 657, seats: 5, drivetrain: "AWD", bodyType: "SUV", engine: "4.0L Twin-Turbo V8", acceleration: "3.5s", torque: "850 Nm", mileage: "6.8 km/l", fuelTank: "85L", description: "The Urus S offers a more refined take on the Super SUV.", tagline: "Refined. Still ferocious.", colors: ["#000000", "#FFFFFF", "#FFD700", "#FF0000"], year: 2024 },
  { id: "37", name: "812 Competizione", brand: "Ferrari", price: 68000000, image: ferrariImg, category: "Limited Editions", fuel: "Petrol", transmission: "Automatic", topSpeed: 340, horsepower: 819, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "6.5L V12", acceleration: "2.85s", torque: "692 Nm", mileage: "5.0 km/l", fuelTank: "92L", description: "The most powerful naturally aspirated V12 Ferrari. Limited and radical.", tagline: "The naturally aspirated V12, perfected.", available: false, colors: ["#FF0000", "#FFD700", "#000000"], year: 2024 },
  { id: "38", name: "Purosangue", brand: "Ferrari", price: 65000000, image: ferrari2Img, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 310, horsepower: 715, seats: 4, drivetrain: "AWD", bodyType: "SUV", engine: "6.5L V12", acceleration: "3.3s", torque: "716 Nm", mileage: "6.0 km/l", fuelTank: "100L", description: "Ferrari's first four-door four-seater. Not an SUV — a Ferrari.", tagline: "Not an SUV. A Ferrari.", colors: ["#FF0000", "#000000", "#C0C0C0", "#FFFFFF"], featured: true, year: 2024 },
  { id: "39", name: "Panamera Turbo S", brand: "Porsche", price: 30000000, image: porsche2Img, category: "Luxury Supercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 315, horsepower: 690, seats: 4, drivetrain: "AWD", bodyType: "Sedan", engine: "4.0L V8 Hybrid", acceleration: "3.2s", torque: "900 Nm", mileage: "7.5 km/l", fuelTank: "80L", description: "The ultimate sports sedan from Porsche. Four doors, no compromise.", tagline: "Four doors. No compromise.", colors: ["#FFFFFF", "#000000", "#C0C0C0"], year: 2025 },
  { id: "40", name: "Valhalla", brand: "Aston Martin", price: 150000000, image: aston2Img, category: "Hypercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 350, horsepower: 937, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "4.0L V8 Hybrid", acceleration: "2.5s", torque: "1000 Nm", mileage: "5.5 km/l", fuelTank: "90L", description: "Mid-engine hybrid hypercar. The new flagship of Aston Martin.", tagline: "Aston Martin's new flagship.", colors: ["#006633", "#000000", "#C0C0C0"], year: 2025 },
];

export const cars: Car[] = carsRaw.map((c) => {
  // Auto-attach brand color image presets so each color swatch swaps the photo.
  const preset = colorImagesForBrand[c.brand] || {};
  const colorImages: Record<string, string> = {};
  c.colors.forEach((hex) => {
    const u = hex.toUpperCase();
    if (preset[u]) colorImages[u] = preset[u];
    else if (preset[hex]) colorImages[hex] = preset[hex];
  });
  return {
    ...c,
    colorImages: Object.keys(colorImages).length > 0 ? colorImages : undefined,
    available: c.available ?? true,
    releaseYear: c.releaseYear ?? c.year,
  };
});

// ============================================================
// Reference lists
// ============================================================
export const brands = ["Lamborghini", "Ferrari", "McLaren", "Porsche", "Bugatti", "Aston Martin", "Rolls-Royce"];
export const categories = ["Hypercars", "Luxury Supercars", "Electric Supercars", "Track Edition", "Convertible Series", "Limited Editions"];
export const fuelTypes = ["Petrol", "Hybrid", "Electric"];
export const transmissions = ["Automatic", "Manual"];
export const drivetrains = ["RWD", "AWD"];
export const bodyTypes = ["Coupe", "Sedan", "Convertible", "SUV"];

export const marqueBrands = ["Lamborghini", "Ferrari", "McLaren", "Porsche", "Bugatti", "Aston Martin", "Rolls-Royce", "Maserati", "Bentley", "Koenigsegg", "Pagani"];

// ============================================================
// Brand logos
// ============================================================
import logoLambo from '@/assets/logo-lamborghini.png';
import logoFerrari from '@/assets/logo-ferrari.png';
import logoMclaren from '@/assets/logo-mclaren.png';
import logoPorsche from '@/assets/logo-porsche.png';
import logoBugatti from '@/assets/logo-bugatti.png';
import logoAston from '@/assets/logo-aston.png';
import logoRolls from '@/assets/logo-rolls.png';

export const brandLogos: Record<string, string> = {
  'Lamborghini': logoLambo,
  'Ferrari': logoFerrari,
  'McLaren': logoMclaren,
  'Porsche': logoPorsche,
  'Bugatti': logoBugatti,
  'Aston Martin': logoAston,
  'Rolls-Royce': logoRolls,
};

// ============================================================
// Formatting & helpers
// ============================================================
export const formatPrice = (price: number): string => {
  return '₹' + (price || 0).toLocaleString('en-IN');
};

/** Get the right image for a car given a selected color hex.
 *  Falls back to the car's default image when no per-color image exists. */
export const getCarImageForColor = (car: Car, hex: string): string => {
  if (!car.colorImages) return car.image;
  return car.colorImages[hex.toUpperCase()] || car.colorImages[hex] || car.image;
};

export const getCarById = (id: string): Car | undefined =>
  cars.find((c) => c.id === id);

export const getCarsByBrand = (brand: string): Car[] =>
  cars.filter((c) => c.brand === brand);

export const getCarsByCategory = (category: string): Car[] =>
  cars.filter((c) => c.category === category);

export const getFeaturedCars = (limit?: number): Car[] => {
  const list = cars.filter((c) => c.featured);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
};

export const getTrendingCars = (limit?: number): Car[] => {
  const list = cars.filter((c) => c.trending);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
};

/** Related cars: same category first, then same brand, excluding the current car. */
export const getRelatedCars = (carId: string, limit = 4): Car[] => {
  const car = getCarById(carId);
  if (!car) return [];
  const sameCategory = cars.filter((c) => c.id !== carId && c.category === car.category);
  const sameBrand = cars.filter(
    (c) => c.id !== carId && c.brand === car.brand && c.category !== car.category,
  );
  const seen = new Set<string>();
  const out: Car[] = [];
  [...sameCategory, ...sameBrand].forEach((c) => {
    if (!seen.has(c.id)) { seen.add(c.id); out.push(c); }
  });
  return out.slice(0, limit);
};

/** Pick the first car image for a category (used on category index pages). */
export const getCategoryImage = (category: string): string | undefined => {
  return getCarsByCategory(category)[0]?.image;
};
