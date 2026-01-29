// ============================================
// Product Attribute Constants
// Shared between frontend filters and Sanity schema
// ============================================

export const COLORS = [
  { value: "gold", label: "Gold Color" },
  { value: "silver", label: "Silver Color" },
  { value: "ruby", label: "Ruby Pink" },
  { value: "green", label: "Emerald Green" },
  { value: "blue", label: "Sapphire Blue" },
  { value: "white", label: "White / Clear" },
  { value: "black", label: "Black" },
  { value: "mint", label: "Mint Green" },
  { value: "peach", label: "Peach" },
  { value: "multicolor", label: "Multicolor" },
] as const;

export const MATERIALS = [
  { value: "gold-plated", label: "Gold Plated" },
  { value: "matte-gold", label: "Matte Gold Finish" },
  { value: "rose-gold-plated", label: "Rose Gold Plated" },
  { value: "oxidized", label: "Oxidized Silver" },
  { value: "silver-plated", label: "Silver Plated" },
  { value: "brass", label: "Brass" },
  { value: "copper", label: "Copper" },
  { value: "kundan", label: "Kundan / Polki" },
  { value: "ad-stone", label: "American Diamond (AD)" },
] as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "relevance", label: "Relevance" },
] as const;

// Type exports
export type ColorValue = (typeof COLORS)[number]["value"];
export type MaterialValue = (typeof MATERIALS)[number]["value"];
export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// ============================================
// Sanity Schema Format Exports
// Format compatible with Sanity's options.list
// ============================================

/** Colors formatted for Sanity schema options.list */
export const COLORS_SANITY_LIST = COLORS.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Materials formatted for Sanity schema options.list */
export const MATERIALS_SANITY_LIST = MATERIALS.map(({ value, label }) => ({
  title: label,
  value,
}));

/** Color values array for zod enums or validation */
export const COLOR_VALUES = COLORS.map((c) => c.value) as [
  ColorValue,
  ...ColorValue[],
];

/** Material values array for zod enums or validation */
export const MATERIAL_VALUES = MATERIALS.map((m) => m.value) as [
  MaterialValue,
  ...MaterialValue[],
];
