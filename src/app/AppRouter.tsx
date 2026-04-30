import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Loading } from '@/components/ui/Loading';
import { useAuth } from '@/features/auth/AuthContext';
import { LoginPage } from '@/features/auth/LoginPage';
import { SignupPage } from '@/features/auth/SignupPage';
import { VerifyPage } from '@/features/auth/VerifyPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { BillingPage } from '@/features/billing/BillingPage';
import { SecurityPage } from '@/features/admin/SecurityPage';
import { WorkflowsPage } from '@/features/workflows/WorkflowsPage';
import { AlertsPage } from '@/features/alerts/AlertsPage';
import { ForecastPage } from '@/features/forecast/ForecastPage';
import { IntelligencePage } from '@/features/intelligence/IntelligencePage';
import { GovernancePage } from '@/features/governance/GovernancePage';

const Protected = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading label="Bootstrapping workspace" />;
  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
};

export const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/verify" element={<VerifyPage />} />
    <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
    <Route path="/workflows" element={<Protected><WorkflowsPage /></Protected>} />
    <Route path="/alerts" element={<Protected><AlertsPage /></Protected>} />
    <Route path="/forecast" element={<Protected><ForecastPage /></Protected>} />
    <Route path="/copilot" element={<Protected><IntelligencePage /></Protected>} />
    <Route path="/governance" element={<Protected><GovernancePage /></Protected>} />
    <Route path="/billing" element={<Protected><BillingPage /></Protected>} />
    <Route path="/security" element={<Protected><SecurityPage /></Protected>} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);
