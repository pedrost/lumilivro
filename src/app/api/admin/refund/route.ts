import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { buildRefundEmail } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { orderId } = body;

  if (!orderId) {
    return NextResponse.json(
      { error: "orderId is required" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!order.stripePaymentIntent) {
    return NextResponse.json(
      { error: "Order has no Stripe payment intent" },
      { status: 400 }
    );
  }

  const refundableStatuses = ["PAID", "PROCESSING", "SHIPPED"];
  if (!refundableStatuses.includes(order.status)) {
    return NextResponse.json(
      { error: `Cannot refund order with status ${order.status}` },
      { status: 400 }
    );
  }

  try {
    await stripe.refunds.create({
      payment_intent: order.stripePaymentIntent,
    });
  } catch (err) {
    console.error("Stripe refund failed:", err);
    return NextResponse.json(
      { error: "Failed to process refund with Stripe" },
      { status: 500 }
    );
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "LumiRead <orders@lumiread.com>",
      to: order.customerEmail,
      subject: `Refund processed — Order #${order.id.slice(-8).toUpperCase()}`,
      html: buildRefundEmail(order),
    });
  } catch (emailErr) {
    console.error("Failed to send refund email:", emailErr);
  }

  return NextResponse.json(updated);
}
