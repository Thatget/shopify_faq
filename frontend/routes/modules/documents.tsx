import type { RouteObject } from 'react-router-dom';
import Documents from '../../pages/documents';
import AddBlockMorePage from '../../pages/documents/modules/AddBlockMorePage';
import AddBlockShopify from '../../pages/documents/modules/AddBlockShopify';
import AddToMenu from '../../pages/documents/modules/AddToMenu';

export const documents: RouteObject[] = [
  {
    path: '/documents',
    Component: Documents,
    children: [
      {
        path: '/documents/add-faq-page-to-menu',
        Component: AddToMenu,
      },
      {
        path: '/documents/add-faq-to-product-page',
        Component: AddBlockShopify,
      },
      {
        path: '/documents/add-faq-to-other-pages',
        Component: AddBlockMorePage,
      }
    ]
  },
];
