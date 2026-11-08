import { db } from "@/db";
import { attractions, regions, submissions, venues } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import type { Attraction, Region, Submission, Venue } from "./types";

function serializeRegion(r: typeof regions.$inferSelect): Region {
  return { ...r, tips: r.tips ?? [] };
}

function serializeAttraction(a: typeof attractions.$inferSelect): Attraction {
  return { ...a };
}

function serializeVenue(v: typeof venues.$inferSelect): Venue {
  return { ...v, amenities: v.amenities ?? [], createdAt: v.createdAt.toISOString() };
}

function serializeSubmission(s: typeof submissions.$inferSelect): Submission {
  return { ...s, createdAt: s.createdAt.toISOString() };
}

export async function getAllRegions(): Promise<Region[]> {
  const rows = await db.select().from(regions).orderBy(regions.id);
  return rows.map(serializeRegion);
}

export async function getFeaturedRegions(): Promise<Region[]> {
  const rows = await db.select().from(regions).where(eq(regions.featured, true));
  return rows.map(serializeRegion);
}

export async function getRegionBySlug(slug: string): Promise<Region | null> {
  const rows = await db.select().from(regions).where(eq(regions.slug, slug)).limit(1);
  return rows[0] ? serializeRegion(rows[0]) : null;
}

export async function getAttractionsByRegion(regionId: number): Promise<Attraction[]> {
  const rows = await db
    .select()
    .from(attractions)
    .where(eq(attractions.regionId, regionId))
    .orderBy(desc(attractions.rating));
  return rows.map(serializeAttraction);
}

export async function getAllAttractions(): Promise<Attraction[]> {
  const rows = await db.select().from(attractions).orderBy(attractions.id);
  return rows.map(serializeAttraction);
}

export async function getApprovedVenues(): Promise<Venue[]> {
  const rows = await db
    .select()
    .from(venues)
    .where(eq(venues.status, "approved"))
    .orderBy(desc(venues.featured), desc(venues.rating));
  return rows.map(serializeVenue);
}

export async function getVenuesByRegion(regionId: number): Promise<Venue[]> {
  const rows = await db
    .select()
    .from(venues)
    .where(and(eq(venues.regionId, regionId), eq(venues.status, "approved")))
    .orderBy(desc(venues.rating));
  return rows.map(serializeVenue);
}

export async function getFeaturedVenues(): Promise<Venue[]> {
  const rows = await db
    .select()
    .from(venues)
    .where(and(eq(venues.status, "approved"), eq(venues.featured, true)))
    .orderBy(desc(venues.rating));
  return rows.map(serializeVenue);
}

export async function getAllSubmissions(): Promise<Submission[]> {
  const rows = await db.select().from(submissions).orderBy(desc(submissions.createdAt));
  return rows.map(serializeSubmission);
}

export async function getStats() {
  const r = await db.select().from(regions);
  const v = await db.select().from(venues).where(eq(venues.status, "approved"));
  const a = await db.select().from(attractions);
  return { regions: r.length, venues: v.length, attractions: a.length };
}
