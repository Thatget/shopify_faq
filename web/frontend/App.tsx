// import './App.css';
import { PolarisProvider } from './components/providers';
import { routes } from './routes/index';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import AppProvider from './pages/store/AppProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Root() {
  return (
    <PolarisProvider>
      {/* <AppBridgeProvider> */}
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <Outlet/>
          </AppProvider>
        </QueryClientProvider>
      {/* </AppBridgeProvider> */}
    </PolarisProvider>
  );
}

// const baseUrl = process.env.FRONT_END || '';

const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Root,
      children: routes,
    },
  ],
  // baseUrl ? { basename: baseUrl } : {},
);

export default function App() {
  return <RouterProvider router={router} />;
}
