import {
  Layout,
  Card,
  Text,
  TextField,
  BlockStack,
  Icon,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { LanguageFilledMinor } from "@shopify/polaris-icons";
import ModalTranslationSetting from "./ModalTranslationSetting";
import { settingProps } from "./General";

const SearchBarSettings = (props: settingProps) => {
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    JSON.parse(props.setting.search_placehoder)[0].content
  );
  const [searchNotFoundText, setSearchNotFoundText] = useState(
    JSON.parse(props.setting.search_not_found)[0].content
  );
  const [isActive, seIsActiveModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");

  const showModal = useCallback((type: string) => {
    setModalType(type);
    seIsActiveModal(true);
  }, []);

  useEffect(() => {
    setSearchPlaceholder(JSON.parse(props.setting.search_placehoder)[0].content)
    setSearchNotFoundText(JSON.parse(props.setting.search_not_found)[0].content)
  }, [props.setting.search_not_found, props.setting.search_placehoder])

  const modalProps =
    modalType === "Search placeholder"
      ? {
          title: modalType,
          value: props.setting.search_placehoder,
          action: setSearchPlaceholder,
          isActive: isActive,
          seIsActive: seIsActiveModal,
          refetch: props.refetch,
          type: 'search_placehoder'
        }
      : {
          title: modalType,
          value: props.setting.search_not_found,
          action: setSearchNotFoundText,
          isActive: isActive,
          seIsActive: seIsActiveModal,
          refetch: props.refetch,
          type: 'search_not_found'
        };

  return (
    <>
      <Layout>
        <Layout.Section variant="oneThird">
          <div>
            <>
              <Text id="storeDetails" variant="headingMd" as="p">
                Search bar settings
              </Text>
              <Text tone="subdued" as="p">
                Allows customers to search for FAQs. Note that search bar only
                works on stand alone page created by this app. If you are
                showing FAQs on other parts of your FAQs, it's hidden by
                default.
              </Text>
            </>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={"400"}>
              <div className="">
                <p className="font-bold mb-1">Search placeholder</p>
                <div className="ms-7 cursor-pointer">
                  <div onClick={() => showModal("Search placeholder")}>
                    <TextField
                      label=""
                      value={searchPlaceholder}
                      autoComplete="off"
                      placeholder="What can we help you with?"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="opacity-70">
                      <Text variant="bodyMd" as="p">
                        This setting allows you to show FAQs on other pages of
                        store.
                      </Text>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => showModal("Search placeholder")}
                  className="flex justify-end cursor-pointer text-orange-500"
                >
                  <Icon source={LanguageFilledMinor}></Icon>
                  <p className="ms-1">Edit & Add Translation</p>
                </div>
              </div>
              <div className="">
                <p className="font-bold mb-1">Search not found text</p>
                <div className="ms-7">
                  <div onClick={() => showModal("Search not found text")}>
                    <TextField
                      label=""
                      value={searchNotFoundText}
                      autoComplete="off"
                      placeholder="Oops, your search did not match any FAQs."
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="opacity-70 cursor-pointer pointer-events-none">
                      <Text variant="bodyMd" as="p">
                        This text is shown when customer search doesn't
                        produce any results.
                      </Text>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => showModal("Search not found text")}
                  className="flex justify-end cursor-pointer text-orange-500"
                >
                  <Icon source={LanguageFilledMinor}></Icon>
                  <p className="ms-1">Edit & Add Translation</p>
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      <ModalTranslationSetting {...modalProps}></ModalTranslationSetting>
    </>
  );
};

export default SearchBarSettings;
