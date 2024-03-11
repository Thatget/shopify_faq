import {Checkbox} from '@shopify/polaris';

type checkBoxProps = {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

export default function CheckBox(props: checkBoxProps) {

  return (
    <Checkbox
      label={props.label}
      checked={props.value}
      onChange={(value) => {props.onChange(value)}}
    />
  );
}