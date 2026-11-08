import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  history: text("history").notNull(),
  culture: text("culture").notNull(),
  tips: text("tips").array().notNull().default([]),
  image: text("image").notNull(),
  lat: numeric("lat", { mode: "number" }).notNull(),
  lng: numeric("lng", { mode: "number" }).notNull(),
  distanceFromBaku: integer("distance_from_baku").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
});

export const attractions = pgTable("attractions", {
  id: serial("id").primaryKey(),
  regionId: integer("region_id")
    .notNull()
    .references(() => regions.id),
  name: text("name").notNull(),
  type: text("type").notNull(), // monument | museum | theater | nature | mosque | palace | park
  description: text("description").notNull(),
  image: text("image").notNull(),
  ticket: numeric("ticket", { mode: "number" }).notNull().default(0),
  rating: numeric("rating", { mode: "number" }).notNull().default(4.5),
  lat: numeric("lat", { mode: "number" }).notNull(),
  lng: numeric("lng", { mode: "number" }).notNull(),
});

export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  regionId: integer("region_id")
    .notNull()
    .references(() => regions.id),
  name: text("name").notNull(),
  category: text("category").notNull(), // hotel | restaurant | cafe | supermarket | store
  description: text("description").notNull(),
  address: text("address").notNull(),
  priceLevel: integer("price_level").notNull().default(2),
  avgPrice: numeric("avg_price", { mode: "number" }).notNull().default(25),
  rating: numeric("rating", { mode: "number" }).notNull().default(4.5),
  reviews: integer("reviews").notNull().default(0),
  hours: text("hours").notNull().default("09:00–22:00"),
  phone: text("phone").notNull().default(""),
  image: text("image").notNull(),
  lat: numeric("lat", { mode: "number" }).notNull(),
  lng: numeric("lng", { mode: "number" }).notNull(),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("approved"), // approved | pending
  amenities: text("amenities").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  ownerName: text("owner_name").notNull(),
  businessName: text("business_name").notNull(),
  category: text("category").notNull(),
  regionSlug: text("region_slug").notNull(),
  description: text("description").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  priceInfo: text("price_info").notNull().default(""),
  hours: text("hours").notNull().default(""),
  notes: text("notes").notNull().default(""),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const savedItineraries = pgTable("saved_itineraries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  days: jsonb("days").notNull(),
  totalCost: numeric("total_cost", { mode: "number" }).notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
