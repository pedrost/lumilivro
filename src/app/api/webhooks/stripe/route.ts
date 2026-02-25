import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { buildOrderConfirmationEmail } from "@/lib/email-templates";
import Stripe from "stripe";

function parseTierAndColor(clientReferenceId: string | null): {
  tier: string;
  color: string;
  productName: string;
} {
  if (!clientReferenceId) {
    return { tier: "unknown", color: "Unknown", productName: "Unknown" };
  }
  const parts = clientReferenceId.split("_");
  const tier = parts[0] || "unknown";
  const color = parts[1] || "Unknown";
  const productName =
    tier === "premium"
      ? "LumiRead Premium"
      : tier === "basic"
        ? "LumiRead Basic"
        : "Unknown";
  return { tier, color, productName };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Retrieve full session with expanded data
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "collected_information.shipping_details"],
      });

      const { color, productName } = parseTierAndColor(
        fullSession.client_reference_id
      );

      const customerDetails = fullSession.customer_details;
      const shippingDetails =
        fullSession.collected_information?.shipping_details;
      const shippingAddress = shippingDetails?.address;
      const lineItem = fullSession.line_items?.data[0];
      const quantity = lineItem?.quantity ?? 1;
      const amountTotal = fullSession.amount_total ?? 0;
      const unitPrice = quantity > 0 ? Math.round(amountTotal / quantity) : 0;
      const paymentIntentId =
        typeof fullSession.payment_intent === "string"
          ? fullSession.payment_intent
          : fullSession.payment_intent?.id ?? null;

      const order = await prisma.order.create({
        data: {
          customerName: customerDetails?.name ?? "Unknown",
          customerEmail: customerDetails?.email ?? "",
          customerPhone: customerDetails?.phone ?? null,
          addressLine1: shippingAddress?.line1 ?? "",
          addressLine2: shippingAddress?.line2 ?? null,
          city: shippingAddress?.city ?? "",
          state: shippingAddress?.state ?? "",
          postalCode: shippingAddress?.postal_code ?? "",
          country: shippingAddress?.country ?? "US",
          color,
          productName,
          quantity,
          unitPrice,
          subtotal: amountTotal,
          total: amountTotal,
          stripePaymentIntent: paymentIntentId,
          status: "PAID",
          paidAt: new Date(),
        },
      });

      // Send confirmation email
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "LumiRead <orders@lumiread.com>",
          to: order.customerEmail,
          subject: `Order confirmed! #${order.id.slice(-8).toUpperCase()}`,
          html: buildOrderConfirmationEmail(order),
        });
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
      }
    } catch (dbErr) {
      console.error("Failed to create order from checkout session:", dbErr);
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      await prisma.order.update({
        where: { stripePaymentIntent: paymentIntent.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });
    } catch (dbErr) {
      // Order may not exist yet or already marked PAID — that's fine
      console.error("Failed to update order for payment_intent.succeeded:", dbErr);
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      await prisma.order.update({
        where: { stripePaymentIntent: paymentIntent.id },
        data: { status: "CANCELLED" },
      });
    } catch (dbErr) {
      console.error("Failed to update failed order:", dbErr);
    }
  }

  return NextResponse.json({ received: true });
}
