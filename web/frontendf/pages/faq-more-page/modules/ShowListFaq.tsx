import { BlockStack, Button, Tooltip } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../hook";
// import { FaqsIdString } from "../../../@type/faq";
import {
  FaqMorePageProps,
  FaqMorePageUpdateApi,
} from "../../../@type/faq_more_page";
import { DeleteMajor } from "@shopify/polaris-icons";
import { useDeleteFaqMorePageApi } from "../../../hook/api/faq_more_page";

export default function ShowListFaq(props: FaqMorePageProps) {
  const { state } = useAppContext();
  const { mutate } = useDeleteFaqMorePageApi()
  const [ indexProductFaqHover, setIndexProductFaqHover ] = useState<number>(-1)
  const [faqsMorePage, setFaqsMorePageData] = useState<FaqMorePageUpdateApi[]>(
    []
  );
  const [faqSelected, setFaqsMorePageSelected] = useState<
    FaqMorePageUpdateApi[]
  >([]);

  useEffect(() => {
    let newFaqs: FaqMorePageUpdateApi[] = [];

    if (!(props.faqsMorePageSelected && (props.faqsMorePageSelected.length > 0))) {
      setFaqsMorePageSelected([]);
      return;
    }

    props.faqsMorePageSelected?.forEach((item) => {
      newFaqs.push({
        ...item,
        faq_id: item.faq_id,
        category_name: "",
        faq_title: item.faq_title,
      });
    });

    if (
      state.categories &&
      state.categories.length > 0 &&
      newFaqs &&
      newFaqs.length > 0
    ) {
      state.categories.forEach((category) => {
        newFaqs?.forEach((faq) => {
          if (category.identify === faq.category_identify) {
            faq.category_name = category.title || "";
          }
        });
      });
    }

    const [resultArray1] = deleteCommonObjects(newFaqs, faqsMorePage);

    if (resultArray1.length > 0) {
      setFaqsMorePageSelected(
        resultArray1.filter((item) => item.page_name === props.pageSelected)
      );
      props.setFaqsMorePageSelected(
        resultArray1.filter((item) => item.page_name === props.pageSelected)
      );
    }
  }, [
    faqsMorePage,
    props,
    props.faqsMorePageSelected,
    props.pageSelected,
    state.categories,
  ]);

  function deleteCommonObjects(
    new_faqs: FaqMorePageUpdateApi[],
    faqs_more_page: FaqMorePageUpdateApi[]
  ) {
    const setListId = new Set(faqs_more_page.map((obj) => obj["faq_id"]));
    const result = new_faqs.filter((obj) => !setListId.has(obj["faq_id"]));

    return [result];
  }

  useEffect(() => {
    let newFaqs: FaqMorePageUpdateApi[] = [];

    if (state.faq_more_page && state.faq_more_page.length > 0) {
      state.faq_more_page
        ?.filter((item) => item.page_name === props.pageSelected)
        .forEach((item) => {
          newFaqs.push({
            ...item,
            faq_id: item.faq_id,
            category_name: "",
            faq_title: item.faq_title,
          });
        });
    }

    if (newFaqs.length === 0) return;

    if (state.faqs && state.faqs.length > 0) {
      state.faqs.forEach((item) => {
        newFaqs.forEach((faq) => {
          if (item.id === faq.faq_id) {
            faq.faq_title = item.title || "";
          }
        });
      });
    }

    if (state.categories && state.categories.length > 0) {
      state.categories.forEach((category) => {
        newFaqs.forEach((faq) => {
          if (category.identify === faq.category_identify) {
            faq.category_name = category.title || "";
          }
        });
      });
    }
    setFaqsMorePageData(
      newFaqs.filter((item) => item.page_name === props.pageSelected)
    );
  }, [props.pageSelected, state.categories, state.faq_more_page, state.faqs]);

  const deleteFaqMorePageRelationship = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        props.refetch()
      }
    })
  }

  return (
    <BlockStack gap={"200"}>
      {faqsMorePage.map((item, index) => (
        <div
          key={index}
          className="flex justify-between border p-2 rounded-[8px]"
        >
          <div>
            <p className="font-bold text-blue-600">{item.faq_title}</p>
            {item.category_name && (
              <div className="opacity-70 pointer-events-none text-xs">
                {item.category_name}
              </div>
            )}
          </div>
          <div>
            <Tooltip content="Delete">
              <div
              onClick={() =>
                deleteFaqMorePageRelationship(item.id?.toString() || '')
              }
              onMouseOver={() => setIndexProductFaqHover(index)}
              onMouseOut={() => setIndexProductFaqHover(-1)}
              >
                <Button
                  tone={
                    indexProductFaqHover === index
                      ? "critical"
                      : "success"
                  }
                  icon={DeleteMajor}
                ></Button>
              </div>
            </Tooltip>
          </div>
        </div>
      ))}


      {faqSelected.map((item, index) => (
        <div
          key={index}
          className="flex justify-between border p-2 rounded-[8px]"
        >
          <div>
            <p className="font-bold text-blue-600">{item.faq_title}</p>
            {item.category_name && (
              <div className="opacity-70 pointer-events-none text-xs">
                {item.category_name}
              </div>
            )}
          </div>
          <div>
            <Tooltip content="Delete">
              <div
              // onClick={() =>
              //   deleteProductFaqRelationship(
              //     item.id.toString(),
              //     item.product_id || 0
              //   )
              // }
              // onMouseOver={() => setIndexProductFaqHover(index)}
              // onMouseOut={() => setIndexProductFaqHover(-1)}
              >
                <Button
                  // tone={
                  //   indexProductFaqHover === index
                  //     ? "critical"
                  //     : "success"
                  // }
                  icon={DeleteMajor}
                ></Button>
              </div>
            </Tooltip>
          </div>
        </div>
      ))}
    </BlockStack>
  );
}
