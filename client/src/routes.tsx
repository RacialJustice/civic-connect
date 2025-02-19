import { Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Only import routes that have implemented components
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Community = lazy(() => import('./pages/Community').then(m => ({ default: m.Community })));
const Chat = lazy(() => import('./pages/Chat').then(m => ({ default: m.Chat })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));

// Services
const Permits = lazy(() => import('./pages/services/Permits').then(m => ({ default: m.Permits })));
const Payments = lazy(() => import('./pages/services/Payments').then(m => ({ default: m.Payments })));
const Support = lazy(() => import('./pages/services/Support').then(m => ({ default: m.Support })));

const Loading = () => <div className="p-4 flex justify-center">Loading...</div>;

export function AppRoutes() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/community" element={<Community />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Services */}
        <Route path="/services/permits" element={<Permits />} />
        <Route path="/services/payments" element={<Payments />} />
        <Route path="/services/support" element={<Support />} />
      </Routes>
    </Suspense>
  );
}
