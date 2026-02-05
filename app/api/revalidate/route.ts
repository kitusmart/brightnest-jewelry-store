import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // This clears the cache for your homepage so new products show up
    revalidatePath("/");
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
