import { BlockStack, Icon, Link, List, Modal, Text } from "@shopify/polaris";
import { useCallback } from "react";
import { useAppContext } from "../../../hook";
import { DomainRedirectMinor } from "@shopify/polaris-icons";
type Props = {
  showModal: boolean,
  setShowModal: (value: boolean) => void
}

export default function ModalTutorialFaqPageUrl(props: Props) {
  const { state } = useAppContext();
  const handleChange = useCallback(() => props.setShowModal(!props.showModal), [props]);

  return (
    <div>
      <Modal
        open={props.showModal}
        onClose={handleChange}
        title="How to change FAQ page URL?"
        primaryAction={{
          content: "I understood",
          onAction: handleChange,
        }}
      >
        <Modal.Section>
          <BlockStack gap="400">
            <div>
              <Text as="p">
                By default FAQ page is located at <b>"/apps/faqs"</b> . If you
                would like to update that, app allows you to make changes based
                on your need. In this example, following will be my current and
                new URLs:
              </Text>
              <p className="mt-2">
                <b>Current:</b> {state.user.shopify_domain}/apps/faqs
              </p>
              <p>
                <b>New:</b>
                {state.user.shopify_domain}/community/new-faqs
              </p>
            </div>
            <div>
              <p>To make these changes, please follow these instructions:</p>
              <List type="number">
                <List.Item>
                  <div className="flex">
                    <p className="pe-1">Click on <b>"Settings"</b> within your Shopify admin.</p>
                    <Link
                      url={`https://${state.user.shopify_domain}/admin/settings/apps/app_installations/app/yanet-professional-faq-page`}
                    >
                      <div className="flex">
                        <p>Setting Page Link</p>
                        <Icon
                          source={DomainRedirectMinor}
                          tone="info"
                        />
                      </div>
                    </Link>
                  </div>
                </List.Item>
                <List.Item>
                  Click on <b>"Customize URL"</b> under App proxy section.
                </List.Item>
                <List.Item>
                  Choose option that suits your need along with the new FAQ page
                  link.
                </List.Item>
                <List.Item>
                  Click <b>"Save"</b>
                </List.Item>
                <List.Item>
                  {" "}
                  Visit newly created URL from your browser. Last step, you need
                  to change the <b>"Faqs page path"</b> setting in the app and
                  save.
                </List.Item>
              </List>
            </div>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </div>
  );
}
