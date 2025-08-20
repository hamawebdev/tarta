'use client';

import React, { memo, useEffect, useState } from 'react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

interface Flavor {
  id: number;
  name: string;
  description: string;
  image: string;
  color: string;
  price?: number;
}

interface ProductSelectionItemProps {
  flavor: Flavor;
  isSelected: boolean;
  quantity: number;
  onToggle: (productId: number, checked: boolean) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
  onCardClick: (productId: number) => void;
}

// Memoized component to prevent unnecessary re-renders
export const ProductSelectionItem = memo(function ProductSelectionItem({
  flavor,
  isSelected,
  quantity,
  onToggle,
  onQuantityChange,
  onCardClick
}: ProductSelectionItemProps) {
  const [localQty, setLocalQty] = useState(String(quantity ?? ''));
  const t = useTranslations('Buy');
  const tProducts = useTranslations('Products');

  useEffect(() => {
    setLocalQty(String(quantity ?? ''));
  }, [quantity]);

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 bg-white cursor-pointer group ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={(e) => {
        // Only handle click if it's not on the checkbox or quantity input
        const target = e.target as HTMLElement;
        if (!target.closest('[data-slot="checkbox"]') && !target.closest('input')) {
          onCardClick(flavor.id);
        }
      }}
    >
      {/* Checkbox - responsive sizing */}
      <Checkbox
        id={`product-${flavor.id}`}
        checked={isSelected}
        onCheckedChange={(checked) => {
          onToggle(flavor.id, checked as boolean);
        }}
        className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 touch-manipulation"
      />

      {/* Product Image - responsive sizing */}
      <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${flavor.color} rounded-lg sm:rounded-xl overflow-hidden shadow-md flex-shrink-0 ${
        isSelected ? 'ring-2 ring-primary/30' : ''
      }`}>
        <Image
          src={flavor.image}
          alt={flavor.name}
          width={64}
          height={64}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span class="text-white font-bold text-xs">Cake</span></div>';
          }}
        />
      </div>

      {/* Product Info - responsive text sizing */}
      <div className="flex-1 min-w-0">
        <Label
          htmlFor={`product-${flavor.id}`}
          className={`text-sm sm:text-base font-semibold block pointer-events-none leading-tight ${
            isSelected ? 'text-primary' : 'text-gray-900'
          }`}
        >
          {flavor.translationKey ? tProducts(`${flavor.translationKey}.name`) : flavor.name}
        </Label>
        {flavor.price && (
          <div className={`text-xs sm:text-sm font-medium mt-0.5 sm:mt-1 ${
            isSelected ? 'text-primary/80' : 'text-gray-600'
          }`}>
            {flavor.price} دج
          </div>
        )}
      </div>

      {/* Quantity Section - responsive layout */}
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 flex-shrink-0">
        <Label
          htmlFor={`quantity-${flavor.id}`}
          className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap"
        >
          {t('quantity')}:
        </Label>
        <Input
          id={`quantity-${flavor.id}`}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={isSelected ? "1" : "0"}
          max="50"
          step="1"
          value={localQty}
          onChange={(e) => {
            // Allow free typing, including temporarily empty values
            const raw = e.target.value.replace(/[^0-9]/g, '');
            setLocalQty(raw);
            if (raw !== '') {
              const n = parseInt(raw, 10);
              if (n > 0) {
                if (!isSelected) {
                  onToggle(flavor.id, true);
                }
                onQuantityChange(flavor.id, Math.min(50, n));
              }
            }
          }}
          onBlur={() => {
            const n = parseInt(localQty, 10);
            if (!Number.isNaN(n) && n > 0) {
              const clamped = Math.min(50, n);
              if (!isSelected) {
                onToggle(flavor.id, true);
              }
              onQuantityChange(flavor.id, clamped);
              setLocalQty(String(clamped));
            } else {
              if (isSelected) {
                onQuantityChange(flavor.id, 1);
                setLocalQty('1');
              } else {
                setLocalQty('');
              }
            }
          }}
          className={`w-14 sm:w-16 md:w-20 text-center text-sm sm:text-base transition-all duration-200 !bg-white touch-manipulation ${
            isSelected
              ? 'border-primary/30 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20'
              : 'text-gray-400 border-gray-200'
          }`}
        />
      </div>
    </div>
  );
});

interface ProductSelectionProps {
  flavors: Flavor[];
  selectedProducts: Array<{ id: number; quantity: number }>;
  onToggle: (productId: number, checked: boolean) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
  onCardClick: (productId: number) => void;
}

export const ProductSelection = memo(function ProductSelection({
  flavors,
  selectedProducts,
  onToggle,
  onQuantityChange,
  onCardClick
}: ProductSelectionProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {flavors.map((flavor) => {
        const isSelected = selectedProducts.some(p => p.id === flavor.id);
        const selectedProduct = selectedProducts.find(p => p.id === flavor.id);
        const quantity = selectedProduct?.quantity || (isSelected ? 1 : 0);

        return (
          <ProductSelectionItem
            key={flavor.id}
            flavor={flavor}
            isSelected={isSelected}
            quantity={quantity}
            onToggle={onToggle}
            onQuantityChange={onQuantityChange}
            onCardClick={onCardClick}
          />
        );
      })}
    </div>
  );
});
