import type { Metadata } from "next";
import { RegionCard } from "@/components/region-card";
import { Reveal } from "@/components/reveal";
import { getAllRegions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Regionlar bələdçisi",
  description: "Bakı, Gəncə, Şuşa, Qəbələ, Şəki, Lənkəran, Quba, Xızı, Şamaxı və İsmayıllı — tam regional bələdçilər.",
};

export default async function RegionsPage() {
  const regions = await getAllRegions();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6">
      <Reveal>
        <div className="max-w-3xl">
          <span className="ornament text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
            Regional bələdçi
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Azərbaycanın regionlarını tanıyın
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Paytaxtın müasir ritmindən Qarabağın dağ zirvələrinə qədər — hər region üçün tarix,
            mədəniyyət, muzeylər, teatrlar, abidələr və yerli məsləhətlər.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((r, i) => (
          <Reveal key={r.slug} delay={(i % 3) * 0.08}>
            <RegionCard region={r} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
