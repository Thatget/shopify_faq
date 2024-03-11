import { Layout, Card, Text, Button, BlockStack, Badge, TextField } from "@shopify/polaris";
import { useCallback, useEffect } from "react";
import {
  RefreshMajor
} from '@shopify/polaris-icons';
import CheckBox from "../../design/modules/template-configuration/components/CheckBox";
import { useAppContext } from "../../../hook";
import { useSyncStoreLanguageApi } from "../../../hook/api/settings";
import { useGetUserApi } from "../../../hook/api/user";
import { setUser } from "../../store/actions";

type AdvanceConfigurationProps = {
  isSeoFaqPage: boolean
  setIsSeoFaqPage: (value: boolean) => void
  isSeoProductPage: boolean
  setIsSeoProductPage: (value: boolean) => void
  setMetaTagDescription: (value: string) => void
  metaTagDescription: string
}

const AdvanceConfiguration = (props: AdvanceConfigurationProps) => {
  const { shopLocalesOption, dispatch } = useAppContext()
  const { mutate: syncLanguage } = useSyncStoreLanguageApi()
  const { mutate: getUser, isLoading, data: dataUser } = useGetUserApi()

  const syncStoreLanguage = useCallback(() => {
    syncLanguage()
    getUser()
  }, [getUser, syncLanguage])

  const handleChange = useCallback(
    (newValue: string) => props.setMetaTagDescription(newValue),
    [props],
  );
  
  useEffect(() => {
    if(dataUser){
      dispatch(setUser(dataUser))
    }
  }, [dataUser, dispatch])

  return (
    <>
      <Layout>
        <Layout.Section variant="oneThird">
          <div>
            <>
              <Text id="storeDetails" variant="headingMd" as="h2">
                Advance configuration
              </Text>
              <Text tone="subdued" as="p">
                You would rarely use these settings. Please don't use if you aren't sure what you are doing. Contact support to learn more.
              </Text>
            </>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={'400'}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">Available store languages</p>
                  <div className="mt-2 ms-7">
                    <div className="flex">
                      { shopLocalesOption.map((item, index) => (
                        <p key={index} className="pe-2"><Badge progress="complete" tone="success">{ item.value }</Badge></p>
                      ))}
                    </div>
                    <div className="opacity-70 pointer-events-none">
                      <Text variant="bodyMd" as="p">
                        Available languages are pulled from your store settings. Sync only if you you've recently added or removed a new language through Shopify admin.
                      </Text>
                    </div>
                  </div>
                </div>
                <div>
                  <Button onClick={() => syncStoreLanguage()} loading={isLoading} icon={RefreshMajor}>Sync</Button>
                </div>
              </div>
              <div>
                <p className="font-bold mb-1">Google SEO snippets</p>
                <div>
                  <CheckBox
                    label="Use Google SEO Snippets for Faq page"
                    value={props.isSeoFaqPage}
                    onChange={(value) => {props.setIsSeoFaqPage(value)}}
                  />
                  { props.isSeoFaqPage &&
                    <div className="ms-7">
                      <TextField
                        label="Meta tag description content"
                        value={props.metaTagDescription}
                        onChange={handleChange}
                        multiline={3}
                        autoComplete="off"
                        placeholder="FAQ professional"
                      />
                    </div>
                  }
                </div>
                <CheckBox
                  label="Use Google SEO Snippets for other page (ex. Homepage, Products, Cart etc...)"
                  value={props.isSeoProductPage}
                  onChange={(value) => {props.setIsSeoProductPage(value)}}
                />
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </>
  );
};

export default AdvanceConfiguration;
