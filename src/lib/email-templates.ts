import { formatUSD } from "@/lib/format";

interface OrderForEmail {
  id: string;
  customerName: string;
  quantity: number;
  total: number;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  color: string;
  productName: string;
}

function formatAddress(order: OrderForEmail): string {
  return [
    order.addressLine1,
    order.addressLine2,
    `${order.city}, ${order.state} ${order.postalCode}`,
    order.country,
  ]
    .filter(Boolean)
    .join("<br>");
}

function formatOrderId(id: string): string {
  return id.slice(-8).toUpperCase();
}

export function buildOrderConfirmationEmail(order: OrderForEmail): string {
  const orderId = formatOrderId(order.id);
  const address = formatAddress(order);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ededed; padding: 32px;">
      <h1 style="color: #f59e0b; font-size: 24px; margin-bottom: 8px;">Order Confirmed!</h1>
      <p style="color: #737373; margin-bottom: 24px;">Order #${orderId}</p>

      <p>Hi, <strong>${order.customerName}</strong>!</p>
      <p>Your payment has been confirmed and your order is being prepared.</p>

      <div style="background: #111; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <h3 style="color: #f59e0b; margin-top: 0;">Order Summary</h3>
        <p><strong>Product:</strong> ${order.productName}</p>
        <p><strong>Color:</strong> ${order.color}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Total:</strong> ${formatUSD(order.total)}</p>
      </div>

      <div style="background: #111; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <h3 style="color: #f59e0b; margin-top: 0;">Shipping Address</h3>
        <p>${address}</p>
      </div>

      <p style="color: #737373; font-size: 14px;">
        You'll receive a tracking number by email once your order ships.
        Estimated delivery: 5-8 business days.
      </p>

      <hr style="border: none; border-top: 1px solid #1a1a1a; margin: 24px 0;">
      <p style="color: #737373; font-size: 12px;">
        LumiRead — Rechargeable Book Light<br>
        Questions? Reply to this email or visit our website.
      </p>
    </div>
  `;
}

export function buildRefundEmail(order: OrderForEmail): string {
  const orderId = formatOrderId(order.id);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ededed; padding: 32px;">
      <h1 style="color: #f59e0b; font-size: 24px; margin-bottom: 8px;">Refund Processed</h1>
      <p style="color: #737373; margin-bottom: 24px;">Order #${orderId}</p>

      <p>Hi, <strong>${order.customerName}</strong>!</p>
      <p>Your refund has been processed for order #${orderId}.</p>

      <div style="background: #111; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <h3 style="color: #f59e0b; margin-top: 0;">Refund Details</h3>
        <p><strong>Product:</strong> ${order.productName}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Refund Amount:</strong> ${formatUSD(order.total)}</p>
      </div>

      <p style="color: #737373; font-size: 14px;">
        The refund will appear on your original payment method within 5-10 business days,
        depending on your bank or card issuer.
      </p>

      <hr style="border: none; border-top: 1px solid #1a1a1a; margin: 24px 0;">
      <p style="color: #737373; font-size: 12px;">
        LumiRead — Rechargeable Book Light<br>
        Questions? Reply to this email or visit our website.
      </p>
    </div>
  `;
}

export function buildShippingEmail(
  order: OrderForEmail,
  trackingCode: string
): string {
  const orderId = formatOrderId(order.id);
  const address = formatAddress(order);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ededed; padding: 32px;">
      <h1 style="color: #f59e0b; font-size: 24px; margin-bottom: 8px;">Your order has shipped!</h1>
      <p style="color: #737373; margin-bottom: 24px;">Order #${orderId}</p>

      <p>Hi, <strong>${order.customerName}</strong>!</p>
      <p>Great news — your order is on its way!</p>

      <div style="background: #111; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <h3 style="color: #f59e0b; margin-top: 0;">Shipping Details</h3>
        <p><strong>Tracking Number:</strong> ${trackingCode}</p>
        <p><strong>Destination:</strong><br>${address}</p>
        <p><strong>Estimated Delivery:</strong> 10-13 business days</p>
      </div>

      <p style="color: #737373; font-size: 14px;">
        You can use your tracking number to follow your package's journey.
        Delivery times may vary depending on your location.
      </p>

      <hr style="border: none; border-top: 1px solid #1a1a1a; margin: 24px 0;">
      <p style="color: #737373; font-size: 12px;">
        LumiRead — Rechargeable Book Light<br>
        Questions? Reply to this email or visit our website.
      </p>
    </div>
  `;
}
