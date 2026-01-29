import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import {
  MATERIALS_SANITY_LIST,
  COLORS_SANITY_LIST,
} from "@/lib/constants/filters";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Media" },
    { name: "inventory", title: "Inventory" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      group: "details",
      validation: (rule) => rule.required().error("Product name is required"),
    }),

    defineField({
      name: "badge",
      title: "Product Badge",
      type: "string",
      group: "details",
      description:
        "Text for the luxury badge (e.g., '18K GOLD', 'TARNISH FREE', 'BEST SELLER')",
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required().error("Slug is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "details",
      rows: 4,
      description: "Detailed description of the jewelry piece",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "details",
      description: "Current selling price",
      validation: (rule) => [
        rule.required().error("Price is required"),
        rule.positive().error("Price must be positive"),
      ],
    }),
    // ⭐ NEW FIELD ADDED HERE
    defineField({
      name: "compareAtPrice",
      title: "Compare at Price (Original Price)",
      type: "number",
      group: "details",
      description:
        "The original price before discount. Leave empty if not on sale.",
      validation: (rule) => rule.min(0).precision(2),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      validation: (rule) => rule.required().error("Category is required"),
    }),
    defineField({
      name: "material",
      title: "Material / Metal",
      type: "string",
      group: "details",
      options: {
        list: MATERIALS_SANITY_LIST,
        layout: "dropdown",
      },
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      group: "details",
      options: {
        list: COLORS_SANITY_LIST,
        layout: "dropdown",
      },
    }),
    defineField({
      name: "weight",
      title: "Weight (grams)",
      type: "string",
      group: "details",
      description: 'e.g., "15g" or "0.5 carats"',
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (rule) => rule.min(1).error("At least one image is required"),
    }),
    defineField({
      name: "stock",
      title: "Stock Quantity",
      type: "number",
      group: "inventory",
      initialValue: 1,
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Product?",
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Toggle ON to show this on the homepage",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "images.0",
      price: "price",
      stock: "stock",
    },
    prepare({ title, subtitle, media, price, stock }) {
      return {
        title: title,
        subtitle: `$${price} | Stock: ${stock}`,
        media: media,
      };
    },
  },
});
