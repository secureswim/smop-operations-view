import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salesApi } from "@/lib/api";
import { StatusBadge } from "./SupplierEnquiry";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const OrderConfirmation = () => {
  const queryClient = useQueryClient();

  const { data: ordersRes, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => salesApi.listOrders({ limit: 100 }),
  });

  const confirmMutation = useMutation({
    mutationFn: (data: {
      customerName: string;
      productName: string;
      quantity: number;
      totalAmount: number;
    }) => salesApi.confirmOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order confirmed");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const orders = (ordersRes?.data ?? []) as Array<Record<string, unknown>>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">Orders</h1>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order #</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Qty</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount (₹)</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No orders found</td></tr>
                ) : orders.map((o: Record<string, unknown>) => (
                  <tr key={o.id as string} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-foreground text-xs">{(o.orderNumber || o.id) as string}</td>
                    <td className="px-4 py-3 text-foreground">{(o.customerName ?? "") as string}</td>
                    <td className="px-4 py-3 text-foreground">{(o.productName ?? "") as string}</td>
                    <td className="px-4 py-3 text-foreground">{String(o.quantity ?? "")}</td>
                    <td className="px-4 py-3 text-foreground">₹{o.totalAmount ? Number(o.totalAmount).toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-foreground text-xs">{o.createdAt ? new Date(o.createdAt as string).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status as string} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
