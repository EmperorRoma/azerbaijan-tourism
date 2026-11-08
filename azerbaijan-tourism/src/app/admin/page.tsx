import type { Metadata } from "next";
import { AdminClient } from "@/components/admin-client";
import { Reveal } from "@/components/reveal";
import { getAllRegions, getAllSubmissions, getApprovedVenues } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin paneli",
};

export default async function AdminPage() {
  const [subs, venues, regions] = await Promise.all([
    getAllSubmissions(),
    getApprovedVenues(),
    getAllRegions(),
  ]);

  const pending = subs.filter((s) => s.status === "pending").length;
  const approved = subs.filter((s) => s.status === "approved").length;
  const rejected = subs.filter((s) => s.status === "rejected").length;
  const regionNames = new Map(regions.map((r) => [r.slug, r.name]));

  return (
    <div className="mx-auto max-w-6xl px-4 pb-8 pt-28 sm:px-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="ornament text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
              Moderasiya mərkəzi · Demo rejim
            </span>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
              Admin paneli
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
              Biznes portalından gələn elanların yoxlanması. Təsdiqlənən müraciətlər dərhal
              kataloqa və xəritəyə əlavə olunur.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Baxış gözləyir", value: pending, tint: "bg-goldt text-gold" },
          { label: "Təsdiqlənmiş", value: approved, tint: "bg-emt text-em" },
          { label: "İmtina edilmiş", value: rejected, tint: "bg-tert text-terra" },
          { label: "Canlı məkan", value: venues.length, tint: "bg-emt text-em" },
        ].map((s) => (
          <div key={s.label} className="rounded-3xl border border-line bg-surface p-5 shadow-lift">
            <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${s.tint}`}>
              {s.label}
            </span>
            <p className="mt-3 font-display text-3xl font-bold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <AdminClient submissions={subs} regionNames={Object.fromEntries(regionNames)} />
    </div>
  );
}
