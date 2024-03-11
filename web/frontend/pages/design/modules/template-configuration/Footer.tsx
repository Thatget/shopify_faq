import CheckBox from "./components/CheckBox"
import RangeSliderComponent from "./components/RangeSlider"
import { useState } from "react";

const Footer = () => {
  const [rangeFontSize, setRangeFontSize] = useState(10);
  const [rangePaddingTop, setRangePaddingTop] = useState(10);
  const [rangePaddingBottom, setRangePaddingBottom] = useState(10);
  const [isShowFooterText, setIsShowFooterText] = useState(true);


  return(
    <div className="w-full">
      {/* <BlockStack gap={'400'}>
        <CheckBox
          label="Show Footer text"
          value={isShowFooterText}
          onChange={(value) => setIsShowFooterText(value)}
        />
        <RangeSliderComponent 
          label="Font size"
          value={rangeFontSize}
          min={0}
          max={40}
          onChange={(value) => setRangeFontSize(value)}
        />
        <RangeSliderComponent 
          label="Padding top"
          value={rangePaddingTop}
          min={0}
          max={60}
          onChange={(value) => setRangePaddingTop(value)}
        />
        <RangeSliderComponent 
          label="Padding bottom"
          value={rangePaddingBottom}
          min={0}
          max={60}
          onChange={(value) => setRangePaddingBottom(value)}
        />
      </BlockStack> */}
    </div>
  )
}

export default Footer
