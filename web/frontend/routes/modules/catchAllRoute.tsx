import NotFound from '../../pages/NotFound';
import type { RouteObject } from 'react-router-dom';

export const catchAllRoute: RouteObject = {
  path: '*',
  element: <NotFound />,
};
