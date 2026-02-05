"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: any[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setMousePos({ x, y });
  };

  const mainImage = images?.[selectedImage]?.asset?.url;

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row lg:gap-8">
      {/* 1. Thumbnail List - Optimized for mobile horizontal scroll */}
      <div className="flex flex-row gap-4 md:flex-col md:w-20 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
        {images?.map((image, index) => (
          <button
            key={image._key || index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative aspect-square w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300",
              selectedImage === index
                ? "border-[#D4AF37] shadow-md"
                : "border-transparent hover:border-gray-200",
            )}
          >
            <Image
              src={image.asset.url}
              alt={`${productName} view ${index + 1}`}
              fill
              sizes="(max-width: 768px) 64px, 80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* 2. Main Image Container - Fixed for Chrome Center and Desktop Zoom */}
      <div
        ref={containerRef}
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F9F9F9] cursor-zoom-in group flex items-center justify-center border border-gray-50"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
      >
        {mainImage ? (
          <>
            <Image
              src={mainImage}
              alt={productName}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              className={cn(
                "object-contain p-4 md:p-0 md:object-cover transition-opacity duration-500 object-center",
                isZoomed ? "opacity-0" : "opacity-100",
              )}
            />

            {/* 3. High-Fidelity Desktop Zoom (250% magnification) */}
            {isZoomed && (
              <div
                className="absolute inset-0 pointer-events-none hidden md:block transition-transform duration-200"
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: "250%",
                }}
              />
            )}

            {/* Mobile Tap Indicator */}
            <div className="absolute bottom-4 right-4 bg-white/90 p-2.5 rounded-full shadow-lg md:hidden border border-gray-100">
              <ZoomIn className="w-5 h-5 text-[#1B2A4E]" />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 font-serif italic">
            Awaiting Visuals
          </div>
        )}
      </div>

      {/* 4. LUXURY LIGHTBOX MODAL */}
      {isLightboxOpen && mainImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B2A4E]/95 p-4 backdrop-blur-md transition-all duration-500">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#D4AF37] transition-all p-2 hover:rotate-90"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center">
            <Image
              src={mainImage}
              alt={productName}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <div className="absolute bottom-10 flex flex-col items-center gap-2">
            <p className="text-[#D4AF37] text-[10px] font-black tracking-[0.4em] uppercase">
              Exclusive Preview
            </p>
            <p className="text-white/80 text-sm font-serif italic">
              {productName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
