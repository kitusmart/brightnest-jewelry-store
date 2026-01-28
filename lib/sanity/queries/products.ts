import { defineQuery } from "next-sanity";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants/stock";

// ============================================
// Shared Query Fragments (DRY)
// ============================================

const PRODUCT_FILTER_CONDITIONS = `
  _type == "product"
  && ($categorySlug == "" || category->slug.current == $categorySlug)
  && ($color == "" || color == $color)
  && ($material == "" || material == $material)
  && ($minPrice == 0 || price >= $minPrice)
  && ($maxPrice == 0 || price <= $maxPrice)
  && ($searchQuery == "" || name match $searchQuery + "*" || description match $searchQuery + "*")
  && ($inStock == false || stock > 0)
`;

const FILTERED_PRODUCT_PROJECTION = `{
  _id,
  name,
  "slug": slug.current,
  price,
  "image": images[0].asset->url,
  "images": images[0...4]{
    _key,
    asset->{
      _id,
      url
    }
  },
  category->{
    _id,
    title,
    "slug": slug.current
  },
  material,
  color,
  stock,
  badge
}`;

const RELEVANCE_SCORE = `score(
  boost(name match $searchQuery + "*", 3),
  boost(description match $searchQuery + "*", 1)
)`;

// ============================================
// Main Queries
// ============================================

export const ALL_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  price,
  "image": images[0].asset->url,
  "images": images[]{
    _key,
    asset->{ _id, url },
    hotspot
  },
  category->{ _id, title, "slug": slug.current },
  material,
  color,
  dimensions,
  stock,
  featured,
  badge
}`);

export const FEATURED_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && featured == true
  && stock > 0
] | order(name asc) [0...6] {
  _id,
  name,
  "slug": slug.current,
  description,
  price,
  "image": images[0].asset->url,
  stock,
  badge
}`);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    price,
    stock,
    description,
    material,
    color,
    weight,
    badge,
    "category": category->title,
    images[]{
      asset->{
        url,
        metadata { dimensions }
      }
    }
  }
`);

// ============================================
// RESTORING MISSING EXPORTS (Fixes Build Errors)
// ============================================

export const AI_SEARCH_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && (name match $searchQuery + "*" || description match $searchQuery + "*")
] {
  _id,
  name,
  "slug": slug.current,
  price,
  "image": images[0].asset->url,
  badge
}`);

export const FILTER_PRODUCTS_BY_NAME_QUERY = defineQuery(
  `*[${PRODUCT_FILTER_CONDITIONS}] | order(name asc) ${FILTERED_PRODUCT_PROJECTION}`
);

export const FILTER_PRODUCTS_BY_PRICE_ASC_QUERY = defineQuery(
  `*[${PRODUCT_FILTER_CONDITIONS}] | order(price asc) ${FILTERED_PRODUCT_PROJECTION}`
);

export const FILTER_PRODUCTS_BY_PRICE_DESC_QUERY = defineQuery(
  `*[${PRODUCT_FILTER_CONDITIONS}] | order(price desc) ${FILTERED_PRODUCT_PROJECTION}`
);

export const FILTER_PRODUCTS_BY_RELEVANCE_QUERY = defineQuery(
  `*[${PRODUCT_FILTER_CONDITIONS}] | ${RELEVANCE_SCORE} | order(_score desc, name asc) ${FILTERED_PRODUCT_PROJECTION}`
);

export const PRODUCTS_BY_IDS_QUERY = defineQuery(`*[
  _type == "product"
  && _id in $ids
] {
  _id,
  name,
  "slug": slug.current,
  price,
  "image": images[0].asset->url,
  stock
}`);