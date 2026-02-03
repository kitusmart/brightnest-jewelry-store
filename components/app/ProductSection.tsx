"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "./ProductGrid";
import type {
  ALL_CATEGORIES_QUERYResult,
  FILTER_PRODUCTS_BY_NAME_QUERYResult,
} from "@/sanity.types";

interface ProductSectionProps {
  categories: ALL_CATEGORIES_QUERYResult;
  products: FILTER_PRODUCTS_BY_NAME_QUERYResult;
  searchQuery: string;
}

export function ProductSection({ products, searchQuery }: ProductSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    // 1. Only trigger the glide if a category is selected or a search is performed
    if (category || searchQuery) {
      // 2. We use a 100ms delay to wait for the new images to appear
      // This stops the 'jump' and allows a clean smooth scroll
      const timeoutId = setTimeout(() => {
        if (sectionRef.current) {
          const headerOffset = 140; // The height of your sticky gold navbar
          const elementPosition =
            sectionRef.current.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth", // This is the high-end glide you want
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
    // 3. We only watch 'category' and 'searchQuery'.
    // Watching 'products' would cause the Red React Error again.
  }, [category, searchQuery]);

  return (
    <div ref={sectionRef} className="flex flex-col">
      {searchQuery && (
        <div className="flex items-center justify-center mb-8">
          <p className="text-xs text-gray-400 tracking-widest uppercase">
            Results for &quot;
            <span className="font-medium text-black">{searchQuery}</span>
            &quot;
          </p>
        </div>
      )}

      <div className="w-full">
        <main className="w-full">
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}
