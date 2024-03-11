import { BlockStack } from "@shopify/polaris"
import ConfigWidgetTheme from "./modules/ConfigWidgetTheme"
import ConfigWidgetContact from "./modules/ConfigWidgetContact"
import ConfigWidgetButton from "./modules/ConfigWidgetButton"
import { WidgetProps } from "../../@type/widget"

const Config = (props: WidgetProps) => {

  return(
    <BlockStack gap={'400'}>
      <ConfigWidgetTheme 
        {...props}
      />
      <ConfigWidgetContact
        {...props}
      />
      <ConfigWidgetButton
        {...props}
      />
    </BlockStack>
  )
}

export default Config
