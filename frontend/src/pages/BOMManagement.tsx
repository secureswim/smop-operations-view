import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { manufacturingApi, materialsApi } from "@/lib/api";
import { Plus, Loader2 } from "lucide-react";
import { Modal } from "./SupplierEnquiry";
import { toast } from "sonner";

const BOMManagement = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    productName: "",
    description: "",
    items: [{ materialId: "", quantity: "", unit: "pcs" }],
  });

  const { data: bomsRes, isLoading } = useQuery({
    queryKey: ["boms"],
    queryFn: () => manufacturingApi.viewBOMs(),
  });

  const { data: materialsRes } = useQuery({
    queryKey: ["materials"],
    queryFn: () => materialsApi.list(),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      manufacturingApi.createBOM({
        name: form.name,
        productName: form.productName,
        description: form.description || undefined,
        items: form.items
          .filter((i) => i.materialId && i.quantity)
          .map((i) => ({ materialId: i.materialId, quantity: Number(i.quantity), unit: i.unit })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boms"] });
      setShowModal(false);
      setForm({ name: "", productName: "", description: "", items: [{ materialId: "", quantity: "", unit: "pcs" }] });
      toast.success("BOM created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const boms = (bomsRes?.data ?? []) as Array<Record<string, unknown>>;
  const materials = (materialsRes?.data ?? []) as Array<{ id: string; name: string }>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">BOM Management</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create BOM
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-4">
          {boms.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">No BOMs found</div>
          ) : boms.map((bom: Record<string, unknown>) => (
            <div key={bom.id as string} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-foreground">{(bom.productName ?? bom.name) as string}</h3>
                <span className="text-xs font-mono text-muted-foreground">{(bom.bomNumber ?? "") as string}</span>
              </div>
              {bom.description && <p className="text-xs text-muted-foreground mb-3">{bom.description as string}</p>}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">Material</th>
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">Required Qty</th>
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">Unit</th>
                  </tr></thead>
                  <tbody>
                    {Array.isArray(bom.items) && (bom.items as Array<Record<string, unknown>>).map((item, i) => {
                      const mat = item.material as Record<string, unknown> | undefined;
                      return (
                        <tr key={i} className="border-b border-border/50">
                          <td className="px-3 py-2 text-foreground">{(mat?.name ?? item.materialName ?? "—") as string}</td>
                          <td className="px-3 py-2 text-foreground">{String(item.quantity ?? 0)}</td>
                          <td className="px-3 py-2 text-foreground text-xs">{(item.unit ?? mat?.unit ?? "") as string}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Create BOM" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">BOM Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors" placeholder="e.g. Speed Motor 500W BOM" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Product Name</label>
              <input type="text" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors" placeholder="e.g. Speed Motor 500W" />
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
            <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.name || !form.productName}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Create BOM
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BOMManagement;
