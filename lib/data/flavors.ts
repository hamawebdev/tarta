// Shared flavor data for consistent use across the application
export interface Flavor {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
}

export const flavors: Flavor[] = [
  {
    id: 1,
    name: "Classic Chocolate",
    description: "Rich, decadent chocolate cake layered with silky chocolate ganache",
    image: "/products/choco.webp",
    color: "from-amber-900 to-amber-700"
  },
  {
    id: 2,
    name: "Berry Delight",
    description: "Fresh berry layers with whipped cream and berry compote",
    image: "/products/berry.webp",
    color: "from-purple-400 to-purple-300"
  },
  {
    id: 3,
    name: "Strawberry Dream",
    description: "Fresh strawberry layers with whipped cream and strawberry compote",
    image: "/products/fraise.webp",
    color: "from-pink-400 to-pink-300"
  },
  {
    id: 4,
    name: "Mango Bliss",
    description: "Tropical mango cake with mango cream and fresh mango pieces",
    image: "/products/mango.webp",
    color: "from-yellow-400 to-orange-300"
  },
  {
    id: 5,
    name: "Pistachio Dream",
    description: "Delicate pistachio cake with pistachio cream and crushed pistachios",
    image: "/products/pistache.webp",
    color: "from-green-400 to-green-300"
  },
  {
    id: 6,
    name: "Caramel",
    description: "Luxurious caramel cake with rich caramel sauce and buttery caramel cream",
    image: "/products/caramel.webp",
    color: "from-amber-500 to-yellow-600"
  }
];

// Helper function to get a flavor by ID
export function getFlavorById(id: number): Flavor | undefined {
  return flavors.find(flavor => flavor.id === id);
}

// Helper function to get all flavor IDs for static generation
export function getAllFlavorIds(): number[] {
  return flavors.map(flavor => flavor.id);
}
