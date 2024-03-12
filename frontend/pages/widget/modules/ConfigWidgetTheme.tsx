import { BlockStack, Card, Select, TextField } from "@shopify/polaris"
import { useState } from "react";
import { WidgetProps } from "../../../@type/widget";

const ConfigWidgetTheme = (props: WidgetProps) => {
  const [welcomeTitle, setWelcomeTitle] = useState('Hi✌️');
  const [descriptionTitle, setDescriptionTitle] = useState('May I help you?');

  const handleChange = (newValue: string) => setWelcomeTitle(newValue)
  const handleChangeColor = (newValue: string) => {
    console.log(newValue)
    props.widgetProps.setBackgroundColor(newValue)
  }

  const fontFamily = [
    {
      label: 'Questrial',
      value: 'Questrial'
    },
    {
      label: 'Time New Roman',
      value: 'Time New Roman'
    },
    {
      label: 'Lucida Sans',
      value: 'Lucida Sans'
    },
    {
      label: 'Courier',
      value: 'Courier'
    },
    {
      label: 'Garamond',
      value: 'Garamond'
    },
    {
      label: 'Arial',
      value: 'Arial'
    },
    {
      label: 'Calibri',
      value: 'Calibri'
    },
    {
      label: 'Playfair Display',
      value: 'Playfair Display'
    },
    {
      label: 'Varela Round',
      value: 'Varela Round'
    },
    {
      label: 'Use your store font (not available in live preview)',
      value: 'unset'
    }
  ]
  const [selected, setSelected] = useState('today');

  const handleSelectChange = (value: string) => setSelected(value)

  return(
    <>
      <Card>
        <b className="text-sm">Theme</b>
        <div className="mt-4 ms-7">
          <BlockStack gap={'400'}>
            <TextField
              label="Welcome title"
              value={welcomeTitle}
              onChange={handleChange}
              autoComplete="off"
            />
            <TextField
              label="Description title"
              value={descriptionTitle}
              onChange={(value) => setDescriptionTitle(value)}
              autoComplete="off"
            />
            <div>
              <p>Theme color {props.widgetProps.backgroundColor}</p>
              <div className="flex items-center">
                <input type="color" className="h-[36px] me-1 w-[60px] cursor-pointer" onChange={() => props.widgetProps.setBackgroundColor(props.widgetProps.backgroundColor)} value={props.widgetProps.backgroundColor}></input>
                <div className="flex-1">
                  <TextField
                    label=""
                    value={props.widgetProps.backgroundColor}
                    onChange={(value) => props.widgetProps.setBackgroundColor(value)}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div>
              <p>Header text color</p>
              <div className="flex items-center">
                <input type="color" className="h-[36px] me-1 w-[60px] cursor-pointer" onInput={() => handleChangeColor} value={props.widgetProps.headerColor}></input>
                <div className="flex-1">
                  <TextField
                    label=""
                    value={props.widgetProps.headerColor}
                    onChange={(value) => props.widgetProps.setHeaderColor(value)}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div>
              <p>Title color</p>
              <div className="flex items-center">
                <input type="color" className="h-[36px] me-1 w-[60px] cursor-pointer" onChange={() => handleChangeColor} value={props.widgetProps.textColor}></input>
                <div className="flex-1">
                  <TextField
                    label=""
                    value={props.widgetProps.textColor}
                    onChange={(value) => props.widgetProps.setTextColor(value)}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div>
              <Select
                label="Font Family"
                options={fontFamily}
                onChange={handleSelectChange}
                value={selected}
              />
            </div>
          </BlockStack>
        </div>
      </Card>
    </>
  )
}

export default ConfigWidgetTheme
