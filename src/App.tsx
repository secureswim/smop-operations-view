import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import SupplierEnquiry from "@/pages/SupplierEnquiry";
import SupplierQuotation from "@/pages/SupplierQuotation";
import PurchaseOrder from "@/pages/PurchaseOrder";
import MaterialReceipt from "@/pages/MaterialReceipt";
import MaterialInspection from "@/pages/MaterialInspection";
import Inventory from "@/pages/Inventory";
import BOMManagement from "@/pages/BOMManagement";
import FeasibilityAnalyzer from "@/pages/FeasibilityAnalyzer";
import OrderConfirmation from "@/pages/OrderConfirmation";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Login />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/enquiries" element={<SupplierEnquiry />} />
        <Route path="/quotations" element={<SupplierQuotation />} />
        <Route path="/purchase-orders" element={<PurchaseOrder />} />
        <Route path="/material-receipt" element={<MaterialReceipt />} />
        <Route path="/inspection" element={<MaterialInspection />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/bom" element={<BOMManagement />} />
        <Route path="/feasibility" element={<FeasibilityAnalyzer />} />
        <Route path="/orders" element={<OrderConfirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
