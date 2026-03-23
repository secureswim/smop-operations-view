import { useState } from "react";
import { mockEnquiries } from "@/data/mockData";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";

const SupplierEnquiry = () => {
  const [enquiries, setEnquiries] = useState(mockEnquiries);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ supplier: "", material: "", quantity: "" });

  const handleAdd = () => {
    if (!form.supplier || !form.material || !form.quantity) return;
    setEnquiries([...enquiries, { id: Date.now(), supplier: form.supplier, material: form.material, quantity: Number(form.quantity), status: "Pending" }]);
    setForm({ supplier: "", material: "", quantity: "" });
    setShowModal(false);
    toast.success("Enquiry created successfully");
  };

  const handleDelete = (id: number) => {
    setEnquiries(enquiries.filter((e) => e.id !== id));
    toast.success("Enquiry deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Supplier Enquiries</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create Enquiry
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Supplier</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Material</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Quantity</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {enquiries.map((e) => (
                <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{e.supplier}</td>
                  <td className="px-4 py-3 text-foreground">{e.material}</td>
                  <td className="px-4 py-3 text-foreground">{e.quantity}</td>
                  <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(e.id)} className="text-xs text-destructive hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title="Create Enquiry" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Input label="Supplier Name" value={form.supplier} onChange={(v) => setForm({ ...form, supplier: v })} />
            <Input label="Material" value={form.material} onChange={(v) => setForm({ ...form, material: v })} />
            <Input label="Quantity" type="number" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} />
            <button onClick={handleAdd} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Submit</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    Pending: "bg-warning/10 text-warning",
    Responded: "bg-primary/10 text-primary",
    Closed: "bg-muted text-muted-foreground",
    Approved: "bg-success/10 text-success",
    Delivered: "bg-success/10 text-success",
    "Under Review": "bg-primary/10 text-primary",
    Received: "bg-primary/10 text-primary",
    Accepted: "bg-success/10 text-success",
    Rejected: "bg-destructive/10 text-destructive",
    Confirmed: "bg-success/10 text-success",
    "Pending Inspection": "bg-warning/10 text-warning",
    Inspected: "bg-success/10 text-success",
  };
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-muted text-muted-foreground"}`}>{status}</span>;
};

export const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
    <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md p-6 animate-fade-in">
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
