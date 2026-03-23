import { useState } from "react";
import { mockPurchaseOrders } from "@/data/mockData";
import { Plus } from "lucide-react";
import { StatusBadge, Modal, Input } from "./SupplierEnquiry";
import { toast } from "sonner";

const PurchaseOrder = () => {
  const [orders, setOrders] = useState(mockPurchaseOrders);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ supplier: "", material: "", amount: "" });

  const handleAdd = () => {
    if (!form.supplier || !form.amount) return;
    const id = `PO-2024-${String(orders.length + 1).padStart(3, "0")}`;
    setOrders([...orders, { id, supplier: form.supplier, material: form.material, amount: Number(form.amount), status: "Pending" }]);
    setForm({ supplier: "", material: "", amount: "" });
    setShowModal(false);
    toast.success("Purchase Order created");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Purchase Orders</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create PO
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">PO ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Supplier</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Material</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount (₹)</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            </tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-foreground text-xs">{o.id}</td>
                  <td className="px-4 py-3 text-foreground">{o.supplier}</td>
                  <td className="px-4 py-3 text-foreground">{o.material}</td>
                  <td className="px-4 py-3 text-foreground">₹{o.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Create Purchase Order" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Input label="Supplier" value={form.supplier} onChange={(v) => setForm({ ...form, supplier: v })} />
            <Input label="Material" value={form.material} onChange={(v) => setForm({ ...form, material: v })} />
            <Input label="Amount (₹)" type="number" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} />
            <button onClick={handleAdd} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Submit</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PurchaseOrder;
