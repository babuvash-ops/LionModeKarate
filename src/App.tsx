import { Suspense, lazy } from 'react';
import { Toaster } from "sonner";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AIChatBubble from '@/components/AIChatBubble';
import AuthModal from '@/components/auth/AuthModal';
import DojoLogo from '@/components/shared/DojoLogo';

// Page imports
import Landing from './pages/Landing';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SenseiChatPage = lazy(() => import('./pages/SenseiChatPage'));
const Students = lazy(() => import('./pages/Students'));
const Videos = lazy(() => import('./pages/Videos'));
const Events = lazy(() => import('./pages/Events'));
const Admin = lazy(() => import('./pages/Admin'));
const Classes = lazy(() => import('./pages/Classes'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Leads = lazy(() => import('./pages/Leads'));
const Shop = lazy(() => import('./pages/Shop'));
const InstructorPortal = lazy(() => import('./pages/InstructorPortal'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const TVMode = lazy(() => import('./pages/TVMode'));
const AppLayout = lazy(() => import('./components/layout/AppLayout'));
const StoreLayout = lazy(() => import('./components/shop/StoreLayout'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const TrialFunnelPage = lazy(() => import('./pages/TrialFunnelPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
import PersonaSwitcher from '@/components/shared/PersonaSwitcher';

const AuthenticatedApp = () => {
  const { authError } = useAuth();

  if (authError && authError.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <Suspense fallback={
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]">
        <div className="relative animate-pulse">
          <DojoLogo size="lg" layout="vertical" glowing />
        </div>
      </div>
    }>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Landing />} />
        <Route path="/trial" element={<TrialFunnelPage />} />
        <Route path="/funnel/:slug" element={<TrialFunnelPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/tv" element={<TVMode />} />
        <Route element={<StoreLayout />}>
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sensei" element={<SenseiChatPage />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/instructor" element={<InstructorPortal />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0A0A0A] text-white p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mb-4 text-[#D4AF37]">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="font-heading text-xl uppercase tracking-wider text-white mb-2">Dojo OS Notice</h2>
      <p className="text-white/60 text-xs max-w-md mb-6 leading-relaxed">
        {error?.message || "A display synchronization notice occurred while initializing the app."}
      </p>
      <button
        onClick={() => {
          localStorage.clear();
          sessionStorage.clear();
          resetErrorBoundary();
          window.location.reload();
        }}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFB800] text-black font-heading font-bold text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
      >
        Reload Dojo OS
      </button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
            <AIChatBubble />
            <AuthModal />
            <PersonaSwitcher />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

