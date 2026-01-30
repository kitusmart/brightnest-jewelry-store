import Link from "next/link";
import Image from "next/image";
import { backendClient } from "@/sanity/lib/backendClient";
import { urlFor } from "@/sanity/lib/image";

async function getCategories() {
  // Fetches only categories with an image and description
  const query = `*[_type == "category" && defined(image)] | order(title asc) {
    title,
    "slug": slug.current,
    description,
    image
  }`;
  return await backendClient.fetch(query);
}

export default async function FeaturedCollections() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-24 bg-white border-t border-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.5em] mb-4">
            The Brightnest Selection
          </span>
          <h2 className="text-4xl font-serif text-[#1B2A4E] uppercase tracking-tight">
            Featured Collections
          </h2>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-10">
          {categories.map((category: any) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group block"
            >
              {/* Luxury Image Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-[#fbf7ed] mb-8 shadow-sm transition-shadow hover:shadow-xl">
                <Image
                  src={urlFor(category.image).url()}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
              </div>

              {/* Text Content */}
              <div className="flex flex-col items-start">
                <h3 className="text-xl font-serif text-[#1B2A4E] mb-3 group-hover:text-[#D4AF37] transition-colors uppercase tracking-wide">
                  {category.title}
                </h3>
                <p className="text-sm text-[#1B2A4E]/70 font-light leading-relaxed italic max-w-sm">
                  {category.description}
                </p>
                <span className="mt-6 text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37] border-b border-[#D4AF37]/20 group-hover:border-[#D4AF37] transition-all pb-1">
                  Discover Pieces
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
