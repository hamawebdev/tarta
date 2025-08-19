import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { getFlavorById, getAllFlavorIds } from '@/lib/data/flavors';
import BuyPageClient from '@/components/buy/buy-page-client';

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

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `Buy ${product.name} - Torta Excelencia`,
    description: `Order ${product.name}: ${product.description}`,
    openGraph: {
      title: `Buy ${product.name}`,
      description: product.description,
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
