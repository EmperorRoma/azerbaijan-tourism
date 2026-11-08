"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck2, Compass, Flame, Map, Menu, Moon, Route, Store, Sun, X } from "lucide-react";
import { usePlan } from "@/lib/store";

const NAV = [
  { href: "/", label: "Əsas" },
  { href: "/regions", label: "Regionlar" },
  { href: "/directory", label: "Kataloq" },
  { href: "/itinerary", label: "Planlayıcı" },
  { href: "/map", label: "Xəritə" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = usePlan((s) => s.days.reduce((n, d) => n + d.items.length, 0));

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("az-theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "glass-strong shadow-lift" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-emb to-em text-bg shadow-lift transition-transform duration-300 group-hover:rotate-6">
            <Flame className="size-5 text-[#f6f1e7]" strokeWidth={2.2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[17px] font-semibold tracking-tight">Kəşf Et</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Azərbaycan
            </span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-em" : "text-ink2 hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-emt"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/itinerary"
            className="relative hidden items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-semibold text-ink2 transition-all hover:border-emb hover:text-em sm:flex"
          >
            <Route className="size-4" />
            <span>Marşrutum</span>
            {mounted && itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-terra text-[10px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Mövzu dəyiş"
            className="grid size-10 place-items-center rounded-full border border-line bg-surface text-ink2 transition-all hover:border-gold hover:text-gold"
          >
            {mounted && dark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
          </button>

          <Link
            href="/business"
            className="hidden items-center gap-2 rounded-full bg-em px-4 py-2.5 text-sm font-semibold text-[#f6f1e7] shadow-lift transition-all hover:bg-emb hover:shadow-lift-lg md:flex"
          >
            <Store className="size-4" />
            Biznes üçün
          </Link>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menyu"
            className="grid size-10 place-items-center rounded-full border border-line bg-surface text-ink lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-line lg:hidden"
          >
            <nav className="space-y-1 px-4 py-4">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-emt"
                >
                  <Compass className="size-4 text-em" />
                  {n.label}
                </Link>
              ))}
              <Link
                href="/business"
                className="flex items-center gap-3 rounded-xl bg-em px-4 py-3 text-sm font-semibold text-white"
              >
                <Store className="size-4" />
                Biznes üçün əlavə et
              </Link>
              <Link
                href="/itinerary"
                className="flex items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm font-semibold text-ink"
              >
                <CalendarCheck2 className="size-4 text-em" />
                Marşrutum {mounted && itemCount > 0 && `(${itemCount})`}
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-medium text-muted"
              >
                <Map className="size-4" />
                Admin paneli (demo)
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
