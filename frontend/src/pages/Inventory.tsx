import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "@/lib/api";
import { Loader2 } from "lucide-react";

const Inventory = () => {
  const { data: inventoryRes, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => inventoryApi.view({ limit: 200 }),
  });

  const items = (inventoryRes?.data ?? []) as Array<Record<string, unknown>>;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-foreground">Inventory Dashboard</h1>
        <div className="flex items-center justify-center p-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">Inventory Dashboard</h1>

      {/* Stock Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const material = item.material as Record<string, unknown> | undefined;
          const location = item.location as Record<string, unknown> | undefined;
          const qty = Number(item.quantity ?? 0);
          const maxQty = Number((item.maxQuantity ?? item.reorderLevel ?? qty * 2) || 1);
          const pct = Math.round((qty / maxQty) * 100);
          const barColor = pct < 30 ? "bg-destructive" : pct < 60 ? "bg-warning" : "bg-success";
          const unit = (item.unit ?? material?.unit ?? "") as string;
          const name = (material?.name ?? item.materialName ?? "Unknown") as string;
          const loc = (location?.name ?? item.locationName ?? "—") as string;

          return (
            <div key={item.id as string} className="kpi-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">{name}</h3>
                <span className="text-xs text-muted-foreground">{loc}</span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{qty} <span className="text-sm font-normal text-muted-foreground">{unit}</span></p>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{pct}% of capacity</p>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="col-span-3 text-center py-12 text-muted-foreground">No inventory items found</div>
        )}
      </div>

      {/* Full Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Material</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Quantity</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Location</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stock Level</th>
            </tr></thead>
            <tbody>
              {items.map((item) => {
                const material = item.material as Record<string, unknown> | undefined;
                const location = item.location as Record<string, unknown> | undefined;
                const qty = Number(item.quantity ?? 0);
                const maxQty = Number((item.maxQuantity ?? item.reorderLevel ?? qty * 2) || 1);
                const pct = Math.round((qty / maxQty) * 100);
                const barColor = pct < 30 ? "bg-destructive" : pct < 60 ? "bg-warning" : "bg-success";
                const unit = (item.unit ?? material?.unit ?? "") as string;

                return (
                  <tr key={item.id as string} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{(material?.name ?? item.materialName ?? "—") as string}</td>
                    <td className="px-4 py-3 font-mono text-foreground text-xs">{(material?.code ?? "—") as string}</td>
                    <td className="px-4 py-3 text-foreground">{qty} {unit}</td>
                    <td className="px-4 py-3 text-foreground">{(location?.name ?? item.locationName ?? "—") as string}</td>
                    <td className="px-4 py-3 w-40">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
