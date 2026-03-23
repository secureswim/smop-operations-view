import { useState } from "react";
import { mockInventory, mockBOMs } from "@/data/mockData";
import { Input } from "./SupplierEnquiry";
import { CheckCircle2, XCircle } from "lucide-react";

const FeasibilityAnalyzer = () => {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [result, setResult] = useState<null | { feasible: boolean; missing: { material: string; required: number; available: number }[] }>(null);

  const analyze = () => {
    if (!product || !quantity) return;
    const qty = Number(quantity);
    const bom = mockBOMs.find((b) => b.product.toLowerCase().includes(product.toLowerCase()));
    if (!bom) {
      setResult({ feasible: false, missing: [{ material: "Product not found in BOM", required: 0, available: 0 }] });
      return;
    }
    const missing: { material: string; required: number; available: number }[] = [];
    bom.materials.forEach((m) => {
      const inv = mockInventory.find((i) => i.material === m.material);
      const required = m.quantity * qty;
      const available = inv?.quantity || 0;
      if (available < required) {
        missing.push({ material: m.material, required, available });
      }
    });
    setResult({ feasible: missing.length === 0, missing });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">Feasibility Analyzer</h1>

      <div className="bg-card rounded-xl border border-border p-6 max-w-lg">
        <div className="space-y-4">
          <Input label="Product Name" value={product} onChange={setProduct} placeholder="e.g. Speed Motor 500W" />
          <Input label="Quantity" type="number" value={quantity} onChange={setQuantity} placeholder="e.g. 100" />
          <button onClick={analyze} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Analyze Feasibility</button>
        </div>
      </div>

      {result && (
        <div className={`rounded-xl border p-6 animate-fade-in ${result.feasible ? "bg-success/5 border-success/30" : "bg-destructive/5 border-destructive/30"}`}>
          <div className="flex items-center gap-3 mb-4">
            {result.feasible ? (
              <><CheckCircle2 className="w-6 h-6 text-success" /><h3 className="text-lg font-semibold text-success">Feasible</h3></>
            ) : (
              <><XCircle className="w-6 h-6 text-destructive" /><h3 className="text-lg font-semibold text-destructive">Not Feasible</h3></>
            )}
          </div>
          {!result.feasible && result.missing.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border">
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Material</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Required</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Available</th>
                  <th className="text-left px-3 py-2 font-medium text-muted-foreground">Shortage</th>
                </tr></thead>
                <tbody>
                  {result.missing.map((m, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="px-3 py-2 text-foreground">{m.material}</td>
                      <td className="px-3 py-2 text-foreground">{m.required}</td>
                      <td className="px-3 py-2 text-foreground">{m.available}</td>
                      <td className="px-3 py-2 text-destructive font-medium">{m.required - m.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeasibilityAnalyzer;
