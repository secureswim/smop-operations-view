import { useAuth, UserRole } from "@/context/AuthContext";
import {
  FileSearch, FileText, ShoppingCart, Package, ClipboardCheck,
  Boxes, Wrench, BarChart3, ShoppingBag, TrendingUp, AlertTriangle, CheckCircle2, Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface KPI {
  label: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  color: string;
}

interface QuickLink {
  label: string;
  url: string;
  icon: React.ElementType;
}

const dashboardConfig: Record<UserRole, { title: string; kpis: KPI[]; links: QuickLink[] }> = {
  admin: {
    title: "Admin Dashboard",
    kpis: [
      { label: "Active POs", value: "24", change: "+3", icon: ShoppingCart, color: "text-primary" },
      { label: "Pending Inspections", value: "8", icon: AlertTriangle, color: "text-warning" },
      { label: "Inventory Items", value: "156", icon: Boxes, color: "text-success" },
      { label: "Open Orders", value: "12", change: "+2", icon: ShoppingBag, color: "text-primary" },
    ],
    links: [
      { label: "Supplier Enquiries", url: "/enquiries", icon: FileSearch },
      { label: "Purchase Orders", url: "/purchase-orders", icon: ShoppingCart },
      { label: "Inventory", url: "/inventory", icon: Boxes },
      { label: "Orders", url: "/orders", icon: ShoppingBag },
    ],
  },
  purchase: {
    title: "Purchase Dashboard",
    kpis: [
      { label: "Open Enquiries", value: "6", icon: FileSearch, color: "text-primary" },
      { label: "Pending Quotations", value: "4", icon: Clock, color: "text-warning" },
      { label: "Active POs", value: "12", change: "+1", icon: ShoppingCart, color: "text-success" },
      { label: "Completed POs", value: "45", icon: CheckCircle2, color: "text-muted-foreground" },
    ],
    links: [
      { label: "Supplier Enquiries", url: "/enquiries", icon: FileSearch },
      { label: "Quotations", url: "/quotations", icon: FileText },
      { label: "Purchase Orders", url: "/purchase-orders", icon: ShoppingCart },
    ],
  },
  stores: {
    title: "Stores Dashboard",
    kpis: [
      { label: "Pending Receipts", value: "5", icon: Package, color: "text-warning" },
      { label: "Awaiting Inspection", value: "3", icon: ClipboardCheck, color: "text-primary" },
      { label: "Low Stock Items", value: "7", icon: AlertTriangle, color: "text-destructive" },
      { label: "Total Materials", value: "156", icon: Boxes, color: "text-success" },
    ],
    links: [
      { label: "Material Receipt", url: "/material-receipt", icon: Package },
      { label: "Inspection", url: "/inspection", icon: ClipboardCheck },
      { label: "Inventory", url: "/inventory", icon: Boxes },
    ],
  },
  manufacturing: {
    title: "Manufacturing Dashboard",
    kpis: [
      { label: "Active BOMs", value: "8", icon: Wrench, color: "text-primary" },
      { label: "Feasible Products", value: "5", icon: CheckCircle2, color: "text-success" },
      { label: "Material Shortage", value: "3", icon: AlertTriangle, color: "text-destructive" },
      { label: "Efficiency", value: "87%", change: "+2%", icon: TrendingUp, color: "text-success" },
    ],
    links: [
      { label: "BOM Management", url: "/bom", icon: Wrench },
      { label: "Feasibility Analyzer", url: "/feasibility", icon: BarChart3 },
    ],
  },
  sales: {
    title: "Sales Dashboard",
    kpis: [
      { label: "Open Orders", value: "12", icon: ShoppingBag, color: "text-primary" },
      { label: "Pending Confirmation", value: "4", icon: Clock, color: "text-warning" },
      { label: "Confirmed Orders", value: "38", change: "+5", icon: CheckCircle2, color: "text-success" },
      { label: "Revenue (₹)", value: "24.5L", change: "+12%", icon: TrendingUp, color: "text-success" },
    ],
    links: [
      { label: "Orders", url: "/orders", icon: ShoppingBag },
    ],
  },
};

const Dashboard = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const config = dashboardConfig[role];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">{config.title}</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {config.kpis.map((kpi, i) => (
          <div key={i} className="kpi-card flex items-start justify-between" style={{ animationDelay: `${i * 80}ms` }}>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              {kpi.change && <span className="text-xs text-success font-medium">{kpi.change}</span>}
            </div>
            <div className={`p-2 rounded-lg bg-muted ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {config.links.map((link, i) => (
            <button
              key={i}
              onClick={() => navigate(link.url)}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all text-left group"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <link.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-foreground">{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
