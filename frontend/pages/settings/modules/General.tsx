import {
  Layout,
  Card,
  Text,
  TextField,
  Button,
  BlockStack,
  Icon,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { Setting } from "../../../@type/setting";
import { useNavigate } from "react-router-dom";
import { QuestionMarkMajor } from "@shopify/polaris-icons";
import ModalTutorialFaqPageUrl from "./ModalTutorialFaqPageUrl";

export type settingProps = {
  refetch: () => void;
  setting: Setting;
  setSettings: (setting: Setting) => void
};

type GeneralProps = {
  viewFaqPage: string,
  setViewFaqPage: (value: string) => void
  settings: Setting
}

const General = (props: GeneralProps) => {
  const [ showModal, setShowModal ] = useState(false)
  const navigate = useNavigate();

  const changePathFaqPage = useCallback(
    (newValue: string) => props.setViewFaqPage(newValue),
    [props]
  );
  return (
    <>
      <Layout>
        <Layout.Section variant="oneThird">
          <div>
            <>
              <Text id="storeDetails" variant="headingMd" as="h2">
                General
              </Text>
              <Text tone="subdued" as="p">
                Allows you to change customer facing FAQ URL along with plan you
                are currently subscribed to.
              </Text>
            </>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={"400"}>
              <div className="">
                <div className="flex">
                  <p className="font-bold mb-1">Faq page path</p>
                  <div className="cursor-pointer" onClick={() => setShowModal(true)}>
                    <Icon source={QuestionMarkMajor} tone="base" />
                  </div>
                </div>
                <div className="ms-7">
                  <TextField
                    label=""
                    value={props.viewFaqPage}
                    onChange={changePathFaqPage}
                    autoComplete="off"
                  />
                  <div className="opacity-70">
                    <Text variant="bodyMd" as="p">
                      Important Note: Once you are redirected, change App Proxy
                      URL. After you are done updating URL, visit newly created
                      page by typing URL in browser.
                    </Text>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold mb-1">
                      Show faqs on other page like product, cart, home page,...
                    </p>
                    <div className="opacity-70 pointer-events-none ms-7">
                      <Text variant="bodyMd" as="p">
                        This setting allows you to show FAQs on other pages of
                        store.
                      </Text>
                    </div>
                  </div>
                  <Button onClick={() => navigate("/faq-more-page")}>
                    Settings
                  </Button>
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      <ModalTutorialFaqPageUrl showModal={showModal} setShowModal={setShowModal}></ModalTutorialFaqPageUrl>
    </>
  );
};

export default General;
