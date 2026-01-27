import { BasketIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { ORDER_STATUS_SANITY_LIST } from "@/lib/constants/orderStatus";

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
      validation: (rule) => [rule.required().error("Order number is required")],
    }),
    defineField({
      name: "items",
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
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "quantity",
              type: "number",
              initialValue: 1,
              validation: (rule) => rule.required().min(1),
            }),
            defineField({
              name: "priceAtPurchase",
              type: "number",
              description: "Price at time of purchase",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "product.name",
              quantity: "quantity",
              price: "priceAtPurchase",
              media: "product.images.0",
            },
            prepare({ title, quantity, price, media }) {
              return {
                title: title ?? "Product",
                subtitle: `Qty: ${quantity} • $${price}`,
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "total", // 🟢 This must match the webhook's 'total'
      title: "Total Price",
      type: "number",
      group: "details",
      readOnly: true,
      description: "Total order amount in AUD",
    }),
    defineField({
      name: "status",
      type: "string",
      group: "details",
      initialValue: "paid",
      options: {
        list: ORDER_STATUS_SANITY_LIST,
        layout: "radio",
      },
    }),
    defineField({
      name: "customerName", // 🟢 Added this to store the name sent by the webhook
      type: "string",
      title: "Customer Name",
      group: "customer",
    }),
    defineField({
      name: "customer",
      type: "reference",
      to: [{ type: "customer" }],
      group: "customer",
      description: "Reference to the customer record",
    }),
    defineField({
      name: "email",
      type: "string",
      group: "customer",
      readOnly: true,
    }),
    defineField({
      name: "stripePaymentId",
      title: "Stripe Payment ID",
      type: "string",
      group: "payment",
      readOnly: true,
      description: "Stripe payment intent ID",
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      group: "details",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      email: "email",
      total: "total", // 🟢 Matches the field name above
      status: "status",
    },
    prepare({ orderNumber, email, total, status }) {
      return {
        title: `Order ${orderNumber ?? "N/A"}`,
        subtitle: `${email ?? "No email"} • $${total ?? 0} • ${status ?? "paid"}`,
      };
    },
  },
});
