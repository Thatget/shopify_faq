import type { RouteObject } from 'react-router-dom';
import FaqMorePage from '../../pages/faq-more-page';
// import CollectionPage from '../../pages/faq-more-page/modules/CollectionPage';
// import CartPage from '../../pages/faq-more-page/modules/CartPage';
// import HomePage from '../../pages/faq-more-page/modules/HomePage';
// import CmsPage from '../../pages/faq-more-page/modules/CmsPage';

export const faqMorePage: RouteObject[] = [
  {
    path: '/faq-more-page',
    Component: FaqMorePage,
  },
  // {
  //   path: '/faq-more-page/home',
  //   Component: HomePage,
  // },
  // {
  //   path: '/faq-more-page/cms',
  //   Component: CmsPage
  // },
  // {
  //   path: '/faq-more-page/cart',
  //   Component: CartPage
  // },
  // {
  //   path: '/faq-more-page/collection',
  //   Component: CollectionPage
  // },
]
