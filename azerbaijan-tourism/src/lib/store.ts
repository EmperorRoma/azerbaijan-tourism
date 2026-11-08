"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlanDay, PlanItem } from "./types";

let keySeq = 0;
const nextKey = () => `${Date.now().toString(36)}-${(keySeq++).toString(36)}`;

export function nextTimeFor(items: PlanItem[]): string {
  const minutes = 9 * 60 + items.length * 120;
  const capped = Math.min(minutes, 21 * 60);
  const h = Math.floor(capped / 60);
  const m = capped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export const TIME_SLOTS: string[] = [];
for (let h = 7; h <= 23; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`);
}

type PlanState = {
  days: PlanDay[];
  persons: number;
  activeDayId: string;
  toast: string | null;
  addDay: () => void;
  removeDay: (dayId: string) => void;
  setActiveDay: (dayId: string) => void;
  addItem: (item: Omit<PlanItem, "key" | "time">, dayId?: string) => void;
  removeItem: (key: string) => void;
  moveItem: (key: string, toDayId: string, toIndex?: number) => void;
  reorderWithinDay: (dayId: string, key: string, toIndex: number) => void;
  setItemTime: (key: string, time: string) => void;
  setPersons: (n: number) => void;
  clearAll: () => void;
  isInPlan: (source: string, refId: number) => boolean;
  showToast: (msg: string) => void;
};

export const usePlan = create<PlanState>()(
  persist(
    (set, get) => ({
      days: [{ id: "day-1", items: [] }],
      persons: 2,
      activeDayId: "day-1",
      toast: null,

      addDay: () =>
        set((s) => {
          const id = `day-${Date.now().toString(36)}`;
          return { days: [...s.days, { id, items: [] }], activeDayId: id };
        }),

      removeDay: (dayId) =>
        set((s) => {
          if (s.days.length <= 1) return { days: [{ id: "day-1", items: [] }], activeDayId: "day-1" };
          const days = s.days.filter((d) => d.id !== dayId);
          return { days, activeDayId: days[0]?.id ?? "day-1" };
        }),

      setActiveDay: (dayId) => set({ activeDayId: dayId }),

      addItem: (item, dayId) =>
        set((s) => {
          const targetId = dayId && s.days.some((d) => d.id === dayId) ? dayId : s.activeDayId;
          const days = s.days.map((d) => {
            if (d.id !== targetId) return d;
            const time = nextTimeFor(d.items);
            return { ...d, items: [...d.items, { ...item, key: nextKey(), time }] };
          });
          return { days, activeDayId: targetId };
        }),

      removeItem: (key) =>
        set((s) => ({
          days: s.days.map((d) => ({ ...d, items: d.items.filter((i) => i.key !== key) })),
        })),

      moveItem: (key, toDayId, toIndex) =>
        set((s) => {
          let moved: PlanItem | null = null;
          const daysWithout = s.days.map((d) => {
            const idx = d.items.findIndex((i) => i.key === key);
            if (idx >= 0) {
              moved = d.items[idx];
              return { ...d, items: d.items.filter((i) => i.key !== key) };
            }
            return d;
          });
          if (!moved) return s;
          const m: PlanItem = moved;
          return {
            days: daysWithout.map((d) => {
              if (d.id !== toDayId) return d;
              const items = [...d.items];
              const insertAt =
                toIndex === undefined ? items.length : Math.max(0, Math.min(items.length, toIndex));
              items.splice(insertAt, 0, m);
              return { ...d, items };
            }),
          };
        }),

      reorderWithinDay: (dayId, key, toIndex) =>
        set((s) => ({
          days: s.days.map((d) => {
            if (d.id !== dayId) return d;
            const idx = d.items.findIndex((i) => i.key === key);
            if (idx < 0) return d;
            const items = [...d.items];
            const [m] = items.splice(idx, 1);
            items.splice(Math.max(0, Math.min(items.length, toIndex)), 0, m);
            return { ...d, items };
          })
        })),

      setItemTime: (key, time) =>
        set((s) => ({
          days: s.days.map((d) => ({
            ...d,
            items: d.items.map((i) => (i.key === key ? { ...i, time } : i)),
          })),
        })),

      setPersons: (n) => set({ persons: Math.max(1, Math.min(12, n)) }),

      clearAll: () => set({ days: [{ id: "day-1", items: [] }], activeDayId: "day-1" }),

      isInPlan: (source, refId) =>
        get().days.some((d) => d.items.some((i) => i.source === source && i.refId === refId)),

      showToast: (msg) => {
        set({ toast: msg });
        setTimeout(() => {
          if (get().toast === msg) set({ toast: null });
        }, 2600);
      },
    }),
    {
      name: "az-explore-plan",
      partialize: (s) => ({ days: s.days, persons: s.persons, activeDayId: s.activeDayId }),
    },
  ),
);
