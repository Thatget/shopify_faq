import { RangeSlider } from "@shopify/polaris";

type rangeSliderProps = {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

export default function RangeSliderComponent(props: rangeSliderProps) {
  // const [rangeValue, setRangeValue] = useState(32);

  // const handleRangeSliderChange = useCallback(
  //   (value: number) => setRangeValue(value),
  //   []
  // );

  return (
    <RangeSlider
      label={`${props.label}: ${props.value}px`}
      value={props.value}
      onChange={(value: number) => props.onChange(value)}
      output
      min={props.min}
      max={props.max}
    />
  );
}
