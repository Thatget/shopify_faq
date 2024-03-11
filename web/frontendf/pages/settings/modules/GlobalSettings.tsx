import {
  Layout,
  Card,
  Text,
  TextField,
  BlockStack,
  Icon,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { LanguageFilledMinor } from "@shopify/polaris-icons";
import CheckBox from "../../design/modules/template-configuration/components/CheckBox";
import ModalTranslationSetting from "./ModalTranslationSetting";
import { Setting } from "../../../@type/setting";

type GlobalSettingsProps = {
  isShowIntroText: boolean
  isShowPageTitle: boolean
  isShowFooterText: boolean
  isShowPageUnderConstruction: boolean
  setIsShowIntroText: (value: boolean) => void
  setIsShowPageTitle: (value: boolean) => void
  setIsShowFooterText: (value: boolean) => void
  setIsShowPageUnderConstruction: (value: boolean) => void
  settings: Setting
  refetch: () => void
}

const GlobalSettings = (props: GlobalSettingsProps) => {
  const [introText, setIntroText] = useState(
    JSON.parse(props.settings.intro_text_content)[0].content
  );
  const [footerText, setFooterText] = useState(
    JSON.parse(props.settings.footer_text_content)[0].content
  );
  const [pageTitle, setPageTitle] = useState(
    JSON.parse(props.settings.page_title_content)[0].content
  );
  const [pageUnderConstruction, setPageUnderConstruction] = useState(
    JSON.parse(props.settings.page_under_contruction)[0].content
  );
  const handleIntroTextChange = useCallback(
    (newValue: string) => setIntroText(newValue),
    []
  );
  const handleFooterTextChange = useCallback(
    (newValue: string) => setFooterText(newValue),
    []
  );
  const handleUnderConstructionChange = useCallback(
    (newValue: string) => setPageUnderConstruction(newValue),
    []
  );
  const handlePageTitleChange = useCallback(
    (newValue: string) => setPageTitle(newValue),
    []
  );
  const [modalType, setModalType] = useState<string>("");
  const [isActive, seIsActiveModal] = useState<boolean>(false);

  const showModal = useCallback((type: string) => {
    setModalType(type);
    seIsActiveModal(true);
  }, []);

  let modalProps;

  switch (modalType) {
    case "Intro text":
      modalProps = {
        title: modalType,
        value: props.settings.intro_text_content,
        action: setIntroText,
        isActive: isActive,
        seIsActive: seIsActiveModal,
        refetch: props.refetch,
        type: "intro_text_content",
      };
      break;
    case "Footer text":
      modalProps = {
        title: modalType,
        value: props.settings.footer_text_content,
        action: setFooterText,
        isActive: isActive,
        seIsActive: seIsActiveModal,
        refetch: props.refetch,
        type: "footer_text_content",
      };
      break;
    case "FAQs page title":
      modalProps = {
        title: modalType,
        value: props.settings.page_title_content,
        action: setPageTitle,
        isActive: isActive,
        seIsActive: seIsActiveModal,
        refetch: props.refetch,
        type: "page_title_content",
      };
      break;
    case "Page under construction":
      modalProps = {
        title: modalType,
        value: props.settings.page_under_contruction,
        action: setPageUnderConstruction,
        isActive: isActive,
        seIsActive: seIsActiveModal,
        refetch: props.refetch,
        type: "page_under_contruction",
      };
      break;
    default:
      modalProps = {
        title: modalType,
        value: props.settings.intro_text_content,
        action: setIntroText,
        isActive: isActive,
        seIsActive: seIsActiveModal,
        refetch: props.refetch,
        type: "intro_text_content",
      };
      break;
  }

  return (
    <>
      <Layout>
        <Layout.Section variant="oneThird">
          <div>
            <>
              <Text id="storeDetails" variant="headingMd" as="h2">
                Global settings
              </Text>
              <Text tone="subdued" as="p">
                You can setup header and footer text along with choosing right
                template for customer facing FAQ page.
              </Text>
            </>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <BlockStack gap={"400"}>
              <div>
                <CheckBox
                  label="Show intro text"
                  value={props.isShowIntroText}
                  onChange={(value) => {
                    props.setIsShowIntroText(value);
                  }}
                />
                { props.isShowIntroText && (
                  <div className="ms-7">
                    <div onClick={() => showModal("Intro text")}>
                      <TextField
                        label=""
                        value={introText}
                        onChange={handleIntroTextChange}
                        autoComplete="off"
                        placeholder="Check most frequently asked questions here"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="opacity-70 pointer-events-none">
                        <Text variant="bodyMd" as="p">
                          This would be shown above all FAQs. Please don't
                          forget single quotes around href tag if you change
                          this.
                        </Text>
                      </div>
                    </div>
                    <div
                      onClick={() => showModal("Intro text")}
                      className="flex justify-end cursor-pointer text-orange-500"
                    >
                      <Icon source={LanguageFilledMinor}></Icon>
                      <p className="ms-1">Edit & Add Translation</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <CheckBox
                  label="Show footer text"
                  value={props.isShowFooterText}
                  onChange={(value) => {
                    props.setIsShowFooterText(value);
                  }}
                />
                {props.isShowFooterText && (
                  <div className="ms-7">
                    <div onClick={() => showModal("Footer text")}>
                      <TextField
                        label=""
                        value={footerText}
                        onChange={handleFooterTextChange}
                        autoComplete="off"
                        placeholder="Thanks for visiting our page!"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="opacity-70 pointer-events-none">
                        <Text variant="bodyMd" as="p">
                          This would be shown below all FAQs.
                        </Text>
                      </div>
                    </div>
                    <div
                      onClick={() => showModal("Footer text")}
                      className="flex justify-end cursor-pointer text-orange-500"
                    >
                      <Icon source={LanguageFilledMinor}></Icon>
                      <p className="ms-1">Edit & Add Translation</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <CheckBox
                  label="Show page title"
                  value={props.isShowPageTitle}
                  onChange={(value) => {
                    props.setIsShowPageTitle(value);
                  }}
                />
                {props.isShowPageTitle && (
                  <div className="ms-7">
                    <div onClick={() => showModal("FAQs page title")}>
                      <TextField
                        label=""
                        value={pageTitle}
                        onChange={handlePageTitleChange}
                        autoComplete="off"
                        placeholder="Thanks for visiting our page!"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="opacity-70 pointer-events-none">
                        <Text variant="bodyMd" as="p">
                          Title for your dedicated FAQ page.
                        </Text>
                      </div>
                    </div>
                    <div
                      onClick={() => showModal("FAQs page title")}
                      className="flex justify-end cursor-pointer text-orange-500"
                    >
                      <Icon source={LanguageFilledMinor}></Icon>
                      <p className="ms-1">Edit & Add Translation</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <CheckBox
                  label="Show page under construction"
                  value={props.isShowPageUnderConstruction}
                  onChange={(value) => {
                    props.setIsShowPageUnderConstruction(value);
                  }}
                />
                {props.isShowPageUnderConstruction && (
                  <div className="ms-7">
                    <div onClick={() => showModal("Page under construction")}>
                      <TextField
                        label=""
                        value={pageUnderConstruction}
                        onChange={handleUnderConstructionChange}
                        autoComplete="off"
                        placeholder="Thanks for visiting our page!"
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="opacity-70 pointer-events-none">
                          <Text variant="bodyMd" as="p">
                            Text shown when you haven't published any FAQs.
                          </Text>
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => showModal("Page under construction")}
                      className="flex justify-end cursor-pointer text-orange-500"
                    >
                      <Icon source={LanguageFilledMinor}></Icon>
                      <p className="ms-1">Edit & Add Translation</p>
                    </div>
                  </div>
                )}
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
      <ModalTranslationSetting {...modalProps}></ModalTranslationSetting>
    </>
  );
};

export default GlobalSettings;
