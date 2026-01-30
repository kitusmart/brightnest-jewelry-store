"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { X, ZoomIn } from "lucide-react"; // For the close and zoom icons

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
      {/* Thumbnail List */}
      <div className="flex flex-row gap-4 md:flex-col md:w-20">
        {images?.map((image, index) => (
          <button
            key={image._key || index}
            onClick={() => setSelectedImage(index)}
            className={cn(
              "relative aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all",
              selectedImage === index
                ? "border-[#D4AF37]"
                : "border-transparent hover:border-gray-200",
            )}
          >
            <Image
              src={image.asset.url}
              alt={productName}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-50 cursor-zoom-in group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)} // Opens Lightbox on click
      >
        {mainImage ? (
          <>
            <Image
              src={mainImage}
              alt={productName}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                isZoomed ? "opacity-0" : "opacity-100",
              )}
              priority
            />
            {/* Desktop Zoom Layer */}
            {isZoomed && (
              <div
                className="absolute inset-0 pointer-events-none hidden md:block"
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: "250%",
                }}
              />
            )}
            {/* Mobile "Tap to Enlarge" Hint */}
            <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full md:hidden">
              <ZoomIn className="w-5 h-5 text-zinc-800" />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {isLightboxOpen && mainImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-[#D4AF37] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
            <Image
              src={mainImage}
              alt={productName}
              fill
              className="object-contain"
            />
          </div>

          <p className="absolute bottom-8 text-white/60 text-sm tracking-widest uppercase">
            {productName}
          </p>
        </div>
      )}
    </div>
  );
}
