"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ScrollController() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const searchQuery = searchParams.get("q");

  useEffect(() => {
    if (category || searchQuery) {
      // Small delay allows the jewelry grid to finish rendering
      // This eliminates the "Hero Flicker" from your video
      const timer = setTimeout(() => {
        const element = document.getElementById("jewelry-results");
        if (element) {
          const yOffset = -140; // Stops exactly below the gold navbar
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [category, searchQuery]);

  return null; // This component doesn't show anything, it just controls the page
}
