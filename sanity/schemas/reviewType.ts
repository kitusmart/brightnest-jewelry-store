import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Product Reviews",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "product",
      title: "Target Product",
      type: "reference",
      to: [{ type: "product" }],
      description: "Which specific piece of jewelry is this review for?",
    }),
    defineField({
      name: "author",
      title: "Customer Name",
      type: "string",
    }),
    defineField({
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      options: { list: [1, 2, 3, 4, 5] },
    }),
    defineField({
      name: "comment",
      title: "Review Comment",
      type: "text",
    }),
    defineField({
      name: "isApproved",
      title: "Approve for Live Site",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
