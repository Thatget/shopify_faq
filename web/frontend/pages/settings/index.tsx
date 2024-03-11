import { BlockStack, Page } from "@shopify/polaris";
import General from "./modules/General";
import AdvanceConfiguration from "./modules/AdvanceConfiguration";
import DisplaySettings from "./modules/DisplaySettings";
import SearchBarSettings from "./modules/SearchBarSettings";
import GlobalSettings from "./modules/GlobalSettings";
import { useAppContext } from "../../hook";
import { Setting } from "../../@type/setting";
import { useEffect, useState } from "react";
import {
  useGetSettingsApi,
  useUpdateSettingsApi,
} from "../../hook/api/settings";
import { setSetting } from "../store/actions";

const Settings = () => {
  const { state, dispatch } = useAppContext();
  const [settings, setSettings] = useState<Setting>(state.settings);
  const { data, refetch } = useGetSettingsApi();
  const props = { refetch, setting: settings, setSettings: setSettings };
  const { mutate, isLoading, data: dataSettings } = useUpdateSettingsApi();
  const [isSeoFaqPage, setIsSeoFaqPage] = useState<boolean>(
    props.setting.faq_page_schema
  );
  const [isSeoProductPage, setIsSeoProductPage] = useState<boolean>(
    props.setting.more_page_schema
  );
  const [metaTagDescription, setMetaTagDescription] = useState<string>(
    props.setting.meta_tag_description
  );
  const [viewFaqPage, setViewFaqPage] = useState<string>(
    props.setting.faq_page_url
  );
  const [isSortByCategory, setIsSortByCategory] = useState<boolean>(
    props.setting.category_sort_name
  );
  const [isSortByFaqs, setIsSortByFaqs] = useState<boolean>(
    props.setting.faq_sort_name
  );
  const [isDontCategory, setIsDontCategory] = useState<boolean>(
    props.setting.dont_category_faq
  );
  const [isShowIntroText, setIsShowIntroText] = useState<boolean>(
    props.setting.show_intro_text
  );
  const [isShowPageTitle, setIsShowPageTitle] = useState<boolean>(
    props.setting.show_page_title
  );
  const [isShowFooterText, setIsShowFooterText] = useState<boolean>(
    props.setting.show_footer_text
  );
  const [isShowPageUnderConstruction, setIsShowPageUnderConstruction] =
    useState(props.setting.show_page_construction);

  const GlobalSettingsProps = {
    isShowIntroText,
    isShowPageTitle,
    isShowFooterText,
    isShowPageUnderConstruction,
    setIsShowIntroText,
    setIsShowPageTitle,
    setIsShowFooterText,
    setIsShowPageUnderConstruction,
    settings,
    refetch,
  };

  const generalProps = {
    viewFaqPage,
    setViewFaqPage,
    settings,
  };

  const AdvanceConfigurationProps = {
    isSeoFaqPage,
    isSeoProductPage,
    metaTagDescription,
    setIsSeoFaqPage,
    setIsSeoProductPage,
    setMetaTagDescription,
  };

  const DisplaySettingsProps = {
    isSortByCategory,
    isSortByFaqs,
    isDontCategory,
    setIsSortByCategory,
    setIsSortByFaqs,
    setIsDontCategory,
  };

  const updateSettings = () => {
    const dataUpdate = {
      id: settings.id,
      faq_page_url: viewFaqPage,
      category_sort_name: isSortByCategory,
      faq_sort_name: isSortByFaqs,
      dont_category_faq: isDontCategory,
      faq_page_schema: isSeoFaqPage,
      more_page_schema: isSeoProductPage,
      meta_tag_description: metaTagDescription,
      show_intro_text: isShowIntroText,
      show_page_title: isShowPageTitle,
      show_footer_text: isShowFooterText,
      show_page_construction: isShowPageUnderConstruction,
    };

    mutate(dataUpdate, {
      onSuccess: () => {
        if (dataSettings) {
          dispatch(setSetting(dataSettings));
        }
      },
    });
  }

  useEffect(() => {
    if (data) {
      setSettings(data);
    }
  }, [data]);

  return (
    <Page
      title="Settings"
      primaryAction={{
        content: "Save",
        onAction: () => updateSettings(),
        loading: isLoading,
      }}
    >
      <BlockStack gap={"400"}>
        <General {...generalProps} />
        <AdvanceConfiguration {...AdvanceConfigurationProps} />
        <DisplaySettings {...DisplaySettingsProps} />
        <SearchBarSettings {...props} />
        <GlobalSettings {...GlobalSettingsProps} />
      </BlockStack>
    </Page>
  );
};

export default Settings;
