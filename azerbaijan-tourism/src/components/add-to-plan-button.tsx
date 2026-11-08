"use client";

import { Check, MapPinPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { usePlan } from "@/lib/store";
import type { PlanItem } from "@/lib/types";

export function AddToPlanButton({
  item,
  label = "Marşruta əlavə et",
  compact = false,
  className = "",
}: {
  item: Omit<PlanItem, "key" | "time">;
  label?: string;
  compact?: boolean;
  className?: string;
}) {
  const addItem = usePlan((s) => s.addItem);
  const showToast = usePlan((s) => s.showToast);
  const isInPlan = usePlan((s) => s.isInPlan(item.source, item.refId));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const added = mounted && isInPlan;

  return (
    <button
      type="button"
      onClick={() => {
        if (added) {
          showToast("Bu məkan artıq marşrutunuzdadır");
          return;
        }
        addItem(item);
        showToast(`${item.name} marşruta əlavə olundu`);
      }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all active:scale-95 ${
        added
          ? "bg-emt text-em"
          : "bg-em text-white hover:bg-emb hover:shadow-lift"
      } ${compact ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"} ${className}`}
    >
      {added ? <Check className={compact ? "size-3.5" : "size-4"} /> : <MapPinPlus className={compact ? "size-3.5" : "size-4"} />}
      {compact ? (added ? "Əlavə edilib" : "Marşruta") : added ? "Marşrutdadır" : label}
    </button>
  );
}
