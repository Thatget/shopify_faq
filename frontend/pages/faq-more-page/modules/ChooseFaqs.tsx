import { Card, ResourceList, ResourceItem, ResourceListProps, Modal } from "@shopify/polaris";
import {useEffect, useState } from "react";
import { useAppContext } from "../../../hook";
import { FaqsIdString } from "../../../@type/faq";
import { FaqMorePageProps, FaqMorePageUpdateApi } from "../../../@type/faq_more_page";

export default function ChooseFaqs(props: FaqMorePageProps) {
  const { state } = useAppContext();

  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);
  const [faqs, setFaqsData] = useState<FaqsIdString[]>([]);

  useEffect(() => {
    let newFaqs: FaqsIdString[] = [];

    if (state.faqs.length > 0) {
      state.faqs.forEach((item) => {
        newFaqs.push({
          ...item,
          id: item.id ? item.id.toString() : "",
        });
      });
    }

    if (state.categories.length > 0) {
      state.categories.forEach((category) => {
        newFaqs.forEach((faq) => {
          if (category.identify === faq.category_identify) {
            faq.category_name = category.title || "";
          }
        });
      });
    }

    setFaqsData(newFaqs);
  }, [state.categories, state.faqs]);
  
  const addFaqs = () => {
    if (selectedItems && state.faqs.length > 0 && state.faqs) {
      let listFaqs: FaqMorePageUpdateApi[] = [];
      state.faqs.forEach((item) => {
        if (selectedItems.indexOf(item.id?.toString() || "") !== -1) {
          listFaqs.push({
            category_identify: item.category_identify || "",
            faq_id: item.id || 0,
            faq_identify: item.identify || "",
            faq_title: item.title || "",
            page_name: props.pageSelected
          });
        }
      });
      props.setFaqsMorePageSelected(listFaqs);
      handleCloseModal()    
    }
  }

  const handleCloseModal = () => {
    // setSelectedItems([])
    props.setShowModal(false)
  }

  return (
    <Modal
      open={props.showModal}
      onClose={() => handleCloseModal()}
      title="Choose Faqs"
      primaryAction={{
        content: 'Add Faqs',
        onAction: () => addFaqs(),
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: () => handleCloseModal(),
        },
      ]}
    >
      <Modal.Section>
        <Card padding={"0"}>
          <ResourceList
            selectable
            onSelectionChange={setSelectedItems}
            selectedItems={selectedItems}
            resourceName={{ singular: "faq", plural: "faqs" }}
            items={faqs}
            renderItem={(item) => {
              return (
                <ResourceItem
                  id={item.id || ""}
                  accessibilityLabel={`View details for ${item.title}`}
                  url={""}
                  name={item.title}
                >
                  <p className="font-bold underline text-blue-600">{item.title}</p>
                  {item.category_name && (
                    <div className="opacity-70 pointer-events-none text-xs">
                      {item.category_name}
                    </div>
                  )}
                </ResourceItem>
              );
            }}
          />
        </Card>
      </Modal.Section>
    </Modal>
  )
}