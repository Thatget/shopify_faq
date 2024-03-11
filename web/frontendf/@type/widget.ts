export type WidgetProps = {
  widgetProps: {
    iconNumber: string
    setIconNumber: (iconNumber: string) => void
    isActiveAnimation: boolean
    setIsActiveAnimation: (isActiveAnimation: boolean) => void
    backgroundColor: string
    setBackgroundColor: (backgroundColor: string) => void
    alignment: string
    setAlignment: (alignment: string) => void
    isActiveContactUs: boolean,
    isActivePhone: boolean,
    isActiveMessage: boolean,
    isActiveEmail: boolean,
    isActiveWhatsApp: boolean,
    isActiveFaqs: boolean,
    isActiveCategories: boolean
    setIsActiveContactUs: (value: boolean) => void,
    setIsActivePhone: (value: boolean) => void,
    setIsActiveMessage: (value: boolean) => void,
    setIsActiveEmail: (value: boolean) => void,
    setIsActiveWhatsApp: (value: boolean) => void,
    setIsActiveFaqs: (value: boolean) => void,
    setIsActiveCategories: (value: boolean) => void
    headerColor: string
    textColor: string
    setHeaderColor: (value: string) => void
    setTextColor: (value: string) => void
    fontFamily: string
    setFontFamily: (value: string) => void  
  }
}

export type FaqMessageSettingsApi = {
  aligment_faq_messages: string
  animation_visible: boolean
  button_background_color: string
  button_title: string
  contact_us_visible: boolean
  createdAt: string
  description_title: string
  email_link: string
  email_visible: boolean
  faq_messages_visible: boolean
  feature_categories_visible: boolean
  feature_questions_visible: boolean
  font_family: string
  help_desk_visible: boolean
  icon_number: string
  id?: number
  message_link: string
  message_visible: boolean
  phone_number: string
  phone_visible: boolean
  primary_language: string
  send_messages_text_color: string
  show_default_locale: boolean
  sort_by: string
  text_color: string
  theme_color: string
  translation: string
  updatedAt: string
  user_id: number
  welcome_title: string
  whatsApp_number: string
  whatsApp_visible: boolean
}

export type FaqMessages = {
  user_id: number
  id: number
  faq_title: string
  customer_name: string
  customer_contact: string
  time: string
  updatedAt: string
  createdAt: string
}[]