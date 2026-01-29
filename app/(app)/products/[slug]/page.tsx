import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_BY_SLUG_QUERY } from "@/lib/sanity/queries/products";
import { ProductGallery } from "@/components/app/ProductGallery";
import { ProductInfo } from "@/components/app/ProductInfo";
import { ProductAccordion } from "@/components/app/ProductAccordion"; // New Import

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 items-start">
          {/* 1. Image Gallery - 4:5 Aspect Ratio focus */}
          <div className="sticky top-24">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* 2. Product Details Section */}
          <div className="flex flex-col">
            {/* Main Product Info (Title, Price, Add to Cart) */}
            <ProductInfo product={product} />

            {/* Luxury Technical Details & Care */}
            <ProductAccordion />
          </div>
        </div>
      </div>
    </div>
  );
}