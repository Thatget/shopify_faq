import { Badge, Layout, List, Page } from "@shopify/polaris";
import {
  LanguageMinor,
  AppsMajor,
  CircleDisabledMajor,
  StatusActiveMajor,
  ConfettiMajor,
} from "@shopify/polaris-icons";
import Preview from "./Preview";
import Config from "./Config";
import { useState } from "react";
import "../../assets/css/widget.css";
import Translation from "./Translation";
import { useAppContext } from "../../hook/useAppContext";
// import { BannerWithDismiss } from "../../components/component/BannerWithDismiss";
import { ESessionStorageKeys } from "../../@type/common";
import { BannerWithDismiss } from "@/components/component/BannerWithDismiss";
// import { useGetWidgetsApi } from "../../hook/api/widget";

const Widget = () => {
  // const { data } = useGetWidgetsApi()
  const [activeWidget, setActiveWidget] = useState<boolean>(true);
  const [iconNumber, setIconNumber] = useState<string>("1");
  const [isActiveAnimation, setIsActiveAnimation] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>("#947451");
  const [headerColor, setHeaderColor] = useState<string>("#ffffff");
  const [textColor, setTextColor] = useState<string>("#5c6282");
  const [alignment, setAlignment] = useState<string>("right");
  const [fontFamily, setFontFamily] = useState<string>("right");
  const [isActiveContactUs, setIsActiveContactUs] = useState<boolean>(true);
  const [isActivePhone, setIsActivePhone] = useState<boolean>(true);
  const [isActiveMessage, setIsActiveMessage] = useState<boolean>(true);
  const [isActiveEmail, setIsActiveEmail] = useState<boolean>(true);
  const [isActiveWhatsApp, setIsActiveWhatsApp] = useState<boolean>(true);
  const [isActiveFaqs, setIsActiveFaqs] = useState<boolean>(true);
  const [isActiveCategories, setIsActiveCategories] = useState<boolean>(true);
  const [activeTranslation, setActiveTranslation] = useState(false);
  const { enableThemeExtension } = useAppContext()

  const widgetProps = {
    iconNumber,
    setIconNumber,
    setIsActiveAnimation,
    isActiveAnimation,
    setBackgroundColor,
    backgroundColor,
    alignment,
    setAlignment,
    isActiveContactUs,
    isActivePhone,
    isActiveMessage,
    isActiveEmail,
    isActiveWhatsApp,
    isActiveFaqs,
    isActiveCategories,
    setIsActiveContactUs,
    setIsActivePhone,
    setIsActiveMessage,
    setIsActiveEmail,
    setIsActiveWhatsApp,
    setIsActiveFaqs,
    setIsActiveCategories,
    headerColor,
    setHeaderColor,
    textColor,
    setTextColor,
    fontFamily,
    setFontFamily,
  };

  return (
    <Page
      title="Widget"
      titleMetadata={
        activeWidget ? (
          <Badge tone="success">Active</Badge>
        ) : (
          <Badge tone="critical">Inactive</Badge>
        )
      }
      primaryAction={{
        content: "Save",
      }}
      secondaryActions={[
        {
          content: activeWidget ? "Turn off" : "Turn on",
          onAction: () => {
            setActiveWidget(!activeWidget);
          },
          icon: activeWidget ? CircleDisabledMajor : StatusActiveMajor,
        },
        {
          content: "Translation",
          onAction: () => setActiveTranslation(true),
          icon: LanguageMinor,
        },
        {
          content: "Enable embed app",
          onAction: () => {
            enableThemeExtension();
          },
          icon: AppsMajor,
        },
      ]}
    >    
      <BannerWithDismiss
        icon={ConfettiMajor}
        title="Widget Overview"
        sessionKey={ESessionStorageKeys.SSK_WIDGET_BANNER}
      >
        <b>This feature is developed to bring a better experience for users when visiting your store online.</b>
        <div className="mt-2 ms-7">
          <List>
            <List.Item>Reach brilliant FAQs easily through a dynamic popup.</List.Item>
            <List.Item>Easy to customize the layout to look nice and match your brand.</List.Item>
            <List.Item>Quick to contact and respond by integrating 3rd parties: WhatsApp, messenger, contact form, and phone call.</List.Item>
          </List>
        </div>
      </BannerWithDismiss>
      <Layout>
        <Layout.Section>
          <Config widgetProps={widgetProps} />
        </Layout.Section>
        <div className="Polaris-Layout__Section Polaris-Layout__Section--oneThird sticky top-6 flex justify-center">
          <Preview widgetProps={widgetProps} />
        </div>
      </Layout>
      <Translation
        activeTranslation={activeTranslation}
        setActiveTranslation={setActiveTranslation}
      ></Translation>
    </Page>
  );
};

export default Widget;
