import CreateFaq from '../../pages/faqs/modules/CreateFaq';
import EditFaq from '../../pages/faqs/modules/EditFaq';
import Faqs from '../../pages/faqs/index';
import type { RouteObject } from 'react-router-dom';

export const faqs: RouteObject[] = [
  {
    path: '/faqs',
    Component: Faqs,
  },
  {
    path: '/edit-faq/:id',
    Component: EditFaq,
    children: []
  },
  {
    path: '/add-faq',
    Component: CreateFaq,
    children: []
  },
]
