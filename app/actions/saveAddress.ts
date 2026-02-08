"use server"; // 🟢 SECURE: Protects your Write Token

import { writeClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export async function saveAddress(formData: any, email: string) {
  try {
    // 1. If this is a default address, unset other defaults for this user
    if (formData.isDefault) {
      const existingDefaults = await writeClient.fetch(
        `*[_type == "address" && userEmail == $email && isDefault == true]._id`,
        { email },
      );

      await Promise.all(
        existingDefaults.map((id: string) =>
          writeClient.patch(id).set({ isDefault: false }).commit(),
        ),
      );
    }

    // 2. Create the new Australian address document in Sanity
    const result = await writeClient.create({
      _type: "address",
      userEmail: email,
      ...formData,
    });

    // 3. Refresh the profile page data instantly
    revalidatePath("/account");

    return { success: true, id: result._id };
  } catch (error) {
    console.error("Address Save Error:", error);
    return { success: false };
  }
}
export async function getAddresses(email: string) {
  try {
    const addresses = await writeClient.fetch(
      `*[_type == "address" && userEmail == $email] | order(isDefault desc, _createdAt desc)`,
      { email },
    );
    return addresses;
  } catch (error) {
    console.error("Fetch Addresses Error:", error);
    return [];
  }
}
export async function deleteAddress(addressId: string) {
  try {
    await writeClient.delete(addressId);
    revalidatePath("/account");
    return { success: true };
  } catch (error) {
    console.error("Delete Address Error:", error);
    return { success: false };
  }
}
