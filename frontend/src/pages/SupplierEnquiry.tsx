import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { suppliersApi, materialsApi } from "@/lib/api";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SupplierEnquiry = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ supplierId: "", items: [{ materialId: "", quantity: "", unit: "pcs" }] });

  const { data: enquiriesRes, isLoading } = useQuery({
    queryKey: ["enquiries"],
    queryFn: () => suppliersApi.listEnquiries({ limit: 100 }),
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
      suppliersApi.createEnquiry({
        supplierId: form.supplierId,
        items: form.items
          .filter((i) => i.materialId && i.quantity)
          .map((i) => ({ materialId: i.materialId, quantity: Number(i.quantity), unit: i.unit })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      setShowModal(false);
      setForm({ supplierId: "", items: [{ materialId: "", quantity: "", unit: "pcs" }] });
      toast.success("Enquiry created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const enquiries = (enquiriesRes?.data ?? []) as Array<Record<string, unknown>>;
  const suppliers = (suppliersRes?.data ?? []) as Array<{ id: string; name: string }>;
  const materials = (materialsRes?.data ?? []) as Array<{ id: string; name: string }>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Supplier Enquiries</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create Enquiry
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Enquiry #</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Supplier</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Items</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              </tr></thead>
              <tbody>
                {enquiries.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No enquiries found</td></tr>
                ) : enquiries.map((e: Record<string, unknown>) => (
                  <tr key={e.id as string} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-foreground text-xs">{(e.enquiryNumber || e.id) as string}</td>
                    <td className="px-4 py-3 text-foreground">{((e.supplier as Record<string, unknown>)?.name ?? e.supplierId) as string}</td>
                    <td className="px-4 py-3 text-foreground">{Array.isArray(e.items) ? e.items.length : 0} items</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status as string} /></td>
                    <td className="px-4 py-3 text-foreground text-xs">{e.createdAt ? new Date(e.createdAt as string).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Create Enquiry" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Supplier</label>
              <select value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors">
                <option value="">Select supplier</option>
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
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

export const StatusBadge = ({ status }: { status: string }) => {
  const s = status?.replace(/_/g, " ") ?? "";
  const colors: Record<string, string> = {
    PENDING: "bg-warning/10 text-warning",
    DRAFT: "bg-muted text-muted-foreground",
    PENDING_APPROVAL: "bg-warning/10 text-warning",
    APPROVED: "bg-success/10 text-success",
    SENT_TO_SUPPLIER: "bg-primary/10 text-primary",
    RESPONDED: "bg-primary/10 text-primary",
    CLOSED: "bg-muted text-muted-foreground",
    DELIVERED: "bg-success/10 text-success",
    PARTIALLY_DELIVERED: "bg-primary/10 text-primary",
    CANCELLED: "bg-destructive/10 text-destructive",
    RECEIVED: "bg-primary/10 text-primary",
    UNDER_REVIEW: "bg-primary/10 text-primary",
    ACCEPTED: "bg-success/10 text-success",
    REJECTED: "bg-destructive/10 text-destructive",
    CONFIRMED: "bg-success/10 text-success",
    INSPECTED: "bg-success/10 text-success",
    PENDING_INSPECTION: "bg-warning/10 text-warning",
    ACTIVE: "bg-success/10 text-success",
    // Lowercase fallbacks
    Pending: "bg-warning/10 text-warning",
    Approved: "bg-success/10 text-success",
    Delivered: "bg-success/10 text-success",
    Confirmed: "bg-success/10 text-success",
    Rejected: "bg-destructive/10 text-destructive",
    Accepted: "bg-success/10 text-success",
  };
  const displayName = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>{displayName}</span>;
};

export const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
    <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors"><X className="w-4 h-4 text-muted-foreground" /></button>
      </div>
      {children}
    </div>
  </div>
);

export const Input = ({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || label}
      className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-colors" />
  </div>
);

export default SupplierEnquiry;
