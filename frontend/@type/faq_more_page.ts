export type FaqMorePageUpdateApi = {
  category_identify: string
  faq_id: number
  faq_identify: string
  faq_title: string
  page_name?: string
  createdAt?: string
  id?: number
  updatedAt?: string
  category_name?: string
}

export type FaqMorePageProps = {
  homePageVisible: boolean,
  cartPageVisible: boolean,
  cmsPageVisible: boolean,
  collectionPageVisible: boolean,
  faqMorePage: FaqMorePageUpdateApi[],
  pageSelected: string
  setCartPageVisible: (value: boolean) => void,
  setCmsPageVisible: (value: boolean) => void,
  setCollectionPageVisible: (value: boolean) => void,
  setHomePageVisible: (value: boolean) => void,
  setFaqMorePage: (value: FaqMorePageUpdateApi[]) => void,
  showModal: boolean,
  setShowModal: (value: boolean) => void
  faqsMorePageSelected: FaqMorePageUpdateApi[],
  setFaqsMorePageSelected: (value: FaqMorePageUpdateApi[]) => void
  refetch: () => void
}
