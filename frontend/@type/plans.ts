export interface Plan {
  level?: number,
  name: string
  isCurrent: boolean,
  price: number
  description: string
  features: string[],
}

export type PlanApi = {
  createdAt: string
  expiry_date: string
  id: number
  plan: string
  plan_extra: boolean
  purchase_date: string
  shopify_plan_id: string
  updatedAt: string
  user_id: number
  level?: number
}

export const plans: Plan[] = [
  {
    level: 1,
    name: 'Free',
    price: 0,
    description: 'Free',
    isCurrent: true,
    features: [
      'Free 15 FAQs',
      'Custom CSS',
      'Import / Export FAQs',
      'Unlimited categories',
      'Unlimited customization',
      'Search bar for customers',
      'Rearrange FAQs / Categories',
      '15 FAQs on product pages (Only Online Store 2.0)',
      'Google SEO snippets'
    ]
  },
  {
    level: 2,
    name: 'Pro',
    price: 2.99,
    description: 'Pro',
    isCurrent: false,
    features: [
      'Everything in FREE plus',
      'Widget',
      '7 days free trial',
      'Unlimited FAQs',
      'Pro template access',
      'Translations support!',
      'Show FAQs on any page',
      'Unlimited FAQs on product pages (Only Online Store 2.0)',
      'Remove WaterMask'
    ]
  },
  {
    level: 3,
    name: 'Ultimate',
    price: 9.99,
    description: 'Ultimate',
    isCurrent: false,
    features: [
      'Everything in PRO plus',
      'Build a FAQ page on demand',
      'Priority support'
    ]
  },
]