import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_BY_SLUG_QUERY } from "@/lib/sanity/queries/products";
import { ProductGallery } from "@/components/app/ProductGallery";
import { ProductInfo } from "@/components/app/ProductInfo";
import { ProductAccordion } from "@/components/app/ProductAccordion";
import { ProductCard } from "@/components/app/ProductCard";
import { ReviewSection } from "@/components/app/ReviewSection";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // 1. DATA FETCHING - No changes to your original logic [cite: 15-37]
  const { data: product } = await sanityFetch({
    query: PRODUCT_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!product) notFound();

  const { data: relatedProducts } = await sanityFetch({
    query: `*[_type == "product" && slug.current != $slug] | order(_createdAt desc) [0...5] {
      _id,
      name,
      price,
      compareAtPrice,
      "slug": slug.current,
      "images": images[] {
        _key,
        asset-> { url }
      },
      "category": category->{ title, "slug": slug.current, _id },
      badge,
      stock
    }`,
    params: { slug },
  });

  const filteredRelated = relatedProducts
    ?.sort((a: any, b: any) => {
      if (a.category?._id === product.category?._id) return -1;
      return 1;
    })
    .slice(0, 5);

  const sectionHeadline = filteredRelated?.some(
    (item: any) => item.category?._id === product.category?._id,
  )
    ? "More from this Collection"
    : "Complete the Set";

  return (
    <div className="min-h-screen bg-white">
      {/* 2. UPDATED CONTAINER: Reduced py-16 to py-6 on mobile to move content up  */}
      <div className="mx-auto w-full px-4 py-6 md:py-16 md:px-10 lg:px-14">
        {/* 3. UPDATED GRID: Reduced gap-16 to gap-6 for mobile  */}
        <div className="grid gap-6 md:gap-12 lg:gap-16 lg:grid-cols-2 items-start mb-16 md:mb-32 max-w-7xl mx-auto">
          {/* 4. GALLERY: Only sticky on desktop (md and up)  */}
          <div className="md:sticky md:top-24">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          <div className="flex flex-col">
            <ProductInfo product={product} />
            <ProductAccordion />
          </div>
        </div>

        <ReviewSection reviews={product.reviews} />

        {/* 5. RELATED PRODUCTS GRID - Kept your 5-column logic [cite: 78-83] */}
        {filteredRelated && filteredRelated.length > 0 && (
          <section className="mt-16 md:mt-32 pt-12 md:pt-24 border-t border-gray-50">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4">
                Style Pairing
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#1B2A4E] uppercase tracking-tight">
                {sectionHeadline}
              </h2>
              <div className="mt-4 h-px w-12 bg-[#D4AF37]"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
              {filteredRelated.map((item: any) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
