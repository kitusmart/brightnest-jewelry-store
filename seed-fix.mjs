import { createClient } from "@sanity/client";

// --- 1. CONFIGURATION ---
const client = createClient({
  projectId: "gzxol775", // <--- PASTE YOUR ID
  dataset: "production",
  token:
    "skvP4F9ti0kqFjkC8NaveIRyF5usxYGehReiymYqXw4QoFjKEnBcU8zTMh98yoRGwoW2ZCWbMwLahdXQPGs0pdW5mgvsZdijHf4U8BFeNSc9Y1YUpTEbifcvm4ZqGeixAdD7pTf5FWVWGntgeRcNukJr4bMidCccdcMwH2LCnteeBhJwsrwK", // <--- PASTE YOUR TOKEN
  useCdn: false,
  apiVersion: "2023-01-01",
});

// --- Reliable Image Links (These won't get blocked) ---
const IMAGE_URLS = {
  Necklaces: [
    "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&q=80",
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    "https://images.unsplash.com/photo-1506630448388-4e683c14dd03?w=800&q=80",
  ],
  Earrings: [
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    "https://images.unsplash.com/photo-1630019852942-f89202989a51?w=800&q=80",
    "https://images.unsplash.com/photo-1617038224558-2839549c15ab?w=800&q=80",
  ],
  Rings: [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    "https://images.unsplash.com/photo-1603561796041-901a126b96e5?w=800&q=80",
  ],
  Bangles: [
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&q=80",
    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
  ],
  Kada: [
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80", // Reusing bangle image for mock
    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
  ],
  Pendants: [
    "https://images.unsplash.com/photo-1602751584552-8ba43d4c3120?w=800&q=80",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
  ],
  Sets: [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&q=80",
  ],
};

const CATEGORIES = [
  { name: "Necklaces", basePrice: 450 },
  { name: "Earrings", basePrice: 150 },
  { name: "Rings", basePrice: 250 },
  { name: "Bangles", basePrice: 350 },
  { name: "Kada", basePrice: 550 },
  { name: "Sets", basePrice: 900 },
  { name: "Pendants", basePrice: 120 },
];

const MATERIALS = ["Gold", "Silver", "Rose Gold", "Platinum"];
const COLORS = ["Gold", "Silver", "Rose Gold", "White"];
const BADGES = ["BEST SELLER", "NEW ARRIVAL", "18K GOLD", null];

// --- HELPER: Upload Image ---
async function uploadImage(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Image fetch failed");
    const buffer = await res.arrayBuffer();
    const asset = await client.assets.upload("image", Buffer.from(buffer), {
      filename: `mock-${Date.now()}.jpg`,
    });
    return asset._id;
  } catch (err) {
    console.error("❌ Image upload failed:", err.message);
    return null;
  }
}

async function getCategoryId(name) {
  const query = `*[_type == "category" && lower(title) == lower($name)][0]._id`;
  return await client.fetch(query, { name });
}

// --- MAIN SCRIPT ---
async function seed() {
  console.log("🧹 Step 1: Deleting old broken products...");
  const oldProducts = await client.fetch('*[_type == "product"]{_id}');
  const transaction = client.transaction();
  oldProducts.forEach((p) => transaction.delete(p._id));
  await transaction.commit();
  console.log("✅ Cleanup complete.");

  console.log("🚀 Step 2: Creating new products with images...");

  for (const cat of CATEGORIES) {
    console.log(`\n📂 Category: ${cat.name}`);
    const catId = await getCategoryId(cat.name);

    if (!catId) {
      console.warn(`   ⚠️ Category '${cat.name}' not found. Skipping.`);
      continue;
    }

    // Create 5 Products per Category
    for (let i = 1; i <= 5; i++) {
      const title = `Royal ${cat.name} Collection ${i}`;
      const price = cat.basePrice + i * 45;
      const compareAtPrice = i % 2 === 0 ? Math.floor(price * 1.4) : null;

      // Select a reliable image URL
      const urlList = IMAGE_URLS[cat.name] || IMAGE_URLS.Necklaces; // Fallback to necklaces if missing
      const imageUrl = urlList[i % urlList.length];

      console.log(`   💎 Creating: ${title}`);
      const imageId = await uploadImage(imageUrl);

      const product = {
        _type: "product",
        name: title,
        slug: {
          _type: "slug",
          current: `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        },
        badge: BADGES[i % BADGES.length],
        description: `This exquisite ${title} is crafted from premium materials.`,
        price: price,
        compareAtPrice: compareAtPrice,
        category: { _type: "reference", _ref: catId },
        material: MATERIALS[i % MATERIALS.length],
        color: COLORS[i % COLORS.length],
        weight: `${(10 + i * 2.5).toFixed(1)}g`,
        stock: Math.floor(Math.random() * 20) + 1,
        isFeatured: i === 1,
        images: imageId
          ? [
              {
                _type: "image",
                asset: { _type: "reference", _ref: imageId },
                alt: title,
              },
            ]
          : [],
      };

      await client.create(product);
    }
  }

  console.log("\n✅ ALL DONE! Refresh your website.");
}

seed();
