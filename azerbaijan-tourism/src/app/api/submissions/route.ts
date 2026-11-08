import { NextResponse } from "next/server";
import { db } from "@/db";
import { submissions } from "@/db/schema";

const ALLOWED_CATEGORIES = ["hotel", "restaurant", "cafe", "supermarket", "store"];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Yararsız sorğu formatı" }, { status: 400 });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");

  const errors: Record<string, string> = {};
  const ownerName = str("ownerName");
  const businessName = str("businessName");
  const category = str("category");
  const regionSlug = str("regionSlug");
  const description = str("description");
  const address = str("address");
  const phone = str("phone");
  const email = str("email");

  if (ownerName.length < 3) errors.ownerName = "Ad və soyad ən azı 3 simvol olmalıdır";
  if (businessName.length < 2) errors.businessName = "Məkan adı tələb olunur";
  if (!ALLOWED_CATEGORIES.includes(category)) errors.category = "Kateqoriya seçin";
  if (!regionSlug) errors.regionSlug = "Region seçin";
  if (description.length < 30 || description.length > 2000)
    errors.description = "Təsvir 30–2000 simvol arasında olmalıdır";
  if (address.length < 6 || address.length > 300) errors.address = "Tam ünvan yazın";
  if (!/^[+0-9()\-\s]{9,20}$/.test(phone)) errors.phone = "Düzgün telefon nömrəsi daxil edin";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120)
    errors.email = "Düzgün e-poçt ünvanı daxil edin";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Formu düzgün doldurun", errors }, { status: 400 });
  }

  const [row] = await db
    .insert(submissions)
    .values({
      ownerName,
      businessName,
      category,
      regionSlug,
      description,
      address,
      phone,
      email,
      priceInfo: str("priceInfo").slice(0, 200),
      hours: str("hours").slice(0, 60),
      notes: str("notes").slice(0, 1000),
      status: "pending",
    })
    .returning({ id: submissions.id });

  return NextResponse.json({ ok: true, id: row.id, status: "pending" }, { status: 201 });
}
