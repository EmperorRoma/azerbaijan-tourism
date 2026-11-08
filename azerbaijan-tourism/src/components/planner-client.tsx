"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Landmark,
  MapPin,
  Navigation,
  Plus,
  Search,
  Store,
  Trash2,
  X,
} from "lucide-react";
import { azn, CATEGORY_LABELS, priceSuffix, TYPE_LABELS } from "@/lib/format";
import { TIME_SLOTS, usePlan } from "@/lib/store";
import type { PlanItem } from "@/lib/types";
import { ExpensePanel } from "./expense-panel";

export type DrawerPlace = {
  id: string;
  source: "venue" | "attraction";
  refId: number;
  name: string;
  image: string;
  category: string;
  categoryLabel: string;
  region: string;
  price: number;
  lat: number;
  lng: number;
};

const DRAWER_TABS = [
  { key: "all", label: "Hamısı" },
  { key: "attraction", label: "Görməli" },
  { key: "restaurant", label: "Restoran" },
  { key: "cafe", label: "Kafe" },
  { key: "hotel", label: "Otel" },
  { key: "supermarket", label: "Market" },
  { key: "store", label: "Mağaza" },
];

const norm = (s: string) => s.toLocaleLowerCase("az-Latn-AZ");

export function PlannerClient({ places }: { places: DrawerPlace[] }) {
  const days = usePlan((s) => s.days);
  const activeDayId = usePlan((s) => s.activeDayId);
  const setActiveDay = usePlan((s) => s.setActiveDay);
  const addDay = usePlan((s) => s.addDay);
  const removeDay = usePlan((s) => s.removeDay);
  const addItem = usePlan((s) => s.addItem);
  const removeItem = usePlan((s) => s.removeItem);
  const moveItem = usePlan((s) => s.moveItem);
  const reorderWithinDay = usePlan((s) => s.reorderWithinDay);
  const setItemTime = usePlan((s) => s.setItemTime);
  const showToast = usePlan((s) => s.showToast);

  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerQ, setDrawerQ] = useState("");
  const [drawerTab, setDrawerTab] = useState("all");
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [dropDay, setDropDay] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  const activeDayNumber = Math.max(1, days.findIndex((d) => d.id === activeDayId) + 1);

  const drawerPlaces = useMemo(() => {
    const needle = norm(drawerQ.trim());
    return places.filter((p) => {
      if (drawerTab !== "all" && p.category !== drawerTab) return false;
      if (needle && !norm(`${p.name} ${p.region} ${p.categoryLabel}`).includes(needle))
        return false;
      return true;
    });
  }, [places, drawerQ, drawerTab]);

  const addPlace = (p: DrawerPlace) => {
    addItem(
      {
        source: p.source,
        refId: p.refId,
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
      },
      activeDayId,
    );
    showToast(`${p.name} → ${activeDayNumber}-ci gün`);
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6">
        <div className="skeleton h-10 w-2/3 rounded-2xl" />
        <div className="mt-4 h-5 w-1/3 rounded-xl skeleton" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="flex gap-5 overflow-hidden">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-96 w-72 shrink-0 rounded-3xl" />
            ))}
          </div>
          <div className="skeleton h-[30rem] rounded-3xl" />
        </div>
      </div>
    );
  }

  const totalItems = days.reduce((n, d) => n + d.items.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="ornament text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
            İnteraktiv planlayıcı
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Səyahət marşrutunuz
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
            Məkanları günlərə əlavə edin, kartları günə və saata görə sürüşdürün — ümumi xərc sağ
            paneldə dərhal yenilənir. Plan brauzerinizdə avtomatik saxlanılır.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-full bg-em px-5 py-3 text-sm font-bold text-white shadow-lift transition-all hover:bg-emb hover:-translate-y-0.5"
          >
            <Plus className="size-4" /> Məkan əlavə et
          </button>
          <Link
            href="/map"
            className="flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-3 text-sm font-bold text-ink transition-all hover:border-em hover:text-em"
          >
            <Navigation className="size-4" /> Xəritədə göstər
          </Link>
        </div>
      </div>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        {/* -------- days board -------- */}
        <div className="no-scrollbar flex snap-x gap-5 overflow-x-auto pb-4">
          {days.map((day, di) => {
            const active = day.id === activeDayId;
            return (
              <section
                key={day.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDropDay(day.id);
                }}
                onDragLeave={() => setDropDay((d) => (d === day.id ? null : d))}
                onDrop={(e) => {
                  e.preventDefault();
                  const key = e.dataTransfer.getData("text/plain") || dragKey;
                  if (key) moveItem(key, day.id);
                  setDragKey(null);
                  setDropDay(null);
                }}
                className={`w-72 shrink-0 snap-start rounded-3xl border bg-surface shadow-lift transition-colors sm:w-80 ${
                  dropDay === day.id ? "border-emb ring-2 ring-emt" : "border-line"
                }`}
              >
                <header
                  className={`flex items-center justify-between rounded-t-3xl px-5 py-4 ${
                    active ? "bg-em text-white" : "bg-bgs text-ink"
                  }`}
                >
                  <button onClick={() => setActiveDay(day.id)} className="text-left">
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${active ? "text-white/70" : "text-muted"}`}>
                      {active ? "Aktiv gün" : "Günə keç"}
                    </p>
                    <h3 className="font-display text-xl font-bold">{di + 1}-ci gün</h3>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        active ? "bg-white/20 text-white" : "bg-surface text-muted"
                      }`}
                    >
                      {day.items.length} dayanacaq
                    </span>
                    {days.length > 1 && (
                      <button
                        onClick={() => removeDay(day.id)}
                        aria-label="Günü sil"
                        className={`grid size-8 place-items-center rounded-full transition ${
                          active ? "text-white/80 hover:bg-white/20" : "text-muted hover:bg-tert hover:text-terra"
                        }`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </header>

                <div className="min-h-40 space-y-3 p-4">
                  <AnimatePresence initial={false}>
                    {day.items.map((item, ii) => (
                      <PlanCard
                        key={item.key}
                        item={item}
                        index={ii}
                        dayId={day.id}
                        onRemove={() => removeItem(item.key)}
                        onTime={(t) => setItemTime(item.key, t)}
                        onMove={(dir) =>
                          reorderWithinDay(day.id, item.key, ii + dir)
                        }
                        canUp={ii > 0}
                        canDown={ii < day.items.length - 1}
                        dragKey={dragKey}
                        setDragKey={setDragKey}
                      />
                    ))}
                  </AnimatePresence>

                  {day.items.length === 0 && (
                    <button
                      onClick={() => {
                        setActiveDay(day.id);
                        setDrawerOpen(true);
                      }}
                      className="grid w-full place-items-center gap-2 rounded-2xl border-2 border-dashed border-line py-10 text-muted transition-colors hover:border-emb hover:text-em"
                    >
                      <CalendarPlus className="size-6" />
                      <span className="text-xs font-semibold">Bu günə məkan əlavə edin</span>
                    </button>
                  )}
                </div>
              </section>
            );
          })}

          <button
            onClick={addDay}
            disabled={days.length >= 14}
            className="grid h-40 w-40 shrink-0 snap-start place-items-center self-start rounded-3xl border-2 border-dashed border-line text-muted transition-all hover:border-em hover:text-em disabled:opacity-40"
          >
            <span className="flex flex-col items-center gap-2">
              <Plus className="size-6" />
              <span className="text-xs font-bold">Gün əlavə et</span>
            </span>
          </button>
        </div>

        <ExpensePanel />
      </div>

      {totalItems === 0 && (
        <div className="mt-10 rounded-3xl border border-line bg-gradient-to-br from-emt via-surface to-goldt p-8 text-center shadow-lift sm:p-12">
          <Landmark className="mx-auto size-10 text-em" />
          <h2 className="mt-4 font-display text-2xl font-semibold text-ink">Marşrutunuzu sıfırdan qurun</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            Kataloqdan otellər, restoranlar və görməli yerlər seçin — xərc təxmini dərhal yan
            paneldə görünəcək.
          </p>
          <Link
            href="/directory"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-em px-6 py-3 text-sm font-bold text-white shadow-lift hover:bg-emb"
          >
            <Store className="size-4" /> Kataloqa bax
          </Link>
        </div>
      )}

      {/* -------- add place drawer -------- */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col border-l border-line bg-surface shadow-lift-lg"
            >
              <header className="border-b border-line p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">Məkan əlavə et</h3>
                    <p className="mt-0.5 text-xs text-muted">
                      İstiqamət: <span className="font-bold text-em">{activeDayNumber}-ci gün</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="grid size-9 place-items-center rounded-full border border-line text-muted hover:text-ink"
                    aria-label="Bağla"
                  >
                    <X className="size-4.5" />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-full border border-line bg-bgs px-4 py-2.5">
                  <Search className="size-4 text-muted" />
                  <input
                    value={drawerQ}
                    onChange={(e) => setDrawerQ(e.target.value)}
                    placeholder="Axtarış…"
                    className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted"
                  />
                </div>
                <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto">
                  {DRAWER_TABS.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setDrawerTab(t.key)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                        drawerTab === t.key
                          ? "bg-em text-white"
                          : "border border-line bg-surface text-ink2 hover:border-em hover:text-em"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </header>

              <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
                {drawerPlaces.length === 0 && (
                  <p className="py-16 text-center text-sm text-muted">Uyğun məkan tapılmadı</p>
                )}
                {drawerPlaces.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-surface2 p-3 transition-colors hover:border-emb"
                  >
                    <img src={p.image} alt="" loading="lazy" className="size-14 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{p.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                        <span className="rounded-full bg-emt px-2 py-0.5 font-semibold text-em">
                          {p.source === "attraction" ? TYPE_LABELS[p.category] ?? "Görməli yer" : p.categoryLabel}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="size-3" /> {p.region}
                        </span>
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="text-xs font-bold text-em">
                        {p.price === 0 ? "Pulsuz" : azn(p.price)}
                      </span>
                      <button
                        onClick={() => addPlace(p)}
                        className="grid size-8 place-items-center rounded-full bg-em text-white transition-all hover:bg-emb active:scale-90"
                        aria-label="Əlavə et"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlanCard({
  item,
  index,
  dayId,
  onRemove,
  onTime,
  onMove,
  canUp,
  canDown,
  dragKey,
  setDragKey,
}: {
  item: PlanItem;
  index: number;
  dayId: string;
  onRemove: () => void;
  onTime: (t: string) => void;
  onMove: (dir: number) => void;
  canUp: boolean;
  canDown: boolean;
  dragKey: string | null;
  setDragKey: (k: string | null) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      draggable
      onDragStart={(e) => {
        (e as unknown as React.DragEvent).dataTransfer?.setData("text/plain", item.key);
        setDragKey(item.key);
      }}
      onDragEnd={() => setDragKey(null)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`group relative flex gap-3 rounded-2xl border border-line bg-surface2 p-3 transition-shadow hover:shadow-lift ${
        dragKey === item.key ? "opacity-40" : ""
      }`}
    >
      <div className="flex cursor-grab flex-col items-center justify-between py-1 text-muted active:cursor-grabbing">
        <GripVertical className="size-4" />
        <select
          value={item.time}
          onChange={(e) => onTime(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-[4.6rem] rounded-lg border border-line bg-surface px-1 py-1 text-center text-[11px] font-bold text-em outline-none"
        >
          {TIME_SLOTS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onMove(-1)}
            disabled={!canUp}
            className="text-muted transition hover:text-em disabled:opacity-25"
            aria-label="Yuxarı"
          >
            <ChevronUp className="size-3.5" />
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={!canDown}
            className="text-muted transition hover:text-em disabled:opacity-25"
            aria-label="Aşağı"
          >
            <ChevronDown className="size-3.5" />
          </button>
        </div>
      </div>

      <img src={item.image} alt="" loading="lazy" className="size-16 shrink-0 self-center rounded-xl object-cover" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold leading-snug text-ink">{item.name}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted">
          <span className="rounded-full bg-emt px-2 py-0.5 font-semibold text-em">
            {item.source === "attraction"
              ? TYPE_LABELS[item.category] ?? CATEGORY_LABELS.attraction
              : CATEGORY_LABELS[item.category] ?? item.category}
          </span>
          <span>{item.region}</span>
        </p>
        <p className="mt-1 text-xs font-bold text-em">
          {item.price === 0 ? "Pulsuz" : `${azn(item.price)}${priceSuffix(item.source === "attraction" ? "attraction" : item.category)}`}
        </p>
      </div>

      <button
        onClick={onRemove}
        aria-label="Sil"
        className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full border border-line bg-surface text-muted opacity-0 shadow-lift transition-all hover:border-terra hover:text-terra group-hover:opacity-100"
        data-day={dayId}
        data-index={index}
      >
        <X className="size-3.5" />
      </button>
    </motion.div>
  );
}
