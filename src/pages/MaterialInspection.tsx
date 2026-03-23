import { useState } from "react";
import { mockInspections } from "@/data/mockData";
import { StatusBadge } from "./SupplierEnquiry";
import { toast } from "sonner";

const MaterialInspection = () => {
  const [inspections, setInspections] = useState(mockInspections);

  const updateStatus = (id: number, status: "Accepted" | "Rejected") => {
    setInspections(inspections.map((i) => i.id === id ? { ...i, status, inspectedDate: new Date().toISOString().split("T")[0] } : i));
    toast.success(`Batch ${status.toLowerCase()}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">Material Inspection</h1>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Batch ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Material</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Quantity</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Inspected Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {inspections.map((i) => (
                <tr key={i.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-foreground text-xs">{i.batchId}</td>
                  <td className="px-4 py-3 text-foreground">{i.material}</td>
                  <td className="px-4 py-3 text-foreground">{i.quantity}</td>
                  <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                  <td className="px-4 py-3 text-foreground">{i.inspectedDate || "—"}</td>
                  <td className="px-4 py-3">
                    {i.status === "Pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(i.id, "Accepted")} className="px-2.5 py-1 rounded-md bg-success/10 text-success text-xs font-medium hover:bg-success/20 transition-colors">Accept</button>
                        <button onClick={() => updateStatus(i.id, "Rejected")} className="px-2.5 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">Reject</button>
                      </div>
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

export default MaterialInspection;
