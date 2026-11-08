import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { regions, submissions, venues } from "@/db/schema";
import { CAFE_POOL, FOOD_POOL, HOTEL_POOL, MARKET_POOL, IMG } from "@/lib/images";

const POOLS: Record<string, string[]> = {
  hotel: HOTEL_POOL,
  restaurant: FOOD_POOL,
  cafe: CAFE_POOL,
  supermarket: MARKET_POOL,
  store: [IMG.baku.bazaar1, IMG.baku.bazaar2, ...MARKET_POOL],
};

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ error: "Yararsız ID" }, { status: 400 });
  }

  const [sub] = await db
    .select()
    .from(submissions)
    .where(and(eq(submissions.id, numId), eq(submissions.status, "pending")))
    .limit(1);

  if (!sub) {
    return NextResponse.json({ error: "Gözləyən müraciət tapılmadı" }, { status: 404 });
  }

  let regionRows = await db.select().from(regions).where(eq(regions.slug, sub.regionSlug)).limit(1);
  if (regionRows.length === 0) {
    regionRows = await db.select().from(regions).limit(1);
  }
  const region = regionRows[0];

  const pool = POOLS[sub.category] ?? FOOD_POOL;
  const image = pool[numId % pool.length];
  const priceMatch = sub.priceInfo.match(/(\d+(?:[.,]\d+)?)/);
  const avgPrice = priceMatch ? Math.round(parseFloat(priceMatch[1].replace(",", "."))) : sub.category === "hotel" ? 80 : 20;

  await db.insert(venues).values({
    regionId: region.id,
    name: sub.businessName,
    category: sub.category,
    description: sub.description,
    address: sub.address,
    priceLevel: avgPrice >= 150 ? 3 : avgPrice >= 40 ? 2 : 1,
    avgPrice,
    rating: 4.0,
    reviews: 0,
    hours: sub.hours || "09:00–22:00",
    phone: sub.phone,
    image,
    lat: region.lat + 0.008,
    lng: region.lng + 0.008,
    featured: false,
    status: "approved",
    amenities: ["Yeni əlavə"],
  });

  await db.update(submissions).set({ status: "approved" }).where(eq(submissions.id, numId));

  return NextResponse.json({ ok: true });
}
