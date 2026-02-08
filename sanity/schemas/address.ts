export default {
  name: "address",
  title: "Customer Addresses",
  type: "document",
  fields: [
    {
      name: "userEmail",
      title: "User Email",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "isDefault",
      title: "Default Address",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "firstName",
      title: "First Name",
      type: "string",
    },
    {
      name: "lastName",
      title: "Last Name",
      type: "string",
    },
    {
      name: "addressLine",
      title: "Address",
      type: "string",
    },
    {
      name: "apartment",
      title: "Apartment/Suite",
      type: "string",
    },
    {
      name: "city",
      title: "City",
      type: "string",
    },
    {
      name: "state",
      title: "State",
      type: "string",
      options: {
        list: [
          "New South Wales",
          "Victoria",
          "Queensland",
          "Western Australia",
          "South Australia",
          "Tasmania",
          "ACT",
          "Northern Territory",
        ],
      },
    },
    {
      name: "postcode",
      title: "Postcode",
      type: "string",
    },
    {
      name: "phone",
      title: "Phone Number",
      type: "string",
    },
  ],
};
