"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatUSD } from "@/lib/format";
import { ORDER_STATUS_CONFIG } from "@/lib/constants";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  MessageSquare,
  ArrowRight,
  Loader2,
  Wallet,
  Hourglass,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  total: number;
  status: string;
}


function StatCard({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  loading: boolean;
}) {
  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-neutral-400">{label}</span>
        <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-amber-500" />
        </div>
      </div>
      {loading ? (
        <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
      ) : (
        <p className="text-2xl font-bold text-white">{value}</p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);
  const [balanceAvailable, setBalanceAvailable] = useState(0);
  const [balancePending, setBalancePending] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, contactsRes] = await Promise.all([
          fetch("/api/orders?limit=1000", { credentials: "include" }),
          fetch("/api/contacts?limit=1", { credentials: "include" }),
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const allOrders: Order[] = ordersData.orders;

          setOrders(allOrders.slice(0, 5));
          setTotalOrders(ordersData.total);

          const paidStatuses = [
            "PAID",
            "PROCESSING",
            "SHIPPED",
            "DELIVERED",
          ];
          const totalRevenue = allOrders
            .filter((o) => paidStatuses.includes(o.status))
            .reduce((sum, o) => sum + o.total, 0);
          setRevenue(totalRevenue);

          const pending = allOrders.filter(
            (o) => o.status === "PENDING"
          ).length;
          setPendingCount(pending);
        }

        if (contactsRes.ok) {
          const contactsData = await contactsRes.json();
          setContactsCount(contactsData.total);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Fetch Stripe balance separately so failure doesn't break dashboard
    async function fetchBalance() {
      try {
        const res = await fetch("/api/admin/balance", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setBalanceAvailable(data.available);
          setBalancePending(data.pending);
        }
      } catch (err) {
        console.error("Error loading balance:", err);
      } finally {
        setBalanceLoading(false);
      }
    }

    fetchBalance();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-neutral-400 mt-1">
          Overview of your LumiRead store
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Orders"
          value={totalOrders.toString()}
          icon={ShoppingCart}
          loading={loading}
        />
        <StatCard
          label="Total Revenue"
          value={formatUSD(revenue)}
          icon={DollarSign}
          loading={loading}
        />
        <StatCard
          label="Pending Orders"
          value={pendingCount.toString()}
          icon={Clock}
          loading={loading}
        />
        <StatCard
          label="Unread Contacts"
          value={contactsCount.toString()}
          icon={MessageSquare}
          loading={loading}
        />
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Available Balance"
          value={formatUSD(balanceAvailable)}
          icon={Wallet}
          loading={balanceLoading}
        />
        <StatCard
          label="Pending Balance"
          value={formatUSD(balancePending)}
          icon={Hourglass}
          loading={balanceLoading}
        />
      </div>

      {/* Recent orders */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800">
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-lg font-semibold text-white">
            Recent Orders
          </h2>
          <Link
            href="/admin/pedidos"
            className="text-sm text-amber-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

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
                <TableHead className="text-neutral-400">Data</TableHead>
                <TableHead className="text-neutral-400">Cliente</TableHead>
                <TableHead className="text-neutral-400">Valor</TableHead>
                <TableHead className="text-neutral-400">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const cfg = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;
                return (
                  <TableRow
                    key={order.id}
                    className="border-neutral-800 hover:bg-neutral-800/50"
                  >
                    <TableCell className="font-mono text-sm text-neutral-300">
                      {order.id.slice(-8)}
                    </TableCell>
                    <TableCell className="text-neutral-300">
                      {new Date(order.createdAt).toLocaleDateString("en-US")}
                    </TableCell>
                    <TableCell className="text-white">
                      {order.customerName}
                    </TableCell>
                    <TableCell className="text-white">
                      {formatUSD(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge className={cfg.className}>{cfg.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
