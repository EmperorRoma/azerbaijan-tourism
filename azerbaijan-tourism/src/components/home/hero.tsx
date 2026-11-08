"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck2, ChevronDown, Compass, Search, Sparkles } from "lucide-react";

const SUGGESTIONS = ["Şəki Xan Sarayı", "Xınalıq", "Dolma", "Cıdır düzü", "Tufandağ", "Çay evi"];

export function HomeHero({ stats }: { stats: { regions: number; venues: number; attractions: number } }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const go = (query: string) => {
    router.push(query.trim() ? `/directory?q=${encodeURIComponent(query.trim())}` : "/directory");
  };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/8412720/pexels-photo-8412720.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920"
          alt="Bakı — Alov Qüllələri və Xəzər dənizi"
          className="animate-kenburns size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pb-28 pt-32 text-center sm:px-6">
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="ornament text-[11px] font-bold uppercase tracking-[0.28em] text-amber-300"
        >
          Azərbaycan Turizm Bələdçisi
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="mt-5 font-display text-[2.75rem] font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Qədim odlar diyarını
          <span className="block bg-gradient-to-r from-amber-300 via-orange-200 to-emerald-200 bg-clip-text text-transparent">
            yenidən kəşf edin
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24 }}
          className="mx-auto mt-6 max-w-2xl text-[15px] leading-relaxed text-white/85 sm:text-base"
        >
          Bakının mərmər bulvarlarından Şuşanın dəmirçi dağlarına qədər — region bələdçiləri,
          yoxlanılmış məkanlar, ağıllı marşrut planlayıcısı və manatla dəqiq xərc hesabı
          bir platformada.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.36 }}
          onSubmit={(e) => {
            e.preventDefault();
            go(q);
          }}
          className="glass mt-9 flex items-center gap-2 rounded-full p-2 shadow-lift-lg"
        >
          <Search className="ml-3 size-5 shrink-0 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Məkan, region və ya xidmət axtarın…"
            className="w-full bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-em px-6 py-3 text-sm font-bold text-white shadow-lift transition-all hover:bg-emb"
          >
            Axtar
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-2"
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => go(s)}
              className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur transition-all hover:border-amber-300 hover:text-amber-200"
            >
              {s}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.62 }}
          className="mx-auto mt-10 grid max-w-xl grid-cols-3 divide-x divide-white/15 rounded-3xl border border-white/15 bg-white/5 backdrop-blur"
        >
          {[
            { icon: Compass, n: `${stats.regions} region`, t: "tam bələdçi ilə" },
            { icon: Sparkles, n: `${stats.venues}+ məkan`, t: "yoxlanılmış kataloq" },
            { icon: CalendarCheck2, n: `${stats.attractions}+ yer`, t: "görməli məntəqə" },
          ].map((s) => (
            <div key={s.t} className="flex flex-col items-center gap-1 px-3 py-5">
              <s.icon className="size-5 text-amber-300" />
              <span className="font-display text-xl font-bold text-white sm:text-2xl">{s.n}</span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-white/65">{s.t}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#regions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        aria-label="Aşağı"
      >
        <span className="animate-floaty grid size-11 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur">
          <ChevronDown className="size-5" />
        </span>
      </motion.a>
    </section>
  );
}
