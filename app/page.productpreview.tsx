'use client';

import { useState, useEffect } from "react";
import { FullPageCarousel } from "@/components/ui/full-page-carousel";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductSection } from "@/components/sections/product-section";

// Sample flavor data - using real product images
const flavors = [
  {
    id: 1,
    name: "Classic Chocolate",
    description: "Rich, decadent chocolate cake layered with silky chocolate ganache",
    image: "/products/choco.jpg",
    color: "from-amber-900 to-amber-700"
  },
  {
    id: 2,
    name: "Berry Delight",
    description: "Fresh berry layers with whipped cream and berry compote",
    image: "/products/berry.png",
    color: "from-purple-400 to-purple-300"
  },
  {
    id: 3,
    name: "Strawberry Dream",
    description: "Fresh strawberry layers with whipped cream and strawberry compote",
    image: "/products/fraise.png",
    color: "from-pink-400 to-pink-300"
  },
  {
    id: 4,
    name: "Mango Bliss",
    description: "Tropical mango cake with mango cream and fresh mango pieces",
    image: "/products/mango.png",
    color: "from-yellow-400 to-orange-300"
  },
  {
    id: 5,
    name: "Pistachio Dream",
    description: "Delicate pistachio cake with pistachio cream and crushed pistachios",
    image: "/products/pistache.png",
    color: "from-green-400 to-green-300"
  }
];

export default function ProductPreviewPage() {
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Apply carousel-specific styles to body when this page is mounted
  useEffect(() => {
    setIsHydrated(true);
    if (typeof document !== 'undefined') {
      document.body.classList.add('carousel-page');

      return () => {
        document.body.classList.remove('carousel-page');
      };
    }
  }, []);

  const handleProductSelect = (product: any) => {
    // Handle product selection - could navigate to product page, add to cart, etc.
    console.log(`Selected product: ${product.name}`);
  };

  const handleScrollToNext = () => {
    if (carouselApi) {
      carouselApi.scrollNext();
    }
  };

  // Create sections array for the carousel
  const sections = [
    {
      id: 'hero',
      type: 'hero' as const,
      content: <HeroSection onScrollToNext={handleScrollToNext} />
    },
    ...flavors.map((flavor, index) => ({
      id: `product-${flavor.id}`,
      type: 'product' as const,
      content: (
        <ProductSection
          product={flavor}
          onProductSelect={handleProductSelect}
          isLast={index === flavors.length - 1}
        />
      )
    }))
  ];

  return (
    <FullPageCarousel sections={sections} setApi={setCarouselApi} />
  );
}