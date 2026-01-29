import { Suspense } from "react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  FILTER_PRODUCTS_BY_NAME_QUERY,
  FILTER_PRODUCTS_BY_PRICE_ASC_QUERY,
  FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
  FILTER_PRODUCTS_BY_RELEVANCE_QUERY,
} from "@/lib/sanity/queries/products";
import { ALL_CATEGORIES_QUERY } from "@/lib/sanity/queries/categories";
import { ProductSection } from "@/components/app/ProductSection";
import FeaturedCarousel from "../../components/FeaturedCarousel";
import { GridLoader } from "../../components/loaders/GridLoader";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    color?: string;
    material?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    inStock?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;

  const searchQuery = params.q ?? "";
  const categorySlug = params.category ?? "";
  const color = params.color ?? "";
  const material = params.material ?? "";
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 0;
  const sort = params.sort ?? "name";
  const inStock = params.inStock === "true";

  // Select query based on sort parameter
  const getQuery = () => {
    if (searchQuery && sort === "relevance") {
      return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
    }

    switch (sort) {
      case "price_asc":
        return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
      case "price_desc":
        return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
      case "relevance":
        return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
      default:
        return FILTER_PRODUCTS_BY_NAME_QUERY;
    }
  };

  // Fetch products and categories
  const [{ data: products }, { data: categories }] = await Promise.all([
    sanityFetch({
      query: getQuery(),
      params: {
        searchQuery,
        categorySlug,
        color,
        material,
        minPrice,
        maxPrice,
        inStock,
      },
    }),
    sanityFetch({
      query: ALL_CATEGORIES_QUERY,
    }),
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* 1. LUXURY HERO SECTION */}
      <FeaturedCarousel />

      {/* 2. Page Title Area */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.3em] uppercase mb-2 block">
            Our Collection
          </span>
          <h1 className="text-4xl font-serif tracking-tight text-[#1B2A4E] capitalize">
            {categorySlug ? categorySlug : "Shop All Pieces"}
          </h1>
          <p className="mt-3 text-sm text-gray-400 font-light max-w-md italic">
            Carefully curated jewelry designed to elevate your everyday radiance.
          </p>
        </div>
      </div>

      {/* 3. Product Grid Section with Suspense Loader */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense key={categorySlug + searchQuery} fallback={<GridLoader />}>
          <ProductSection
            categories={categories}
            products={products}
            searchQuery={searchQuery}
          />
        </Suspense>
      </div>
    </div>
  );
}