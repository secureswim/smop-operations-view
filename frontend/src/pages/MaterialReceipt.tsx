import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseOrdersApi, materialsApi } from "@/lib/api";
import { Plus, Loader2 } from "lucide-react";
import { StatusBadge, Modal } from "./SupplierEnquiry";
import { toast } from "sonner";

const MaterialReceipt = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    purchaseOrderId: "",
    items: [{ materialId: "", quantity: "", unit: "pcs" }],
  });

  // List POs that are approved/sent so we can receive against them
  const { data: posRes } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: () => purchaseOrdersApi.list({ limit: 100 }),
  });

  const { data: materialsRes } = useQuery({
    queryKey: ["materials"],
    queryFn: () => materialsApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      materialsApi.recordReceipt({
        purchaseOrderId: form.purchaseOrderId,
        items: form.items
          .filter((i) => i.materialId && i.quantity)
          .map((i) => ({ materialId: i.materialId, quantity: Number(i.quantity), unit: i.unit })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setShowModal(false);
      setForm({ purchaseOrderId: "", items: [{ materialId: "", quantity: "", unit: "pcs" }] });
      toast.success("Material receipt recorded");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const pos = (posRes?.data ?? []) as Array<Record<string, unknown>>;
  const materials = (materialsRes?.data ?? []) as Array<{ id: string; name: string }>;

  // Filter POs to only those in receivable statuses
  const receivablePOs = pos.filter((po) =>
    ["APPROVED", "SENT_TO_SUPPLIER", "PARTIALLY_DELIVERED"].includes(po.status as string)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Material Receipt</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Record Receipt
        </button>
      </div>

      {/* Show POs with their delivery status */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">PO #</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Supplier</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Items</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
            </tr></thead>
            <tbody>
              {pos.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No purchase orders yet</td></tr>
              ) : pos.map((po: Record<string, unknown>) => (
                <tr key={po.id as string} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-foreground text-xs">{(po.poNumber || po.id) as string}</td>
                  <td className="px-4 py-3 text-foreground">{((po.supplier as Record<string, unknown>)?.name ?? "") as string}</td>
                  <td className="px-4 py-3 text-foreground">{Array.isArray(po.items) ? po.items.length : 0} items</td>
                  <td className="px-4 py-3"><StatusBadge status={po.status as string} /></td>
                  <td className="px-4 py-3 text-foreground text-xs">{po.createdAt ? new Date(po.createdAt as string).toLocaleDateString() : "—"}</td>
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
              <select value={form.purchaseOrderId} onChange={(e) => setForm({ ...form, purchaseOrderId: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors">
                <option value="">Select PO</option>
                {receivablePOs.map((po) => (
                  <option key={po.id as string} value={po.id as string}>
                    {(po.poNumber || po.id) as string} — {((po.supplier as Record<string, unknown>)?.name ?? "") as string}
                  </option>
                ))}
              </select>
            </div>
            {form.items.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-1.5">{idx === 0 ? "Material" : ""}</label>
                  <select value={item.materialId} onChange={(e) => {
                    const newItems = [...form.items];
                    newItems[idx] = { ...item, materialId: e.target.value };
                    setForm({ ...form, items: newItems });
                  }} className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors">
                    <option value="">Select material</option>
                    {materials.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-foreground mb-1.5">{idx === 0 ? "Qty" : ""}</label>
                  <input type="number" value={item.quantity} onChange={(e) => {
                    const newItems = [...form.items];
                    newItems[idx] = { ...item, quantity: e.target.value };
                    setForm({ ...form, items: newItems });
                  }} className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors" placeholder="Qty" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { materialId: "", quantity: "", unit: "pcs" }] })} className="text-xs text-primary hover:underline">+ Add another item</button>
            <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.purchaseOrderId}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Receipt
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MaterialReceipt;
