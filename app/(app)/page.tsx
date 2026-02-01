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
import JewelryAnatomy from "../../components/JewelryAnatomy";
import TrustBadges from "../../components/TrustBadges";
import ShopTheLook from "../../components/ShopTheLook";
import Testimonials from "../../components/Testimonials";
import FeaturedCollections from "@/components/app/FeaturedCollections";
export const revalidate = 60;

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
  const inStock = params.inStock === "true";
  const sort = params.sort ?? (searchQuery ? "relevance" : "name");

  const getQuery = () => {
    if (searchQuery && sort === "relevance")
      return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
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
      <FeaturedCarousel />
      <FeaturedCollections />

      {/* --- LUXURY HEADER --- */}
      <div className="bg-white -mt-12 relative z-10">
        <div className="mx-auto max-w-7xl px-4 pt-0 pb-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
            Our Curated Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1B2A4E] uppercase tracking-tight">
            {categorySlug || "Timeless Elegance"}
          </h2>
        </div>
      </div>

      {/* FIX: Changed pb-24 to pb-0 to remove the gap before Shop The Look */}
      <div className="mx-auto max-w-7xl px-4 pb-0 sm:px-6 lg:px-8">
        <Suspense key={categorySlug + searchQuery} fallback={<GridLoader />}>
          <ProductSection
            categories={categories}
            products={products}
            searchQuery={searchQuery}
          />
        </Suspense>
      </div>

      <ShopTheLook />
      <Testimonials />

      <div className="border-t border-gray-50">
        <JewelryAnatomy />
      </div>
      <div className="bg-[#fbf7ed]/30 border-t border-gray-50">
        <TrustBadges />
      </div>
    </div>
  );
}
