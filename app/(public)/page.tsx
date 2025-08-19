'use client';

import { useState, useEffect } from "react";
import { FullPageCarousel } from "@/components/ui/full-page-carousel";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductSection } from "@/components/sections/product-section";
import { SocialLinksSection } from "@/components/sections/social-links-section";
import { InstantNavigation } from "@/components/ui/instant-navigation";
import { useHydration } from "@/hooks/use-hydration";
import { flavors, type Flavor } from "@/lib/data/flavors";
import { type UseEmblaCarouselType } from "embla-carousel-react";

export default function Home() {
  const [carouselApi, setCarouselApi] = useState<UseEmblaCarouselType[1] | null>(null);
  const isHydrated = useHydration();

  // Apply carousel-specific styles to body when this page is mounted
  useEffect(() => {
    if (isHydrated) {
      document.body.classList.add('carousel-page');

      return () => {
        document.body.classList.remove('carousel-page');
      };
    }
  }, [isHydrated]);

  const handleProductSelect = (product: Flavor) => {
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
    ...flavors.map((flavor, idx) => ({
      id: `product-${flavor.id}`,
      type: 'product' as const,
      content: (
        <ProductSection
          product={flavor}
          onProductSelect={handleProductSelect}
          isLast={false} // No longer the last since we're adding social links
          priority={idx === 0}
        />
      )
    })),
    {
      id: 'social-links',
      type: 'social' as const,
      content: <SocialLinksSection />
    }
  ];

  return (
    <>
      <InstantNavigation />
      <FullPageCarousel sections={sections} setApi={setCarouselApi} />
    </>
  );
}
