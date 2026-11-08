import { NextResponse } from "next/server";
import { db } from "@/db";
import { savedItineraries } from "@/db/schema";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Yararsız sorğu formatı" }, { status: 400 });
  }

  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim().slice(0, 120) : "Adsız marşrut";
  const days = body.days;
  const totalCost = typeof body.totalCost === "number" && Number.isFinite(body.totalCost) ? body.totalCost : 0;

  if (!Array.isArray(days) || days.length === 0) {
    return NextResponse.json({ error: "Plan boşdur" }, { status: 400 });
  }

  // basic shape guard
  const safeDays = days.slice(0, 30).map((d) => ({
    id: typeof d?.id === "string" ? d.id : String(Math.random()),
    items: Array.isArray(d?.items) ? d.items.slice(0, 60) : [],
  }));

  const [row] = await db
    .insert(savedItineraries)
    .values({ name, days: safeDays, totalCost })
    .returning({ id: savedItineraries.id });

  return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
}
