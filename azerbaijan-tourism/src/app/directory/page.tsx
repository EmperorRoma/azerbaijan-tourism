import type { Metadata } from "next";
import { DirectoryClient } from "@/components/directory-client";
import { getAllRegions, getApprovedVenues } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Məkan kataloqu",
  description: "Azərbaycan üzrə otellər, restoranlar, kafelər, supermarketlər və mağazalar — filtrlər, reytinqlər və qiymətlərlə.",
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const sp = await searchParams;
  const [venues, regions] = await Promise.all([getApprovedVenues(), getAllRegions()]);
  const regionNames = new Map(regions.map((r) => [r.id, r.name]));

  return (
    <DirectoryClient
      venues={venues}
      regions={regions}
      regionNames={Object.fromEntries(regionNames)}
      initialQuery={sp.q ?? ""}
      initialCategory={sp.cat ?? "all"}
    />
  );
}
