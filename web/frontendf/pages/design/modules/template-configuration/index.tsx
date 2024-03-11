import { Card, Layout, Tabs, Text } from "@shopify/polaris"
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import More from "./More";
import { useState, useCallback } from "react";
import TemplatePreview from "./TemplatePreview";
import { templateProps } from "../TemplateSelection";

const TemplateConfiguration = (props: templateProps) => {
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelected(selectedTabIndex),
    [],
  );
  const tabs = [
    {
      id: '1',
      content: 'Header',
      accessibilityLabel: 'All customers',
      panelID: 'all-customers-content-1',
    },
    {
      id: '2',
      content: 'Body',
      panelID: 'accepts-marketing-content-1',
    },
    {
      id: '3',
      content: 'Footer',
      panelID: 'repeat-customers-content-1',
    },
    {
      id: '4',
      content: 'More settings',
      panelID: 'prospects-content-1',
    },
  ];
  return(
    <Layout>
      <Layout.Section variant="oneThird">
        <div>
          <>
            <Text id="storeDetails" variant="headingMd" as="h2">
              Template configuration
            </Text>
            <div className="mt-1">
              <Card>
                <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}/>
                <div className="flex mt-3 w-full">
                  { selected === 0 && 
                    <Header></Header>
                  }
                  { selected === 1 && 
                    <Body></Body>
                  }
                  { selected === 2 && 
                    <Footer></Footer>
                  }
                  { selected === 3 && 
                    <More></More>
                  }
                </div>
              </Card>
            </div>
            {/* <Text tone="subdued" as="p">
              Select a photo in your computer to change the store banner.
            </Text> */}
          </>
        </div>
      </Layout.Section>
      <Layout.Section>
        <Text id="storeDetails" variant="headingMd" as="h2">
          Live preview
        </Text>
        <div className="mt-1">
          <Card>
            <TemplatePreview templateSelected={props.templateSelected} setTemplateSelected={props.setTemplateSelected}></TemplatePreview>
          </Card>
        </div>
      </Layout.Section>
    </Layout>
  )
}

export default TemplateConfiguration
