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

  // --- INVENTORY GUARD START ---
  // This rule runs before you can publish a product
  validation: (Rule) =>
    Rule.custom(async (_, context) => {
      // 1. Get the Sanity Client to check the database
      const client = context.getClient({ apiVersion: "2024-01-01" });

      // 2. Count existing products (excluding the current draft you are working on)
      // We look for documents of type 'product' that are NOT in the 'drafts' path
      const count = await client.fetch(
        'count(*[_type == "product" && !(_id in path("drafts.**"))])',
      );

      // 3. The Logic: If we have 8 or more, stop the publication
      if (count >= 8) {
        return "🛑 LIMIT REACHED: You cannot have more than 8 products. Please delete an old product to add a new one.";
      }

      return true;
    }),
  // --- INVENTORY GUARD END ---

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
      validation: (rule) => [rule.required().error("Product name is required")],
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
      validation: (rule) => [
        rule.required().error("Slug is required for URL generation"),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "details",
      rows: 4,
      description: "Product description",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "details",
      description: "Price in AUD (e.g., 599.99)",
      validation: (rule) => [
        rule.required().error("Price is required"),
        rule.positive().error("Price must be a positive number"),
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "details",
      validation: (rule) => [rule.required().error("Category is required")],
    }),
    defineField({
      name: "material",
      title: "Material",
      type: "string",
      group: "details",
      options: {
        list: MATERIALS_SANITY_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      group: "details",
      options: {
        list: COLORS_SANITY_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "string",
      group: "details",
      description: 'e.g., "120cm x 80cm x 75cm"',
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (rule) => [
        rule.min(1).error("At least one image is required"),
      ],
    }),
    defineField({
      name: "stock",
      title: "Stock Level",
      type: "number",
      group: "inventory",
      initialValue: 0,
      description: "Number of items in stock",
      validation: (rule) => [
        rule.min(0).error("Stock cannot be negative"),
        rule.integer().error("Stock must be a whole number"),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Show on homepage and promotions",
    }),
    defineField({
      name: "assemblyRequired",
      title: "Assembly Required",
      type: "boolean",
      group: "inventory",
      initialValue: false,
      description: "Does this product require assembly?",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.title",
      media: "images.0",
      price: "price",
    },
    prepare({ title, subtitle, media, price }) {
      return {
        title,
        subtitle: `${subtitle ? subtitle + " • " : ""}$${price ?? 0}`,
        media,
      };
    },
  },
});
