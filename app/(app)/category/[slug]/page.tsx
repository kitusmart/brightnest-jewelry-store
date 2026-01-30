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

  // 1. Fetch data with a simplified param set to avoid GROQ errors
  const [{ data: products }, { data: categories }] = await Promise.all([
    sanityFetch({
      query: FILTER_PRODUCTS_BY_NAME_QUERY,
      params: {
        categorySlug: slug,
        searchQuery: "",
        color: "", // Added empty fallbacks to prevent "Parameter not found" errors
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

  // 2. If the category doesn't exist in Sanity, show 404 instead of a crash

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">
            The Collection
          </span>
          <h1 className="text-5xl font-serif text-[#1B2A4E] uppercase tracking-tight">
            {currentCategory?.title || slug}
          </h1>
          <p className="mt-6 text-sm text-gray-400 font-light max-w-xl mx-auto italic leading-loose">
            {currentCategory?.description ||
              "Curated jewelry for refined tastes."}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12">
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
