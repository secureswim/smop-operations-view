import { useState } from "react";
import { mockOrders } from "@/data/mockData";
import { StatusBadge } from "./SupplierEnquiry";
import { toast } from "sonner";

const OrderConfirmation = () => {
  const [orders, setOrders] = useState(mockOrders);

  const confirmOrder = (id: string) => {
    setOrders(orders.map((o) => o.id === id ? { ...o, status: "Confirmed" } : o));
    toast.success(`Order ${id} confirmed`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">Orders</h1>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Qty</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-foreground text-xs">{o.id}</td>
                  <td className="px-4 py-3 text-foreground">{o.customer}</td>
                  <td className="px-4 py-3 text-foreground">{o.product}</td>
                  <td className="px-4 py-3 text-foreground">{o.quantity}</td>
                  <td className="px-4 py-3 text-foreground">{o.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3">
                    {o.status === "Pending" && (
                      <button onClick={() => confirmOrder(o.id)} className="px-3 py-1 rounded-md bg-success/10 text-success text-xs font-medium hover:bg-success/20 transition-colors">Confirm</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
