"use client";

import { useState } from "react";
import {
  Banknote,
  BedDouble,
  Calculator,
  Minus,
  Navigation,
  Plus,
  Save,
  ShoppingBasket,
  Ticket,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { azn, aznPrecise, computeExpenses, km } from "@/lib/format";
import { usePlan } from "@/lib/store";

export function ExpensePanel() {
  const days = usePlan((s) => s.days);
  const persons = usePlan((s) => s.persons);
  const setPersons = usePlan((s) => s.setPersons);
  const clearAll = usePlan((s) => s.clearAll);
  const showToast = usePlan((s) => s.showToast);
  const [planName, setPlanName] = useState("");
  const [saving, setSaving] = useState(false);

  const items = days.reduce((n, d) => n + d.items.length, 0);
  const e = computeExpenses(days, persons);

  const rows = [
    { icon: BedDouble, label: "Qonaqlama (otel gecələri)", value: e.accommodation, tint: "bg-emt text-em" },
    { icon: UtensilsCrossed, label: `Qidalanma (${persons} nəfər)`, value: e.dining, tint: "bg-tert text-terra" },
    { icon: Ticket, label: "Giriş biletləri", value: e.tickets, tint: "bg-goldt text-gold" },
    { icon: Navigation, label: `Nəqliyyat (~${km(e.transportKm)})`, value: e.transport, tint: "bg-emt text-em" },
    { icon: ShoppingBasket, label: "Alış-veriş / market", value: e.shopping, tint: "bg-tert text-terra" },
  ];

  const save = async () => {
    if (items === 0) {
      showToast("Boş planı saxlamaq olmaz");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: planName.trim() || "Adsız marşrut",
          days,
          totalCost: Math.round(e.total * 100) / 100,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("Plan yadda saxlanıldı ✓");
      setPlanName("");
    } catch {
      showToast("Xəta baş verdi — yenidən cəhd edin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="sticky top-32 space-y-5">
      <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
        <div className="bg-em px-6 py-5 text-white">
          <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Calculator className="size-5" /> Xərc kalkulyatoru
          </h3>
          <p className="mt-1 text-xs text-white/70">
            Real vaxtda, Azərbaycan manatı ilə hesablanır
          </p>
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between rounded-2xl border border-line bg-bgs px-4 py-3">
            <span className="text-sm font-semibold text-ink">Səyahətçi sayı</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPersons(persons - 1)}
                className="grid size-8 place-items-center rounded-full border border-line bg-surface text-ink transition hover:border-em hover:text-em disabled:opacity-40"
                disabled={persons <= 1}
                aria-label="Azalt"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center font-display text-xl font-bold text-em">{persons}</span>
              <button
                onClick={() => setPersons(persons + 1)}
                className="grid size-8 place-items-center rounded-full border border-line bg-surface text-ink transition hover:border-em hover:text-em disabled:opacity-40"
                disabled={persons >= 12}
                aria-label="Artır"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <ul className="space-y-2">
            {rows.map((r) => (
              <li
                key={r.label}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface2 px-4 py-3"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-xl ${r.tint}`}>
                    <r.icon className="size-4.5" />
                  </span>
                  <span className="truncate text-sm font-medium text-ink2">{r.label}</span>
                </span>
                <span className="shrink-0 font-display text-base font-bold text-ink">
                  {aznPrecise(r.value)}
                </span>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl bg-em p-5 text-white">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-white/80">Ümumi xərc</span>
              <span className="font-display text-3xl font-bold">{azn(e.total)}</span>
            </div>
            <div className="mt-1 flex items-baseline justify-between text-xs text-white/70">
              <span>Adambaşına</span>
              <span className="font-semibold text-amber-200">{aznPrecise(e.perPerson)}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <input
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="Planın adı (məs. 5 günlük Qarabağ turu)"
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink outline-none transition-colors placeholder:text-muted focus:border-emb"
            />
            <button
              onClick={save}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-white shadow-lift transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Save className="size-4" /> {saving ? "Saxlanılır…" : "Planı yadda saxla"}
            </button>
            <button
              onClick={() => {
                clearAll();
                showToast("Marşrut təmizləndi");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-terra hover:text-terra"
            >
              <Trash2 className="size-4" /> Hamısını təmizlə
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-5 text-xs leading-relaxed text-muted shadow-lift">
        <p className="flex items-start gap-2">
          <Banknote className="mt-0.5 size-4 shrink-0 text-em" />
          Model: otel qiyməti gecəlikdir (2 nəfərə 1 otaq), restoran/kafe nəfərbaşı, bilet
          nəfərbaşına, nəqliyyat isə gündə 6₼ baza + kilometrə 0,45₼ olaraq hesablanır.
        </p>
      </div>
    </aside>
  );
}
