'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllFlavorIds } from '@/lib/data/flavors';

/**
 * Component that preloads all buy pages for instant navigation
 * This should be included in the main page to ensure all routes are prefetched
 */
export function InstantNavigation() {
  const router = useRouter();

  useEffect(() => {
    // Preload all buy pages immediately when the component mounts
    const flavorIds = getAllFlavorIds();
    
    // Use requestIdleCallback for better performance
    const preloadRoutes = () => {
      flavorIds.forEach((id) => {
        router.prefetch(`/buy/${id}`);
      });
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(preloadRoutes);
      } else {
        // Fallback for browsers that don't support requestIdleCallback
        setTimeout(preloadRoutes, 100);
      }
    }
  }, [router]);

  // This component doesn't render anything
  return null;
}

/**
 * Hook for instant navigation with optimistic UI updates
 */
export function useInstantNavigation() {
  const router = useRouter();

  const navigateInstantly = (path: string) => {
    // Use router.push for instant navigation
    // The route should already be prefetched
    router.push(path);
  };

  return { navigateInstantly };
}
