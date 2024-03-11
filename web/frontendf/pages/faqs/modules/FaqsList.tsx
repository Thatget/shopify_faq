import {
  IndexTable,
  Card,
  useIndexResourceState,
  Badge,
  Icon,
  Checkbox,
  Tooltip,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { DeleteMajor } from "@shopify/polaris-icons";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../../hook";
import { Faq, FaqsApi } from "../../../@type/faq";
import {
  useDeleteFaqApi,
  useGetAllFaqsApi,
  useUpdateFaqApi,
} from "../../../hook/api/faqs";
import { setAllFaqs, setFaqs } from "../../store/actions";
import FaqsTableSkeleton from "./FaqTableSkeleton";

export function FaqsList() {
  const { state, defaultLocale, dispatch } = useAppContext();
  const [faqs, setFaqsData] = useState<FaqsApi>([]);
  const { data: allFaqs, isLoading, refetch } = useGetAllFaqsApi();
  // const { data } = useGetFaqsByLocaleApi("default");
  const { mutate: mutateUpdateFaq } = useUpdateFaqApi();
  const { mutate: mutateDeleteFaq } = useDeleteFaqApi();
  const [indexIconHover, setIndexIconHover] = useState<number>();

  useEffect(() => {
    if (allFaqs && allFaqs.length > 0) {
      let faqsData:FaqsApi = []
      allFaqs.forEach(item => {
        if(item.locale === "default") {
          faqsData.push({
            ...item,
            category_name: ''
          })
        }
      })
      dispatch(setAllFaqs(allFaqs));
      dispatch(setFaqs(faqsData));
      
      if(state.categories && state.categories.length > 0 && faqsData && faqsData.length > 0) {
        state.categories.forEach((category) => {
          faqsData.forEach((faq) => { 
            if (category.identify === faq.category_identify) {
              faq.category_name = category.title || '';
            }
          });
        });
      }
      setFaqsData(faqsData);
    }
  }, [allFaqs, dispatch, state.categories])

  const resourceName = {
    singular: "faq",
    plural: "faqs",
  };

  const navigate = useNavigate();
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(faqs);

  const visibleChange = useCallback(
    (faq: Faq) => {
      const dataUpdate = {
        ...faq,
      };
      dataUpdate.is_visible = !faq.is_visible;
      mutateUpdateFaq(dataUpdate, {
        onSuccess: () => {
          refetch();
        },
      });
    },
    [mutateUpdateFaq, refetch]
  );

  const deleteFaq = useCallback(
    (faq: Faq) => {
      mutateDeleteFaq(faq, {
        onSuccess: () => {
          refetch();
        },
      });
    },
    [mutateDeleteFaq, refetch]
  );

  const featureChange = useCallback(
    (faq: Faq) => {
      const dataUpdate = {
        ...faq,
      };
      dataUpdate.feature_faq = !faq.feature_faq;
      mutateUpdateFaq(dataUpdate, {
        onSuccess: () => {
          refetch();
        },
      });
    },
    [mutateUpdateFaq, refetch]
  );

  const rowMarkup = faqs.map((item, index) => (
    <IndexTable.Row
      id={item.id?.toString() || ""}
      key={item.id}
      selected={selectedResources.includes(item.id?.toString() || "")}
      position={index}
    >
      <IndexTable.Cell>
        <div
          onClick={(event: SyntheticEvent) => {
            event.stopPropagation();
            navigate(`/edit-faq/${item.id}`);
          }}
          className="cursor-pointer"
        >
          <p className="font-bold underline text-blue-600">{item.title} </p>
          {item.category_name && 
            <div className="opacity-70 pointer-events-none text-xs">
              {item.category_name}
            </div>
          }
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div
          className="flex justify-center"
          onClick={(event: SyntheticEvent) => {
            event.stopPropagation();
          }}
        >
          <Checkbox
            label=""
            checked={item.is_visible}
            onChange={() => visibleChange(item)}
          />
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div
          className="flex justify-center"
          onClick={(event: SyntheticEvent) => {
            event.stopPropagation();
          }}
        >
          <Checkbox
            label=""
            checked={item.feature_faq}
            onChange={() => featureChange(item)}
          />
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div className="flex justify-center">
          {state.all_faqs.map((itemFaqs, index) => (
            <div key={index}>
              {itemFaqs.category_identify === item.category_identify &&
                itemFaqs.identify === item.identify && (
                  <Badge progress="complete" tone="success">
                    {itemFaqs.locale === "default"
                      ? defaultLocale
                      : itemFaqs.locale}
                  </Badge>
                )}
            </div>
          ))}
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div className="flex justify-center">
          <Tooltip content="Delete">
            <div
              className={`cursor-pointer p-2 rounded-[6px] border ${
                indexIconHover === index
                  ? "border-red-400"
                  : ""
              }`}
              onMouseOver={() => setIndexIconHover(index)}
              onMouseOut={() => setIndexIconHover(-1)}
              onClick={(event: SyntheticEvent) => {
                event.stopPropagation();
                deleteFaq(item);
              }}
            >
                <Icon
                  source={DeleteMajor}
                  tone={indexIconHover === index ? "critical" : "base"}
                />
            </div>
          </Tooltip>
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      <Card padding={"0"}>
        {isLoading ? (
          <FaqsTableSkeleton></FaqsTableSkeleton>
        ) : (
          <IndexTable
            selectable={false}
            resourceName={resourceName}
            itemCount={faqs.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Title" },
              { title: "Visibility", alignment: "center" },
              { title: ("Widget"), alignment: "center" },
              { title: "Store languages", alignment: "center" },
              { title: "Actions", alignment: "center" },
            ]}
          >
            {isLoading ? <FaqsTableSkeleton></FaqsTableSkeleton> : rowMarkup}
          </IndexTable>
        )}
      </Card>
      <div className="text-center mt-3">
        View FAQs Page:{" "}
        <a
          href={`https://${state.user.shopify_domain}/${state.settings.faq_page_url}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          https://{state.user.shopify_domain}/{state.settings.faq_page_url}
        </a>
      </div>
    </>
  );
}
