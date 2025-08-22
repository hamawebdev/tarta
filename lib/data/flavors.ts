// Shared flavor data for consistent use across the application
export interface Flavor {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
  translationKey?: string; // Optional translation key for localized content
  price?: number; // Price in DZD
}

export const flavors: Flavor[] = [
  {
    id: 1,
    name: "Chocolate",
    description: "Rich, decadent chocolate cake layered with silky chocolate ganache",
    image: "/products/choco.webp",
    color: "from-amber-900 to-amber-700",
    translationKey: "classicChocolate",
    price: 450 // Torta Chocolate
  },
  {
    id: 2,
    name: "Berry",
    description: "Fresh berry layers with whipped cream and berry compote",
    image: "/products/berry.webp",
    color: "from-purple-400 to-purple-300",
    translationKey: "berryDelight",
    price: 550 // Updated to match fresa price
  },
  {
    id: 3,
    name: "Strawberry",
    description: "Fresh strawberry layers with whipped cream and strawberry compote",
    image: "/products/fraise.webp",
    color: "from-pink-400 to-pink-300",
    translationKey: "strawberryDream",
    price: 450 // Torta Strawberry (fresa)
  },
  {
    id: 4,
    name: "Mango",
    description: "Tropical mango cake with mango cream and fresh mango pieces",
    image: "/products/mango.webp",
    color: "from-yellow-400 to-orange-300",
    translationKey: "mangoBliss",
    price: 480 // Torta Mango
  },
  {
    id: 5,
    name: "Pistachio",
    description: "Delicate pistachio cake with pistachio cream and crushed pistachios",
    image: "/products/pistache.webp",
    color: "from-green-400 to-green-300",
    translationKey: "pistachioDream",
    price: 650 // Torta Pistachio
  },
  {
    id: 6,
    name: "Caramel",
    description: "Luxurious caramel cake with rich caramel sauce and buttery caramel cream",
    image: "/products/caramel.webp",
    color: "from-amber-500 to-yellow-600",
    translationKey: "caramel",
    price: 450 // Torta Caramel
  },
  {
    id: 7,
    name: "Nuts",
    description: "Rich nutty cake with mixed nuts, walnut cream, and crunchy nut toppings",
    image: "/products/NUTS.webp",
    color: "from-amber-600 to-amber-800",
    translationKey: "nuts",
    price: 650 // Torta Nuts
  }
];

// Helper function to get all flavors
export function getFlavors(): Flavor[] {
  return flavors;
}

// Helper function to get a flavor by ID
export function getFlavorById(id: number): Flavor | undefined {
  return flavors.find(flavor => flavor.id === id);
}

// Helper function to get all flavor IDs for static generation
export function getAllFlavorIds(): number[] {
  return flavors.map(flavor => flavor.id);
}
