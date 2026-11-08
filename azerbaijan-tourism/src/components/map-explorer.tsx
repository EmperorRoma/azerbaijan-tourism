"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import {
  List,
  LocateFixed,
  MapPin,
  Navigation,
  Route,
  Search,
  Star,
  X,
} from "lucide-react";
import type { MapPoint } from "./map-page-client";
import { NavSimulator, type Waypoint } from "./nav-simulator";
import { azn, CATEGORY_LABELS, haversineKm, km } from "@/lib/format";
import { usePlan } from "@/lib/store";

const CAT_META: Record<string, { color: string; svg: string; label: string }> = {
  hotel: {
    color: "#0c4a36",
    label: "Otel",
    svg: '<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/>',
  },
  restaurant: {
    color: "#bf5a33",
    label: "Restoran",
    svg: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z"/><path d="M21 15v7"/>',
  },
  cafe: {
    color: "#b9872f",
    label: "Kafe",
    svg: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>',
  },
  supermarket: {
    color: "#33475e",
    label: "Supermarket",
    svg: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  },
  store: {
    color: "#7a4b93",
    label: "Mağaza",
    svg: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>',
  },
  attraction: {
    color: "#a31236",
    label: "Görməli yer",
    svg: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  },
};

const pinCache = new Map<string, L.DivIcon>();
function pinIcon(cat: string): L.DivIcon {
  const meta = CAT_META[cat] ?? CAT_META.attraction;
  const cached = pinCache.get(cat);
  if (cached) return cached;
  const icon = L.divIcon({
    className: "az-marker",
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    popupAnchor: [0, -38],
    html: `<div style="position:relative;width:34px;height:42px;filter:drop-shadow(0 4px 6px rgba(0,0,0,.35))">
      <svg width="34" height="42" viewBox="0 0 34 42"><path d="M17 40 C 5 26 2 21 2 14.5 A 15 15 0 1 1 32 14.5 C 32 21 29 26 17 40 Z" fill="${meta.color}" stroke="#ffffff" stroke-width="2"/></svg>
      <svg style="position:absolute;top:7px;left:9px" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${meta.svg}</svg>
    </div>`,
  });
  pinCache.set(cat, icon);
  return icon;
}

const numCache = new Map<number, L.DivIcon>();
function numberIcon(n: number): L.DivIcon {
  const cached = numCache.get(n);
  if (cached) return cached;
  const icon = L.divIcon({
    className: "az-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
    html: `<div style="width:30px;height:30px;border-radius:9999px;background:#b9872f;border:2.5px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:13px">${n}</div>`,
  });
  numCache.set(n, icon);
  return icon;
}

function FlyTo({ target }: { target: { lat: number; lng: number; zoom: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], target.zoom, { duration: 1.4 });
  }, [target, map]);
  return null;
}

function FitBoundsOnOpen({ points, when }: { points: Waypoint[]; when: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (when && points.length >= 2) {
      map.fitBounds(
        L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])).pad(0.25),
        { duration: 1 },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [when]);
  return null;
}

function interpolate(points: Waypoint[], t: number): { lat: number; lng: number } | null {
  if (points.length === 0) return null;
  if (points.length === 1) return points[0];
  const segs: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const d = haversineKm(points[i - 1], points[i]);
    segs.push(d);
    total += d;
  }
  if (total === 0) return points[0];
  let remaining = t * total;
  for (let i = 0; i < segs.length; i++) {
    if (remaining <= segs[i] || i === segs.length - 1) {
      const f = segs[i] === 0 ? 0 : Math.min(1, remaining / segs[i]);
      const a = points[i];
      const b = points[i + 1];
      return { lat: a.lat + (b.lat - a.lat) * f, lng: a.lng + (b.lng - a.lng) * f };
    }
    remaining -= segs[i];
  }
  return points[points.length - 1];
}

const CHIPS = [
  { key: "all", label: "Hamısı" },
  { key: "attraction", label: "Görməli yerlər" },
  { key: "hotel", label: "Otellər" },
  { key: "restaurant", label: "Restoranlar" },
  { key: "cafe", label: "Kafelər" },
  { key: "supermarket", label: "Marketlər" },
];

export default function MapExplorer({
  points,
  focusLatLng,
  regionLatLng,
}: {
  points: MapPoint[];
  focusLatLng?: { lat: number; lng: number; zoom: number };
  regionLatLng?: { lat: number; lng: number; zoom: number };
}) {
  const [chip, setChip] = useState("all");
  const [q, setQ] = useState("");
  const [fly, setFly] = useState<{ lat: number; lng: number; zoom: number } | null>(
    focusLatLng ?? regionLatLng ?? null,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showRoute, setShowRoute] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [navProgress, setNavProgress] = useState<number | null>(null);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [dark, setDark] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const days = usePlan((s) => s.days);
  const addItem = usePlan((s) => s.addItem);
  const showToast = usePlan((s) => s.showToast);

  useEffect(() => {
    const el = document.documentElement;
    setDark(el.classList.contains("dark"));
    const obs = new MutationObserver(() => setDark(el.classList.contains("dark")));
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const norm = (s: string) => s.toLocaleLowerCase("az-Latn-AZ");

  const filtered = useMemo(() => {
    const needle = norm(q.trim());
    return points.filter((p) => {
      if (chip !== "all" && p.category !== chip) return false;
      if (needle && !norm(`${p.name} ${p.region} ${p.desc}`).includes(needle)) return false;
      return true;
    });
  }, [points, chip, q]);

  const waypoints: Waypoint[] = useMemo(
    () =>
      days.flatMap((d) =>
        [...d.items]
          .sort((a, b) => a.time.localeCompare(b.time))
          .map((i) => ({ name: i.name, lat: i.lat, lng: i.lng, time: i.time, image: i.image })),
      ),
    [days],
  );

  const routeLatLngs = waypoints.map((w) => [w.lat, w.lng] as [number, number]);
  const navPos = navProgress !== null ? interpolate(waypoints, navProgress) : null;

  const totalKm = useMemo(() => {
    let t = 0;
    for (let i = 1; i < waypoints.length; i++) t += haversineKm(waypoints[i - 1], waypoints[i]);
    return t;
  }, [waypoints]);

  const locate = () => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(loc);
        setFly({ ...loc, zoom: 13 });
      },
      () => showToast("Yer təyin olunmadı — icazəni yoxlayın"),
      { timeout: 6000 },
    );
  };

  const centerOn = (p: MapPoint) => {
    setSelectedId(p.id);
    setFly({ lat: p.lat, lng: p.lng, zoom: 14 });
    requestAnimationFrame(() => {
      const m = markerRefs.current[p.id];
      if (m) setTimeout(() => m.openPopup(), 900);
    });
  };

  return (
    <div className="relative flex h-[100svh] flex-col pt-16">
      {/* toolbar */}
      <div className="absolute inset-x-0 top-16 z-20 border-b border-line glass-strong">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2.5 px-4 py-3 sm:px-6">
          <h1 className="mr-2 hidden items-center gap-2 font-display text-lg font-semibold text-ink md:flex">
            <MapPin className="size-5 text-em" /> İnteraktiv xəritə
          </h1>
          <div className="no-scrollbar flex flex-1 items-center gap-1.5 overflow-x-auto">
            {CHIPS.map((c) => (
              <button
                key={c.key}
                onClick={() => setChip(c.key)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  chip === c.key
                    ? "bg-em text-white shadow-lift"
                    : "border border-line bg-surface text-ink2 hover:border-em hover:text-em"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowRoute((v) => !v)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              showRoute && waypoints.length >= 2
                ? "bg-gold text-white shadow-lift"
                : "border border-line bg-surface text-ink2 hover:border-gold hover:text-gold"
            }`}
          >
            <Route className="size-4" /> Marşrut {waypoints.length > 0 && `(${waypoints.length})`}
          </button>
          <button
            onClick={() => {
              if (waypoints.length < 2) {
                showToast("Naviqasiya üçün marşruta ən azı 2 məkan əlavə edin");
                return;
              }
              setNavOpen(true);
              setNavProgress(0);
            }}
            className="flex items-center gap-2 rounded-full bg-em px-4 py-2 text-xs font-bold text-white shadow-lift transition-all hover:bg-emb"
          >
            <Navigation className="size-4" /> Naviqasiya
          </button>
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink2 transition-all hover:border-em hover:text-em lg:hidden"
            aria-label="Siyahı"
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* side list */}
        <aside
          className={`glass-strong z-10 w-full shrink-0 flex-col overflow-hidden border-r border-line lg:flex lg:w-[22rem] ${
            panelOpen ? "flex" : "hidden"
          }`}
        >
          <div className="border-b border-line p-4">
            <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5">
              <Search className="size-4 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Xəritədə axtar…"
                className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted"
              />
              {q && (
                <button onClick={() => setQ("")}>
                  <X className="size-4 text-muted" />
                </button>
              )}
            </div>
            <p className="mt-2.5 text-xs font-semibold text-muted">{filtered.length} məntəqə göstərilir</p>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => centerOn(p)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition-all ${
                  selectedId === p.id
                    ? "border-emb bg-emt"
                    : "border-line bg-surface hover:border-emb"
                }`}
              >
                <img src={p.image} alt="" loading="lazy" className="size-12 shrink-0 rounded-xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-ink">{p.name}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                    <span
                      className="inline-block size-2 rounded-full"
                      style={{ background: CAT_META[p.category]?.color }}
                    />
                    {p.source === "attraction" ? "Görməli yer" : CATEGORY_LABELS[p.category]}
                    <span>·</span> {p.region}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-gold">
                  <Star className="size-3.5" fill="currentColor" /> {p.rating.toFixed(1)}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* map */}
        <div className="relative min-w-0 flex-1">
          <MapContainer
            center={[40.4, 47.8]}
            zoom={8}
            className="absolute inset-0"
            zoomControl={false}
          >
            <TileLayer
              key={dark ? "dark" : "light"}
              url={
                dark
                  ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              }
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            />
            <FlyTo target={fly} />
            <FitBoundsOnOpen points={waypoints} when={navOpen} />

            {filtered.map((p) => (
              <Marker
                key={p.id}
                position={[p.lat, p.lng]}
                icon={pinIcon(p.category)}
                ref={(m) => {
                  markerRefs.current[p.id] = m;
                }}
              >
                <Popup>
                  <div className="w-56">
                    <img src={p.image} alt="" className="h-28 w-full rounded-xl object-cover" />
                    <p className="mt-2.5 text-sm font-bold leading-snug">{p.name}</p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: CAT_META[p.category]?.color }}>
                      {p.source === "attraction" ? "Görməli yer" : CATEGORY_LABELS[p.category]} · {p.region}
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-xs opacity-75">{p.desc}</p>
                    <div className="mt-2 flex items-center justify-between text-xs font-bold">
                      <span style={{ color: "var(--em)" }}>
                        {p.price === 0 ? "Pulsuz" : azn(p.price)}
                      </span>
                      <span className="flex items-center gap-1" style={{ color: "var(--gold)" }}>
                        ★ {p.rating.toFixed(1)}
                      </span>
                    </div>
                    <button
                      className="az-popup-btn mt-2.5"
                      onClick={() => {
                        addItem({
                          source: p.source,
                          refId: p.numericId,
                          name: p.name,
                          image: p.image,
                          region: p.region,
                          category: p.category,
                          lat: p.lat,
                          lng: p.lng,
                          price: p.price,
                          priceKind:
                            p.source === "attraction"
                              ? "ticket"
                              : p.category === "hotel"
                                ? "night"
                                : p.category === "supermarket" || p.category === "store"
                                  ? "visit"
                                  : "person",
                        });
                        showToast(`${p.name} marşruta əlavə olundu`);
                      }}
                    >
                      + Marşruta əlavə et
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {showRoute && waypoints.length >= 2 && (
              <Polyline
                positions={routeLatLngs}
                pathOptions={{ color: "#b9872f", weight: 4, dashArray: "1 10", lineCap: "round", opacity: 0.9 }}
              />
            )}

            {showRoute &&
              waypoints.map((w, i) => (
                <Marker key={`wp-${i}`} position={[w.lat, w.lng]} icon={numberIcon(i + 1)}>
                  <Popup>
                    <p className="text-xs font-bold">
                      {i + 1}. {w.name}
                    </p>
                    {"time" in w && w.time && <p className="text-[11px] opacity-70">Plan saatı: {w.time}</p>}
                  </Popup>
                </Marker>
              ))}

            {userLoc && (
              <CircleMarker
                center={[userLoc.lat, userLoc.lng]}
                radius={9}
                pathOptions={{ color: "#fff", weight: 3, fillColor: "#2f7cf6", fillOpacity: 1 }}
              />
            )}

            {navPos && (
              <CircleMarker
                center={[navPos.lat, navPos.lng]}
                radius={10}
                pathOptions={{ color: "#fff", weight: 3, fillColor: "#bf5a33", fillOpacity: 1 }}
              />
            )}
          </MapContainer>

          {/* floating controls */}
          <div className="absolute bottom-6 right-4 z-[500] flex flex-col gap-2">
            <button
              onClick={locate}
              aria-label="Yerimi göstər"
              className="grid size-11 place-items-center rounded-full border border-line bg-surface text-ink shadow-lift transition-all hover:border-em hover:text-em"
            >
              <LocateFixed className="size-5" />
            </button>
          </div>

          {showRoute && waypoints.length >= 2 && !navOpen && (
            <div className="glass-strong absolute bottom-6 left-4 z-[500] rounded-2xl px-4 py-3 shadow-lift">
              <p className="flex items-center gap-2 text-xs font-bold text-ink">
                <Route className="size-4 text-gold" /> Marşrut aktiv
              </p>
              <p className="mt-1 text-[11px] text-muted">
                {waypoints.length} dayanacaq · təxminən {km(totalKm)} (quş uçuşu)
              </p>
            </div>
          )}
        </div>
      </div>

      {navOpen && (
        <NavSimulator
          waypoints={waypoints}
          onClose={() => {
            setNavOpen(false);
            setNavProgress(null);
          }}
          onProgress={(t) => setNavProgress(t)}
        />
      )}
    </div>
  );
}
