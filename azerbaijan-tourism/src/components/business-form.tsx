"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, CircleAlert, Hourglass, Loader2, Send } from "lucide-react";

const CATEGORIES = [
  { key: "hotel", label: "Otel / qonaq evi" },
  { key: "restaurant", label: "Restoran" },
  { key: "cafe", label: "Kafe / çay evi" },
  { key: "supermarket", label: "Supermarket" },
  { key: "store", label: "Mağaza / bazar" },
];

type Errors = Record<string, string>;

const inputCls =
  "w-full rounded-xl border border-line bg-bgs px-4 py-3 text-sm font-medium text-ink outline-none transition-all placeholder:text-muted focus:border-emb focus:bg-surface focus:ring-4 focus:ring-emt";

export function BusinessForm({ regions }: { regions: { slug: string; name: string }[] }) {
  const [form, setForm] = useState({
    ownerName: "",
    businessName: "",
    category: "restaurant",
    regionSlug: "baki",
    description: "",
    address: "",
    phone: "",
    email: "",
    priceInfo: "",
    hours: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [serverError, setServerError] = useState("");

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = (): Errors => {
    const errs: Errors = {};
    if (form.ownerName.trim().length < 3) errs.ownerName = "Ad və soyad ən azı 3 simvol olmalıdır";
    if (form.businessName.trim().length < 2) errs.businessName = "Məkan adı tələb olunur";
    if (form.description.trim().length < 30)
      errs.description = "Təsvir ən azı 30 simvol olmalıdır (menyu, xidmətlər, fərqləndirici cəhətlər)";
    if (form.address.trim().length < 6) errs.address = "Tam ünvan yazın";
    if (!/^[+0-9()\-\s]{9,20}$/.test(form.phone.trim())) errs.phone = "Düzgün telefon nömrəsi daxil edin";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errs.email = "Düzgün e-poçt ünvanı daxil edin";
    return errs;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setBusy(true);
    setServerError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setServerError(data.error ?? "Xəta baş verdi");
        return;
      }
      setTicketId(data.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError("Şəbəkə xətası — yenidən cəhd edin");
    } finally {
      setBusy(false);
    }
  };

  if (ticketId !== null) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-line bg-surface p-8 text-center shadow-lift sm:p-12"
      >
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-goldt">
          <Hourglass className="size-8 text-gold" />
        </span>
        <h2 className="mt-5 font-display text-3xl font-semibold text-ink">Elanınız qəbul edildi</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Referans nömrəsi: <span className="font-bold text-ink">KE-{String(ticketId).padStart(5, "0")}</span>.
          Elanınız hazırda <span className="font-bold text-gold">“Baxış gözləyir”</span> statusundadır.
          Moderator komandası yoxladıqdan sonra məkanınız kataloqda və xəritədə görünəcək.
        </p>
        <div className="mx-auto mt-8 max-w-sm space-y-3 text-left">
          {[
            ["Müraciət qəbul edildi", true],
            ["Moderator yoxlaması", false],
            ["Canlı yayım", false],
          ].map(([label, on], i) => (
            <div key={label as string} className="flex items-center gap-3">
              <span
                className={`grid size-7 place-items-center rounded-full text-[11px] font-bold ${
                  on ? "bg-em text-white" : "border border-line bg-bgs text-muted"
                }`}
              >
                {i + 1}
              </span>
              <span className={`text-sm font-semibold ${on ? "text-em" : "text-muted"}`}>
                {label as string}
              </span>
              {i < 2 && <span className="h-px flex-1 bg-line" />}
              {Boolean(on) && <BadgeCheck className="size-4 text-em" />}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setTicketId(null);
            setForm({
              ownerName: "",
              businessName: "",
              category: "restaurant",
              regionSlug: "baki",
              description: "",
              address: "",
              phone: "",
              email: "",
              priceInfo: "",
              hours: "",
              notes: "",
            });
          }}
          className="mt-8 rounded-full border border-line bg-bgs px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-em hover:text-em"
        >
          Yeni elan göndər
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-line bg-surface p-6 shadow-lift sm:p-8" noValidate>
      <h2 className="font-display text-2xl font-semibold text-ink">Elan formu</h2>
      <p className="mt-1 text-sm text-muted">Bütün sahələr Azərbaycan mühitinə uyğun yoxlanılır.</p>

      <AnimatePresence>
        {serverError && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 rounded-xl bg-tert px-4 py-3 text-sm font-semibold text-terra"
          >
            <CircleAlert className="size-4" /> {serverError}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Sahibkarın adı *
          </label>
          <input value={form.ownerName} onChange={set("ownerName")} placeholder="Aysel Məmmədova" className={inputCls} />
          {errors.ownerName && <p className="mt-1.5 text-xs font-semibold text-terra">{errors.ownerName}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Məkanın adı *
          </label>
          <input value={form.businessName} onChange={set("businessName")} placeholder="Nar Restoranı" className={inputCls} />
          {errors.businessName && <p className="mt-1.5 text-xs font-semibold text-terra">{errors.businessName}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Kateqoriya *</label>
          <select value={form.category} onChange={set("category")} className={inputCls}>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Region *</label>
          <select value={form.regionSlug} onChange={set("regionSlug")} className={inputCls}>
            {regions.map((r) => (
              <option key={r.slug} value={r.slug}>{r.name}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Təsvir və menyü haqqında *
          </label>
          <textarea
            value={form.description}
            onChange={set("description")}
            rows={4}
            placeholder="Məkanınızı, menyunu, qiymət siyasətinizi və fərqləndirici xüsusiyyətləri təsvir edin…"
            className={inputCls}
          />
          {errors.description && <p className="mt-1.5 text-xs font-semibold text-terra">{errors.description}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Ünvan *</label>
          <input value={form.address} onChange={set("address")} placeholder="Bakı şəh., Nizami küç. 12" className={inputCls} />
          {errors.address && <p className="mt-1.5 text-xs font-semibold text-terra">{errors.address}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">Telefon *</label>
          <input value={form.phone} onChange={set("phone")} placeholder="+994 50 555 12 34" className={inputCls} />
          {errors.phone && <p className="mt-1.5 text-xs font-semibold text-terra">{errors.phone}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">E-poçt *</label>
          <input value={form.email} onChange={set("email")} placeholder="info@mekanim.az" className={inputCls} />
          {errors.email && <p className="mt-1.5 text-xs font-semibold text-terra">{errors.email}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Qiymət məlumatı (AZN)
          </label>
          <input value={form.priceInfo} onChange={set("priceInfo")} placeholder="orta hesab 25 AZN / gecə 80 AZN" className={inputCls} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">İş saatları</label>
          <input value={form.hours} onChange={set("hours")} placeholder="09:00–23:00" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted">
            Əlavə qeydlər (şəkil linkləri, menyu faylı və s.)
          </label>
          <textarea value={form.notes} onChange={set("notes")} rows={3} placeholder="Şəkillərin linki, sosial şəbəkə səhifələri…" className={inputCls} />
        </div>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-em px-6 py-4 text-sm font-bold text-white shadow-lift transition-all hover:bg-emb hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto"
      >
        {busy ? <Loader2 className="size-4.5 animate-spin" /> : <Send className="size-4.5" />}
        {busy ? "Göndərilir…" : "Elanı baxış üçün göndər"}
      </button>
    </form>
  );
}
