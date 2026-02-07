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
    { name: "shipping", title: "Shipping" },
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
      name: "stripeCustomerId",
      title: "Stripe Customer ID",
      type: "string",
      group: "customer",
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      group: "customer",
      fields: [
        { name: "city", type: "string" },
        { name: "country", type: "string" },
        { name: "line1", type: "string" },
        { name: "line2", type: "string" },
        { name: "postalCode", type: "string" },
        { name: "state", type: "string" },
      ],
    }),
    defineField({
      name: "trackingNumber",
      title: "Tracking Number",
      type: "string",
      group: "shipping",
      description: "Enter the courier tracking ID here",
    }),
    defineField({
      name: "shippedDate",
      title: "Shipped Date",
      type: "datetime",
      group: "shipping",
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
              productName: "product.name",
              quantity: "quantity",
              // 🟢 FIXED: Check both possible image field names
              image: "product.image",
              images: "product.images.0",
            },
            prepare({ productName, quantity, image, images }) {
              return {
                title: `${productName || "Product"} x ${quantity}`,
                media: images || image,
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
      name: "amountDiscount",
      title: "Amount Discount",
      type: "number",
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
      currency: "currency",
      // 🟢 FIXED: Check both 'image' and 'images' array for the main order list
      mainImage: "items.0.product.image",
      mainImages: "items.0.product.images.0",
    },
    prepare({ name, amount, orderId, email, currency, mainImage, mainImages }) {
      const orderIdSnippet = orderId || "New Order";
      const currencySymbol = currency?.toUpperCase() === "AUD" ? "$" : "₹";

      return {
        title: `${name || email || "Unknown Customer"}`,
        subtitle: `${currencySymbol}${amount || 0} - ${orderIdSnippet}`,
        // 🟢 FIXED: Show the product image if either field exists
        media: mainImages || mainImage || BasketIcon,
      };
    },
  },
});
