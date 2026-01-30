import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Collection Title",
      type: "string",
      validation: (rule) => rule.required().error("Category title is required"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) =>
        rule.required().error("Slug is required for URL generation"),
    }),
    defineField({
      name: "description",
      title: "Collection Description",
      type: "text",
      rows: 3,
      description:
        "A short, luxury description for this collection (e.g., 'Timeless designs for the modern minimalist.')",
    }),
    defineField({
      name: "image",
      title: "Collection Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
      description:
        "High-resolution cover image for the homepage featured section.",
      validation: (rule) =>
        rule.required().error("An image is required for featured collections"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
