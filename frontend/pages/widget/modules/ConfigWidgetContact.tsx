import { BlockStack, Card, Checkbox, TextField, Text } from "@shopify/polaris"
import { useCallback, useState } from "react";
import { WidgetProps } from "../../../@type/widget";

const ConfigWidgetContact = (props: WidgetProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneChange = useCallback(
    (newValue: string) => setPhoneNumber(newValue),
    [],
  );
  
  const [messageLink, setMessageLink] = useState('');

  const handleMessageChange = useCallback(
    (newValue: string) => setMessageLink(newValue),
    [],
  );

  const [emailLink, setEmailLink] = useState('');

  const handleEmailChange = useCallback(
    (newValue: string) => setEmailLink(newValue),
    [],
  );

  const [whatsAppLink, setWhatsAppLink] = useState('');

  const handleWhatsAppChange = useCallback(
    (newValue: string) => setWhatsAppLink(newValue),
    [],
  );

  return(
    <>
      <Card>
        <BlockStack gap={'400'}>
          <div>
            <Checkbox
              label="Contact"
              checked={props.widgetProps.isActiveContactUs}
              onChange={() => props.widgetProps.setIsActiveContactUs(!props.widgetProps.isActiveContactUs)}
            />
            <div className="ms-7 opacity-70 pointer-events-none">
              <Text variant="bodyMd" as="p">
                Show contact options when customers need support.
              </Text>
            </div>
            { props.widgetProps.isActiveContactUs &&
              <div className="ms-7">
                <BlockStack gap={'400'}>
                  <div className="mt-4">
                    <Checkbox
                      label="Phone"
                      checked={props.widgetProps.isActivePhone}
                      onChange={() => props.widgetProps.setIsActivePhone(!props.widgetProps.isActivePhone)}
                    />
                    { props.widgetProps.isActivePhone && 
                      <div className="ms-7">
                        <TextField
                          label=""
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          autoComplete="off"
                        />
                      </div>
                    }
                  </div>
                  <div>
                    <Checkbox
                      label="Message link"
                      checked={props.widgetProps.isActiveMessage}
                      onChange={() => props.widgetProps.setIsActiveMessage(!props.widgetProps.isActiveMessage)}
                    />
                    { props.widgetProps.isActiveMessage && 
                      <div className="ms-7">
                        <TextField
                          label=""
                          value={messageLink}
                          onChange={handleMessageChange}
                          autoComplete="off"
                        />
                      </div>
                    }
                  </div>
                  <div>
                    <Checkbox
                      label="Contact form"
                      checked={props.widgetProps.isActiveEmail}
                      onChange={() => props.widgetProps.setIsActiveEmail(!props.widgetProps.isActiveEmail)}
                    />
                    { props.widgetProps.isActiveEmail && 
                      <div className="ms-7">
                        <TextField
                          label=""
                          value={emailLink}
                          onChange={handleEmailChange}
                          autoComplete="off"
                        />
                      </div>
                    }
                  </div>
                  <div>
                    <Checkbox
                      label="WhatsApp"
                      checked={props.widgetProps.isActiveWhatsApp}
                      onChange={() => props.widgetProps.setIsActiveWhatsApp(!props.widgetProps.isActiveWhatsApp)}
                    />
                    { props.widgetProps.isActiveWhatsApp && 
                      <div className="ms-7">
                        <TextField
                          label=""
                          value={whatsAppLink}
                          onChange={handleWhatsAppChange}
                          autoComplete="off"
                        />
                      </div>
                    }
                  </div>
                </BlockStack>
              </div>
            }
          </div>
          <div>
            <Checkbox
              label="Featured Questions"
              checked={props.widgetProps.isActiveFaqs}
              onChange={() => props.widgetProps.setIsActiveFaqs(!props.widgetProps.isActiveFaqs)}
            />
            <div className="ms-7 opacity-70 pointer-events-none">
              <Text variant="bodyMd" as="p">
                Show featured questions configured in FAQs settings.
              </Text>
            </div>
          </div>
          <div>
            <Checkbox
              label="Featured Categories"
              checked={props.widgetProps.isActiveCategories}
              onChange={() => props.widgetProps.setIsActiveCategories(!props.widgetProps.isActiveCategories)}
            />
            <div className="ms-7 opacity-70 pointer-events-none">
              <Text variant="bodyMd" as="p">
                Show featured categories configured in FAQs settings.
              </Text>
            </div>
          </div>
        </BlockStack>
      </Card>
    </>
  )
}

export default ConfigWidgetContact
