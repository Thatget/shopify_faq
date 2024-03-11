import { BlockStack, Modal, Select, TextField } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../../hook";
import { useUpdateSettingsApi } from "../../../hook/api/settings";

export type ModalTranslationProps = {
  title: string;
  value: string;
  action: (value: string) => void;
  isActive: boolean;
  seIsActive: (active: boolean) => void;
  refetch: () => void;
  type: string;
};

export type Translation = {
  content: string;
  locale: string;
};

export default function ModalTranslationSetting(props: ModalTranslationProps) {
  const { shopLocalesOption, defaultLocale, state } = useAppContext();
  const [locale, setLocale] = useState<string>(defaultLocale);
  const translationArray: Translation[] = JSON.parse(props.value);
  const { mutate, isLoading } = useUpdateSettingsApi();

  const convertTranslateContent = useCallback(
    (text: string) => {
      return (
        JSON.parse(text).filter(
          (item: Translation) => item.locale === locale
        )[0] ||
        JSON.parse(text).filter(
          (item: Translation) => item.locale === "default"
        )[0]
      );
    },
    [locale]
  );

  const [valueModal, setValueModal] = useState(
    convertTranslateContent(props.value).content
  );

  const isCheckLocaleExist = useMemo(() => {
    const localeCheck = locale === defaultLocale ? "default" : locale;
    const isCheck = translationArray.filter(
      (item) => item.locale === localeCheck
    );
    if (isCheck.length > 0) {
      return true;
    }
    return false;
  }, [defaultLocale, locale, translationArray]);

  const handleChange = useCallback(() => {
    setLocale(defaultLocale);
    props.seIsActive(!props.isActive);
  }, [defaultLocale, props]);

  const changeLocale = useCallback(
    (locale: string) => {
      setLocale(locale);
      if (!isCheckLocaleExist) {
        setValueModal(convertTranslateContent(props.value).content);
      } else {
        const localeCheck = locale === defaultLocale ? "default" : locale;
        const currentContent = translationArray.filter(
          (item) => item.locale === localeCheck
        );
        if (currentContent.length > 0) setValueModal(currentContent[0].content);
      }
    },
    [
      convertTranslateContent,
      defaultLocale,
      isCheckLocaleExist,
      props.value,
      translationArray,
    ]
  );

  useEffect(() => {
    setValueModal(convertTranslateContent(props.value).content);
  }, [convertTranslateContent, props.value]);

  const submit = useCallback(() => {
    const localeCheck = locale === defaultLocale ? "default" : locale;

    if (isCheckLocaleExist) {
      translationArray.forEach((item) => {
        if (item.locale === localeCheck) {
          item.content = valueModal;
        }
      });
    } else {
      translationArray.push({
        locale: locale,
        content: valueModal,
      });
    }

    let data;
    switch (props.type) {
      case "search_placehoder":
        data = {
          id: state.settings.id,
          search_placehoder: JSON.stringify(translationArray),
        };
        break;
      case "search_not_found":
        data = {
          id: state.settings.id,
          search_not_found: JSON.stringify(translationArray),
        };
        break;
      case "intro_text_content":
        data = {
          id: state.settings.id,
          intro_text_content: JSON.stringify(translationArray),
        };
        break;
      case "footer_text_content":
        data = {
          id: state.settings.id,
          footer_text_content: JSON.stringify(translationArray),
        };
        break;
      case "page_title_content":
        data = {
          id: state.settings.id,
          page_title_content: JSON.stringify(translationArray),
        };
        break;
      case "page_under_contruction":
        data = {
          id: state.settings.id,
          page_under_contruction: JSON.stringify(translationArray),
        };
        break;
    }

    mutate(data, {
      onSuccess: () => {
        props.refetch();
      },
    });
  }, [
    defaultLocale,
    isCheckLocaleExist,
    locale,
    mutate,
    props,
    state.settings.id,
    translationArray,
    valueModal,
  ]);

  return (
    <div>
      <Modal
        open={props.isActive}
        onClose={handleChange}
        title={props.title}
        size="small"
        primaryAction={{
          content: "Save",
          onAction: () => submit(),
          loading: isLoading,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <Select
              label="Add Translation"
              options={shopLocalesOption}
              onChange={(value) => changeLocale(value)}
              value={locale}
            />
            <TextField
              label="Translation"
              value={valueModal}
              onChange={(value) => setValueModal(value)}
              autoComplete="off"
            />
          </BlockStack>
        </Modal.Section>
      </Modal>
    </div>
  );
}
