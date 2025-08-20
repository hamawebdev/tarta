"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useIsMobile } from '@/hooks/use-mobile'

interface HeroSectionProps {
  onScrollToNext?: () => void
}

export function HeroSection({ onScrollToNext }: HeroSectionProps) {
  const t = useTranslations('Hero');
  const isMobile = useIsMobile()
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Respect user setting for reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const showStaticPoster = isMobile || prefersReducedMotion

  // Pause video when not visible to save CPU/GPU and avoid stutter
  useEffect(() => {
    const video = videoRef.current
    if (!video || showStaticPoster) return

    // Small GPU hints
    video.style.willChange = 'transform'
    video.style.transform = 'translateZ(0)'
    video.style.backfaceVisibility = 'hidden'
    ;(video.style as any).WebkitBackfaceVisibility = 'hidden'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [showStaticPoster])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background media: video on desktop, static image on mobile/reduced motion */}
      {showStaticPoster ? (
        <Image
          src="/products/choco.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/products/choco.webp"
          aria-hidden
        >
          {/* Single video source */}
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Minimal Elite Hero Content */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="text-center text-white max-w-3xl mx-auto">
          {/* Clean, Elite Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-[0.85] animate-in slide-in-from-bottom-8 duration-1000">
            {t('title')}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-normal text-white/80 mb-12 tracking-wide animate-in slide-in-from-bottom-10 duration-1000 delay-300">
            {t('subtitle')}
          </p>

          {/* Minimal CTA */}
          <div className="animate-in slide-in-from-bottom-12 duration-1000 delay-500">
            <Button
              onClick={onScrollToNext}
              className="bg-white text-black hover:bg-white/90 px-8 py-3 font-medium tracking-widest uppercase text-sm transition-all duration-500"
            >
              {t('explore')}
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
