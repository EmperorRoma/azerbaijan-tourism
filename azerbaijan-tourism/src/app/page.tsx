import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  Calculator,
  Landmark,
  Map as MapIcon,
  Navigation,
  Route,
  Search,
  ShoppingBasket,
  Store,
  StoreIcon,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import { HomeHero } from "@/components/home/hero";
import { RegionCard } from "@/components/region-card";
import { Reveal, SectionHeading } from "@/components/reveal";
import { VenueCard } from "@/components/venue-card";
import { getAllRegions, getApprovedVenues, getStats } from "@/lib/queries";
import { IMG } from "@/lib/images";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  {
    key: "hotel",
    title: "Otellər və qonaq evləri",
    text: "Butik otellərdən beşulduzlu kurortlara — hər büdcəyə uyğun gecələmə seçimləri.",
    icon: BedDouble,
    img: IMG.hotel.room1,
    tint: "from-emerald-900/80",
  },
  {
    key: "restaurant",
    title: "Restoranlar və kafelər",
    text: "Muğam sədaları altında şah plovu, dağ kəndlərində xaş — milli mətbəxin əsl ünvanları.",
    icon: UtensilsCrossed,
    img: IMG.food.feast,
    tint: "from-orange-900/80",
  },
  {
    key: "supermarket",
    title: "Supermarketlər və mağazalar",
    text: "Yol ehtiyatları, yerli məhsullar və suvenir bazarları — səyahətin praktiki tərəfi.",
    icon: ShoppingBasket,
    img: IMG.market.stocked,
    tint: "from-stone-900/80",
  },
] as const;

const STEPS = [
  {
    icon: Search,
    title: "Axtarın və süzün",
    text: "Kateqoriya, qiymət, reytinq və məsafə üzrə ağıllı filtrlərlə sizə uyğun məkanı saniyələrlə tapın.",
  },
  {
    icon: Route,
    title: "Marşrutu planlayın",
    text: "Günlərə görə görməli yerləri, restoranları və otelləri bir siyahıda toplayın — sistem xərci özü hesablayır.",
  },
  {
    icon: Navigation,
    title: "Naviqasiya ilə gedin",
    text: "İnteraktiv xəritədə marşrut xətti, simulyasiya edilmiş səsli bələdçi və addım-addım istiqamətlər.",
  },
];

export default async function HomePage() {
  const [stats, regions, venues] = await Promise.all([
    getStats(),
    getAllRegions(),
    getApprovedVenues(),
  ]);

  const regionNames = new Map(regions.map((r) => [r.id, r.name]));
  const featuredRegions = regions.filter((r) => r.featured);
  const featuredVenues = venues.filter((v) => v.featured).slice(0, 6);
  const marqueeRegions = [...regions.map((r) => r.name), ...regions.map((r) => r.name)];

  return (
    <>
      <HomeHero stats={stats} />

      {/* ---- region marquee ---- */}
      <div className="relative overflow-hidden border-y border-line bg-surface py-4">
        <div className="animate-marquee flex w-max items-center">
          {marqueeRegions.map((name, i) => (
            <span
              key={i}
              className="mx-6 flex items-center gap-6 font-display text-lg text-muted"
            >
              {name}
              <span className="size-1.5 rotate-45 bg-gold" />
            </span>
          ))}
        </div>
      </div>

      {/* ---- featured regions ---- */}
      <section id="regions" className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Regional bələdçi"
            title="Haradan başlamalı?"
            sub="Hər region üçün tarix, mədəniyyət, yerli məsləhətlər və mütləq görülməli yerlər."
          />
          <Link
            href="/regions"
            className="hidden shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:border-em hover:text-em sm:flex"
          >
            Bütün regionlar <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredRegions.slice(0, 6).map((r, i) => (
            <Reveal key={r.slug} delay={i * 0.07}>
              <RegionCard region={r} />
            </Reveal>
          ))}
        </div>

        <Link
          href="/regions"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-5 py-3.5 text-sm font-semibold text-ink transition-all hover:border-em hover:text-em sm:hidden"
        >
          Bütün regionlar <ArrowRight className="size-4" />
        </Link>
      </section>

      {/* ---- categories ---- */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <SectionHeading
          eyebrow="Məkan kataloqu"
          title="Axtardığınız hər şey bir yerdə"
          sub="Otel, restoran, kafe, supermarket və ticarət mərkəzləri — iş saatları, reytinqlər və qiymət kateqoriyaları ilə."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.key} delay={i * 0.08}>
              <Link
                href={`/directory?cat=${c.key}`}
                className="group relative block h-72 overflow-hidden rounded-3xl shadow-lift transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift-lg"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${c.tint} via-black/30 to-transparent`} />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="grid size-11 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                    <c.icon className="size-5.5 text-white" />
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-white">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{c.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-300">
                    Kataloqda gör <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- how it works ---- */}
      <section className="mt-24 border-y border-line bg-surface2">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Necə işləyir"
            title="Üç addımda mükəmməl səfər"
            sub="Kəşf Et Azərbaycan planlaşdırmanı sadələşdirir — axtarışdan naviqasiyaya qədər."
          />
          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-10 hidden border-t-2 border-dashed border-line md:block" />
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1} className="relative">
                <div className="flex flex-col items-center text-center">
                  <span className="relative z-10 grid size-20 place-items-center rounded-3xl border border-line bg-surface shadow-lift">
                    <s.icon className="size-9 text-em" strokeWidth={1.6} />
                    <span className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-gold text-xs font-bold text-white">
                      {i + 1}
                    </span>
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-muted">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- featured venues ---- */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Redaksiya seçimi"
            title="Həftənin tövsiyələri"
            sub="Komandamızın yoxladığı və yüksək qiymətləndirdiyi məkanlar."
          />
          <Link
            href="/directory"
            className="hidden shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:border-em hover:text-em sm:flex"
          >
            Bütün məkanlar <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredVenues.map((v, i) => (
            <Reveal key={v.id} delay={i * 0.06}>
              <VenueCard venue={v} regionName={regionNames.get(v.regionId)} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- planner teaser ---- */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-em px-6 py-14 shadow-lift-lg sm:px-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, rgba(255,255,255,.35) 0 2px, transparent 2px)",
                backgroundSize: "26px 26px",
              }}
            />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-amber-200">
                  Marşrut planlayıcı + Xərc kalkulyatoru
                </span>
                <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Səfərinizi gün-gün planlayın, büdcəni isə biz hesablayaq
                </h2>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/80">
                  Görməli yerləri, restoranları və otelləri marşruta əlavə edin — sistem
                  yerləşmə, qidalanma, biletlər və nəqliyyat üzrə ümumi xərci real vaxtda
                  Azərbaycan manatı ilə göstərir.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/itinerary"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-em shadow-lift transition-all hover:-translate-y-0.5"
                  >
                    <Route className="size-4" /> Planlamaya başla
                  </Link>
                  <Link
                    href="/map"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
                  >
                    <MapIcon className="size-4" /> Xəritəni aç
                  </Link>
                </div>
              </div>
              <div className="glass rounded-3xl p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-white/90">
                    <Calculator className="size-5.5 text-em" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                      Nümunə 3 günlük tur
                    </p>
                    <p className="font-display text-lg font-semibold text-white">Bakı + Şəki</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2.5 text-sm text-white/85">
                  {[
                    ["Otel — 2 gecə (orta sinif)", "₼220"],
                    ["Qidalanma — 2 nəfər", "₼168"],
                    ["Giriş biletləri", "₼64"],
                    ["Nəqliyyat (taksi/reys)", "₼58"],
                  ].map(([k, v]) => (
                    <li
                      key={k as string}
                      className="flex items-center justify-between rounded-xl bg-black/15 px-4 py-2.5"
                    >
                      <span>{k}</span>
                      <span className="font-bold text-amber-200">{v}</span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between rounded-xl bg-white/90 px-4 py-3 font-bold text-em">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="size-4" /> Ümumi təxmini
                    </span>
                    <span className="font-display text-lg">₼510</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---- business CTA ---- */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <Reveal>
          <div className="relative grid items-center gap-8 overflow-hidden rounded-[2.5rem] border border-line bg-gradient-to-br from-tertiary via-tertiary to-surface p-8 shadow-lift sm:p-12 lg:grid-cols-2" style={{ backgroundImage: "linear-gradient(135deg, var(--tert), var(--goldt))" }}>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-terra">
                Biznes sahibləri üçün
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                Məkanınızı minlərlə səyahətçiyə göstərin
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink2">
                Oteliniz, restoranınız və ya mağazanız var? Elanı göndərin — komandamız yoxladıqdan
                sonra siyahı 24 saat ərzində canlı yayımlanır. Tamamilə pulsuzdur.
              </p>
              <Link
                href="/business"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-terra px-6 py-3 text-sm font-bold text-white shadow-lift transition-all hover:bg-terab hover:-translate-y-0.5"
              >
                <StoreIcon className="size-4" /> Elan yerləşdir
              </Link>
            </div>
            <div className="relative h-64 overflow-hidden rounded-3xl shadow-lift lg:h-72">
              <img src={IMG.tea.rustic} alt="Yerli biznes" loading="lazy" className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
                <Landmark className="size-4 text-amber-300" /> Ənənədən biznesə — bir addım
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
