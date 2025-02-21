import { 
  Route,
  createRoutesFromElements,
  createBrowserRouter,
} from 'react-router-dom';

// Create router with future flags enabled
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      // Enable v7 features through props
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_normalizeFormMethod: true
      }}
    />
  ),
  {
    // Optional: Configure future flags at router level
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);
