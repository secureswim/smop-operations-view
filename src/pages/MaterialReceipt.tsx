import { useState } from "react";
import { mockReceipts, mockPurchaseOrders } from "@/data/mockData";
import { Plus } from "lucide-react";
import { StatusBadge, Modal, Input } from "./SupplierEnquiry";
import { toast } from "sonner";

const MaterialReceipt = () => {
  const [receipts, setReceipts] = useState(mockReceipts);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ poId: "", material: "", quantity: "" });

  const handleAdd = () => {
    if (!form.poId || !form.material || !form.quantity) return;
    setReceipts([...receipts, { id: Date.now(), poId: form.poId, material: form.material, quantity: Number(form.quantity), receivedDate: new Date().toISOString().split("T")[0], status: "Pending Inspection" }]);
    setForm({ poId: "", material: "", quantity: "" });
    setShowModal(false);
    toast.success("Material receipt recorded");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Material Receipt</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Record Receipt
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">PO ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Material</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Quantity</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Received Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            </tr></thead>
            <tbody>
              {receipts.map((r) => (
                <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-foreground text-xs">{r.poId}</td>
                  <td className="px-4 py-3 text-foreground">{r.material}</td>
                  <td className="px-4 py-3 text-foreground">{r.quantity}</td>
                  <td className="px-4 py-3 text-foreground">{r.receivedDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Record Material Receipt" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Purchase Order</label>
              <select value={form.poId} onChange={(e) => setForm({ ...form, poId: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors">
                <option value="">Select PO</option>
                {mockPurchaseOrders.map((po) => <option key={po.id} value={po.id}>{po.id} - {po.supplier}</option>)}
              </select>
            </div>
            <Input label="Material" value={form.material} onChange={(v) => setForm({ ...form, material: v })} />
            <Input label="Quantity" type="number" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} />
            <button onClick={handleAdd} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Submit</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MaterialReceipt;
