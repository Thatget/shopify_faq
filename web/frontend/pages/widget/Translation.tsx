import { BlockStack, Card, Grid, Modal, Select, TextField } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import translationData from "../../assets/data/translation.json";

type TranslationProps = {
  activeTranslation: boolean;
  setActiveTranslation: (value: boolean) => void;
};

export default function Translation(props: TranslationProps) {
  const [language, setLanguage] = useState("English");
  const translation = useMemo(() => {
    return translationData.filter((item) => item.country === language)[0];
  }, [language]);

  const [contactUs, setContactUs] = useState(translation?.contact_us);
  const [faqs, setFaqs] = useState(translation?.contact_us);
  const [categories, setCategories] = useState(translation?.contact_us);
  const [search, setSearch] = useState(translation?.contact_us);
  const [YourName, setYourName] = useState(translation?.contact_us);
  const [messages, setMessages] = useState(translation?.contact_us);
  const [send, setSend] = useState(translation?.contact_us);
  const [contact, setContact] = useState(translation?.contact_us);

  const closeModal = useCallback(
    () => props.setActiveTranslation(!props.activeTranslation),
    [props]
  );

  const handleSelectLanguage = useCallback(
    (value: string) => setLanguage(value),
    []
  );

  useEffect(() => {
    setContactUs(translation?.contact_us);
    setFaqs(translation?.faq);
    setCategories(translation?.contact_us);
    setSearch(translation?.search);
    setYourName(translation?.your_name);
    setMessages(translation?.messages);
    setSend(translation?.send);
    setContact(translation?.contact);
  }, [
    translation?.contact,
    translation?.contact_us,
    translation?.faq,
    translation?.messages,
    translation?.search,
    translation?.send,
    translation?.your_name,
  ]);

  const options = [
    { label: "English", value: "English" },
    { label: "VietNamese", value: "VietNamese" },
    { label: "French", value: "French" },
    { label: "Thailand", value: "Thailand" },
    { label: "Portuguese", value: "Portuguese" },
    { label: "Germany", value: "Germany" },
    { label: "Japanese", value: "Japanese" },
    { label: "Spanish", value: "Spanish" },
    { label: "Laos", value: "Laos" },
    { label: "Russian", value: "Russian" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div>
      <Modal
        size="large"
        open={props.activeTranslation}
        onClose={closeModal}
        title="Translation"
        primaryAction={{
          content: "Save",
          onAction: closeModal,
        }}
      >
        <Modal.Section>
          <BlockStack gap={'400'}>
            <Card>
              <Select
                label="Choose the primary language"
                options={options}
                onChange={handleSelectLanguage}
                value={language}
              />
            </Card>
            <Card>
              <Grid>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                  <BlockStack gap={'400'}>
                    <TextField
                      label="Contact Us"
                      value={contactUs}
                      onChange={(value) => setContactUs(value)}
                      autoComplete="off"
                    />
                    <TextField
                      label="FAQs"
                      value={faqs}
                      onChange={(value) => setFaqs(value)}
                      autoComplete="off"
                    />
                    <TextField
                      label="Categories"
                      value={categories}
                      onChange={(value) => setCategories(value)}
                      autoComplete="off"
                    />
                    <TextField
                      label="Search"
                      value={search}
                      onChange={(value) => setSearch(value)}
                      autoComplete="off"
                    />
                  </BlockStack>
                </Grid.Cell>
                <Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}>
                  <BlockStack gap={'400'}>
                    <TextField
                      label="Your Name"
                      value={YourName}
                      onChange={(value) => setYourName(value)}
                      autoComplete="off"
                    />
                    <TextField
                      label="Messages"
                      value={messages}
                      onChange={(value) => setMessages(value)}
                      autoComplete="off"
                    />
                    <TextField
                      label="Send"
                      value={send}
                      onChange={(value) => setSend(value)}
                      autoComplete="off"
                    />
                    <TextField
                      label="Contact"
                      value={contact}
                      onChange={(value) => setContact(value)}
                      autoComplete="off"
                    />
                  </BlockStack>  
                </Grid.Cell>
              </Grid>
            </Card>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </div>
  );
}
