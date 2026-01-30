"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";
import type { FEATURED_PRODUCTS_QUERYResult } from "@/sanity.types";

type FeaturedProduct = FEATURED_PRODUCTS_QUERYResult[number];

interface FeaturedCarouselProps {
  products: FEATURED_PRODUCTS_QUERYResult;
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api],
  );

  if (!products || products.length === 0) {
    return null;
  }

  return (
    /* STEP 1: Reduced to 60vh and removed min-h to ensure visibility of content below */
    <div className="relative w-full h-[60vh] overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full h-full"
      >
        <CarouselContent className="-ml-0 h-full">
          {products.map((product) => (
            /* STEP 2: Force CarouselItem to match the 60vh parent */
            <CarouselItem key={product._id} className="pl-0 h-full">
              <FeaturedSlide product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 border-zinc-700 bg-zinc-800/80 text-white hover:bg-zinc-700 hover:text-white sm:left-8" />
        <CarouselNext className="right-4 border-zinc-700 bg-zinc-800/80 text-white hover:bg-zinc-700 hover:text-white sm:right-8" />
      </Carousel>

      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                current === index
                  ? "w-6 bg-white"
                  : "bg-white/40 hover:bg-white/60",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FeaturedSlideProps {
  product: FeaturedProduct;
}

function FeaturedSlide({ product }: FeaturedSlideProps) {
  const productAny = product as any;
  const category = productAny.category as { title?: string } | null;
  const mainImage = productAny.image;

  return (
    /* STEP 3: Removed all min-h restrictions to let the 60vh parent control height */
    <div className="flex h-full w-full flex-col md:flex-row">
      {/* Image Section - Reduced height on mobile to h-48 */}
      <div className="relative h-48 w-full md:h-full md:w-3/5">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name ?? "Featured product"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800">
            <span className="text-zinc-500">No image</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-900/90 dark:to-zinc-950/90 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent md:hidden" />
      </div>

      {/* Content Section - Adjusted padding for better fit in smaller height */}
      <div className="flex w-full flex-col justify-center px-6 py-6 md:w-2/5 md:px-10 lg:px-16 bg-zinc-900/50">
        {category?.title && (
          <Badge
            variant="secondary"
            className="mb-3 w-fit bg-amber-500/20 text-amber-400"
          >
            {category.title}
          </Badge>
        )}

        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
          {product.name ?? "Exclusive Jewelry"}
        </h2>

        {product.description && (
          <p className="mt-3 line-clamp-2 text-sm text-zinc-300 sm:text-base">
            {product.description}
          </p>
        )}

        <p className="mt-4 text-2xl font-bold text-white lg:text-3xl">
          {formatPrice(product.price ?? 0)}
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-white text-zinc-900 hover:bg-zinc-100 h-10"
          >
            <Link href={`/product/${product.slug ?? ""}`}>
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
