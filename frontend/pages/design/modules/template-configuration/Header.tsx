import CheckBox from "./components/CheckBox"
import RangeSliderComponent from "./components/RangeSlider"
import { useState } from "react";

const Header = () => {
  const [rangeValue, setRangeValue] = useState(320);
  const [isShowBanner, setIsShowBanner] = useState(true);

  return(
    <div className="w-full">
      {/* <BlockStack gap={'400'}>
        <CheckBox
          label="Show banner"
          value={isShowBanner}
          onChange={(value) => setIsShowBanner(value)}
        />
        <RangeSliderComponent 
          label="Header height"
          value={rangeValue}
          min={0}
          max={460}
          onChange={(value) => setRangeValue(value)}
        />
      </BlockStack> */}
    </div>
  )
}

export default Header
