import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RegionDetail } from "@/components/region-detail";
import {
  getAllRegions,
  getAttractionsByRegion,
  getRegionBySlug,
  getVenuesByRegion,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) return { title: "Region tapılmadı" };
  return { title: `${region.name} bələdçisi`, description: region.tagline };
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) notFound();

  const [attracts, vens, allRegions] = await Promise.all([
    getAttractionsByRegion(region.id),
    getVenuesByRegion(region.id),
    getAllRegions(),
  ]);

  const others = allRegions.filter((r) => r.id !== region.id).slice(0, 3);

  return <RegionDetail region={region} attractions={attracts} venues={vens} others={others} />;
}
