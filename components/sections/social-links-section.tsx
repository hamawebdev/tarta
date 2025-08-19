"use client"

import React from 'react'
import { Instagram, Facebook, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

// TikTok icon component since it's not in lucide-react
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.1z"/>
  </svg>
)

interface SocialLink {
  name: string
  url: string
  icon: React.ReactNode
  color: string
  hoverColor: string
}

export function SocialLinksSection() {
  const socialLinks: SocialLink[] = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/torta_excelencia?igsh=eXY3dnA4bnp4MXIz',
      icon: <Instagram className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/16zUe4pJjx/',
      icon: <Facebook className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@torta.excelencia?_t=ZS-8z0InOR3XVq&_r=1',
      icon: <TikTokIcon className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-gray-700 to-gray-900',
      hoverColor: 'hover:from-gray-800 hover:to-black'
    },
    {
      name: 'Location',
      url: '#', // Non-functional for now
      icon: <MapPin className="w-8 h-8" />,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700'
    }
  ]

  const phoneNumber = '0563671499'

  const handlePhoneClick = () => {
    window.open(`tel:${phoneNumber}`, '_self')
  }

  const handleSocialClick = (url: string) => {
    if (url === '#') {
      // Non-functional for now - could show a toast or modal
      console.log('Maps functionality coming soon!')
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/20 rounded-full animate-pulse" />
        <div className="absolute top-32 right-8 w-16 h-16 bg-blue-500/15 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-32 left-16 w-12 h-12 bg-pink-500/10 rounded-full animate-pulse delay-2000" />
        <div className="absolute top-1/2 left-4 w-8 h-8 bg-purple-500/10 rounded-full animate-bounce delay-500" />
        <div className="absolute bottom-1/4 right-12 w-14 h-14 bg-blue-500/15 rounded-full animate-pulse delay-1500" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/20" />

      <div className="relative h-full flex flex-col justify-center items-center p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-in slide-in-from-bottom-4 delay-100">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Connect With Us
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Follow our journey and stay updated with the latest creations
          </p>
        </div>

        {/* Social Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-2xl w-full mb-8 md:mb-12">
          {socialLinks.map((social, index) => {
            const delayClasses = ['delay-300', 'delay-500', 'delay-700', 'delay-900'];
            return (
              <div
                key={social.name}
                className={`animate-in slide-in-from-bottom-4 ${delayClasses[index] || 'delay-300'}`}
              >
              <Button
                onClick={() => handleSocialClick(social.url)}
                className={`
                  w-full h-24 md:h-28 lg:h-32
                  ${social.color} ${social.hoverColor}
                  text-white border-0 rounded-2xl
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-2xl
                  flex flex-col items-center justify-center gap-3
                  backdrop-blur-sm border border-gray-200
                  group shadow-lg
                `}
                variant="outline"
              >
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {social.icon}
                </div>
                <span className="font-semibold text-sm md:text-base tracking-wide">
                  {social.name}
                </span>
              </Button>
            </div>
            )
          })}
        </div>

        {/* Phone Number Card */}
        <div className="animate-in slide-in-from-bottom-4 delay-600 w-full max-w-md">
          <Button
            onClick={handlePhoneClick}
            className="
              w-full h-20 md:h-24
              bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700
              text-white border-0 rounded-2xl
              transform transition-all duration-300
              hover:scale-105 hover:shadow-2xl
              flex items-center justify-center gap-4
              backdrop-blur-sm border border-gray-200
              group shadow-lg
            "
            variant="outline"
          >
            <div className="transform transition-transform duration-300 group-hover:scale-110">
              <Phone className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm md:text-base tracking-wide">
                Call Us
              </span>
              <span className="text-xs md:text-sm text-white/90 font-mono">
                {phoneNumber}
              </span>
            </div>
          </Button>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8 md:mt-12 animate-in slide-in-from-bottom-4 delay-700">
          <p className="text-sm md:text-base text-gray-500">
            Thank you for choosing Torta Excelencia
          </p>
        </div>
      </div>
    </div>
  )
}
