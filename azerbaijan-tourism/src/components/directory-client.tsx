"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  ArrowDownUp,
  Banknote,
  Filter,
  LocateFixed,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { CATEGORY_LABELS, haversineKm } from "@/lib/format";
import type { Region, Venue } from "@/lib/types";
import { Reveal } from "./reveal";
import { VenueCard } from "./venue-card";
import { usePlan } from "@/lib/store";

const BAKU = { lat: 40.4093, lng: 49.8671 };

const CATS = [
  { key: "all", label: "Hamısı" },
  { key: "hotel", label: "Otellər" },
  { key: "restaurant", label: "Restoranlar" },
  { key: "cafe", label: "Kafelər" },
  { key: "supermarket", label: "Supermarketlər" },
  { key: "store", label: "Mağazalar" },
];

const SORTS = [
  { key: "recommended", label: "Tövsiyə olunan" },
  { key: "closest", label: "Mənə ən yaxın" },
  { key: "rating", label: "Ən yüksək reytinq" },
  { key: "priceAsc", label: "Qiymət: aşağıdan yuxarı" },
  { key: "priceDesc", label: "Qiymət: yuxarıdan aşağı" },
];

const DISTANCES = [
  { key: "any", label: "İstənilən məsafə" },
  { key: "5", label: "5 km radiusda" },
  { key: "10", label: "10 km radiusda" },
  { key: "25", label: "25 km radiusda" },
  { key: "50", label: "50 km radiusda" },
];

const norm = (s: string) => s.toLocaleLowerCase("az-Latn-AZ");

export function DirectoryClient({
  venues,
  regions,
  regionNames,
  initialQuery,
  initialCategory,
}: {
  venues: Venue[];
  regions: Region[];
  regionNames: Record<number, string>;
  initialQuery: string;
  initialCategory: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [cat, setCat] = useState(CATS.some((c) => c.key === initialCategory) ? initialCategory : "all");
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [regionSlug, setRegionSlug] = useState("all");
  const [maxDist, setMaxDist] = useState("any");
  const [sort, setSort] = useState("recommended");
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const showToast = usePlan((s) => s.showToast);

  const regionSlugById = useMemo(
    () => new Map(regions.map((r) => [r.id, r.slug])),
    [regions],
  );

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setUserLoc(BAKU);
      showToast("Geolokasiya dəstəklənmir — Bakı mərkəzi götürüldü");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        showToast("Yeriniz tapıldı — məsafələr yeniləndi");
      },
      () => {
        setUserLoc(BAKU);
        showToast("İcazə verilmədi — Bakı mərkəzi götürüldü");
      },
      { timeout: 6000 },
    );
  };

  const withDistance = useMemo(
    () =>
      venues.map((v) => ({
        v,
        d: userLoc ? haversineKm(userLoc, { lat: v.lat, lng: v.lng }) : undefined,
      })),
    [venues, userLoc],
  );

  const filtered = useMemo(() => {
    const needle = norm(q.trim());
    let list = withDistance.filter(({ v, d }) => {
      if (cat !== "all" && v.category !== cat) return false;
      if (regionSlug !== "all" && regionSlugById.get(v.regionId) !== regionSlug) return false;
      if (v.avgPrice > maxPrice) return false;
      if (v.rating < minRating) return false;
      if (maxDist !== "any") {
        if (d === undefined) return true;
        if (d > Number(maxDist)) return false;
      }
      if (needle) {
        const hay = norm(
          `${v.name} ${v.description} ${v.address} ${CATEGORY_LABELS[v.category] ?? ""} ${regionNames[v.regionId] ?? ""}`,
        );
        if (!hay.includes(needle)) return false;
      }
      return true;
    });

    switch (sort) {
      case "closest":
        list = [...list].sort((a, b) => (a.d ?? Infinity) - (b.d ?? Infinity));
        break;
      case "rating":
        list = [...list].sort((a, b) => b.v.rating - a.v.rating || b.v.reviews - a.v.reviews);
        break;
      case "priceAsc":
        list = [...list].sort((a, b) => a.v.avgPrice - b.v.avgPrice);
        break;
      case "priceDesc":
        list = [...list].sort((a, b) => b.v.avgPrice - a.v.avgPrice);
        break;
      default:
        list = [...list].sort(
          (a, b) =>
            Number(b.v.featured) - Number(a.v.featured) ||
            b.v.rating * Math.log10(b.v.reviews + 10) - a.v.rating * Math.log10(a.v.reviews + 10),
        );
    }
    return list;
  }, [withDistance, q, cat, regionSlug, maxPrice, minRating, maxDist, sort, regionSlugById, regionNames]);

  const reset = () => {
    setQ("");
    setCat("all");
    setMaxPrice(500);
    setMinRating(0);
    setRegionSlug("all");
    setMaxDist("any");
    setSort("recommended");
  };

  const activeFilters =
    (cat !== "all" ? 1 : 0) +
    (maxPrice < 500 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (regionSlug !== "all" ? 1 : 0) +
    (maxDist !== "any" ? 1 : 0);

  const FilterPanel = (
    <div className="space-y-7">
      <div>
        <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
          <Filter className="size-3.5" /> Kateqoriya
        </h4>
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                cat === c.key
                  ? "bg-em text-white shadow-lift"
                  : "border border-line bg-surface text-ink2 hover:border-em hover:text-em"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted">Region</h4>
        <select
          value={regionSlug}
          onChange={(e) => setRegionSlug(e.target.value)}
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-medium text-ink outline-none transition-colors focus:border-emb"
        >
          <option value="all">Bütün regionlar</option>
          {regions.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
          <Banknote className="size-3.5" /> Qiymət tavanı
        </h4>
        <p className="mb-2 font-display text-xl font-bold text-em">
          ₼{maxPrice}
          <span className="ml-1 text-xs font-medium text-muted">və aşağı</span>
        </p>
        <input
          type="range"
          min={5}
          max={500}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted">
          <span>₼5</span>
          <span>₼500+</span>
        </div>
      </div>

      <div>
        <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
          <Star className="size-3.5" /> Minimum reytinq
        </h4>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5, 4.7].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                minRating === r
                  ? "bg-gold text-white shadow-lift"
                  : "border border-line bg-surface text-ink2 hover:border-gold hover:text-gold"
              }`}
            >
              {r === 0 ? "Hamısı" : <>{r}+ <Star className="size-3" fill="currentColor" /></>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
          <MapPin className="size-3.5" /> Məsafə
        </h4>
        <select
          value={maxDist}
          onChange={(e) => setMaxDist(e.target.value)}
          className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm font-medium text-ink outline-none transition-colors focus:border-emb"
        >
          {DISTANCES.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>
        <button
          onClick={locate}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            userLoc
              ? "bg-emt text-em"
              : "border border-line bg-surface text-ink2 hover:border-em hover:text-em"
          }`}
        >
          <LocateFixed className="size-4" />
          {userLoc ? "Yeriniz təyin edilib" : "Yerimi tap"}
        </button>
      </div>

      {activeFilters > 0 && (
        <button
          onClick={reset}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-terra/40 bg-tert px-4 py-2.5 text-sm font-semibold text-terra transition-colors hover:bg-terra hover:text-white"
        >
          <X className="size-4" /> Filtrləri sıfırla ({activeFilters})
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="ornament text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
              Ağıllı kataloq
            </span>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Məkanlar və xidmətlər
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {venues.length} yoxlanılmış məkan — real vaxtda axtarış, çoxmeyarlı filtrlər və
              çevik sıralama ilə.
            </p>
          </div>
          <div className="glass flex w-full items-center gap-2 rounded-full p-2 sm:w-auto sm:min-w-[26rem]">
            <Search className="ml-3 size-5 shrink-0 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ad, mətbəx, ünvan üzrə axtar…"
              className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted"
            />
            {q && (
              <button onClick={() => setQ("")} className="grid size-8 place-items-center rounded-full text-muted hover:bg-bgs hover:text-ink">
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[17rem_1fr]">
        {/* sidebar desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-3xl border border-line bg-surface p-6 shadow-lift">
            {FilterPanel}
          </div>
        </aside>

        {/* mobile filters */}
        <div className="lg:hidden">
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink shadow-lift"
          >
            <SlidersHorizontal className="size-4 text-em" />
            Filtrlər {activeFilters > 0 && <span className="grid size-5 place-items-center rounded-full bg-em text-[10px] font-bold text-white">{activeFilters}</span>}
          </button>
          <AnimatePresence>
            {filtersOpen && (
              <div className="mt-4 rounded-3xl border border-line bg-surface p-6 shadow-lift">
                {FilterPanel}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-muted">
              <span className="font-display text-xl font-bold text-ink">{filtered.length}</span> nəticə tapıldı
            </p>
            <label className="flex items-center gap-2 text-sm">
              <ArrowDownUp className="size-4 text-muted" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-ink outline-none transition-colors focus:border-emb"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-surface p-14 text-center">
              <Search className="mx-auto size-10 text-muted" />
              <p className="mt-4 font-display text-xl font-semibold text-ink">Heç nə tapılmadı</p>
              <p className="mt-2 text-sm text-muted">
                Axtarış sözünü sadələşdirin və ya filtrlərin bir hissəsini ləğv edin.
              </p>
              <button
                onClick={reset}
                className="mt-6 rounded-full bg-em px-6 py-2.5 text-sm font-semibold text-white hover:bg-emb"
              >
                Filtrləri sıfırla
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(({ v, d }, i) => (
                <Reveal key={v.id} delay={Math.min(i, 8) * 0.04} y={16}>
                  <VenueCard venue={v} regionName={regionNames[v.regionId]} distance={d} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
