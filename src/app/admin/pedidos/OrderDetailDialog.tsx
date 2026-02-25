"use client";

import { useState } from "react";
import { formatUSD, formatPhone } from "@/lib/format";
import { ORDER_STATUS_CONFIG, ORDER_STATUS_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Loader2, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  color: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  stripePaymentIntent: string | null;
  paidAt: string | null;
  status: string;
  trackingCode: string | null;
  notes: string | null;
}


function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-sm text-neutral-400 shrink-0">{label}</span>
      <span className="text-sm text-white text-right">{value}</span>
    </div>
  );
}

export default function OrderDetailDialog({
  order,
  open,
  onClose,
  onUpdate,
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updated: Order) => void;
}) {
  const [status, setStatus] = useState(order?.status || "");
  const [trackingCode, setTrackingCode] = useState(order?.trackingCode || "");
  const [notes, setNotes] = useState(order?.notes || "");
  const [saving, setSaving] = useState(false);
  const [refunding, setRefunding] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Sync form state when order changes
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  if (order && order.id !== lastOrderId) {
    setLastOrderId(order.id);
    setStatus(order.status);
    setTrackingCode(order.trackingCode || "");
    setNotes(order.notes || "");
  }

  if (!order) return null;

  const fullAddress = [
    order.addressLine1,
    order.addressLine2,
    `${order.city}, ${order.state} ${order.postalCode}`,
    order.country,
  ]
    .filter(Boolean)
    .join(", ");

  async function handleCopyAddress() {
    const addressForCopy = `${order!.customerName}\n${order!.addressLine1}${order!.addressLine2 ? `\n${order!.addressLine2}` : ""}\n${order!.city}, ${order!.state} ${order!.postalCode}\n${order!.country}${order!.customerPhone ? `\n${formatPhone(order!.customerPhone)}` : ""}`;

    await navigator.clipboard.writeText(addressForCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${order!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingCode, notes }),
        credentials: "include",
      });

      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
        onClose();
      }
    } catch (err) {
      console.error("Error saving:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleRefund() {
    if (
      !window.confirm(
        `Issue a full refund of ${formatUSD(order!.total)} for order #${order!.id.slice(-8)}? This cannot be undone.`
      )
    ) {
      return;
    }

    setRefunding(true);
    try {
      const res = await fetch("/api/admin/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order!.id }),
        credentials: "include",
      });

      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
        toast({
          title: "Refund processed",
          description: `Order #${order!.id.slice(-8)} has been refunded.`,
        });
      } else {
        const data = await res.json();
        toast({
          title: "Refund failed",
          description: data.error || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Refund error:", err);
      toast({
        title: "Refund failed",
        description: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefunding(false);
    }
  }

  const statusLabel =
    ORDER_STATUS_OPTIONS.find((s) => s.value === order.status)?.label || order.status;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="bg-neutral-900 border-neutral-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3">
            <span>Order #{order.id.slice(-8)}</span>
            <Badge className={ORDER_STATUS_CONFIG[order.status]?.className}>
              {statusLabel}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Created{" "}
            {new Date(order.createdAt).toLocaleString("en-US")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Customer */}
          <Section title="Customer">
            <InfoRow label="Name" value={order.customerName} />
            <InfoRow label="Email" value={order.customerEmail} />
            {order.customerPhone && (
              <InfoRow label="Phone" value={formatPhone(order.customerPhone)} />
            )}
          </Section>

          {/* Address */}
          <Section title="Address">
            <p className="text-sm text-white">{fullAddress}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAddress}
              className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Address
                </>
              )}
            </Button>
          </Section>

          {/* Payment */}
          <Section title="Payment">
            <InfoRow
              label="Status"
              value={
                <Badge className={ORDER_STATUS_CONFIG[order.status]?.className}>
                  {statusLabel}
                </Badge>
              }
            />
            {order.stripePaymentIntent && (
              <InfoRow
                label="Payment Intent"
                value={
                  <span className="font-mono text-xs">
                    {order.stripePaymentIntent}
                  </span>
                }
              />
            )}
            {order.paidAt && (
              <InfoRow
                label="Paid at"
                value={new Date(order.paidAt).toLocaleString("en-US")}
              />
            )}
            {order.stripePaymentIntent &&
              ["PAID", "PROCESSING", "SHIPPED"].includes(order.status) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefund}
                  disabled={refunding}
                  className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-2"
                >
                  {refunding ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <RotateCcw className="h-3 w-3 mr-1" />
                  )}
                  Issue Full Refund
                </Button>
              )}
          </Section>

          {/* Product */}
          <Section title="Product">
            <InfoRow label="Product" value={order.productName} />
            <InfoRow label="Color" value={order.color} />
            <InfoRow label="Quantity" value={order.quantity} />
            <InfoRow label="Unit Price" value={formatUSD(order.unitPrice)} />
            <InfoRow label="Subtotal" value={formatUSD(order.subtotal)} />
            {order.discount > 0 && (
              <InfoRow
                label="Discount"
                value={
                  <span className="text-green-400">
                    -{formatUSD(order.discount)}
                  </span>
                }
              />
            )}
            <InfoRow label="Shipping" value={formatUSD(order.shipping)} />
            <div className="border-t border-neutral-700 pt-2">
              <InfoRow
                label="Total"
                value={
                  <span className="text-lg font-bold text-amber-500">
                    {formatUSD(order.total)}
                  </span>
                }
              />
            </div>
          </Section>

          {/* Editable fields */}
          <div className="border-t border-neutral-700 pt-6 space-y-4">
            <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider">
              Manage Order
            </h3>

            <div className="space-y-2">
              <label className="text-sm text-neutral-400">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  {ORDER_STATUS_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-white focus:bg-neutral-700 focus:text-white"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-neutral-400">
                Tracking Code
              </label>
              <Input
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="e.g. 1Z999AA10123456784"
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              />
              <p className="text-xs text-neutral-500">
                Adding a tracking code to a Processing order will auto-set status to Shipped and send a shipping email.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-neutral-400">
                Internal Notes
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes about this order..."
                rows={3}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
