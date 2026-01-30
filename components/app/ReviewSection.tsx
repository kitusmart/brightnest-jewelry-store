import { Star } from "lucide-react";

export function ReviewSection({ reviews }: { reviews: any[] }) {
  // If there are no approved reviews, we don't show the section at all
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-24 border-t border-gray-100 bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-16">
          <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">
            Verified Excellence
          </span>
          <h2 className="text-3xl font-serif text-[#1B2A4E] uppercase tracking-tight">
            Radiance Stories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {reviews.map((review: any, i: number) => (
            <div
              key={i}
              className="bg-[#fbf7ed]/20 p-10 border border-[#D4AF37]/10 flex flex-col items-center text-center"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={12}
                    className={
                      starIndex < review.rating
                        ? "fill-[#D4AF37] text-[#D4AF37]"
                        : "text-gray-200"
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-[#1B2A4E] leading-loose italic mb-6 font-light">
                "{review.comment}"
              </p>
              <p className="text-[10px] font-black text-[#1B2A4E] uppercase tracking-[0.2em]">
                — {review.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
