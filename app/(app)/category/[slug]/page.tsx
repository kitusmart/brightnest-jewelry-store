import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import { FILTER_PRODUCTS_BY_NAME_QUERY } from "@/lib/sanity/queries/products";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import { ProductSection } from "@/components/app/ProductSection";
import { GridLoader } from "@/components/loaders/GridLoader";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  // 1. Fetch data
  const [{ data: products }, { data: categories }] = await Promise.all([
    sanityFetch({
      query: FILTER_PRODUCTS_BY_NAME_QUERY,
      params: {
        categorySlug: slug,
        searchQuery: "",
        color: "",
        material: "",
        minPrice: 0,
        maxPrice: 200000,
        inStock: false,
      },
    }),
    sanityFetch({ query: ALL_CATEGORIES_QUERY }),
  ]);

  const currentCategory = categories?.find(
    (c: any) => c.slug?.current === slug,
  );

  return (
    <div className="min-h-screen bg-white">
      {/* --- MODERN LUXURY HEADER (No Borders, More Space) --- */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8 text-center">
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.6em] uppercase mb-6 block opacity-80">
            The Collection
          </span>

          {/* Lighter font weight looks more expensive */}
          <h1 className="text-6xl font-serif text-[#1B2A4E] uppercase tracking-widest font-light">
            {currentCategory?.title || slug}
          </h1>

          <p className="mt-8 text-sm text-gray-500 font-light max-w-lg mx-auto leading-loose tracking-wide">
            {/* FIX IS HERE: Added (currentCategory as any) */}
            {(currentCategory as any)?.description ||
              "Discover our curated selection of fine jewelry, designed to elevate your everyday shine."}
          </p>
        </div>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-8">
        <Suspense key={slug} fallback={<GridLoader />}>
          <ProductSection
            categories={categories}
            products={products}
            searchQuery=""
          />
        </Suspense>
      </div>
    </div>
  );
}
