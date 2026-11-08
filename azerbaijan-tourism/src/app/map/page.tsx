import type { Metadata } from "next";
import { MapPageClient } from "@/components/map-page-client";
import { getAllAttractions, getAllRegions, getApprovedVenues } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "İnteraktiv xəritə",
  description: "Azərbaycan üzrə otellər, restoranlar və görməli yerlər interaktiv xəritədə — marşrut xətti və səsli naviqasiya simulyasiyası ilə.",
};

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string; region?: string }>;
}) {
  const sp = await searchParams;
  const [venues, attractions, regions] = await Promise.all([
    getApprovedVenues(),
    getAllAttractions(),
    getAllRegions(),
  ]);
  const regionNames = new Map(regions.map((r) => [r.id, r.name]));

  const points = [
    ...venues.map((v) => ({
      id: `v-${v.id}`,
      numericId: v.id,
      source: "venue" as const,
      name: v.name,
      category: v.category,
      image: v.image,
      region: regionNames.get(v.regionId) ?? "",
      lat: v.lat,
      lng: v.lng,
      price: v.avgPrice,
      rating: v.rating,
      desc: v.description,
      address: v.address,
    })),
    ...attractions.map((a) => ({
      id: `a-${a.id}`,
      numericId: a.id,
      source: "attraction" as const,
      name: a.name,
      category: "attraction",
      image: a.image,
      region: regionNames.get(a.regionId) ?? "",
      lat: a.lat,
      lng: a.lng,
      price: a.ticket,
      rating: a.rating,
      desc: a.description,
      address: "",
    })),
  ];

  const focusPoint = sp.focus
    ? points.find((p) => p.source === "venue" && p.numericId === Number(sp.focus))
    : undefined;
  const focusRegion = sp.region ? regions.find((r) => r.slug === sp.region) : undefined;

  return (
    <MapPageClient
      points={points}
      focusLatLng={focusPoint ? { lat: focusPoint.lat, lng: focusPoint.lng, zoom: 15 } : undefined}
      regionLatLng={
        !focusPoint && focusRegion
          ? { lat: focusRegion.lat, lng: focusRegion.lng, zoom: 11 }
          : undefined
      }
    />
  );
}
