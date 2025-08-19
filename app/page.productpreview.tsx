'use client';

import { useState, useEffect } from "react";
import { FullPageCarousel } from "@/components/ui/full-page-carousel";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductSection } from "@/components/sections/product-section";
import { type UseEmblaCarouselType } from "embla-carousel-react";
import { flavors, type Flavor } from "@/lib/data/flavors";

// Type definitions
interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
}

export default function ProductPreviewPage() {
  const [carouselApi, setCarouselApi] = useState<UseEmblaCarouselType[1] | null>(null);

  // Apply carousel-specific styles to body when this page is mounted
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('carousel-page');

      return () => {
        document.body.classList.remove('carousel-page');
      };
    }
  }, []);

  const handleProductSelect = (product: Product) => {
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