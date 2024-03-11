import Categories from '../../pages/categories/index';
import type { RouteObject } from 'react-router-dom';
import CreateCategory from '../../pages/categories/modules/CreateCategory';
import EditCategory from '../../pages/categories/modules/EditCategory';

export const categories: RouteObject[] = [
  {
    path: '/categories',
    Component: Categories,
  },
  {
    path: '/add-category',
    Component: CreateCategory
  },
  {
    path: '/edit-category/:id',
    Component: EditCategory
  }
];
