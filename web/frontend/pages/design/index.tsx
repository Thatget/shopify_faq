import { Page } from "@shopify/polaris"
import UploadBanner from "./modules/UploadBanner"
import TemplateConfiguration from "./modules/template-configuration"
import TemplateSelection from "./modules/TemplateSelection"
import { useState } from "react"

const Design = () => {
  const [ templateSelected, setTemplateSelected ] = useState<string>('2')

  return(
    <Page
      // fullWidth
      title="Design"
      primaryAction={{
        content: 'Save',
      }}
    >
      {/* <BlockStack gap={'400'}>
        <TemplateSelection
          templateSelected={templateSelected}
          setTemplateSelected={setTemplateSelected}          
        />
        <UploadBanner></UploadBanner>
        <TemplateConfiguration 
          templateSelected={templateSelected}
          setTemplateSelected={setTemplateSelected}                  
        />
      </BlockStack> */}
    </Page>
  )
}

export default Design
