"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  description: string
  image: string
  color: string
}

const TINY_BLUR_DATA_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

interface ProductSectionProps {
  product: Product
  onProductSelect?: (product: Product) => void
  isLast?: boolean
  priority?: boolean
}

export function ProductSection({ product, isLast = false, priority = false }: ProductSectionProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  // Keep the render path free of any async/state work before navigation to ensure instant feel
  return (
    <div className={`h-full w-full bg-gradient-to-br ${product.color} relative overflow-hidden`}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full animate-pulse" />
        <div className="absolute top-32 right-8 w-16 h-16 bg-white/15 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-4 w-8 h-8 bg-white/10 rounded-full animate-bounce delay-500" />
        <div className="absolute bottom-1/4 right-12 w-14 h-14 bg-white/15 rounded-full animate-pulse delay-1500" />
      </div>

      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

      <div className="relative h-full flex flex-col justify-center items-center p-4 md:p-6 lg:p-8">
        {/* Large Product Image Preview - Main Focus */}
        <div className="flex-1 flex items-center justify-center mb-2 md:mb-6 animate-in slide-in-from-bottom-4 delay-300">
          <div className="relative">
            <div className="w-80 h-[26rem] sm:w-80 sm:h-[28rem] md:w-80 md:h-[28rem] lg:w-96 lg:h-[32rem] bg-white/10 rounded-3xl backdrop-blur-md border border-white/30 overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:rotate-1">
              <Image
                src={product.image}
                alt={product.name}
                width={384}
                height={512}
                sizes="(min-width: 1024px) 384px, 320px"
                priority={priority}
                fetchPriority={priority ? 'high' : 'auto'}
                loading={priority ? 'eager' : 'lazy'}
                placeholder="blur"
                blurDataURL={TINY_BLUR_DATA_URL}
                className="w-full h-full object-cover transition-opacity duration-300"
                style={{ opacity: imgLoaded ? 1 : 0 }}
                onLoadingComplete={() => setImgLoaded(true)}
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class=\"w-full h-full flex items-center justify-center\"><span class=\"text-white font-semibold text-lg tracking-wide\">Product Preview</span></div>';
                }}
              />
            </div>
            {/* Floating glow effect */}
            <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl animate-pulse" />
          </div>
        </div>

        {/* Buy Button positioned below the preview */}
        <div className="animate-in slide-in-from-bottom-8 delay-500">
          <Button
            asChild
            size="lg"
            className="bg-white text-gray-900 hover:bg-white/95 px-8 py-6 md:px-12 md:py-7 h-auto text-lg md:text-xl font-bold shadow-2xl rounded-full border-2 border-white/20 backdrop-blur-sm hover:scale-110 transition-transform"
          >
            <Link href={`/buy/${product.id}`} prefetch>
              <span className="flex items-center gap-3">
                <ShoppingCart size={20} />
                Buy This Flavor
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator (only show if not last) */}
      {!isLast && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      )}
    </div>
  )
}