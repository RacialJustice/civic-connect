import { Route, Routes, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/error-fallback';
import { Loader } from '@/components/ui/loader';

// Lazy load components with default exports
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Community = lazy(() => import('./pages/Community'));
const Chat = lazy(() => import('./pages/Chat'));
const Profile = lazy(() => import('./pages/Profile'));

// Services
const Permits = lazy(() => import('./pages/services/Permits'));
const Payments = lazy(() => import('./pages/services/Payments'));
const Support = lazy(() => import('./pages/services/Support'));

const Loading = () => <Loader className="mx-auto my-8" />;

export function AppRoutes() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        <Route path="/" element={
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="/about" element={
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <About />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="/community" element={
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <Community />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="/chat" element={
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <Chat />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="/profile" element={
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <Profile />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="/services/permits" element={
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <Permits />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="/services/payments" element={
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <Payments />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="/services/support" element={
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <Support />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
