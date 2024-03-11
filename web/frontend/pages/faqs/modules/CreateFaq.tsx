import { Page } from "@shopify/polaris";
import CreateOrEditFaq from "./CreateOrEditFaq";

export default function EditFaq() {
  
  return (
    <Page 
      title="Create Faq"
      backAction={{content: '', url: '/faqs'}}
      // primaryAction={{content: 'Save', disabled: true}}
    >
      <CreateOrEditFaq></CreateOrEditFaq>
    </Page>
  )
}
