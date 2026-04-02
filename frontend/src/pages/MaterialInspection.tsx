import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { materialsApi, inventoryApi } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { StatusBadge } from "./SupplierEnquiry";
import { toast } from "sonner";

const MaterialInspection = () => {
  const queryClient = useQueryClient();

  // We show inventory items that may need inspection
  // In a real app, you'd have a dedicated receipts-pending-inspection endpoint
  // For now we show inventory and allow recording inspections
  const { data: inventoryRes, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => inventoryApi.view({ limit: 100 }),
  });

  const inspectionMutation = useMutation({
    mutationFn: (data: {
      receiptId: string;
      items: Array<{
        receiptItemId: string;
        status: "ACCEPTED" | "REJECTED" | "PARTIAL";
        acceptedQuantity: number;
        rejectedQuantity?: number;
        remarks?: string;
      }>;
    }) => materialsApi.recordInspection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Inspection recorded");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const items = (inventoryRes?.data ?? []) as Array<Record<string, unknown>>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">Material Inspection</h1>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Material</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Quantity</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Location</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No inventory items found</td></tr>
                ) : items.map((item: Record<string, unknown>) => {
                  const material = item.material as Record<string, unknown> | undefined;
                  const location = item.location as Record<string, unknown> | undefined;
                  return (
                    <tr key={item.id as string} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-foreground font-medium">{(material?.name ?? item.materialName ?? "—") as string}</td>
                      <td className="px-4 py-3 font-mono text-foreground text-xs">{(material?.code ?? "—") as string}</td>
                      <td className="px-4 py-3 text-foreground">{String(item.quantity ?? 0)} {(item.unit ?? material?.unit ?? "") as string}</td>
                      <td className="px-4 py-3 text-foreground">{(location?.name ?? item.locationName ?? "—") as string}</td>
                      <td className="px-4 py-3">
                        {item.status ? <StatusBadge status={item.status as string} /> : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">Inspection Notes</h3>
        <p className="text-xs text-muted-foreground">
          To record an inspection, use the Material Receipt workflow first. Once materials are received against a PO,
          inspections can be recorded via the <span className="font-medium">POST /api/material/inspection</span> endpoint
          with the receipt ID and item-level accept/reject decisions.
        </p>
      </div>
    </div>
  );
};

export default MaterialInspection;
