import type { PlanDay, PlanItem, ExpenseBreakdown } from "./types";

const aznFmt = new Intl.NumberFormat("az-Latn-AZ", { maximumFractionDigits: 0 });
const aznFmt1 = new Intl.NumberFormat("az-Latn-AZ", { maximumFractionDigits: 1 });
const numFmt = new Intl.NumberFormat("az-Latn-AZ", { maximumFractionDigits: 1 });

export function azn(n: number): string {
  return `₼${aznFmt.format(Math.round(n))}`;
}

export function aznPrecise(n: number): string {
  return `₼${aznFmt1.format(Math.round(n * 10) / 10)}`;
}

export function km(n: number): string {
  if (n < 1) return `${Math.round(n * 1000)} m`;
  return `${numFmt.format(Math.round(n * 10) / 10)} km`;
}

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export const CATEGORY_LABELS: Record<string, string> = {
  hotel: "Otel",
  restaurant: "Restoran",
  cafe: "Kafe",
  supermarket: "Supermarket",
  store: "Mağaza / Bazar",
  attraction: "Görməli yer",
};

export const TYPE_LABELS: Record<string, string> = {
  monument: "Tarixi abidə",
  museum: "Muzey",
  theater: "Teatr",
  nature: "Təbiət",
  mosque: "Məbəd",
  palace: "Saray",
  park: "Park / Bulvar",
};

export const PRICE_LEVEL_LABELS: Record<number, string> = {
  1: "Büdcə",
  2: "Orta",
  3: "Premium",
};

export function priceSymbol(level: number): string {
  return "₼".repeat(Math.max(1, Math.min(3, level)));
}

export function priceSuffix(category: string): string {
  switch (category) {
    case "hotel":
      return "/ gecə";
    case "restaurant":
    case "cafe":
      return "/ nəfər";
    case "supermarket":
      return "/ səbət";
    case "store":
      return "/ alış";
    default:
      return "/ nəfər";
  }
}

function priceKindFor(source: "venue" | "attraction", category: string): PlanItem["priceKind"] {
  if (source === "attraction") return "ticket";
  if (category === "hotel") return "night";
  if (category === "supermarket" || category === "store") return "visit";
  return "person";
}

export function toPlanItem(
  x:
    | { source: "venue"; v: { id: number; name: string; image: string; category: string; avgPrice: number; lat: number; lng: number; regionName: string } }
    | { source: "attraction"; a: { id: number; name: string; image: string; type: string; ticket: number; lat: number; lng: number; regionName: string } },
): Omit<PlanItem, "key" | "time"> {
  if (x.source === "venue") {
    return {
      source: "venue",
      refId: x.v.id,
      name: x.v.name,
      image: x.v.image,
      region: x.v.regionName,
      category: x.v.category,
      lat: x.v.lat,
      lng: x.v.lng,
      price: x.v.avgPrice,
      priceKind: priceKindFor("venue", x.v.category),
    };
  }
  return {
    source: "attraction",
    refId: x.a.id,
    name: x.a.name,
    image: x.a.image,
    region: x.a.regionName,
    category: "attraction",
    lat: x.a.lat,
    lng: x.a.lng,
    price: x.a.ticket,
    priceKind: "ticket",
  };
}

/**
 * Realistic local cost model (AZN):
 * - hotels: price per night (per room, up to 2 guests)
 * - restaurants/cafes: average bill per person
 * - attractions: entry ticket per person
 * - markets/stores: average basket per visit
 * - transport: 6₼ daily base + 0.45₼/km between consecutive stops (road factor 1.35)
 */
export function computeExpenses(days: PlanDay[], persons: number): ExpenseBreakdown {
  let accommodation = 0;
  let dining = 0;
  let tickets = 0;
  let shopping = 0;
  let transportKm = 0;
  let activeDays = 0;

  for (const day of days) {
    if (day.items.length === 0) continue;
    activeDays += 1;
    const ordered = [...day.items].sort((a, b) => a.time.localeCompare(b.time));
    for (const item of ordered) {
      switch (item.priceKind) {
        case "night":
          accommodation += item.price * Math.ceil(persons / 2);
          break;
        case "person":
          dining += item.price * persons;
          break;
        case "ticket":
          tickets += item.price * persons;
          break;
        case "visit":
          shopping += item.price;
          break;
      }
    }
    for (let i = 1; i < ordered.length; i++) {
      transportKm += haversineKm(ordered[i - 1], ordered[i]) * 1.35;
    }
  }

  const transport = activeDays > 0 ? activeDays * 6 + transportKm * 0.45 : 0;
  const total = accommodation + dining + tickets + shopping + transport;

  return {
    accommodation,
    dining,
    tickets,
    shopping,
    transport,
    transportKm,
    total,
    perPerson: persons > 0 ? total / persons : total,
  };
}

export function monthName(i: number): string {
  return [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
    "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
  ][i] ?? "";
}

export function timeAgo(dateIso: string): string {
  const d = new Date(dateIso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)} dəq əvvəl`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat əvvəl`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} gün əvvəl`;
  return `${d.getDate()} ${monthName(d.getMonth())} ${d.getFullYear()}`;
}
