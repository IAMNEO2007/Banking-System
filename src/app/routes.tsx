import { createBrowserRouter, Navigate } from "react-router";
import { AppShell } from "./components/AppShell";
import { ConsumerDashboard } from "./components/ConsumerDashboard";
import { MerchantDashboard } from "./components/MerchantDashboard";
import { DocsViewer } from "./components/DocsViewer";
import { KYCWorkflow } from "./components/KYCWorkflow";
import { PaymentFlow } from "./components/PaymentFlow";
import { ServicePayments } from "./components/ServicePayments";
import { LoginPage } from "./components/LoginPage";
import { UserProfile } from "./components/UserProfile";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('currentUser');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    element: <ProtectedRoute><AppShell /></ProtectedRoute>,
    children: [
      { index: true, Component: ConsumerDashboard },
      { path: "merchant", Component: MerchantDashboard },
      { path: "docs", Component: DocsViewer },
      { path: "kyc", Component: KYCWorkflow },
      { path: "pay", Component: PaymentFlow },
      { path: "services", Component: ServicePayments },
      { path: "profile", Component: UserProfile },
    ],
  },
]);
