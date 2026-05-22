"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const companies = [
  { symbol: "AAPL", name: "Apple", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80", description: "Consumer electronics & services", marketCap: "$3.4T" },
  { symbol: "MSFT", name: "Microsoft", image: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80", description: "Cloud computing & enterprise software", marketCap: "$3.1T" },
  { symbol: "NVDA", name: "NVIDIA", image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&q=80", description: "AI chips & GPU computing", marketCap: "$2.8T" },
  { symbol: "GOOGL", name: "Google", image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=80", description: "Search, ads & cloud platform", marketCap: "$2.1T" },
  { symbol: "AMZN", name: "Amazon", image: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&q=80", description: "E-commerce & cloud infrastructure", marketCap: "$1.9T" },
  { symbol: "TSLA", name: "Tesla", image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80", description: "Electric vehicles & energy", marketCap: "$800B" },
];

export default function CompanyCarousel() {
  return (
    <div className="w-full">
        <Swiper
          modules={[EffectCoverflow, Autoplay, Navigation]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          slidesPerView="auto"
          coverflowEffect={{ rotate: 0, stretch: 0, depth: 100, modifier: 2.5, slideShadows: false }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          className="company-carousel"
        >
          {companies.map((company) => (
            <SwiperSlide key={company.symbol} className="!w-[300px] md:!w-[350px]">
              <a href={`/company/${company.symbol}`} className="block group">
                <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-500 group-hover:border-zinc-600 group-hover:scale-[1.02]">
                  <div className="relative h-[200px]">
                    <img src={company.image} alt={company.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{company.name}</h3>
                      <span className="text-sm font-mono text-zinc-400">{company.symbol}</span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-3">{company.description}</p>
                    <div className="text-emerald-400 font-semibold">{company.marketCap}</div>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
    </div>
  );
}
