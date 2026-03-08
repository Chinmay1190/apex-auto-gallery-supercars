import heroImg from '@/assets/hero-car.jpg';
import ferrariImg from '@/assets/car-ferrari.jpg';
import mclarenImg from '@/assets/car-mclaren.jpg';
import porscheImg from '@/assets/car-porsche.jpg';
import bugattiImg from '@/assets/car-bugatti.jpg';
import lamboImg from '@/assets/car-lambo.jpg';
import astonImg from '@/assets/car-aston.jpg';
import rollsImg from '@/assets/car-rolls.jpg';

export interface Car {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
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
  colors: string[];
  featured?: boolean;
  trending?: boolean;
  year: number;
}

export const cars: Car[] = [
  {
    id: "1",
    name: "Aventador SVJ",
    brand: "Lamborghini",
    price: 85000000,
    image: lamboImg,
    category: "Hypercars",
    fuel: "Petrol",
    transmission: "Automatic",
    topSpeed: 350,
    horsepower: 770,
    seats: 2,
    drivetrain: "AWD",
    bodyType: "Coupe",
    engine: "6.5L V12",
    acceleration: "2.8s",
    torque: "720 Nm",
    mileage: "5.5 km/l",
    fuelTank: "90L",
    description: "The Lamborghini Aventador SVJ represents the pinnacle of Lamborghini's super sports car legacy. With its naturally aspirated V12 engine producing 770 HP, it delivers an unparalleled driving experience.",
    colors: ["#FFD700", "#FF0000", "#000000", "#FFFFFF", "#00FF00"],
    featured: true,
    trending: true,
    year: 2024,
  },
  {
    id: "2",
    name: "SF90 Stradale",
    brand: "Ferrari",
    price: 75000000,
    image: ferrariImg,
    category: "Luxury Supercars",
    fuel: "Hybrid",
    transmission: "Automatic",
    topSpeed: 340,
    horsepower: 986,
    seats: 2,
    drivetrain: "AWD",
    bodyType: "Coupe",
    engine: "4.0L V8 Hybrid",
    acceleration: "2.5s",
    torque: "800 Nm",
    mileage: "6.5 km/l",
    fuelTank: "68L",
    description: "The Ferrari SF90 Stradale is Ferrari's first plug-in hybrid, combining a twin-turbo V8 with three electric motors for a combined output of 986 HP.",
    colors: ["#FF0000", "#FFD700", "#000000", "#FFFFFF", "#0000FF"],
    featured: true,
    trending: true,
    year: 2024,
  },
  {
    id: "3",
    name: "720S",
    brand: "McLaren",
    price: 55000000,
    image: mclarenImg,
    category: "Luxury Supercars",
    fuel: "Petrol",
    transmission: "Automatic",
    topSpeed: 341,
    horsepower: 710,
    seats: 2,
    drivetrain: "RWD",
    bodyType: "Coupe",
    engine: "4.0L Twin-Turbo V8",
    acceleration: "2.9s",
    torque: "770 Nm",
    mileage: "7.0 km/l",
    fuelTank: "72L",
    description: "The McLaren 720S redefines the supercar segment with its breathtaking performance, innovative design, and driver engagement.",
    colors: ["#FF6600", "#000000", "#C0C0C0", "#FFFFFF", "#0066FF"],
    featured: true,
    trending: true,
    year: 2024,
  },
  {
    id: "4",
    name: "911 GT3 RS",
    brand: "Porsche",
    price: 38000000,
    image: porscheImg,
    category: "Track Edition",
    fuel: "Petrol",
    transmission: "Automatic",
    topSpeed: 312,
    horsepower: 518,
    seats: 2,
    drivetrain: "RWD",
    bodyType: "Coupe",
    engine: "4.0L Flat-6",
    acceleration: "3.2s",
    torque: "465 Nm",
    mileage: "8.0 km/l",
    fuelTank: "64L",
    description: "The Porsche 911 GT3 RS is a track-focused masterpiece that brings motorsport technology to the road.",
    colors: ["#C0C0C0", "#FFFFFF", "#000000", "#FF0000", "#00FF00"],
    featured: true,
    year: 2024,
  },
  {
    id: "5",
    name: "Chiron Super Sport",
    brand: "Bugatti",
    price: 350000000,
    image: bugattiImg,
    category: "Hypercars",
    fuel: "Petrol",
    transmission: "Automatic",
    topSpeed: 440,
    horsepower: 1578,
    seats: 2,
    drivetrain: "AWD",
    bodyType: "Coupe",
    engine: "8.0L Quad-Turbo W16",
    acceleration: "2.4s",
    torque: "1600 Nm",
    mileage: "3.5 km/l",
    fuelTank: "100L",
    description: "The Bugatti Chiron Super Sport is the ultimate expression of speed and luxury, featuring a quad-turbocharged W16 engine.",
    colors: ["#0066FF", "#000000", "#C0C0C0", "#FF0000", "#FFFFFF"],
    featured: true,
    trending: true,
    year: 2024,
  },
  {
    id: "6",
    name: "Vantage V8",
    brand: "Aston Martin",
    price: 32000000,
    image: astonImg,
    category: "Luxury Supercars",
    fuel: "Petrol",
    transmission: "Automatic",
    topSpeed: 314,
    horsepower: 503,
    seats: 2,
    drivetrain: "RWD",
    bodyType: "Coupe",
    engine: "4.0L Twin-Turbo V8",
    acceleration: "3.6s",
    torque: "685 Nm",
    mileage: "9.0 km/l",
    fuelTank: "73L",
    description: "The Aston Martin Vantage combines British elegance with raw performance in a stunning grand tourer package.",
    colors: ["#006633", "#000000", "#C0C0C0", "#FF0000", "#0000FF"],
    trending: true,
    year: 2024,
  },
  {
    id: "7",
    name: "Ghost Black Badge",
    brand: "Rolls-Royce",
    price: 120000000,
    image: rollsImg,
    category: "Limited Editions",
    fuel: "Petrol",
    transmission: "Automatic",
    topSpeed: 250,
    horsepower: 592,
    seats: 5,
    drivetrain: "AWD",
    bodyType: "Sedan",
    engine: "6.75L Twin-Turbo V12",
    acceleration: "4.8s",
    torque: "900 Nm",
    mileage: "6.0 km/l",
    fuelTank: "82L",
    description: "The Rolls-Royce Ghost Black Badge is the most powerful Ghost ever, wrapped in the darkest expression of the marque.",
    colors: ["#FFFFFF", "#000000", "#1a1a2e", "#8B0000", "#FFD700"],
    featured: true,
    year: 2024,
  },
  {
    id: "8",
    name: "Huracán EVO",
    brand: "Lamborghini",
    price: 45000000,
    image: lamboImg,
    category: "Luxury Supercars",
    fuel: "Petrol",
    transmission: "Automatic",
    topSpeed: 325,
    horsepower: 630,
    seats: 2,
    drivetrain: "AWD",
    bodyType: "Coupe",
    engine: "5.2L V10",
    acceleration: "2.9s",
    torque: "600 Nm",
    mileage: "7.0 km/l",
    fuelTank: "83L",
    description: "The Lamborghini Huracán EVO takes the iconic V10 to new heights with advanced aerodynamics and predictive logic.",
    colors: ["#FFD700", "#FF6600", "#00FF00", "#000000", "#FFFFFF"],
    trending: true,
    year: 2024,
  },
];

export const brands = ["Lamborghini", "Ferrari", "McLaren", "Porsche", "Bugatti", "Aston Martin", "Rolls-Royce"];
export const categories = ["Hypercars", "Luxury Supercars", "Electric Supercars", "Track Edition", "Convertible Series", "Limited Editions"];
export const fuelTypes = ["Petrol", "Hybrid", "Electric"];
export const transmissions = ["Automatic", "Manual"];
export const drivetrains = ["RWD", "AWD"];
export const bodyTypes = ["Coupe", "Sedan", "Convertible", "SUV"];

export const formatPrice = (price: number): string => {
  return '₹' + price.toLocaleString('en-IN');
};

export const marqueBrands = ["Lamborghini", "Ferrari", "McLaren", "Porsche", "Bugatti", "Aston Martin", "Rolls-Royce", "Maserati", "Bentley", "Koenigsegg", "Pagani"];
