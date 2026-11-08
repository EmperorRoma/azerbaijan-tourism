// Curated photography pool (Pexels). Grouped by theme for consistent usage.

const px = (id: string, ext = "jpeg") =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;

export const IMG = {
  hero: px("8412720"), // Baku aerial at dusk — Flame Towers + Caspian
  baku: {
    flame1: px("35418664"),
    flame2: px("19998475"),
    flame3: px("16830141"),
    flame4: px("39296766"),
    flame5: px("33329106"),
    boulevard: px("21772208"),
    day: px("37480336"),
    maidenAerial: px("32957341"),
    maidenSunset: px("14383805"),
    bazaar1: px("40862707"),
    bazaar2: px("32913727"),
    maidenCloud: px("167702", "png"),
  },
  mountains: {
    shekiTown: px("36883270"),
    khinalug: px("18372968"),
    oghuz1: px("37084417"),
    oghuz2: px("37084421"),
    laza: px("39215614"),
    village: px("10230398"),
    oghuz3: px("37084420"),
    riverbed: px("38735112"),
  },
  food: {
    dolma1: px("36734915"),
    feast: px("36734921"),
    meze: px("36734920"),
    dolma2: px("30764320"),
    bowl: px("8743830"),
    grape: px("6089610"),
  },
  hotel: {
    room1: px("6434592"),
    room2: px("7507131"),
    room3: px("40756978"),
    room4: px("39338444"),
    room5: px("8134808"),
    room6: px("2736384"),
  },
  market: {
    aisle1: px("21582447"),
    aisle2: px("16211537"),
    dairy: px("20489330"),
    stocked: px("5951182"),
  },
  tea: {
    pear: px("6148202"),
    kettle: px("6148259"),
    rustic: px("35509010"),
    ceremony: px("39609123"),
  },
};

export const HOTEL_POOL = [
  IMG.hotel.room1,
  IMG.hotel.room2,
  IMG.hotel.room3,
  IMG.hotel.room4,
  IMG.hotel.room5,
  IMG.hotel.room6,
];

export const FOOD_POOL = [
  IMG.food.feast,
  IMG.food.dolma1,
  IMG.food.grape,
  IMG.food.dolma2,
  IMG.food.bowl,
  IMG.food.meze,
];

export const CAFE_POOL = [IMG.tea.ceremony, IMG.tea.kettle, IMG.tea.pear, IMG.tea.rustic];

export const MARKET_POOL = [
  IMG.market.aisle1,
  IMG.market.stocked,
  IMG.market.aisle2,
  IMG.market.dairy,
];
