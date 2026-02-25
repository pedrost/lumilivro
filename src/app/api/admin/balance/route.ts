import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { stripe } from "@/lib/stripe";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const balance = await stripe.balance.retrieve();

    const available =
      balance.available.find((b) => b.currency === "usd")?.amount ?? 0;
    const pending =
      balance.pending.find((b) => b.currency === "usd")?.amount ?? 0;

    return NextResponse.json({ available, pending });
  } catch (err) {
    console.error("Failed to retrieve Stripe balance:", err);
    return NextResponse.json(
      { error: "Failed to retrieve balance" },
      { status: 500 }
    );
  }
}
