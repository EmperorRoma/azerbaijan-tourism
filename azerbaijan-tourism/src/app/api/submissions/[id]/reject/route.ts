import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { submissions } from "@/db/schema";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ error: "Yararsız ID" }, { status: 400 });
  }
  const res = await db
    .update(submissions)
    .set({ status: "rejected" })
    .where(eq(submissions.id, numId))
    .returning({ id: submissions.id });

  if (res.length === 0) {
    return NextResponse.json({ error: "Müraciət tapılmadı" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
