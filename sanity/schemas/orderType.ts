import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BasketIcon,
  groups: [
    { name: "details", title: "Order Details", default: true },
    { name: "customer", title: "Customer" },
    { name: "payment", title: "Payment" },
  ],
  fields: [
    defineField({
      name: "orderNumber",
      type: "string",
      group: "details",
      readOnly: true,
    }),
    defineField({
      name: "stripeCheckoutSessionId",
      type: "string",
      group: "payment",
      readOnly: true,
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      group: "customer",
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      group: "customer",
    }),
    defineField({
      name: "stripePaymentIntentId",
      type: "string",
      group: "payment",
    }),
    defineField({
      name: "items",
      title: "Products Ordered",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              type: "reference",
              to: [{ type: "product" }],
            }),
            defineField({ name: "quantity", type: "number" }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
            },
            prepare({ product, quantity, image }) {
              return {
                title: `${product} x ${quantity}`,
                media: image,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "totalPrice",
      title: "Total Price",
      type: "number",
      group: "payment",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      type: "string",
      group: "payment",
    }),
    defineField({
      name: "status",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Paid", value: "paid" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
        ],
      },
    }),
    defineField({
      name: "orderDate",
      type: "datetime",
      group: "details",
    }),
  ],
  preview: {
    select: {
      name: "customerName",
      amount: "totalPrice",
      orderId: "orderNumber",
      email: "email",
    },
    prepare({ name, amount, orderId, email }) {
      const orderIdSnippet = `${orderId?.slice(0, 10)}...` || "New Order";
      return {
        title: `${name || email || "Unknown Customer"}`,
        subtitle: `₹${amount || 0} - ${orderIdSnippet}`,
        media: BasketIcon,
      };
    },
  },
});
