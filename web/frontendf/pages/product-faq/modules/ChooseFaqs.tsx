import {
  Card,
  ResourceList,
  ResourceItem,
  ResourceListProps,
} from "@shopify/polaris";
import { useEffect, useState } from "react";
import { ProductFaqs } from "../../../@type/product_faqs";
import { useAppContext } from "../../../hook";
import { FaqsIdString } from "../../../@type/faq";

type ChooseFaqsProps = {
  listFaqsUpdate: ProductFaqs[];
  setListFaqsUpdate: (listFaqsUpdate: ProductFaqs[]) => void;
};

export default function ChooseFaqs(props: ChooseFaqsProps) {
  const { state } = useAppContext();
  const [faqs, setFaqsData] = useState<FaqsIdString[]>([]);

  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);

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

  useEffect(() => {
    if (selectedItems && state.faqs.length > 0 && state.faqs) {
      let listFaqs: ProductFaqs[] = [];
      state.faqs.forEach((item) => {
        if (selectedItems.indexOf(item.id?.toString() || "") !== -1) {
          listFaqs.push({
            category_identify: item.category_identify || "",
            faq_id: item.id || 0,
            faq_identify: item.identify || "",
          });
        }
      });
      props.setListFaqsUpdate(listFaqs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems, state.faqs]);

  return (
    <Card padding={"0"}>
      <div
        className="p-4 w-full"
        style={{ borderBottom: "1px solid rgb(229 229 229)" }}
      >
        <b>Choose Faqs</b>
      </div>
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
  );
}
