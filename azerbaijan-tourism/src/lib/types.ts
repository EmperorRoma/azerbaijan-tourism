export type Region = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  history: string;
  culture: string;
  tips: string[];
  image: string;
  lat: number;
  lng: number;
  distanceFromBaku: number;
  featured: boolean;
};

export type Attraction = {
  id: number;
  regionId: number;
  name: string;
  type: string;
  description: string;
  image: string;
  ticket: number;
  rating: number;
  lat: number;
  lng: number;
};

export type Venue = {
  id: number;
  regionId: number;
  name: string;
  category: string;
  description: string;
  address: string;
  priceLevel: number;
  avgPrice: number;
  rating: number;
  reviews: number;
  hours: string;
  phone: string;
  image: string;
  lat: number;
  lng: number;
  featured: boolean;
  status: string;
  amenities: string[];
  createdAt: string;
};

export type Submission = {
  id: number;
  ownerName: string;
  businessName: string;
  category: string;
  regionSlug: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  priceInfo: string;
  hours: string;
  notes: string;
  status: string;
  createdAt: string;
};

export type PlanItem = {
  key: string;
  source: "venue" | "attraction";
  refId: number;
  name: string;
  image: string;
  region: string;
  category: string;
  lat: number;
  lng: number;
  price: number;
  priceKind: "night" | "person" | "ticket" | "visit";
  time: string;
};

export type PlanDay = {
  id: string;
  items: PlanItem[];
};

export type ExpenseBreakdown = {
  accommodation: number;
  dining: number;
  tickets: number;
  transport: number;
  shopping: number;
  transportKm: number;
  total: number;
  perPerson: number;
};
