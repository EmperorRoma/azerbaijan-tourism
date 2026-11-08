import Link from "next/link";
import { Flame, Mail, MapPin, Phone } from "lucide-react";

const REGION_LINKS = [
  { slug: "baki", name: "Bakı" },
  { slug: "shusha", name: "Şuşa" },
  { slug: "sheki", name: "Şəki" },
  { slug: "qebele", name: "Qəbələ" },
  { slug: "quba", name: "Quba" },
  { slug: "gence", name: "Gəncə" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-emb to-em">
              <Flame className="size-5 text-[#f6f1e7]" strokeWidth={2.2} />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold">Kəşf Et</span>
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
                Azərbaycan
              </span>
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Azərbaycan qonaqpərvərliyi ilə hazırlanmış müstəqil turizm bələdçisi — regionlar,
            məkanlar və marşrutlar bir arada.
          </p>
          <p className="text-xs text-muted">Bütün qiymətlər Azərbaycan manatı ilə (AZN).</p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">Regionlar</h4>
          <ul className="space-y-2.5">
            {REGION_LINKS.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/regions/${r.slug}`}
                  className="text-sm text-ink2 transition-colors hover:text-em"
                >
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">Səhifələr</h4>
          <ul className="space-y-2.5 text-sm text-ink2">
            <li><Link href="/directory" className="transition-colors hover:text-em">Məkan kataloqu</Link></li>
            <li><Link href="/itinerary" className="transition-colors hover:text-em">Marşrut planlayıcı</Link></li>
            <li><Link href="/map" className="transition-colors hover:text-em">İnteraktiv xəritə</Link></li>
            <li><Link href="/business" className="transition-colors hover:text-em">Biznes portalı</Link></li>
            <li><Link href="/admin" className="transition-colors hover:text-em">Admin paneli (demo)</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-muted">Əlaqə</h4>
          <ul className="space-y-3 text-sm text-ink2">
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-terra" />
              Bakı şəh., Xəqani küç. 21
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 shrink-0 text-terra" />
              +994 12 555 01 01
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 shrink-0 text-terra" />
              salam@kesfet.az
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Kəşf Et Azərbaycan — bütün hüquqlar qorunur.
      </div>
    </footer>
  );
}
