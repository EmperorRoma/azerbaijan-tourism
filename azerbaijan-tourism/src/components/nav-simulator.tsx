"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  CornerUpLeft,
  CornerUpRight,
  Flag,
  Gauge,
  MapPin,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { haversineKm, km } from "@/lib/format";

export type Waypoint = {
  name: string;
  lat: number;
  lng: number;
  time?: string;
  image?: string;
};

type NavStep = {
  kind: "start" | "straight" | "left" | "right" | "arrive";
  text: string;
  distKm: number;
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function bearingWord(a: Waypoint, b: Waypoint): string {
  const dLng = b.lng - a.lng;
  const dLat = b.lat - a.lat;
  const ang = (Math.atan2(dLng, dLat) * 180) / Math.PI;
  const dirs = ["şimala", "şimal-şərqə", "şərqə", "cənub-şərqə", "cənuba", "cənub-qərbə", "qərbə", "şimal-qərbə"];
  const idx = Math.round((((ang % 360) + 360) % 360) / 45) % 8;
  return dirs[idx];
}

function buildSteps(waypoints: Waypoint[]): NavStep[] {
  const steps: NavStep[] = [];
  for (let leg = 1; leg < waypoints.length; leg++) {
    const a = waypoints[leg - 1];
    const b = waypoints[leg];
    const total = haversineKm(a, b);
    const rnd = mulberry32(Math.round(a.lat * 1000 + b.lng * 1000));
    steps.push({
      kind: "start",
      text: `${a.name} məntəqəsindən hərəkət edin — istiqamət ${bearingWord(a, b)}`,
      distKm: total * 0.3,
    });
    const turns = total > 30 ? 2 : 1;
    for (let t = 0; t < turns; t++) {
      const left = rnd() > 0.5;
      steps.push({
        kind: left ? "left" : "right",
        text: `${Math.max(150, Math.round(total * 400 * rnd()))} m sonra ${left ? "sola" : "sağa"} dönün`,
        distKm: total * (0.25 + rnd() * 0.2),
      });
    }
    steps.push({
      kind: "straight",
      text: "Düz yola davam edin",
      distKm: total * 0.15,
    });
    steps.push({
      kind: "arrive",
      text: `Təyinata çatdınız: ${b.name}`,
      distKm: 0,
    });
  }
  return steps;
}

const STEP_MS = 3200;

export function NavSimulator({
  waypoints,
  onClose,
  onProgress,
}: {
  waypoints: Waypoint[];
  onClose: () => void;
  onProgress: (t: number | null) => void;
}) {
  const steps = useMemo(() => buildSteps(waypoints), [waypoints]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [voice, setVoice] = useState(false);
  const [stepElapsed, setStepElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const done = idx >= steps.length - 1;
  const step = steps[Math.min(idx, steps.length - 1)];

  const speak = (text: string) => {
    if (!voice || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const az = voices.find((v) => v.lang.toLowerCase().startsWith("az"));
    const tr = voices.find((v) => v.lang.toLowerCase().startsWith("tr"));
    u.lang = az?.lang ?? tr?.lang ?? "az-AZ";
    if (az) u.voice = az;
    else if (tr) u.voice = tr;
    u.rate = 1.05;
    window.speechSynthesis.speak(u);
  };

  useEffect(() => {
    onProgress(steps.length <= 1 ? 1 : idx / (steps.length - 1));
    speak(step.text);
    setStepElapsed(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  useEffect(() => {
    if (!playing || done) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setStepElapsed((e) => {
        const next = e + 100 * speed;
        if (next >= STEP_MS) {
          setIdx((i) => Math.min(i + 1, steps.length - 1));
          return 0;
        }
        return next;
      });
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, speed, done, steps.length]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window)
        window.speechSynthesis.cancel();
    };
  }, []);

  const remainingKm = step.distKm * Math.max(0, 1 - stepElapsed / STEP_MS);

  const Icon =
    step.kind === "left"
      ? CornerUpLeft
      : step.kind === "right"
        ? CornerUpRight
        : step.kind === "arrive"
          ? Flag
          : step.kind === "start"
            ? MapPin
            : ArrowUp;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-x-3 bottom-3 z-[600] mx-auto max-w-xl sm:inset-x-6 sm:bottom-6"
    >
      <div className="glass-strong overflow-hidden rounded-3xl shadow-lift-lg">
        <div className="flex items-center justify-between bg-em px-5 py-3 text-white">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]">
            <Gauge className="size-4" /> Naviqasiya simulyasiyası
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
              className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold transition hover:bg-white/25"
            >
              {speed}x
            </button>
            <button
              onClick={() => setVoice((v) => !v)}
              aria-label="Səsli bələdçi"
              className="grid size-8 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
            >
              {voice ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </button>
            <button
              onClick={onClose}
              aria-label="Çıxış"
              className="grid size-8 place-items-center rounded-full bg-white/15 transition hover:bg-white/25"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 p-5">
          <motion.div
            key={idx}
            initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className={`grid size-16 shrink-0 place-items-center rounded-2xl text-white shadow-lift ${
              step.kind === "arrive" ? "bg-gold" : step.kind === "start" ? "bg-em" : "bg-terra"
            }`}
          >
            <Icon className="size-8" strokeWidth={2.4} />
          </motion.div>

          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-bold leading-snug text-ink sm:text-lg">
              {step.text}
            </p>
            <p className="mt-1 text-xs font-semibold text-muted">
              {step.kind === "arrive"
                ? "Marşrut mərhələsi tamamlandı"
                : `${km(remainingKm)} qaldı`}
              <span className="mx-1.5 text-line">•</span>
              Addım {Math.min(idx + 1, steps.length)} / {steps.length}
            </p>
          </div>

          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pauza" : "Davam"}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-em text-white shadow-lift transition-all hover:bg-emb active:scale-95"
          >
            {playing ? <Pause className="size-5" /> : <Play className="size-5 translate-x-0.5" />}
          </button>
        </div>

        <div className="h-1.5 bg-line">
          <motion.div
            className="h-full bg-gradient-to-r from-em to-gold"
            animate={{ width: `${(idx / Math.max(1, steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex items-center justify-between px-5 py-2.5 text-[11px] font-semibold text-muted">
          <span>
            Növbəti:{" "}
            {idx < steps.length - 1 ? steps[idx + 1].text : "— marşrut tamamlandı"}
          </span>
          {done && <span className="font-bold text-gold">Səfər tamamlandı ✓</span>}
        </div>
      </div>
    </motion.div>
  );
}
