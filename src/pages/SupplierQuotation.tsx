import { useState } from "react";
import { mockQuotations } from "@/data/mockData";
import { Plus } from "lucide-react";
import { StatusBadge, Modal, Input } from "./SupplierEnquiry";
import { toast } from "sonner";

const SupplierQuotation = () => {
  const [quotations, setQuotations] = useState(mockQuotations);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ supplier: "", material: "", price: "", leadTime: "" });

  const handleAdd = () => {
    if (!form.supplier || !form.price) return;
    setQuotations([...quotations, { id: Date.now(), supplier: form.supplier, material: form.material, price: Number(form.price), leadTime: form.leadTime, status: "Received" }]);
    setForm({ supplier: "", material: "", price: "", leadTime: "" });
    setShowModal(false);
    toast.success("Quotation added");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Supplier Quotations</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Quotation
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Supplier</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Material</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price (₹)</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Lead Time</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            </tr></thead>
            <tbody>
              {quotations.map((q) => (
                <tr key={q.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{q.supplier}</td>
                  <td className="px-4 py-3 text-foreground">{q.material}</td>
                  <td className="px-4 py-3 text-foreground">₹{q.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-foreground">{q.leadTime}</td>
                  <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Add Quotation" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Input label="Supplier" value={form.supplier} onChange={(v) => setForm({ ...form, supplier: v })} />
            <Input label="Material" value={form.material} onChange={(v) => setForm({ ...form, material: v })} />
            <Input label="Price (₹)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
            <Input label="Lead Time" value={form.leadTime} onChange={(v) => setForm({ ...form, leadTime: v })} placeholder="e.g. 7 days" />
            <button onClick={handleAdd} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Submit</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SupplierQuotation;
