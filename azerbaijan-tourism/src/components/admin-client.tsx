"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  Check,
  CircleAlert,
  Clock4,
  Inbox,
  Loader2,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { CATEGORY_LABELS, timeAgo } from "@/lib/format";
import type { Submission } from "@/lib/types";

const STATUS_META: Record<string, { label: string; cls: string; icon: typeof Clock4 }> = {
  pending: { label: "Baxış gözləyir", cls: "bg-goldt text-gold", icon: Clock4 },
  approved: { label: "Təsdiqləndi", cls: "bg-emt text-em", icon: BadgeCheck },
  rejected: { label: "İmtina edildi", cls: "bg-tert text-terra", icon: CircleAlert },
};

export function AdminClient({
  submissions,
  regionNames,
}: {
  submissions: Submission[];
  regionNames: Record<string, string>;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const act = async (id: number, action: "approve" | "reject") => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/submissions/${id}/${action}`, { method: "POST" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Əməliyyat alınmadı");
      } else {
        router.refresh();
      }
    } catch {
      setError("Şəbəkə xətası");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mt-8">
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-center gap-2 rounded-xl bg-tert px-4 py-3 text-sm font-semibold text-terra"
          >
            <CircleAlert className="size-4" /> {error}
          </motion.p>
        )}
      </AnimatePresence>

      {submissions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-surface p-14 text-center">
          <Inbox className="mx-auto size-10 text-muted" />
          <p className="mt-4 font-display text-xl font-semibold text-ink">Müraciət yoxdur</p>
          <p className="mt-2 text-sm text-muted">
            Biznes portalından yeni elan göndərildikdə burada görünəcək.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => {
            const meta = STATUS_META[s.status] ?? STATUS_META.pending;
            return (
              <motion.article
                key={s.id}
                layout
                className="rounded-3xl border border-line bg-surface p-6 shadow-lift"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display text-xl font-semibold text-ink">
                        {s.businessName}
                      </h3>
                      <span className="rounded-full bg-emt px-2.5 py-0.5 text-[11px] font-bold text-em">
                        {CATEGORY_LABELS[s.category] ?? s.category}
                      </span>
                      <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${meta.cls}`}>
                        <meta.icon className="size-3" />
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-muted">
                      Referans KE-{String(s.id).padStart(5, "0")} · {s.ownerName} · {timeAgo(s.createdAt)}
                    </p>
                  </div>

                  {s.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => act(s.id, "approve")}
                        disabled={busyId === s.id}
                        className="flex items-center gap-2 rounded-full bg-em px-5 py-2.5 text-xs font-bold text-white shadow-lift transition-all hover:bg-emb disabled:opacity-60"
                      >
                        {busyId === s.id ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                        Təsdiqlə və yayımla
                      </button>
                      <button
                        onClick={() => act(s.id, "reject")}
                        disabled={busyId === s.id}
                        className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-xs font-bold text-terra transition-colors hover:border-terra disabled:opacity-60"
                      >
                        <X className="size-3.5" /> İmtina et
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink2">{s.description}</p>

                <div className="mt-4 grid flex-wrap gap-x-8 gap-y-2 text-xs text-muted sm:grid-cols-2 lg:grid-cols-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-em" />
                    {regionNames[s.regionSlug] ?? s.regionSlug} — {s.address}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-em" /> {s.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5 text-em" /> {s.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock4 className="size-3.5 text-em" /> {s.hours || "saatlar qeyd olunmayıb"}
                  </span>
                </div>

                {(s.priceInfo || s.notes) && (
                  <div className="mt-4 rounded-2xl bg-bgs px-4 py-3 text-xs text-muted">
                    {s.priceInfo && (
                      <p>
                        <span className="font-bold text-ink2">Qiymət:</span> {s.priceInfo}
                      </p>
                    )}
                    {s.notes && (
                      <p className="mt-1">
                        <span className="font-bold text-ink2">Qeyd:</span> {s.notes}
                      </p>
                    )}
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
