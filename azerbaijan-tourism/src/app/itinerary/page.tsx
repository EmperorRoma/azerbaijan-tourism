import type { Metadata } from "next";
import { PlannerClient, type DrawerPlace } from "@/components/planner-client";
import { CATEGORY_LABELS, TYPE_LABELS } from "@/lib/format";
import { getAllAttractions, getAllRegions, getApprovedVenues } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marşrut planlayıcı",
  description: "Çoxgünlük səyahət planı qurun — görməli yerlər, restoranlar və otellər bir marşrutda, xərclər isə avtomatik hesablanır.",
};

export default async function ItineraryPage() {
  const [venues, attractions, regions] = await Promise.all([
    getApprovedVenues(),
    getAllAttractions(),
    getAllRegions(),
  ]);
  const regionNames = new Map(regions.map((r) => [r.id, r.name]));

  const places: DrawerPlace[] = [
    ...venues.map((v) => ({
      id: `v-${v.id}`,
      source: "venue" as const,
      refId: v.id,
      name: v.name,
      image: v.image,
      category: v.category,
      categoryLabel: CATEGORY_LABELS[v.category] ?? v.category,
      region: regionNames.get(v.regionId) ?? "",
      price: v.avgPrice,
      lat: v.lat,
      lng: v.lng,
    })),
    ...attractions.map((a) => ({
      id: `a-${a.id}`,
      source: "attraction" as const,
      refId: a.id,
      name: a.name,
      image: a.image,
      category: a.type,
      categoryLabel: TYPE_LABELS[a.type] ?? "Görməli yer",
      region: regionNames.get(a.regionId) ?? "",
      price: a.ticket,
      lat: a.lat,
      lng: a.lng,
    })),
  ];

  return <PlannerClient places={places} />;
}
