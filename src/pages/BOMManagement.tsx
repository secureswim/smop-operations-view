import { useState } from "react";
import { mockBOMs } from "@/data/mockData";
import { Plus } from "lucide-react";
import { Modal, Input } from "./SupplierEnquiry";
import { toast } from "sonner";

const BOMManagement = () => {
  const [boms, setBoms] = useState(mockBOMs);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ product: "", materials: "" });

  const handleAdd = () => {
    if (!form.product || !form.materials) return;
    const materials = form.materials.split(",").map((m) => {
      const parts = m.trim().split(":");
      return { material: parts[0]?.trim() || "", quantity: Number(parts[1]?.trim()) || 1 };
    });
    setBoms([...boms, { id: Date.now(), product: form.product, materials }]);
    setForm({ product: "", materials: "" });
    setShowModal(false);
    toast.success("BOM created");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">BOM Management</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create BOM
        </button>
      </div>

      <div className="grid gap-4">
        {boms.map((bom) => (
          <div key={bom.id} className="bg-card rounded-xl border border-border p-5">
            <h3 className="text-base font-semibold text-foreground mb-3">{bom.product}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Material</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Required Qty</th>
                </tr></thead>
                <tbody>
                  {bom.materials.map((m, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-3 py-2 text-foreground">{m.material}</td>
                      <td className="px-3 py-2 text-foreground">{m.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title="Create BOM" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Input label="Product Name" value={form.product} onChange={(v) => setForm({ ...form, product: v })} />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Materials (format: name:qty, name:qty)</label>
              <textarea value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors min-h-[80px]"
                placeholder="e.g. Mild Steel Sheets:5, Copper Wire:50" />
            </div>
            <button onClick={handleAdd} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Create BOM</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BOMManagement;
