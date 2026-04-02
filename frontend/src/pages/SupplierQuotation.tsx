import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { suppliersApi, materialsApi } from "@/lib/api";
import { Plus, Loader2 } from "lucide-react";
import { StatusBadge, Modal } from "./SupplierEnquiry";
import { toast } from "sonner";

const SupplierQuotation = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    supplierId: "",
    leadTimeDays: "",
    items: [{ materialId: "", quantity: "", unitPrice: "" }],
  });

  const { data: quotationsRes, isLoading } = useQuery({
    queryKey: ["quotations"],
    queryFn: () => suppliersApi.listQuotations({ limit: 100 }),
  });

  const { data: suppliersRes } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => suppliersApi.list(),
  });

  const { data: materialsRes } = useQuery({
    queryKey: ["materials"],
    queryFn: () => materialsApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      suppliersApi.addQuotation({
        supplierId: form.supplierId,
        leadTimeDays: form.leadTimeDays ? Number(form.leadTimeDays) : undefined,
        items: form.items
          .filter((i) => i.materialId && i.quantity && i.unitPrice)
          .map((i) => ({ materialId: i.materialId, quantity: Number(i.quantity), unitPrice: Number(i.unitPrice) })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      setShowModal(false);
      setForm({ supplierId: "", leadTimeDays: "", items: [{ materialId: "", quantity: "", unitPrice: "" }] });
      toast.success("Quotation added");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const quotations = (quotationsRes?.data ?? []) as Array<Record<string, unknown>>;
  const suppliers = (suppliersRes?.data ?? []) as Array<{ id: string; name: string }>;
  const materials = (materialsRes?.data ?? []) as Array<{ id: string; name: string }>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Supplier Quotations</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Quotation
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Quotation #</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Supplier</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Items</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Total (₹)</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Lead Time</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {quotations.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No quotations found</td></tr>
                ) : quotations.map((q: Record<string, unknown>) => (
                  <tr key={q.id as string} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-foreground text-xs">{(q.quotationNumber || q.id) as string}</td>
                    <td className="px-4 py-3 text-foreground">{((q.supplier as Record<string, unknown>)?.name ?? q.supplierId) as string}</td>
                    <td className="px-4 py-3 text-foreground">{Array.isArray(q.items) ? q.items.length : 0} items</td>
                    <td className="px-4 py-3 text-foreground">₹{q.totalAmount ? Number(q.totalAmount).toLocaleString() : "—"}</td>
                    <td className="px-4 py-3 text-foreground">{q.leadTimeDays ? `${q.leadTimeDays} days` : "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={q.status as string} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Add Quotation" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Supplier</label>
              <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors">
                <option value="">Select supplier</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Lead Time (days)</label>
              <input type="number" value={form.leadTimeDays} onChange={(e) => setForm({ ...form, leadTimeDays: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors" placeholder="e.g. 7" />
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
                <div className="w-20">
                  <label className="block text-sm font-medium text-foreground mb-1.5">{idx === 0 ? "Qty" : ""}</label>
                  <input type="number" value={item.quantity} onChange={(e) => {
                    const newItems = [...form.items];
                    newItems[idx] = { ...item, quantity: e.target.value };
                    setForm({ ...form, items: newItems });
                  }} className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors" placeholder="Qty" />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-foreground mb-1.5">{idx === 0 ? "Unit ₹" : ""}</label>
                  <input type="number" value={item.unitPrice} onChange={(e) => {
                    const newItems = [...form.items];
                    newItems[idx] = { ...item, unitPrice: e.target.value };
                    setForm({ ...form, items: newItems });
                  }} className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors" placeholder="Price" />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setForm({ ...form, items: [...form.items, { materialId: "", quantity: "", unitPrice: "" }] })} className="text-xs text-primary hover:underline">+ Add another item</button>
            <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.supplierId}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SupplierQuotation;
