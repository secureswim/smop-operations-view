import { mockInventory } from "@/data/mockData";

const Inventory = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">Inventory Dashboard</h1>

      {/* Stock Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockInventory.map((item) => {
          const pct = Math.round((item.quantity / item.maxQuantity) * 100);
          const barColor = pct < 30 ? "bg-destructive" : pct < 60 ? "bg-warning" : "bg-success";
          return (
            <div key={item.id} className="kpi-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">{item.material}</h3>
                <span className="text-xs text-muted-foreground">{item.location}</span>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{item.quantity} <span className="text-sm font-normal text-muted-foreground">{item.unit}</span></p>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{pct}% of capacity ({item.maxQuantity} {item.unit})</p>
            </div>
          );
        })}
      </div>

      {/* Full Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Material</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Quantity</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Max Capacity</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Location</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stock Level</th>
            </tr></thead>
            <tbody>
              {mockInventory.map((item) => {
                const pct = Math.round((item.quantity / item.maxQuantity) * 100);
                const barColor = pct < 30 ? "bg-destructive" : pct < 60 ? "bg-warning" : "bg-success";
                return (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-foreground font-medium">{item.material}</td>
                    <td className="px-4 py-3 text-foreground">{item.quantity} {item.unit}</td>
                    <td className="px-4 py-3 text-foreground">{item.maxQuantity} {item.unit}</td>
                    <td className="px-4 py-3 text-foreground">{item.location}</td>
                    <td className="px-4 py-3 w-40">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
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
