import {
  Layout,
  Card,
  Text,
  Select,
} from '@shopify/polaris';
import { useEffect, useState } from 'react';
import template1 from '../../../assets/images/template1.png'
import template2 from '../../../assets/images/template2.png'
import template3 from '../../../assets/images/template3.png'
import Template04 from '../../../assets/images/Template04.png'
import Template05 from '../../../assets/images/Template05.png'
import Template06 from '../../../assets/images/Template06.png'
import Template07 from '../../../assets/images/Template07.png'
import Template08 from '../../../assets/images/Template08.png'

export type templateProps = {
  templateSelected: string
  setTemplateSelected: (templateSelected: string) => void
}

export default function TemplateSelection(props: templateProps) {
  const [image, setImage] = useState('');

  const handleSelectChange = (value: string) => {
    props.setTemplateSelected(value)
  }

  useEffect(() => {
    switch(props.templateSelected){
      case '1':
        setImage(template1)
        break;
      case '2':
        setImage(template2)
        break;
      case '3':
        setImage(template3)
        break;
      case '4':
        setImage(Template04)
        break;
      case '5':
        setImage(Template05)
        break;
      case '6':
        setImage(Template06)
        break;
      case '7':
        setImage(Template07)
        break;
      case '8':
        setImage(Template08)
        break;
    }
  }, [props.templateSelected])
  const options = [
    {label: 'Template 01', value: '1'},
    {label: 'Template 02', value: '2'},
    {label: 'Template 03', value: '3'},
    {label: 'Template 04', value: '4'},
    {label: 'Template 05', value: '5'},
    {label: 'Template 06', value: '6'},
    {label: 'Template 07', value: '7'},
    {label: 'Template 08', value: '8'},
  ];

  return (
    <>
      <Layout>
        <Layout.Section oneHalf>
          <div>
            <Text id="storeDetails" variant="headingMd" as="h2">
              Template Selection
            </Text>
            <Text tone="subdued" as="p">
              Choose one of our 8 pre-existing template.
            </Text>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card>
          <Select
            label="Faq templates"
            options={options}
            onChange={handleSelectChange}
            value={props.templateSelected}
          />
          <div className='mt-4'>
            <img src={image} alt="" className='border rounded' />
          </div>
          </Card>
        </Layout.Section>
      </Layout>
    </>
  );
}
