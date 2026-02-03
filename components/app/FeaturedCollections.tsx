import Link from "next/link";
import Image from "next/image";
import { backendClient } from "@/sanity/lib/backendClient";
import { urlFor } from "@/sanity/lib/image";

async function getCategories() {
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
    <section className="py-20 bg-white border-t border-gray-50">
      <div className="w-full px-4 md:px-10 lg:px-14">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-[0.5em] mb-3">
            The Brightnest Selection
          </span>
          <h2 className="text-3xl font-serif text-[#1B2A4E] uppercase tracking-tight">
            Featured Collections
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-[1600px] mx-auto">
          {categories.map((category: any) => (
            <Link
              key={category.slug}
              href={`/?category=${category.slug}`}
              // FIX: Added scroll={false} to stop the jumpy flicker seen in your video
              scroll={false}
              className="group block text-center"
            >
              <div className="relative aspect-square overflow-hidden bg-[#fbf7ed] mb-4 shadow-sm rounded-2xl border border-gray-50">
                <Image
                  src={urlFor(category.image).url()}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <h3 className="text-[10px] font-bold text-[#1B2A4E] group-hover:text-[#D4AF37] transition-colors uppercase tracking-[0.2em]">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
