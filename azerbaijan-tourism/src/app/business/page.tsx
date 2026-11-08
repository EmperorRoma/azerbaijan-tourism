import type { Metadata } from "next";
import { CheckCircle2, Clock3, Mail, MessageCircle, Phone, Radio, ShieldCheck, Send } from "lucide-react";
import { BusinessForm } from "@/components/business-form";
import { Reveal } from "@/components/reveal";
import { getAllRegions } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Biznes portalı",
  description: "Otelinizi, restoranınızı və ya mağazanızı Kəşf Et Azərbaycan kataloğuna əlavə edin — moderator yoxlamasından sonra elanınız canlı yayımlanır.",
};

const STEPS = [
  {
    icon: Send,
    title: "1. Məlumatları göndərin",
    text: "Məkanınız haqqında təsvir, ünvan, iş saatları və qiymət məlumatını doldurun.",
  },
  {
    icon: ShieldCheck,
    title: "2. Moderator yoxlaması",
    text: "Komandamız elanı 24 saat ərzində yoxlayır. Status: 'Baxış gözləyir'.",
  },
  {
    icon: Radio,
    title: "3. Canlı yayım",
    text: "Təsdiqdən sonra məkanınız kataloqda, xəritədə və axtarışda görünür.",
  },
];

export default async function BusinessPage() {
  const regions = await getAllRegions();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6">
      <Reveal>
        <div className="max-w-3xl">
          <span className="ornament text-[11px] font-bold uppercase tracking-[0.24em] text-gold">
            Biznes portalı
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Məkanınızı xəritəyə əlavə edin
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Tap.az tipli rahat elan sistemi — restoran, otel, kafe və ya mağazanızı qeydiyyatdan
            keçirin. Elanlar əvvəlcə <strong className="text-ink">“Baxış gözləyir”</strong> statusuna
            düşür, admin təsdiqindən sonra isə canlı yayımlanır.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="h-full rounded-3xl border border-line bg-surface p-6 shadow-lift">
              <span className="grid size-12 place-items-center rounded-2xl bg-emt text-em">
                <s.icon className="size-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <BusinessForm regions={regions.map((r) => ({ slug: r.slug, name: r.name }))} />
        </Reveal>

        <Reveal delay={0.15}>
          <div className="space-y-5">
            <div className="rounded-3xl border border-line bg-surface p-6 shadow-lift">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
                <MessageCircle className="size-5 text-em" /> Birbaşa əlaqə kanalları
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Formdan əlavə, komandamıza istənilən kanalla yaza bilərsiniz:
              </p>
              <ul className="mt-5 space-y-3">
                <li className="flex items-center gap-3 rounded-2xl border border-line bg-bgs px-4 py-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-emt text-em">
                    <Phone className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-muted">Zəng mərkəzi</p>
                    <p className="text-sm font-bold text-ink">+994 12 555 01 01</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 rounded-2xl border border-line bg-bgs px-4 py-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-goldt text-gold">
                    <Mail className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-muted">E-poçt</p>
                    <p className="text-sm font-bold text-ink">biznes@kesfet.az</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 rounded-2xl border border-line bg-bgs px-4 py-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-tert text-terra">
                    <MessageCircle className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-muted">WhatsApp xətti</p>
                    <p className="text-sm font-bold text-ink">+994 50 555 01 01</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-em p-6 text-white shadow-lift">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Clock3 className="size-5 text-amber-300" /> Baxış müddəti
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/85">
                <li className="flex gap-3">
                  <CheckCircle2 className="size-4.5 shrink-0 text-amber-300" />
                  İş günləri: orta hesabla 4–8 saat
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="size-4.5 shrink-0 text-amber-300" />
                  Həftə sonları: 24 saata qədər
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="size-4.5 shrink-0 text-amber-300" />
                  Qəbul/imal cavabı e-poçtla bildirilir
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-dashed border-line bg-surface p-5 text-xs leading-relaxed text-muted">
              <p>
                Qeyd: saxta və ya tələb olunan normativlərə uyğun olmayan məlumatlar imtina edilir.
                Eksklüziv yerləşdirmə kampaniyaları üçün biznes@kesfet.az ünvanına yazın.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
