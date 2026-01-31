import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  hoverImage: string;
  slug: string;
}

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      // ⭐ FIX 1: Prevent duplicates by checking if ID already exists
      addToWishlist: (item) => {
        const currentItems = get().items;
        const alreadyInVault = currentItems.some(
          (i) => i.productId === item.productId,
        );

        if (!alreadyInVault) {
          set({ items: [...currentItems, item] });
        }
      },
      // ⭐ FIX 2: Ensure immediate removal for the UI
      removeFromWishlist: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      isInWishlist: (productId) =>
        get().items.some((i) => i.productId === productId),
    }),
    { name: "brightnest-wishlist" }, // Matches your local storage key
  ),
);
