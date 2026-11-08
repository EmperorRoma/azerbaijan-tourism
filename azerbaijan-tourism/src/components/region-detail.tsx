"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Landmark,
  Lightbulb,
  Map,
  MapPin,
  Navigation,
  Route,
  ScrollText,
  Sparkles,
  Store,
} from "lucide-react";
import { azn, TYPE_LABELS } from "@/lib/format";
import type { Attraction, Region, Venue } from "@/lib/types";
import { AddToPlanButton } from "./add-to-plan-button";
import { RegionCard } from "./region-card";
import { StarRating } from "./star-rating";
import { VenueCard } from "./venue-card";

const TABS = [
  { key: "overview", label: "Ümumi baxış", icon: Sparkles },
  { key: "history", label: "Tarix", icon: ScrollText },
  { key: "sights", label: "Görməli yerlər", icon: Landmark },
  { key: "venues", label: "Məkanlar", icon: Store },
  { key: "tips", label: "Yerli məsləhətlər", icon: Lightbulb },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function RegionDetail({
  region,
  attractions,
  venues,
  others,
}: {
  region: Region;
  attractions: Attraction[];
  venues: Venue[];
  others: Region[];
}) {
  const [tab, setTab] = useState<TabKey>("overview");

  return (
    <>
      {/* hero */}
      <section className="relative flex min-h-[62svh] items-end overflow-hidden">
        <img
          src={region.image}
          alt={region.name}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-px" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-36 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <nav className="mb-4 flex items-center gap-2 text-xs font-semibold text-white/70">
              <Link href="/" className="hover:text-white">Əsas</Link>
              <span>/</span>
              <Link href="/regions" className="hover:text-white">Regionlar</Link>
              <span>/</span>
              <span className="text-amber-300">{region.name}</span>
            </nav>
            <h1 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              {region.name}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/85 sm:text-lg">
              {region.tagline}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {region.distanceFromBaku > 0 && (
                <span className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
                  <Navigation className="size-3.5" /> Bakıdan {region.distanceFromBaku} km yol
                </span>
              )}
              <span className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
                <Landmark className="size-3.5" /> {attractions.length} görməli yer
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
                <Store className="size-3.5" /> {venues.length} qeydiyyatlı məkan
              </span>
              <Link
                href={`/map?region=${region.slug}`}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-em shadow-lift transition-all hover:-translate-y-0.5"
              >
                <Map className="size-3.5" /> Xəritədə göstər
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* tabs */}
      <div className="sticky top-16 z-30 border-b border-line glass">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 no-scrollbar sm:px-6">
          <div className="flex gap-1 py-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                  tab === t.key ? "text-em" : "text-muted hover:text-ink"
                }`}
              >
                {tab === t.key && (
                  <motion.span
                    layoutId="region-tab"
                    className="absolute inset-0 rounded-full bg-emt"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <t.icon className="relative size-4" />
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* tab content */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "overview" && (
              <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div className="space-y-5">
                  <h2 className="font-display text-3xl font-semibold text-ink">
                    {region.name} haqqında
                  </h2>
                  <p className="text-[15px] leading-[1.9] text-ink2">{region.description}</p>
                  <div className="rounded-3xl border border-line bg-surface p-6">
                    <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
                      <Sparkles className="size-5 text-gold" /> Mədəni vurğular
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.9] text-ink2">{region.culture}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl border border-line bg-gradient-to-br from-emt to-goldt p-6">
                    <h3 className="font-display text-lg font-semibold text-ink">Sürətli fakt</h3>
                    <ul className="mt-4 space-y-3 text-sm text-ink2">
                      <li className="flex items-center gap-3">
                        <MapPin className="size-4 shrink-0 text-em" />
                        Koordinatlar: {region.lat.toFixed(3)}°, {region.lng.toFixed(3)}°
                      </li>
                      <li className="flex items-center gap-3">
                        <Route className="size-4 shrink-0 text-em" />
                        {region.distanceFromBaku === 0
                          ? "Ölkənin paytaxtı — başlanğıc nöqtəniz"
                          : `Paytaxta yol məsafəsi: təxminən ${region.distanceFromBaku} km`}
                      </li>
                      <li className="flex items-center gap-3">
                        <Banknote className="size-4 shrink-0 text-em" />
                        Bütün ödənişlər Azərbaycan manatı (AZN) ilə aparılır
                      </li>
                    </ul>
                  </div>
                  <div className="overflow-hidden rounded-3xl border border-line">
                    <img src={region.image} alt={region.name} className="h-56 w-full object-cover" />
                  </div>
                </div>
              </div>
            )}

            {tab === "history" && (
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-3xl font-semibold text-ink">Tarix xronologiyası</h2>
                <div className="relative mt-8 border-l-2 border-dashed border-line pl-8">
                  <span className="animate-pulse-dot absolute -left-[9px] top-0 size-4 rounded-full bg-em" />
                  <p className="pb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">
                    {region.name}
                  </p>
                  <p className="text-[15px] leading-[1.95] text-ink2 whitespace-pre-line">{region.history}</p>
                </div>
              </div>
            )}

            {tab === "sights" && (
              <div>
                <div className="mb-8 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl font-semibold text-ink">
                      Muzeylər, teatrlar və abidələr
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                      Bilet qiymətləri bir nəfər üçün göstərilir; bir çox abidəyə giriş pulsuzdur.
                    </p>
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {attractions.map((a) => (
                    <article
                      key={a.id}
                      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-lift transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift-lg"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={a.image}
                          alt={a.name}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
                          {TYPE_LABELS[a.type] ?? a.type}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-display text-lg font-semibold leading-snug text-ink">
                            {a.name}
                          </h3>
                          <span className="mt-0.5 flex items-center gap-1 text-sm font-bold">
                            <StarRating rating={a.rating} />
                            {a.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="clamp-3 text-sm leading-relaxed text-ink2">{a.description}</p>
                        <div className="mt-auto flex items-center justify-between border-t border-line pt-3.5">
                          <span className="flex items-center gap-1.5 text-sm font-semibold text-em">
                            <Banknote className="size-4" />
                            {a.ticket === 0 ? "Giriş pulsuz" : `Bilet ${azn(a.ticket)}`}
                          </span>
                          <AddToPlanButton
                            compact
                            item={{
                              source: "attraction",
                              refId: a.id,
                              name: a.name,
                              image: a.image,
                              region: region.name,
                              category: "attraction",
                              lat: a.lat,
                              lng: a.lng,
                              price: a.ticket,
                              priceKind: "ticket",
                            }}
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {tab === "venues" && (
              <div>
                <h2 className="font-display text-3xl font-semibold text-ink">
                  {region.name}da yerləşmə, yemək və alış-veriş
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Yoxlanılmış otellər, restoranlar, kafelər və marketlər.
                </p>
                {venues.length === 0 ? (
                  <div className="mt-10 rounded-3xl border border-dashed border-line bg-surface p-12 text-center">
                    <Store className="mx-auto size-10 text-muted" />
                    <p className="mt-4 font-semibold text-ink">Hələ qeydiyyatlı məkan yoxdur</p>
                    <p className="mt-1 text-sm text-muted">
                      Bu regionda biznes sahibisinizsə, ilk elanı siz yerləşdirin.
                    </p>
                    <Link
                      href="/business"
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-em px-5 py-2.5 text-sm font-semibold text-white hover:bg-emb"
                    >
                      Elan yerləşdir
                    </Link>
                  </div>
                ) : (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {venues.map((v) => (
                      <VenueCard key={v.id} venue={v} regionName={region.name} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "tips" && (
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-3xl font-semibold text-ink">Yerli məsləhətlər</h2>
                <p className="mt-2 text-sm text-muted">
                  Həmin regionu yaxşı tanıyan bələdçilərimizdən praktiki tövsiyələr.
                </p>
                <ol className="mt-8 space-y-4">
                  {region.tips.map((t, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex gap-4 rounded-2xl border border-line bg-surface p-5"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-goldt font-display text-sm font-bold text-gold">
                        {i + 1}
                      </span>
                      <p className="text-[15px] leading-relaxed text-ink2">{t}</p>
                    </motion.li>
                  ))}
                </ol>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* other regions */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-ink">Digər istiqamətlər</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((r) => (
            <RegionCard key={r.slug} region={r} />
          ))}
        </div>
      </section>
    </>
  );
}
