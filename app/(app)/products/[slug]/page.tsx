import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_BY_SLUG_QUERY, FILTER_PRODUCTS_BY_NAME_QUERY } from "@/lib/sanity/queries/products";
import { ProductGallery } from "@/components/app/ProductGallery";
import { ProductInfo } from "@/components/app/ProductInfo";
import { ProductAccordion } from "@/components/app/ProductAccordion";
import { ProductCard } from "@/components/app/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) notFound();

  // Fetch Related Products for "Complete the Set"
  const { data: relatedProducts } = await sanityFetch({
    query: FILTER_PRODUCTS_BY_NAME_QUERY,
    params: { 
      categorySlug: product.category?.slug || "",
      searchQuery: "",
      color: "", material: "", minPrice: 0, maxPrice: 0, inStock: true // Padding params for query safety
    },
  });

  const filteredRelated = relatedProducts
    ?.filter((item: any) => item.slug !== slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 items-start">
          <div className="sticky top-24">
            <ProductGallery images={product.images} productName={product.name} />
          </div>
          <div className="flex flex-col">
            <ProductInfo product={product} />
            <ProductAccordion />
          </div>
        </div>

        {filteredRelated && filteredRelated.length > 0 && (
          <section className="mt-32 pt-24 border-t border-gray-50">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4">Style Pairing</span>
              <h2 className="text-4xl font-serif text-[#1B2A4E] uppercase tracking-tight">Complete the Set</h2>
              <div className="mt-4 h-px w-12 bg-[#D4AF37]"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredRelated.map((item: any) => <ProductCard key={item._id} product={item} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}