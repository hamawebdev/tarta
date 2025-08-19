"use client"

import React from 'react'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  onScrollToNext?: () => void
}

export function HeroSection({ onScrollToNext }: HeroSectionProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Simple Video Element */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/products/choco.webp"
      >
        {/* Single video source */}
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Minimal Elite Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="text-center text-white max-w-3xl mx-auto">
          {/* Clean, Elite Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[0.85] animate-in slide-in-from-bottom-8 duration-1000">
            Torta Excelencia
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-normal text-white/80 mb-12 tracking-wide animate-in slide-in-from-bottom-10 duration-1000 delay-300">
            Capas de Felicidad
          </p>

          {/* Minimal CTA */}
          <div className="animate-in slide-in-from-bottom-12 duration-1000 delay-500">
            <Button
              onClick={onScrollToNext}
              className="bg-white text-black hover:bg-white/90 px-8 py-3 font-medium tracking-widest uppercase text-sm transition-all duration-500"
            >
              Explore
            </Button>
          </div>
        </div>
      </div>

      {/* Minimal scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/30">
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent"></div>
      </div>
    </div>
  )
}
