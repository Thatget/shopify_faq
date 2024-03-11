import { BlockStack } from "@shopify/polaris"
import RangeSliderComponent from "./components/RangeSlider"
import { useState } from "react";
import ColorPickerDesign from "./components/ColorPicker";
import CheckBox from "./components/CheckBox";

export default function More() {
  const [rangeFaqPage, setRangeFaqPage] = useState(1280);
  const [rangeProductFaq, setRangeProductFaq] = useState(1280);
  const [isProductFaqWidth, setIsProductFaqWidth] = useState(true);
  const [isBackToTop, setIsBackToTop] = useState(true);
  const [isRemoveBranding, setIsRemoveBranding] = useState(false);
  const [ buttonBackgroundColor, setButtonBackgroundColor ] = useState<string>('#DDDEDD')
  const [ buttonColor, setButtonColor ] = useState<string>('#000000')
  const [ buttonHoverColor, setButtonHoverColor ] = useState<string>('#000000')

  return(
    <div className="w-full max-h-96 overflow-y-auto scroll-bar-custom">
      <BlockStack gap={'400'}>
        <ColorPickerDesign
          label="Page Background Color"
          value={buttonBackgroundColor}
          onChange={(value) => setButtonBackgroundColor(value)}
        />
        <RangeSliderComponent 
          label="Faq page max width"
          value={rangeFaqPage}
          min={800}
          max={1800}
          onChange={(value) => setRangeFaqPage(value)}
        />
        <div>
          <CheckBox
            label="Set Product Faq width"
            value={isProductFaqWidth}
            onChange={(value) => setIsProductFaqWidth(value)}
          />
          { isProductFaqWidth &&
            <div className="ms-7">
              <RangeSliderComponent 
                label="Product Faq max width"
                value={rangeProductFaq}
                min={400}
                max={1800}
                onChange={(value) => setRangeProductFaq(value)}
              />
            </div>
          }
        </div>
        <CheckBox
          label="Button back to top"
          value={isBackToTop}
          onChange={(value) => setIsBackToTop(value)}
        />
        { isBackToTop &&
          <>
            <ColorPickerDesign
              label="Button Background Color"
              value={buttonColor}
              onChange={(value) => setButtonColor(value)}
            />
            <ColorPickerDesign
              label="Button Hover Color"
              value={buttonHoverColor}
              onChange={(value) => setButtonHoverColor(value)}
            />
          </>
        }
        <CheckBox
          label="Remove Water mark"
          value={isRemoveBranding}
          onChange={(value) => setIsRemoveBranding(value)}
        />
      </BlockStack>  
    </div>
  )
}

