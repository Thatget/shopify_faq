import { Layout, Card, Text, BlockStack } from "@shopify/polaris";
import CheckBox from "../../design/modules/template-configuration/components/CheckBox";

type DisplaySettingsProps = {
  isSortByCategory: boolean
  isSortByFaqs: boolean
  isDontCategory: boolean
  setIsSortByCategory: (value: boolean) => void
  setIsSortByFaqs: (value: boolean) => void
  setIsDontCategory: (value: boolean) => void
}

const DisplaySettings = (props: DisplaySettingsProps) => {

  return (
    <>
      <Layout>
        <Layout.Section variant="oneThird">
          <div>
            <>
              <Text id="storeDetails" variant="headingMd" as="h2">
                Display settings
              </Text>
              <Text tone="subdued" as="p">
                Adjust how FAQs and Categories should be shown on customer facing FAQs page.
              </Text>
            </>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={'400'}>
              <div className="flex flex-col">
                <CheckBox
                  label="Sort categories alphabetically"
                  value={props.isSortByCategory}
                  onChange={(value) => {props.setIsSortByCategory(value)}}
                />
                <CheckBox
                  label="Sort FAQs alphabetically"
                  value={props.isSortByFaqs}
                  onChange={(value) => {props.setIsSortByFaqs(value)}}
                />
                <CheckBox
                  label="Don't categorize FAQs (This would show all FAQs flat)"
                  value={props.isDontCategory}
                  onChange={(value) => {props.setIsDontCategory(value)}}
                />
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </>
  );
};

export default DisplaySettings;
