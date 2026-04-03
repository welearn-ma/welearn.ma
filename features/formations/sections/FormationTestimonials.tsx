import { Quote } from "lucide-react";
import type { Testimonial } from "@/types/formation-page";

type Props = {
  testimonials: Testimonial[];
};

// TODO: replace with real testimonials
export function FormationTestimonials({ testimonials }: Props) {
  return (
    <section className="bg-wl-gray-light py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-wl-orange mb-3">
          Témoignages
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-wl-text mb-10">
          Ce qu&apos;en disent nos participants
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col rounded-xl border border-wl-border bg-white p-7 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 text-wl-star"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="flex-1 mb-6">
                <Quote className="h-5 w-5 text-wl-text-tertiary mb-2" />
                <p className="text-wl-text-secondary leading-relaxed italic text-[15px]">
                  {testimonial.quote}
                </p>
              </blockquote>

              <div className="flex items-center gap-3 pt-5 border-t border-wl-border">
                <div className="h-10 w-10 rounded-full bg-wl-blue flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white uppercase">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-wl-text text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-wl-text-tertiary">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
