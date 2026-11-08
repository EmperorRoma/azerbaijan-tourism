"use client";

import dynamic from "next/dynamic";

const MapExplorer = dynamic(() => import("@/components/map-explorer"), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-[1600px] px-4 pb-8 pt-28 sm:px-6">
      <div className="skeleton h-10 w-72 rounded-2xl" />
      <div className="mt-8 grid gap-5 lg:grid-cols-[22rem_1fr]">
        <div className="skeleton h-[36rem] rounded-3xl" />
        <div className="skeleton h-[36rem] rounded-3xl" />
      </div>
    </div>
  ),
});

export type MapPoint = {
  id: string;
  numericId: number;
  source: "venue" | "attraction";
  name: string;
  category: string;
  image: string;
  region: string;
  lat: number;
  lng: number;
  price: number;
  rating: number;
  desc: string;
  address: string;
};

export function MapPageClient({
  points,
  focusLatLng,
  regionLatLng,
}: {
  points: MapPoint[];
  focusLatLng?: { lat: number; lng: number; zoom: number };
  regionLatLng?: { lat: number; lng: number; zoom: number };
}) {
  return <MapExplorer points={points} focusLatLng={focusLatLng} regionLatLng={regionLatLng} />;
}
