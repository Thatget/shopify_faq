import type { RouteObject } from 'react-router-dom'

import {
  catchAllRoute,
  faqs,
  categories,
  design,
  settings,
  productFaqs,
  widget,
  homeRoute,
  documents,
  plans,
  faqMorePage
} from "./modules/index";

export const routes: RouteObject[] = [
  catchAllRoute,
  ...faqs,
  ...categories,
  design,
  settings,
  productFaqs,
  widget,
  homeRoute,
  ...documents,
  plans,
  ...faqMorePage
] as RouteObject[]
