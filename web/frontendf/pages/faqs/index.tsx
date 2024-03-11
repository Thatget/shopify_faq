import { Page } from "@shopify/polaris"
import { FaqsList } from "./modules/FaqsList"
import { ImportMinor, ExportMinor, AddNoteMajor, CategoriesMajor } from "@shopify/polaris-icons"
import '../../assets/css/faqs.css'
import { useNavigate } from "react-router-dom"

const Faqs = () => {
  const navigate = useNavigate()
  
  return(
    <Page 
      title="Store FAQs"
      primaryAction={{
        content: 'Add FAQs',
        onAction: () => {navigate('/add-faq')},
      }}
      secondaryActions={[
        {
          content: 'Import FAQs',
          icon: ImportMinor
          // onAction: () => handleChange(),
        },
        {
          content: 'Export FAQs',
          icon: ExportMinor
          // onAction: () => handleChange(),  
        },
        {
          content: 'Add category',
          icon: CategoriesMajor,
          onAction: () => navigate('/add-category')
        },
        {
          content: 'Add FAQs on other pages',
          icon: AddNoteMajor,
          onAction: () => navigate('/faq-more-page'),
        }
      ]}
    >
      <FaqsList></FaqsList>
    </Page>
  )
}

export default Faqs
