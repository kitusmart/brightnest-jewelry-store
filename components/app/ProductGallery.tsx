"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: any[] | null;
  productName: string | null;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Safety check if no images exist
  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-sm bg-[#fbf7ed] border border-[#D4AF37]/20">
        <span className="text-[#1B2A4E] font-serif uppercase tracking-widest text-xs">
          Image arriving soon
        </span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="space-y-6">
      {/* Main Image Display */}
      <div className="relative aspect-square overflow-hidden bg-white border border-[#fbf7ed] shadow-sm group">
        {selectedImage?.asset?.url ? (
          <Image
            src={selectedImage.asset.url}
            alt={productName ?? "Luxury Jewelry Image"}
            fill
            className="object-contain p-6 transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#1B2A4E]/40">
            Preview Unavailable
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image._key || index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden bg-white border transition-all duration-300",
                selectedIndex === index
                  ? "border-[#D4AF37] ring-1 ring-[#D4AF37]"
                  : "border-gray-100 opacity-60 hover:opacity-100",
              )}
            >
              {image.asset?.url && (
                <Image
                  src={image.asset.url}
                  alt={`${productName} thumb ${index}`}
                  fill
                  className="object-cover p-1"
                  sizes="100px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
