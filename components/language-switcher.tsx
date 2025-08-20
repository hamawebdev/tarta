"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useHydration } from '@/hooks/use-hydration'
import { usePathname } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function LanguageSwitcher() {
  const locale = useLocale();
  const isHydrated = useHydration();
  const pathname = usePathname();

  // Hide on /buy route
  if (pathname?.startsWith('/buy')) return null;

  const handleLanguageSwitch = (newLocale: string) => {
    // Set locale in cookie and reload page
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`; // 1 year
    window.location.reload();
  };

  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[1];

  // Show loading state during hydration
  if (!isHydrated) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
          <Button variant="ghost" size="sm" disabled className="text-sm font-medium text-black">

            العربية
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-sm font-medium text-black hover:bg-gray-100">

              {currentLanguage.name}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px] bg-white text-black border border-gray-200 shadow-lg">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageSwitch(language.code)}
                className="cursor-pointer text-black hover:bg-gray-100 focus:bg-gray-100 focus:text-black"
              >

                {language.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
