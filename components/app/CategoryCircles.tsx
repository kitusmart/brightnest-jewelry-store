import Link from "next/link";

const CATEGORIES = [
  // 1. Necklaces
  {
    name: "Necklaces",
    slug: "necklaces",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&q=80",
  },
  // 2. Earrings
  {
    name: "Earrings",
    slug: "earrings",
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=80",
  },
  // 3. Bangles
  {
    name: "Bangles",
    slug: "bangles",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=200&q=80",
  },
  // 4. Rings
  {
    name: "Rings",
    slug: "rings",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=200&q=80",
  },
  // 5. Combos
  {
    name: "Combos",
    slug: "combos",
    image:
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=200&q=80",
  },
];

export function CategoryCircles() {
  return (
    <div className="w-full bg-white py-6 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
        <div className="flex gap-6 md:gap-8 justify-start md:justify-center min-w-max">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-transparent group-hover:border-gold-500 p-1 transition-all">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs md:text-sm font-medium text-black group-hover:text-primary-600">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
