"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { usePlan } from "@/lib/store";

export function Toaster() {
  const toast = usePlan((s) => s.toast);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="glass-strong flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-lift-lg"
          >
            <span className="grid size-7 place-items-center rounded-full bg-emt">
              <CheckCircle2 className="size-4.5 text-em" />
            </span>
            <span className="text-sm font-semibold text-ink">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
