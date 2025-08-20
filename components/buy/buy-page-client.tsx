'use client';

import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { flavors, type Flavor } from '@/lib/data/flavors';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

// Dynamic imports for code splitting
const ProductSelection = lazy(() => import('@/components/ui/product-selection').then(mod => ({ default: mod.ProductSelection })));

// Loading component for ProductSelection
const ProductSelectionFallback = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center space-x-4 p-4 rounded-lg border-2 border-gray-200 bg-white animate-pulse">
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
        <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
        <div className="flex-1">
          <div className="w-32 h-5 bg-gray-200 rounded-md"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-4 bg-gray-200 rounded"></div>
          <div className="w-20 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

// Function to create form validation schema with translations
const createOrderFormSchema = (t: (key: string) => string) => z.object({
  fullName: z.string().min(2, { message: t('validation.nameMinLength') }),
  phoneNumber: z.string().min(10, { message: t('validation.phoneMinLength') }),
  address: z.string().min(10, { message: t('validation.addressMinLength') }),
  shippingMethod: z.enum(['pickup', 'delivery'], {
    required_error: t('validation.selectShippingMethod')
  }),
  selectedProducts: z.array(z.object({
    id: z.number(),
    quantity: z.number().min(1, { message: t('validation.quantityMinimum') })
      .max(50, { message: t('validation.quantityMaximum') }),
  })).min(1, { message: t('validation.selectAtLeastOneProduct') }),
});

interface BuyPageClientProps {
  selectedProduct: Flavor;
}

export default function BuyPageClient({ selectedProduct }: BuyPageClientProps) {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const t = useTranslations('Buy');
  const tCommon = useTranslations('Common');
  const tProducts = useTranslations('Products');

  const productId = selectedProduct.id;

  // Create schema with translations
  const orderFormSchema = useMemo(() => createOrderFormSchema(t), [t]);

  // Memoize form default values to prevent unnecessary re-initialization
  const defaultValues = useMemo(() => ({
    fullName: '',
    phoneNumber: '',
    address: '',
    shippingMethod: 'pickup' as const,
    selectedProducts: [{ id: productId, quantity: 1 }],
  }), [productId]);

  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues,
  });

  // Memoize handlers to prevent unnecessary re-renders
  const handleProductToggle = useCallback((productId: number, checked: boolean) => {
    const currentProducts = form.getValues('selectedProducts');
    if (checked) {
      // Add product with default quantity of 1
      const newProducts = [...currentProducts, { id: productId, quantity: 1 }];
      form.setValue('selectedProducts', newProducts);
    } else {
      // Remove product
      const newProducts = currentProducts.filter(p => p.id !== productId);
      form.setValue('selectedProducts', newProducts);
    }
  }, [form]);

  const handleProductCardClick = useCallback((productId: number) => {
    const selectedProducts = form.getValues('selectedProducts');
    const isSelected = selectedProducts.some(p => p.id === productId);
    handleProductToggle(productId, !isSelected);
  }, [form, handleProductToggle]);

  const handleQuantityChange = useCallback((productId: number, quantity: number) => {
    const currentProducts = form.getValues('selectedProducts');
    const isSelected = currentProducts.some(p => p.id === productId);

    if (isSelected) {
      const updatedProducts = currentProducts.map(p =>
        p.id === productId ? { ...p, quantity } : p
      );
      form.setValue('selectedProducts', updatedProducts);
    }
  }, [form]);

  // Calculate total price
  const calculateTotal = useCallback((selectedProducts: Array<{ id: number; quantity: number }>) => {
    return selectedProducts.reduce((total, selectedProduct) => {
      const flavor = flavors.find(f => f.id === selectedProduct.id);
      if (flavor && flavor.price) {
        return total + (flavor.price * selectedProduct.quantity);
      }
      return total;
    }, 0);
  }, []);

  // Watch selected products to calculate total
  const selectedProducts = form.watch('selectedProducts');
  const totalPrice = calculateTotal(selectedProducts);

  async function onSubmit(values: z.infer<typeof orderFormSchema>) {
    try {
      // Prepare order data with product details
      const orderData = {
        ...values,
        selectedProductsWithDetails: values.selectedProducts.map(sp => ({
          ...flavors.find(f => f.id === sp.id),
          quantity: sp.quantity
        }))
      };

      // Send to API route which will forward to Telegram
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      setIsSubmitted(true);
      toast.success('Thank you! Your order has been received.');

      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Something went wrong. Please try again.');
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
        <Card className="w-full max-w-lg mx-auto shadow-xl border-0">
          <CardContent className="pt-12 pb-10 px-8">
            <div className="text-center space-y-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <ShoppingCart className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-green-800 tracking-tight leading-tight">
                  {t('orderConfirmed')}
                </h2>
                <p className="text-lg text-green-700 font-medium leading-relaxed max-w-sm mx-auto">
                  {t('thankYou')}
                </p>
              </div>
              <Button
                onClick={() => router.push('/')}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold tracking-tight shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {t('backToHome')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-br p-3 sm:p-4 md:p-6 lg:p-8", selectedProduct.color)}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 sm:mb-8 md:mb-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="text-white hover:bg-white/20 mr-3 sm:mr-4 md:mr-6 h-9 sm:h-10 px-2 sm:px-3 font-medium transition-all duration-200 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            {tCommon('back')}
          </Button>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
            {t('title')}
          </h1>
        </div>

        {/* Order Form */}
        <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60"></div>
          <CardHeader className="pb-4 sm:pb-6 px-4 sm:px-6 md:px-8 pt-6 sm:pt-8">
            <CardTitle className="flex items-center text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              {t('orderDetails')}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base md:text-lg text-gray-700 font-medium leading-relaxed">
              {t('orderDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-500">

                {/* Product Selection */}
                <FormField
                  control={form.control}
                  name="selectedProducts"
                  render={() => (
                    <FormItem className="space-y-2 sm:space-y-3 animate-in slide-in-from-left-4 duration-500">
                      <FormLabel className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight">
                        {t('selectProducts')}
                      </FormLabel>
                      <FormControl>
                        <Suspense fallback={<ProductSelectionFallback />}>
                          <ProductSelection
                            flavors={flavors}
                            selectedProducts={form.watch('selectedProducts')}
                            onToggle={handleProductToggle}
                            onQuantityChange={handleQuantityChange}
                            onCardClick={handleProductCardClick}
                          />
                        </Suspense>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Order Summary */}
                {selectedProducts.length > 0 && (
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 border border-primary/20 animate-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <ShoppingCart className="w-4 h-4 text-primary" />
                      </div>
                      {t('orderSummary')}
                    </h3>
                    <div className="space-y-3">
                      {selectedProducts.map((selectedProduct) => {
                        const flavor = flavors.find(f => f.id === selectedProduct.id);
                        if (!flavor) return null;

                        const productName = flavor.translationKey
                          ? tProducts(`${flavor.translationKey}.name`)
                          : flavor.name;
                        const itemTotal = (flavor.price || 0) * selectedProduct.quantity;

                        return (
                          <div key={selectedProduct.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">
                              {productName} × {selectedProduct.quantity}
                            </span>
                            <span className="font-medium text-gray-900">
                              {itemTotal} دج
                            </span>
                          </div>
                        );
                      })}
                      <div className="border-t border-primary/20 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">
                            {t('total')}:
                          </span>
                          <span className="text-xl font-bold text-primary">
                            {totalPrice} دج
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-500 delay-200">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-gray-900 tracking-tight">{t('fullName')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('fullNamePlaceholder')}
                            {...field}
                            className="h-12 text-base border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 !bg-white text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold text-gray-900 tracking-tight">{t('phoneNumber')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('phoneNumberPlaceholder')}
                            {...field}
                            className="h-12 text-base border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 !bg-white text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="animate-in slide-in-from-left-4 duration-500 delay-300">
                      <FormLabel className="text-base font-semibold text-gray-900 tracking-tight">{t('address')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('addressPlaceholder')}
                          className="min-h-[100px] text-base border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none !bg-white text-gray-900"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3 animate-in slide-in-from-right-4 duration-500 delay-400">
                      <FormLabel className="text-base font-semibold text-gray-900 tracking-tight">{t('shippingMethod')}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-3"
                        >
                          <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white">
                            <RadioGroupItem value="pickup" id="pickup" className="text-primary border-2 border-gray-300" />
                            <Label htmlFor="pickup" className="text-base font-medium text-gray-900 cursor-pointer flex-1">
                              {t('pickup')}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 bg-white">
                            <RadioGroupItem value="delivery" id="delivery" className="text-primary border-2 border-gray-300" />
                            <Label htmlFor="delivery" className="text-base font-medium text-gray-900 cursor-pointer flex-1">
                              {t('delivery')}
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 animate-in slide-in-from-bottom-6 duration-700">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 font-bold text-lg tracking-tight shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-white/20 backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] text-white"
                    style={{
                      backgroundColor: 'oklch(0.5250 0.2230 3.9580)',
                      '--hover-bg': 'oklch(0.4750 0.2230 3.9580)'
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'oklch(0.4750 0.2230 3.9580)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'oklch(0.5250 0.2230 3.9580)';
                    }}
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin"></div>
                        <span>{t('placingOrder')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="w-5 h-5" />
                        <span>{t('placeOrder')}</span>
                      </div>
                    )}
                  </Button>
                </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
