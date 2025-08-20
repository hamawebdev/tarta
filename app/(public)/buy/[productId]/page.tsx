import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { getFlavorById, getAllFlavorIds } from '@/lib/data/flavors';
import BuyPageClient from '@/components/buy/buy-page-client';
import { getTranslations } from 'next-intl/server';

// Static generation for instant page loading
export async function generateStaticParams() {
  const flavorIds = getAllFlavorIds();

  return flavorIds.map((id) => ({
    productId: id.toString(),
  }));
}

// Generate metadata for each product page
export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }) {
  const { productId: productIdStr } = await params;
  const productId = parseInt(productIdStr);
  const product = getFlavorById(productId);
  const t = await getTranslations('Metadata');
  const tProducts = await getTranslations('Products');

  if (!product) {
    return {
      title: t('productNotFound'),
      description: t('productNotFoundDescription'),
    };
  }

  const productName = product.translationKey ? tProducts(`${product.translationKey}.name`) : product.name;
  const productDescription = product.translationKey ? tProducts(`${product.translationKey}.description`) : product.description;

  return {
    title: t('buyProductTitle', { productName }),
    description: t('buyProductDescription', { productName, productDescription }),
    openGraph: {
      title: t('buyProductTitle', { productName }),
      description: productDescription,
      images: [product.image],
    },
  };
}

interface BuyPageProps {
  params: Promise<{ productId: string }>;
}

export default async function BuyPage({ params }: BuyPageProps) {
  const { productId: productIdStr } = await params;
  const productId = parseInt(productIdStr);
  const selectedProduct = getFlavorById(productId);

  // With static generation, this should rarely happen
  if (!selectedProduct) {
    return <LoadingSkeleton />;
  }

  return <BuyPageClient selectedProduct={selectedProduct} />;
}
