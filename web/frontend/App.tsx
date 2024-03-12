// import './App.css';
import { AppBridgeProvider, PolarisProvider } from './components/providers';
import { routes } from './routes/index';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, RouterProvider, createBrowserRouter, useSearchParams } from "react-router-dom";
import AppProvider from './pages/store/AppProvider';
import { useEffect, useMemo, useState } from 'react';
import { NavigationMenu } from '@shopify/app-bridge-react';
import { isString } from 'lodash-es';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Root() {
  const [searchParams] = useSearchParams();
  const [forceLogin, setForceLogin] = useState<string>();

  useEffect(() => {
    if (searchParams.get('forceLogin')) {
      setForceLogin(searchParams.get('forceLogin') ?? '');
    }
  }, [searchParams]);

  const searchParam = useMemo(() => {
    const searchObj = new URLSearchParams();
    forceLogin && searchObj.set('forceLogin', forceLogin ?? '');
    const searchString = searchObj.toString();
    return searchString ? '?' + searchString : '';
  }, [forceLogin]);

  return (
    <PolarisProvider>
      <AppBridgeProvider>
      <QueryClientProvider client={queryClient}>
      <NavigationMenu
              navigationLinks={[
                {
                  label: 'Categories',
                  destination: '/categories' + searchParam,
                },
                {
                  label: 'Design',
                  destination: '/design' + searchParam,
                },
                {
                  label: 'Setting',
                  destination: '/setting' + searchParam,
                },
                {
                  label: 'Product faq',
                  destination: '/products-faqs' + searchParam,
                },
              ]}
              matcher={(link, location) => {
                if (isString(location)) {
                  return false;
                }
                const locationFirstpath = location.pathname.split('/')[1];
                const linkFirstpath = link.destination.split('/')[1];
                return locationFirstpath === linkFirstpath;
              }}
            />
          <AppProvider>
            <Outlet/>
          </AppProvider>
        </QueryClientProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Root,
      children: routes,
    },
  ],
);

export default function App() {
  return <RouterProvider router={router} />;
}
