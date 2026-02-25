import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin-auth";
import { resend } from "@/lib/resend";
import { buildShippingEmail } from "@/lib/email-templates";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json(
      { error: "Pedido não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(order);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Fetch current order to detect tracking changes
  const currentOrder = await prisma.order.findUnique({ where: { id } });
  if (!currentOrder) {
    return NextResponse.json(
      { error: "Pedido não encontrado" },
      { status: 404 }
    );
  }

  const allowedFields = ["status", "trackingCode", "notes"];
  const updateData: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  // Auto-set status to SHIPPED when tracking is added on a PROCESSING order
  const newTracking = updateData.trackingCode as string | undefined;
  const trackingBeingSet = newTracking && newTracking !== currentOrder.trackingCode;
  if (
    trackingBeingSet &&
    currentOrder.status === "PROCESSING" &&
    !body.status
  ) {
    updateData.status = "SHIPPED";
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    // Send shipping email when tracking code is set/changed
    if (trackingBeingSet) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "LumiRead <orders@lumiread.com>",
          to: order.customerEmail,
          subject: `Your order has shipped! #${order.id.slice(-8).toUpperCase()}`,
          html: buildShippingEmail(order, newTracking),
        });
      } catch (emailErr) {
        console.error("Failed to send shipping email:", emailErr);
      }
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Pedido não encontrado" },
      { status: 404 }
    );
  }
}
