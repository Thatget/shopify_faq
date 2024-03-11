import type { RouteObject } from 'react-router-dom'
import DashBoard from '../../pages/dashboard/DashBoard';

export const homeRoute: RouteObject = {
  index: true,
  element: <DashBoard />
}
