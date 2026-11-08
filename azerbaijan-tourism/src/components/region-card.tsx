import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Region } from "@/lib/types";

export function RegionCard({ region, large = false }: { region: Region; large?: boolean }) {
  return (
    <Link
      href={`/regions/${region.slug}`}
      className={`group relative block overflow-hidden rounded-3xl shadow-lift transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift-lg ${
        large ? "h-[26rem] sm:h-[28rem]" : "h-80"
      }`}
    >
      <img
        src={region.image}
        alt={region.name}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      <div className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition-all duration-300 group-hover:bg-white group-hover:text-em">
        <ArrowUpRight className="size-4.5 text-white transition-colors group-hover:text-em" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6">
        {region.distanceFromBaku > 0 && (
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <MapPin className="size-3" /> Bakıdan {region.distanceFromBaku} km
          </span>
        )}
        <h3 className="font-display text-3xl font-semibold text-white">{region.name}</h3>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/80">{region.tagline}</p>
      </div>
    </Link>
  );
}
