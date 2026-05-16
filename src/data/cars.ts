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
// New 2025 catalog additions
import maseratiMc20Img from '@/assets/car-maserati-mc20.jpg';
import maseratiGtImg from '@/assets/car-maserati-gt.jpg';
import bentleyGtImg from '@/assets/car-bentley-gt.jpg';
import bentleyBacalarImg from '@/assets/car-bentley-bacalar.jpg';
import koenigseggJeskoImg from '@/assets/car-koenigsegg-jesko.jpg';
import koenigseggGemeraImg from '@/assets/car-koenigsegg-gemera.jpg';
import paganiHuayraImg from '@/assets/car-pagani-huayra.jpg';
import paganiUtopiaImg from '@/assets/car-pagani-utopia.jpg';
import amgBlackImg from '@/assets/car-amg-black.jpg';
import amgOneImg from '@/assets/car-amg-one.jpg';
import mclarenSennaImg from '@/assets/car-mclaren-senna.jpg';
import mclarenSpeedtailImg from '@/assets/car-mclaren-speedtail.jpg';
import porscheCgtImg from '@/assets/car-porsche-cgt.jpg';
import ferrariMonzaImg from '@/assets/car-ferrari-monza.jpg';
import lamboCountachImg from '@/assets/car-lambo-countach.jpg';
import bugattiTourbillonImg from '@/assets/car-bugatti-tourbillon.jpg';
import rollsBoatTailImg from '@/assets/car-rolls-boattail.jpg';
import rimacNeveraImg from '@/assets/car-rimac-nevera.jpg';
import lotusEvijaImg from '@/assets/car-lotus-evija.jpg';
import astonValhallaImg from '@/assets/car-aston-valhalla.jpg';

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
  { id: "40", name: "Valhalla", brand: "Aston Martin", price: 150000000, image: astonValhallaImg, category: "Hypercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 350, horsepower: 937, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "4.0L V8 Hybrid", acceleration: "2.5s", torque: "1000 Nm", mileage: "5.5 km/l", fuelTank: "90L", description: "Mid-engine hybrid hypercar. The new flagship of Aston Martin.", tagline: "Aston Martin's new flagship.", colors: ["#00FF00", "#000000", "#C0C0C0"], year: 2025 },
  // ===== NEW 2025 ARRIVALS =====
  { id: "41", name: "MC20", brand: "Maserati", price: 32000000, image: maseratiMc20Img, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 325, horsepower: 621, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "3.0L Twin-Turbo V6", acceleration: "2.9s", torque: "730 Nm", mileage: "8.0 km/l", fuelTank: "60L", description: "Maserati's reborn supercar with the all-new Nettuno engine.", tagline: "The Trident, reignited.", colors: ["#FFFFFF", "#000000", "#FF0000", "#FFD700"], featured: true, trending: true, year: 2025 },
  { id: "42", name: "GranTurismo Trofeo", brand: "Maserati", price: 22000000, image: maseratiGtImg, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 320, horsepower: 542, seats: 4, drivetrain: "AWD", bodyType: "Coupe", engine: "3.0L Twin-Turbo V6", acceleration: "3.5s", torque: "650 Nm", mileage: "8.5 km/l", fuelTank: "65L", description: "The grand tourer reinvented for a new era of Italian elegance.", tagline: "Italian elegance, reborn.", colors: ["#0000FF", "#000000", "#FFFFFF", "#C0C0C0"], trending: true, year: 2025 },
  { id: "43", name: "Continental GT Speed", brand: "Bentley", price: 38000000, image: bentleyGtImg, category: "Luxury Supercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 335, horsepower: 650, seats: 4, drivetrain: "AWD", bodyType: "Coupe", engine: "6.0L Twin-Turbo W12", acceleration: "3.5s", torque: "900 Nm", mileage: "6.5 km/l", fuelTank: "90L", description: "The most dynamic Bentley ever — a grand tourer with supercar pace.", tagline: "Crafted ferocity.", colors: ["#000000", "#FFFFFF", "#1A1A2E", "#8B0000"], featured: true, year: 2025 },
  { id: "44", name: "Bacalar", brand: "Bentley", price: 180000000, image: bentleyBacalarImg, category: "Convertible Series", fuel: "Petrol", transmission: "Automatic", topSpeed: 320, horsepower: 650, seats: 2, drivetrain: "AWD", bodyType: "Convertible", engine: "6.0L Twin-Turbo W12", acceleration: "3.5s", torque: "900 Nm", mileage: "6.0 km/l", fuelTank: "90L", description: "Limited to 12 units. Mulliner coachbuilt open-top exclusivity.", tagline: "12 cars. Infinite craftsmanship.", available: false, colors: ["#FFD700", "#1A1A2E"], year: 2025 },
  { id: "45", name: "Jesko Absolut", brand: "Koenigsegg", price: 280000000, image: koenigseggJeskoImg, category: "Hypercars", fuel: "Petrol", transmission: "Automatic", topSpeed: 480, horsepower: 1600, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "5.0L Twin-Turbo V8", acceleration: "2.5s", torque: "1500 Nm", mileage: "4.0 km/l", fuelTank: "70L", description: "Engineered to be the fastest production car ever made.", tagline: "Built for one purpose: pure speed.", awards: ["Theoretical Top Speed: 532 km/h"], colors: ["#C0C0C0", "#000000"], featured: true, trending: true, year: 2025 },
  { id: "46", name: "Gemera", brand: "Koenigsegg", price: 170000000, image: koenigseggGemeraImg, category: "Hypercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 400, horsepower: 1700, seats: 4, drivetrain: "AWD", bodyType: "Coupe", engine: "2.0L Twin-Turbo I3 Hybrid", acceleration: "1.9s", torque: "2750 Nm", mileage: "5.5 km/l", fuelTank: "75L", description: "The world's first Mega-GT. Four seats, no compromise.", tagline: "The Mega-GT.", colors: ["#FF0000", "#000000", "#C0C0C0"], featured: true, year: 2025 },
  { id: "47", name: "Huayra R", brand: "Pagani", price: 320000000, image: paganiHuayraImg, category: "Track Edition", fuel: "Petrol", transmission: "Automatic", topSpeed: 380, horsepower: 850, seats: 1, drivetrain: "RWD", bodyType: "Coupe", engine: "6.0L NA V12", acceleration: "2.7s", torque: "750 Nm", mileage: "3.5 km/l", fuelTank: "80L", description: "Track-only naturally aspirated V12 masterpiece. No regulations, just emotion.", tagline: "Unrestricted by regulations.", available: false, colors: ["#000000", "#FF0000"], year: 2025 },
  { id: "48", name: "Utopia", brand: "Pagani", price: 250000000, image: paganiUtopiaImg, category: "Hypercars", fuel: "Petrol", transmission: "Manual", topSpeed: 360, horsepower: 864, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "6.0L Twin-Turbo V12", acceleration: "2.8s", torque: "1100 Nm", mileage: "4.5 km/l", fuelTank: "85L", description: "Pagani's escape from complexity. A true analog hypercar.", tagline: "An ode to mechanical purity.", awards: ["Best Hypercar Design 2024"], colors: ["#FFD700", "#C0C0C0", "#000000"], featured: true, trending: true, year: 2025 },
  { id: "49", name: "AMG GT Black Series", brand: "Mercedes-AMG", price: 32000000, image: amgBlackImg, category: "Track Edition", fuel: "Petrol", transmission: "Automatic", topSpeed: 325, horsepower: 730, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "4.0L Twin-Turbo V8", acceleration: "3.2s", torque: "800 Nm", mileage: "7.0 km/l", fuelTank: "75L", description: "The most powerful AMG V8 ever. Built to dominate the Nürburgring.", tagline: "Born from the Green Hell.", awards: ["Nürburgring Production Car Lap Record (2020)"], colors: ["#000000", "#FFD700", "#C0C0C0"], featured: true, year: 2025 },
  { id: "50", name: "AMG One", brand: "Mercedes-AMG", price: 280000000, image: amgOneImg, category: "Hypercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 352, horsepower: 1063, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "1.6L Turbo V6 F1 Hybrid", acceleration: "2.9s", torque: "1100 Nm", mileage: "5.0 km/l", fuelTank: "60L", description: "An actual Formula 1 power unit, road-legal. The closest thing to F1 you can drive.", tagline: "F1, in your driveway.", available: false, colors: ["#C0C0C0", "#000000"], trending: true, year: 2025 },
  { id: "51", name: "Senna", brand: "McLaren", price: 75000000, image: mclarenSennaImg, category: "Track Edition", fuel: "Petrol", transmission: "Automatic", topSpeed: 340, horsepower: 800, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "4.0L Twin-Turbo V8", acceleration: "2.8s", torque: "800 Nm", mileage: "6.0 km/l", fuelTank: "72L", description: "Named after the legend. Built without compromise for circuit dominance.", tagline: "Function before form.", available: false, colors: ["#FF6600", "#000000"], year: 2025 },
  { id: "52", name: "Speedtail", brand: "McLaren", price: 220000000, image: mclarenSpeedtailImg, category: "Limited Editions", fuel: "Hybrid", transmission: "Automatic", topSpeed: 403, horsepower: 1055, seats: 3, drivetrain: "RWD", bodyType: "Coupe", engine: "4.0L Twin-Turbo V8 Hybrid", acceleration: "2.5s", torque: "1150 Nm", mileage: "5.5 km/l", fuelTank: "70L", description: "The spiritual successor to the F1. Three seats, central driving position.", tagline: "The fastest McLaren ever produced.", available: false, colors: ["#C0C0C0", "#000000"], featured: true, year: 2025 },
  { id: "53", name: "Carrera GT", brand: "Porsche", price: 95000000, image: porscheCgtImg, category: "Limited Editions", fuel: "Petrol", transmission: "Manual", topSpeed: 330, horsepower: 612, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "5.7L NA V10", acceleration: "3.5s", torque: "590 Nm", mileage: "6.5 km/l", fuelTank: "92L", description: "An analog masterpiece. Manual gearbox, naturally aspirated V10, pure driving.", tagline: "The last great analog supercar.", available: false, colors: ["#C0C0C0", "#FFFFFF", "#000000"], year: 2025 },
  { id: "54", name: "Monza SP2", brand: "Ferrari", price: 145000000, image: ferrariMonzaImg, category: "Limited Editions", fuel: "Petrol", transmission: "Automatic", topSpeed: 300, horsepower: 810, seats: 2, drivetrain: "RWD", bodyType: "Convertible", engine: "6.5L NA V12", acceleration: "2.9s", torque: "719 Nm", mileage: "5.5 km/l", fuelTank: "78L", description: "Open-cockpit barchetta inspired by Ferrari's 1950s racers.", tagline: "Wind. V12. Nothing else.", available: false, colors: ["#FF0000", "#FFD700"], featured: true, year: 2025 },
  { id: "55", name: "Countach LPI 800-4", brand: "Lamborghini", price: 220000000, image: lamboCountachImg, category: "Limited Editions", fuel: "Hybrid", transmission: "Automatic", topSpeed: 355, horsepower: 803, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "6.5L V12 Hybrid", acceleration: "2.8s", torque: "720 Nm", mileage: "5.0 km/l", fuelTank: "85L", description: "A modern reinterpretation of the iconic 1971 wedge. Limited to 112 units.", tagline: "The legend, reincarnated.", available: false, colors: ["#FFFFFF", "#FFD700", "#000000"], featured: true, year: 2025 },
  { id: "56", name: "Tourbillon", brand: "Bugatti", price: 380000000, image: bugattiTourbillonImg, category: "Hypercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 445, horsepower: 1800, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "8.3L NA V16 Hybrid", acceleration: "2.0s", torque: "1900 Nm", mileage: "4.2 km/l", fuelTank: "80L", description: "The post-Chiron era begins. A naturally aspirated V16 hybrid masterpiece.", tagline: "The successor to legend.", colors: ["#0000FF", "#000000", "#C0C0C0"], featured: true, trending: true, year: 2026 },
  { id: "57", name: "Boat Tail", brand: "Rolls-Royce", price: 280000000, image: rollsBoatTailImg, category: "Limited Editions", fuel: "Petrol", transmission: "Automatic", topSpeed: 250, horsepower: 593, seats: 4, drivetrain: "AWD", bodyType: "Convertible", engine: "6.75L Twin-Turbo V12", acceleration: "5.3s", torque: "900 Nm", mileage: "5.5 km/l", fuelTank: "82L", description: "One of the most expensive new cars ever made. Coachbuilt for three patrons.", tagline: "The pinnacle of bespoke.", available: false, colors: ["#0000FF", "#FFFFFF"], year: 2025 },
  { id: "58", name: "Nevera", brand: "Rimac", price: 240000000, image: rimacNeveraImg, category: "Electric Supercars", fuel: "Electric", transmission: "Automatic", topSpeed: 412, horsepower: 1914, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "Quad Electric Motors", acceleration: "1.85s", torque: "2360 Nm", mileage: "3.5 km/kWh", fuelTank: "120 kWh", description: "The world's quickest accelerating production car. Croatia's electric marvel.", tagline: "0-100 km/h in 1.85 seconds.", awards: ["Quickest Production EV — Guinness World Record"], colors: ["#1A1A2E", "#000000", "#C0C0C0"], featured: true, trending: true, year: 2025 },
  { id: "59", name: "Evija", brand: "Lotus", price: 180000000, image: lotusEvijaImg, category: "Electric Supercars", fuel: "Electric", transmission: "Automatic", topSpeed: 350, horsepower: 2011, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "Quad Electric Motors", acceleration: "2.7s", torque: "1700 Nm", mileage: "3.2 km/kWh", fuelTank: "93 kWh", description: "Lotus's first hypercar in decades — and their first all-electric one.", tagline: "British engineering, electrified.", available: false, colors: ["#FFD700", "#000000"], trending: true, year: 2025 },
  { id: "60", name: "Vanquish Volante", brand: "Aston Martin", price: 48000000, image: aston2Img, category: "Convertible Series", fuel: "Petrol", transmission: "Automatic", topSpeed: 340, horsepower: 824, seats: 2, drivetrain: "RWD", bodyType: "Convertible", engine: "5.2L Twin-Turbo V12", acceleration: "3.4s", torque: "1000 Nm", mileage: "7.0 km/l", fuelTank: "78L", description: "The flagship V12 Aston Martin returns, now with open-top thrills.", tagline: "The V12 flagship returns.", colors: ["#006633", "#000000", "#C0C0C0", "#FF0000"], featured: true, year: 2026 },
  // ===== 2026 ARRIVALS =====
  { id: "61", name: "SF90 XX Stradale", brand: "Ferrari", price: 85000000, image: ferrari3Img, category: "Track Edition", fuel: "Hybrid", transmission: "Automatic", topSpeed: 320, horsepower: 1030, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "4.0L Twin-Turbo V8 Hybrid", acceleration: "2.3s", torque: "900 Nm", mileage: "5.5 km/l", fuelTank: "78L", description: "The XX program meets the road. Ferrari's most extreme street-legal hybrid.", tagline: "XX. Now street-legal.", colors: ["#FF0000", "#FFD700", "#000000"], featured: true, trending: true, year: 2026 },
  { id: "62", name: "12Cilindri Spider", brand: "Ferrari", price: 58000000, image: ferrari2Img, category: "Convertible Series", fuel: "Petrol", transmission: "Automatic", topSpeed: 340, horsepower: 819, seats: 2, drivetrain: "RWD", bodyType: "Convertible", engine: "6.5L NA V12", acceleration: "2.95s", torque: "678 Nm", mileage: "5.2 km/l", fuelTank: "92L", description: "Twelve cylinders, naturally aspirated, open to the sky.", tagline: "The V12 sings again.", colors: ["#C0C0C0", "#FF0000", "#1A1A2E"], featured: true, year: 2026 },
  { id: "63", name: "Temerario", brand: "Lamborghini", price: 45000000, image: lambo3Img, category: "Luxury Supercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 343, horsepower: 907, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "4.0L Twin-Turbo V8 Hybrid", acceleration: "2.7s", torque: "800 Nm", mileage: "6.8 km/l", fuelTank: "80L", description: "The Huracán successor. A new V8 hybrid era begins.", tagline: "The new V8 era.", colors: ["#00FF00", "#FFD700", "#000000", "#FFFFFF"], trending: true, year: 2026 },
  { id: "64", name: "Revuelto Roadster", brand: "Lamborghini", price: 72000000, image: lamboImg, category: "Convertible Series", fuel: "Hybrid", transmission: "Automatic", topSpeed: 350, horsepower: 1015, seats: 2, drivetrain: "AWD", bodyType: "Convertible", engine: "6.5L V12 Hybrid", acceleration: "2.5s", torque: "725 Nm", mileage: "5.0 km/l", fuelTank: "85L", description: "The V12 flagship, now under open skies.", tagline: "Open-top V12 thunder.", colors: ["#FFD700", "#FF6600", "#000000"], featured: true, year: 2026 },
  { id: "65", name: "750S Spider", brand: "McLaren", price: 38000000, image: mclaren2Img, category: "Convertible Series", fuel: "Petrol", transmission: "Automatic", topSpeed: 332, horsepower: 740, seats: 2, drivetrain: "RWD", bodyType: "Convertible", engine: "4.0L Twin-Turbo V8", acceleration: "2.8s", torque: "800 Nm", mileage: "7.2 km/l", fuelTank: "72L", description: "The lightest, most powerful series-production McLaren Spider yet.", tagline: "Weight reduced. Thrills amplified.", colors: ["#FF6600", "#000000", "#C0C0C0", "#FFFFFF"], trending: true, year: 2026 },
  { id: "66", name: "W1", brand: "McLaren", price: 220000000, image: mclaren3Img, category: "Hypercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 350, horsepower: 1275, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "4.0L Twin-Turbo V8 Hybrid", acceleration: "2.7s", torque: "1340 Nm", mileage: "5.0 km/l", fuelTank: "72L", description: "The successor to the P1. McLaren's new hypercar flagship.", tagline: "The P1 legacy continues.", available: false, colors: ["#FF6600", "#C0C0C0", "#000000"], featured: true, trending: true, year: 2026 },
  { id: "67", name: "911 Turbo S Hybrid", brand: "Porsche", price: 28000000, image: porsche3Img, category: "Luxury Supercars", fuel: "Hybrid", transmission: "Automatic", topSpeed: 330, horsepower: 701, seats: 4, drivetrain: "AWD", bodyType: "Coupe", engine: "3.6L Twin-Turbo Flat-6 Hybrid", acceleration: "2.5s", torque: "800 Nm", mileage: "9.5 km/l", fuelTank: "67L", description: "The icon, now electrified. Hybrid power for the legendary 911.", tagline: "The icon, electrified.", colors: ["#FFFFFF", "#000000", "#FF0000", "#C0C0C0"], featured: true, year: 2026 },
  { id: "68", name: "Mission X", brand: "Porsche", price: 195000000, image: porscheImg, category: "Electric Supercars", fuel: "Electric", transmission: "Automatic", topSpeed: 350, horsepower: 1450, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "Dual Electric Motors", acceleration: "2.0s", torque: "1500 Nm", mileage: "3.4 km/kWh", fuelTank: "110 kWh", description: "Porsche's vision of the all-electric hypercar future.", tagline: "Porsche's electric vision.", available: false, colors: ["#FF0000", "#C0C0C0", "#000000"], trending: true, year: 2026 },
  { id: "69", name: "Spectre Black Badge", brand: "Rolls-Royce", price: 115000000, image: rolls2Img, category: "Electric Supercars", fuel: "Electric", transmission: "Automatic", topSpeed: 250, horsepower: 650, seats: 4, drivetrain: "AWD", bodyType: "Coupe", engine: "Dual Electric Motors", acceleration: "4.1s", torque: "1075 Nm", mileage: "3.0 km/kWh", fuelTank: "102 kWh", description: "The darker, more potent side of silent luxury.", tagline: "Silence with menace.", colors: ["#000000", "#1A1A2E", "#8B0000"], featured: true, year: 2026 },
  { id: "70", name: "La Rose Noire Droptail", brand: "Rolls-Royce", price: 280000000, image: rolls3Img, category: "Limited Editions", fuel: "Petrol", transmission: "Automatic", topSpeed: 250, horsepower: 593, seats: 2, drivetrain: "AWD", bodyType: "Convertible", engine: "6.75L Twin-Turbo V12", acceleration: "5.3s", torque: "840 Nm", mileage: "5.5 km/l", fuelTank: "82L", description: "A Coachbuild Droptail masterpiece. One of one bespoke.", tagline: "One of one. One of a kind.", available: false, colors: ["#8B0000", "#000000"], year: 2026 },
  { id: "71", name: "Mistral Roadster", brand: "Bugatti", price: 520000000, image: bugatti2Img, category: "Convertible Series", fuel: "Petrol", transmission: "Automatic", topSpeed: 420, horsepower: 1577, seats: 2, drivetrain: "AWD", bodyType: "Convertible", engine: "8.0L Quad-Turbo W16", acceleration: "2.4s", torque: "1600 Nm", mileage: "3.2 km/l", fuelTank: "100L", description: "The fastest open-top production car in the world.", tagline: "Fastest roadster on Earth.", available: false, colors: ["#0066FF", "#000000"], featured: true, year: 2026 },
  { id: "72", name: "Valhalla Spider", brand: "Aston Martin", price: 160000000, image: astonValhallaImg, category: "Convertible Series", fuel: "Hybrid", transmission: "Automatic", topSpeed: 345, horsepower: 937, seats: 2, drivetrain: "AWD", bodyType: "Convertible", engine: "4.0L V8 Hybrid", acceleration: "2.6s", torque: "1000 Nm", mileage: "5.5 km/l", fuelTank: "90L", description: "Open-top mid-engine hybrid. A new Aston Martin chapter under the sun.", tagline: "Open-top, mid-engine, electrified.", colors: ["#00FF00", "#C0C0C0", "#000000"], featured: true, trending: true, year: 2026 },
  { id: "73", name: "GranCabrio Folgore", brand: "Maserati", price: 25000000, image: maseratiGtImg, category: "Electric Supercars", fuel: "Electric", transmission: "Automatic", topSpeed: 290, horsepower: 760, seats: 4, drivetrain: "AWD", bodyType: "Convertible", engine: "Triple Electric Motors", acceleration: "2.8s", torque: "1350 Nm", mileage: "3.0 km/kWh", fuelTank: "92 kWh", description: "Maserati's first all-electric convertible. Italian grace, silent thunder.", tagline: "Silent thunder. Italian grace.", colors: ["#0000FF", "#FFFFFF", "#C0C0C0"], trending: true, year: 2026 },
  { id: "74", name: "MCXtrema", brand: "Maserati", price: 95000000, image: maseratiMc20Img, category: "Track Edition", fuel: "Petrol", transmission: "Automatic", topSpeed: 320, horsepower: 740, seats: 1, drivetrain: "RWD", bodyType: "Coupe", engine: "3.0L Twin-Turbo V6", acceleration: "2.6s", torque: "850 Nm", mileage: "5.5 km/l", fuelTank: "65L", description: "Track-only beast. Limited to 62 units. Pure Maserati racing DNA.", tagline: "62 units. Track-only fury.", available: false, colors: ["#000000", "#FFD700"], featured: true, year: 2026 },
  { id: "75", name: "Batur Convertible", brand: "Bentley", price: 220000000, image: bentleyBacalarImg, category: "Limited Editions", fuel: "Petrol", transmission: "Automatic", topSpeed: 320, horsepower: 740, seats: 2, drivetrain: "AWD", bodyType: "Convertible", engine: "6.0L Twin-Turbo W12", acceleration: "3.4s", torque: "1000 Nm", mileage: "5.8 km/l", fuelTank: "90L", description: "Mulliner Coachbuilt farewell to the W12. Sixteen examples only.", tagline: "Farewell to the W12.", available: false, colors: ["#FFD700", "#1A1A2E"], featured: true, year: 2026 },
  { id: "76", name: "Continental GTC Speed", brand: "Bentley", price: 42000000, image: bentleyGtImg, category: "Convertible Series", fuel: "Hybrid", transmission: "Automatic", topSpeed: 335, horsepower: 782, seats: 4, drivetrain: "AWD", bodyType: "Convertible", engine: "4.0L V8 Hybrid", acceleration: "3.2s", torque: "1000 Nm", mileage: "7.0 km/l", fuelTank: "80L", description: "The most powerful Bentley convertible ever made.", tagline: "Open-top crafted ferocity.", colors: ["#1A1A2E", "#FFFFFF", "#8B0000"], trending: true, year: 2026 },
  { id: "77", name: "CC850", brand: "Koenigsegg", price: 380000000, image: koenigseggJeskoImg, category: "Limited Editions", fuel: "Petrol", transmission: "Manual", topSpeed: 410, horsepower: 1385, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "5.0L Twin-Turbo V8", acceleration: "2.5s", torque: "1385 Nm", mileage: "4.0 km/l", fuelTank: "70L", description: "Tribute to the CC8S. Engage Shift System: manual or automatic.", tagline: "The 9-speed manual hypercar.", available: false, colors: ["#C0C0C0", "#000000"], featured: true, year: 2026 },
  { id: "78", name: "Codalunga", brand: "Pagani", price: 350000000, image: paganiUtopiaImg, category: "Limited Editions", fuel: "Petrol", transmission: "Automatic", topSpeed: 350, horsepower: 829, seats: 2, drivetrain: "RWD", bodyType: "Coupe", engine: "6.0L Twin-Turbo V12", acceleration: "3.0s", torque: "1100 Nm", mileage: "4.5 km/l", fuelTank: "85L", description: "Long-tail Huayra masterpiece. Five units. Coachbuilt artistry.", tagline: "Five units. Endless artistry.", available: false, colors: ["#C0C0C0", "#000000"], featured: true, year: 2026 },
  { id: "79", name: "GT3 Coupé", brand: "Mercedes-AMG", price: 38000000, image: amgBlackImg, category: "Track Edition", fuel: "Petrol", transmission: "Automatic", topSpeed: 320, horsepower: 671, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "4.0L Twin-Turbo V8", acceleration: "3.2s", torque: "850 Nm", mileage: "7.2 km/l", fuelTank: "75L", description: "The new AMG GT. Razor-sharp dynamics, twin-turbo V8 power.", tagline: "The hand-built thunder.", colors: ["#000000", "#FFD700", "#C0C0C0", "#FFFFFF"], trending: true, year: 2026 },
  { id: "80", name: "Nevera R", brand: "Rimac", price: 280000000, image: rimacNeveraImg, category: "Track Edition", fuel: "Electric", transmission: "Automatic", topSpeed: 420, horsepower: 2107, seats: 2, drivetrain: "AWD", bodyType: "Coupe", engine: "Quad Electric Motors", acceleration: "1.74s", torque: "2400 Nm", mileage: "3.2 km/kWh", fuelTank: "120 kWh", description: "Track-focused Nevera evolution. The fastest accelerating EV ever made.", tagline: "0-100 km/h in 1.74 seconds.", available: false, colors: ["#FFD700", "#1A1A2E", "#000000"], featured: true, trending: true, year: 2026 },
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
export const brands = ["Lamborghini", "Ferrari", "McLaren", "Porsche", "Bugatti", "Aston Martin", "Rolls-Royce", "Maserati", "Bentley", "Koenigsegg", "Pagani", "Mercedes-AMG", "Rimac", "Lotus"];
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
