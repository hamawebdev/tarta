"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  onScrollToNext?: () => void
}

export function HeroSection({ onScrollToNext }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLowBandwidth, setIsLowBandwidth] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [retryCount, setRetryCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Detect connection speed and device capabilities
  useEffect(() => {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      const effectiveType = connection.effectiveType
      const downlink = connection.downlink || 0
      setIsLowBandwidth(
        effectiveType === 'slow-2g' ||
        effectiveType === '2g' ||
        effectiveType === '3g' ||
        downlink < 1.5
      )
    }

    // Also check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsLowBandwidth(true)
    }

    // Check for data saver mode
    if ((navigator as any).connection?.saveData) {
      setIsLowBandwidth(true)
    }
  }, [])

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    const videoElement = videoRef.current
    if (videoElement) {
      observer.observe(videoElement)
    }

    return () => observer.disconnect()
  }, [])

  // Progressive video loading
  const handleVideoLoad = useCallback(() => {
    setIsLoaded(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay failed, but that's okay
      })
    }
  }, [])

  const handleVideoError = useCallback(() => {
    setHasError(true)
  }, [])

  // Preload video when in view
  useEffect(() => {
    if (isInView && videoRef.current && !isLowBandwidth) {
      const video = videoRef.current
      video.load()
    }
  }, [isInView, isLowBandwidth])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black hero-video-container">
      {/* Video Element with Advanced Optimizations */}
      <video
        ref={videoRef}
        className={`object-cover hero-video-optimized transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload={isInView && !isLowBandwidth ? "auto" : "none"}
        poster="/hero-poster.jpg"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onCanPlayThrough={handleVideoLoad}
      >
        {/* Responsive video sources based on device and connection */}
        {!isLowBandwidth && (
          <>
            {/* High quality for good connections */}
            <source
              src="/hero-hd.webm"
              type="video/webm"
              media="(min-width: 1024px)"
            />
            <source
              src="/hero-hd.mp4"
              type="video/mp4"
              media="(min-width: 1024px)"
            />
            {/* Medium quality for tablets */}
            <source
              src="/hero-md.webm"
              type="video/webm"
              media="(min-width: 768px)"
            />
            <source
              src="/hero-md.mp4"
              type="video/mp4"
              media="(min-width: 768px)"
            />
            {/* Mobile quality */}
            <source
              src="/hero-mobile.webm"
              type="video/webm"
              media="(max-width: 767px)"
            />
            <source
              src="/hero-mobile.mp4"
              type="video/mp4"
              media="(max-width: 767px)"
            />
          </>
        )}

        {/* Fallback sources for all devices */}
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Loading State */}
      {!isLoaded && !hasError && (
        <div className="hero-loading-state bg-black flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading experience...</p>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-poster.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Low Bandwidth Fallback */}
      {isLowBandwidth && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero-poster.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Minimal Elite Overlay */}
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
