// import CheckBox from "./components/CheckBox"
import RangeSliderComponent from "./components/RangeSlider"
import { useState } from "react";

const Body = () => {
  const [rangeValue, setRangeValue] = useState(10);
  // const [isShowFooterText, setIsShowFooterText] = useState(true);

  return(
    <div className="w-full">
      {/* <BlockStack gap={'400'}> */}
        {/* <CheckBox
          label="Show Footer text"
          value={isShowFooterText}
          onChange={(value) => setIsShowFooterText(value)}
        /> */}
        <RangeSliderComponent 
          label="Font size"
          value={rangeValue}
          min={0}
          max={40}
          onChange={(value) => setRangeValue(value)}
        />
      {/* </BlockStack> */}
    </div>
  )
}

export default Body
