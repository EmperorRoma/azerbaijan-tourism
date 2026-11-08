"use client";

import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import {
  azn,
  CATEGORY_LABELS,
  km,
  PRICE_LEVEL_LABELS,
  priceSuffix,
  priceSymbol,
} from "@/lib/format";
import type { Venue } from "@/lib/types";
import { StarRating } from "./star-rating";
import { AddToPlanButton } from "./add-to-plan-button";

const CAT_STYLES: Record<string, string> = {
  hotel: "bg-em text-white",
  restaurant: "bg-terra text-white",
  cafe: "bg-gold text-white",
  supermarket: "bg-ink text-bg",
  store: "bg-surface text-ink border border-line",
};

export function VenueCard({
  venue,
  regionName,
  distance,
}: {
  venue: Venue;
  regionName?: string;
  distance?: number;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-lift transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${CAT_STYLES[venue.category] ?? "bg-surface text-ink"}`}
        >
          {CATEGORY_LABELS[venue.category] ?? venue.category}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold text-amber-300 backdrop-blur">
          {priceSymbol(venue.priceLevel)} · {PRICE_LEVEL_LABELS[venue.priceLevel] ?? ""}
        </span>
        {regionName && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <MapPin className="size-3" /> {regionName}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-semibold leading-snug text-ink">
              {venue.name}
            </h3>
            <span className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-ink">
              <StarRating rating={venue.rating} />
              {venue.rating.toFixed(1)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {venue.reviews.toLocaleString("az")} rəy
          </p>
        </div>

        <p className="clamp-2 text-sm leading-relaxed text-ink2">{venue.description}</p>

        <div className="mt-auto space-y-1.5 text-xs text-muted">
          <p className="flex items-center gap-2">
            <Clock className="size-3.5 shrink-0 text-em" /> {venue.hours}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0 text-em" /> {venue.address}
          </p>
          {venue.phone && (
            <p className="flex items-center gap-2">
              <Phone className="size-3.5 shrink-0 text-em" /> {venue.phone}
            </p>
          )}
          {distance !== undefined && (
            <p className="flex items-center gap-2 font-semibold text-terra">
              <MapPin className="size-3.5 shrink-0" /> Sizdən {km(distance)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-line pt-3.5">
          <p className="text-sm">
            <span className="font-display text-lg font-bold text-em">{azn(venue.avgPrice)}</span>
            <span className="text-xs text-muted">{priceSuffix(venue.category)}</span>
          </p>
          <div className="flex items-center gap-2">
            <Link
              href={`/map?focus=${venue.id}`}
              className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink2 transition-colors hover:border-em hover:text-em"
            >
              Xəritə
            </Link>
            <AddToPlanButton
              compact
              item={{
                source: "venue",
                refId: venue.id,
                name: venue.name,
                image: venue.image,
                region: regionName ?? "",
                category: venue.category,
                lat: venue.lat,
                lng: venue.lng,
                price: venue.avgPrice,
                priceKind:
                  venue.category === "hotel"
                    ? "night"
                    : venue.category === "supermarket" || venue.category === "store"
                      ? "visit"
                      : "person",
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
