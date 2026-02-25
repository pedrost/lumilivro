"use client";

import { useEffect, useState, useCallback } from "react";
import { formatUSD } from "@/lib/format";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";
import OrderDetailDialog from "./OrderDetailDialog";
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

const STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];


export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/orders?${params}`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setTotalPages(data.pages);
        setTotal(data.total);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  function handleStatusChange(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  function handleOrderClick(order: Order) {
    setSelectedOrder(order);
    setDialogOpen(true);
  }

  function handleOrderUpdate(updated: Order) {
    setOrders((prev) =>
      prev.map((o) => (o.id === updated.id ? updated : o))
    );
    setSelectedOrder(updated);
  }

  function exportCSV() {
    const headers = [
      "ID",
      "Date",
      "Customer",
      "Email",
      "Phone",
      "City",
      "State",
      "Product",
      "Color",
      "Quantity",
      "Total",
      "Status",
      "Tracking",
    ];

    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleDateString("en-US"),
      o.customerName,
      o.customerEmail,
      o.customerPhone || "",
      o.city,
      o.state,
      o.productName,
      o.color,
      o.quantity,
      (o.total / 100).toFixed(2),
      o.status,
      o.trackingCode || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportSupplierCSV() {
    const paidOrders = orders.filter((o) => o.status === "PAID");

    if (paidOrders.length === 0) {
      toast({
        title: "No orders to export",
        description: "There are no PAID orders to export for the supplier.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Name",
      "Phone",
      "Address Line 1",
      "Address Line 2",
      "City",
      "State",
      "ZIP",
      "Country",
      "Color",
      "Quantity",
      "Product",
    ];

    const rows = paidOrders.map((o) => [
      o.customerName,
      o.customerPhone || "",
      o.addressLine1,
      o.addressLine2 || "",
      o.city,
      o.state,
      o.postalCode,
      o.country,
      o.color,
      o.quantity,
      o.productName,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `supplier-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-neutral-400 text-sm mt-1">
            {total} order{total !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportSupplierCSV}
            className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Supplier Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800"
          >
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-48 bg-neutral-900 border-neutral-700 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-800 border-neutral-700">
            {STATUS_FILTER_OPTIONS.map((opt) => (
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

        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email or ID..."
              className="pl-10 bg-neutral-900 border-neutral-700 text-white placeholder:text-neutral-500"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800"
          >
            Search
          </Button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            No orders found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-neutral-800 hover:bg-transparent">
                <TableHead className="text-neutral-400">ID</TableHead>
                <TableHead className="text-neutral-400">Date</TableHead>
                <TableHead className="text-neutral-400">Customer</TableHead>
                <TableHead className="text-neutral-400">Total</TableHead>
                <TableHead className="text-neutral-400">Product</TableHead>
                <TableHead className="text-neutral-400">Status</TableHead>
                <TableHead className="text-neutral-400 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const cfg =
                  ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;
                return (
                  <TableRow
                    key={order.id}
                    className="border-neutral-800 hover:bg-neutral-800/50 cursor-pointer"
                    onClick={() => handleOrderClick(order)}
                  >
                    <TableCell className="font-mono text-sm text-neutral-300">
                      {order.id.slice(-8)}
                    </TableCell>
                    <TableCell className="text-neutral-300 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString("en-US")}
                    </TableCell>
                    <TableCell className="text-white">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-neutral-500">
                          {order.customerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-white whitespace-nowrap">
                      {formatUSD(order.total)}
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      {order.productName}
                    </TableCell>
                    <TableCell>
                      <Badge className={cfg.className}>{cfg.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-neutral-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-800">
            <p className="text-sm text-neutral-400">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Order detail dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onUpdate={handleOrderUpdate}
      />
    </div>
  );
}
