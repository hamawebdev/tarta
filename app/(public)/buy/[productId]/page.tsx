'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { Checkbox } from '@/components/ui/checkbox';

// Sample flavor data - should match the data from the main page
const flavors = [
  {
    id: 1,
    name: "Classic Chocolate",
    description: "Rich, decadent chocolate cake layered with silky chocolate ganache",
    image: "/products/choco.jpg",
    color: "from-amber-900 to-amber-700"
  },
  {
    id: 2,
    name: "Berry Delight",
    description: "Fresh berry layers with whipped cream and berry compote",
    image: "/products/berry.png",
    color: "from-purple-400 to-purple-300"
  },
  {
    id: 3,
    name: "Strawberry Dream",
    description: "Fresh strawberry layers with whipped cream and strawberry compote",
    image: "/products/fraise.png",
    color: "from-pink-400 to-pink-300"
  },
  {
    id: 4,
    name: "Mango Bliss",
    description: "Tropical mango cake with mango cream and fresh mango pieces",
    image: "/products/mango.png",
    color: "from-yellow-400 to-orange-300"
  },
  {
    id: 5,
    name: "Pistachio Dream",
    description: "Delicate pistachio cake with pistachio cream and crushed pistachios",
    image: "/products/pistache.png",
    color: "from-green-400 to-green-300"
  }
];

// Form validation schema
const orderFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  phoneNumber: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  address: z.string().min(10, { message: 'Address must be at least 10 characters long' }),
  shippingMethod: z.enum(['pickup', 'delivery'], {
    required_error: 'Please select a shipping method'
  }),
  selectedProducts: z.array(z.object({
    id: z.number(),
    quantity: z.number().min(1, { message: 'Quantity must be at least 1' })
      .max(50, { message: 'Maximum quantity is 50' }),
  })).min(1, { message: 'Please select at least one product' }),
});

export default function BuyPage() {
  const params = useParams();
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const productId = parseInt(params.productId as string);

  useEffect(() => {
    const product = flavors.find(f => f.id === productId);
    if (!product) {
      router.push('/');
      return;
    }
    setSelectedProduct(product);
  }, [productId, router]);

  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      address: '',
      shippingMethod: 'pickup' as const,
      selectedProducts: [{ id: productId, quantity: 1 }],
    },
  });

  const handleProductToggle = (productId: number, checked: boolean) => {
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
  };

  const handleProductCardClick = (productId: number) => {
    const selectedProducts = form.getValues('selectedProducts');
    const isSelected = selectedProducts.some(p => p.id === productId);
    handleProductToggle(productId, !isSelected);
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    const currentProducts = form.getValues('selectedProducts');
    const isSelected = currentProducts.some(p => p.id === productId);

    if (isSelected) {
      const updatedProducts = currentProducts.map(p =>
        p.id === productId ? { ...p, quantity } : p
      );
      form.setValue('selectedProducts', updatedProducts);
    }
  };

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

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/10 p-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground tracking-tight">Loading your order...</p>
            <p className="text-sm text-muted-foreground font-medium">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
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
                  Order Confirmed!
                </h2>
                <p className="text-lg text-green-700 font-medium leading-relaxed max-w-sm mx-auto">
                  Thank you! Your order has been received.
                </p>
              </div>
              <Button
                onClick={() => router.push('/')}
                className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                size="lg"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedProduct.color} p-4 md:p-6 lg:p-8`}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 md:mb-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="text-white hover:bg-white/20 mr-4 md:mr-6 h-10 px-3 font-medium transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
            Complete Your Order
          </h1>
        </div>



        {/* Order Form */}
        <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60"></div>
          <CardHeader className="pb-6 px-6 md:px-8 pt-8">
            <CardTitle className="flex items-center text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              Order Details
            </CardTitle>
            <CardDescription className="text-base md:text-lg text-gray-700 font-medium leading-relaxed">
              Please fill in your details to complete your order.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">

                {/* Product Selection */}
                <FormField
                  control={form.control}
                  name="selectedProducts"
                  render={() => (
                    <FormItem className="space-y-3 animate-in slide-in-from-left-4 duration-500">
                      <FormLabel className="text-base font-semibold text-gray-900 tracking-tight">
                        Select Products
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {(() => {
                            const selectedProducts = form.watch('selectedProducts');
                            return flavors.map((flavor) => {
                              const isSelected = selectedProducts.some(p => p.id === flavor.id);
                              const selectedProduct = selectedProducts.find(p => p.id === flavor.id);
                              const quantity = selectedProduct?.quantity || (isSelected ? 1 : 0);

                            return (
                              <div
                                key={flavor.id}
                                className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all duration-200 bg-white cursor-pointer group ${
                                  isSelected
                                    ? 'border-primary ring-2 ring-primary/20 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                                onClick={(e) => {
                                  // Only handle click if it's not on the checkbox or quantity input
                                  const target = e.target as HTMLElement;
                                  if (!target.closest('[data-slot="checkbox"]') && !target.closest('input')) {
                                    handleProductCardClick(flavor.id);
                                  }
                                }}
                              >
                                <Checkbox
                                  id={`product-${flavor.id}`}
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    // Prevent the card click handler from firing
                                    handleProductToggle(flavor.id, checked as boolean);
                                  }}
                                  className="flex-shrink-0"
                                />
                                <div className={`w-16 h-16 bg-gradient-to-br ${flavor.color} rounded-xl overflow-hidden shadow-md flex-shrink-0 ${
                                  isSelected ? 'ring-2 ring-primary/30' : ''
                                }`}>
                                  <img
                                    src={flavor.image}
                                    alt={flavor.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><span class="text-white font-bold text-xs">Cake</span></div>';
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Label
                                    htmlFor={`product-${flavor.id}`}
                                    className={`text-base font-semibold block pointer-events-none ${
                                      isSelected ? 'text-primary' : 'text-gray-900'
                                    }`}
                                  >
                                    {flavor.name}
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                  <Label htmlFor={`quantity-${flavor.id}`} className="text-sm font-medium text-gray-700">
                                    Qty:
                                  </Label>
                                  <Input
                                    id={`quantity-${flavor.id}`}
                                    type="number"
                                    min={isSelected ? "1" : "0"}
                                    max="50"
                                    value={quantity}
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value) || 0;
                                      if (newQuantity > 0 && !isSelected) {
                                        handleProductToggle(flavor.id, true);
                                        handleQuantityChange(flavor.id, newQuantity);
                                      } else if (isSelected) {
                                        handleQuantityChange(flavor.id, newQuantity || 1);
                                      }
                                    }}
                                    disabled={!isSelected}
                                    className={`w-20 text-center transition-all duration-200 !bg-white ${
                                      isSelected
                                        ? 'border-primary/30 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20'
                                        : 'text-gray-400 border-gray-200'
                                    }`}
                                  />
                                </div>
                              </div>
                            );
                            });
                          })()}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-3 animate-in slide-in-from-left-4 duration-500 delay-100">
                      <FormLabel className="text-base font-semibold text-gray-900 tracking-tight">
                        Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="Enter your name"
                            className="h-12 text-base font-medium text-gray-900 !bg-white border-2 border-gray-200 focus:border-primary focus:!bg-white focus:shadow-sm hover:!bg-white hover:border-gray-300 transition-all duration-200 placeholder:text-gray-500"
                            {...field}
                          />
                          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm font-medium text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="space-y-3 animate-in slide-in-from-left-4 duration-500 delay-200">
                      <FormLabel className="text-base font-semibold text-gray-900 tracking-tight">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="Enter your phone number"
                            type="number"
                            className="h-12 text-base font-medium text-gray-900 !x !bg-white border-2 border-gray-200 focus:border-primary focus:!bg-white focus:shadow-sm hover:!bg-white hover:border-gray-300 transition-all duration-200 placeholder:text-gray-500"
                            {...field}
                          />
                          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm font-medium text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-3 animate-in slide-in-from-left-4 duration-500 delay-300">
                      <FormLabel className="text-base font-semibold text-gray-900 tracking-tight">
                        Delivery Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Textarea
                            className="min-h-20 text-base font-medium text-gray-900 !bg-white border-2 border-gray-200 focus:border-primary focus:!bg-white focus:shadow-sm hover:!bg-white hover:border-gray-300 transition-all duration-200 placeholder:text-gray-500 resize-none"
                            rows={3}
                            {...field}
                          />
                          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm font-medium text-red-600" />
                    </FormItem>
                  )}
                />

                {/* Shipping Method */}
                <FormField
                  control={form.control}
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3 animate-in slide-in-from-left-4 duration-500 delay-400">
                      <FormLabel className="text-base font-semibold text-gray-900 tracking-tight">
                        Shipping Method
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 !bg-white hover:!bg-white">
                            <RadioGroupItem value="pickup" id="pickup" />
                            <Label
                              htmlFor="pickup"
                              className="flex-1 cursor-pointer text-base font-medium text-gray-900"
                            >
                              Pick up from shop
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 !bg-white hover:!bg-white">
                            <RadioGroupItem value="delivery" id="delivery" />
                            <Label
                              htmlFor="delivery"
                              className="flex-1 cursor-pointer text-base font-medium text-gray-900"
                            >
                              Home delivery
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage className="text-sm font-medium text-red-600" />
                    </FormItem>
                  )}
                />



                </div>

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
                        <span>Placing Order...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="w-5 h-5" />
                        <span>Place Order</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
