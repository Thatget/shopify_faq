import {
  IndexTable,
  Card,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  IndexFiltersMode,
  Thumbnail,
  Button,
  Modal,
  BlockStack,
  Tooltip,
} from "@shopify/polaris";
import type { TabProps } from "@shopify/polaris";
import {
  useState,
  useCallback,
  SyntheticEvent,
  useEffect,
} from "react";
import { DeleteMajor } from "@shopify/polaris-icons";
import { useAppContext } from "../../../hook";
import { ProductIdStringApi } from "../../../@type/product";
import { ProductFaqs } from "../../../@type/product_faqs";
import {
  useDeleteProductFaqRelationship,
  useDeleteProductFaqsApi,
} from "../../../hook/api/product_faqs";

type ProductFaqsRelationship = {
  faq_id: number;
  id: number;
  faq_title?: string;
  category_title?: string;
  category_identify?: string;
  product_id?: number;
};

type Props = {
  refetch: () => void;
  refetchProduct: () => void;
};

export default function ProductFaqsRelationships(props: Props) {
  const tabs: TabProps[] = [];
  const [selected, setSelected] = useState(0);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
  const onHandleCancel = () => {};
  const [queryValue, setQueryValue] = useState<string | undefined>(undefined);
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const { state } = useAppContext();
  const [products, setProducts] = useState<ProductIdStringApi>([]);
  const [productFaqs, setProductFaqs] = useState<ProductFaqs[]>(
    state.faq_product || []
  );
  const [productFaqsRelationships, setProductFaqsRelationships] = useState<
    ProductFaqsRelationship[]
  >([]);
  const [indexProductFaqHover, setIndexProductFaqHover] = useState<number>();
  const [indexProductHover, setIndexProductHover] = useState<number>();
  const { mutate: mutateDeleteProduct } = useDeleteProductFaqsApi();
  const { mutate: mutateDeleteProductFaqRelationship } =
    useDeleteProductFaqRelationship();
  const [productId, setProductId] = useState<string>('');
  const deleteProductFaqRelationship = (id: string, product_id: number) => {
    mutateDeleteProductFaqRelationship(id, {
      onSuccess: () => {
        props.refetch();
      },
    });
  };

  useEffect(() => {
    if (productId && productFaqs) {
      openModal(productId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, productFaqs]);

  const deleteProduct = (id: string) => {
    mutateDeleteProduct(id, {
      onSuccess: () => {
        props.refetch();
        props.refetchProduct();
      },
    });
  };

  useEffect(() => {
    if (state.faq_product) {
      setProductFaqs(state.faq_product);
    }
  }, [productId, state.faq_product]);

  useEffect(() => {
    if (state.all_product) {
      let product: ProductIdStringApi = [];
      state.all_product.forEach((item) => {
        product.push({
          product_image: item.product_image || "",
          product_id: item.product_id,
          product_title: item.product_title,
          user_id: item.user_id,
          id: item.id ? item.id.toString() : "",
        });
      });
      setProducts(product);
    }
  }, [state.all_product]);

  const openModal = (product_id: string) => {
    const listProductFaqsFilter = productFaqs.filter(
      (item) => item.product_id?.toString() === product_id
    );
    let productFaqsRelationship: ProductFaqsRelationship[] = [];

    state.faqs.forEach((item) => {
      listProductFaqsFilter.forEach((element) => {
        if (item.id === element.faq_id) {
          productFaqsRelationship.push({
            id: element.id || 0,
            category_identify: element.category_identify,
            faq_id: item.id,
            product_id: element.product_id,
          });
        }
      });
    });

    productFaqsRelationship.forEach((item) => {
      state.faqs.forEach((element) => {
        if (item.faq_id === element.id) {
          item.faq_title = element.title;
        }
      });
    });

    productFaqsRelationship.forEach((item) => {
      state.categories.forEach((element) => {
        if (item.category_identify === element.identify) {
          item.category_title = element.title;
        }
      });
    });
    setProductFaqsRelationships(productFaqsRelationship);
  };

  const handleQueryValueChange = useCallback(
    (value: string) => setQueryValue(value),
    []
  );

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products);

  const promotedBulkActions = [
    {
      content: "Delete Products",
      onAction: () => console.log("Todo: implement bulk edit"),
    },
  ];

  const rowMarkup = products?.map((product, index) => (
    <IndexTable.Row
      id={product.id?.toString() || ""}
      key={product.id?.toString() || ""}
      selected={selectedResources.includes(product.id?.toString() || "")}
      position={index}
    >
      <IndexTable.Cell>
        <Thumbnail
          source={product.product_image || ""}
          alt="Black choker necklace"
        />
      </IndexTable.Cell>
      <IndexTable.Cell>{product.product_title}</IndexTable.Cell>
      <IndexTable.Cell>
        <div className="flex justify-center">
          <p
            onClick={(event: SyntheticEvent) => {
              event.stopPropagation();
              setProductId(product.id)
              openModal(product.id);
              handleChange();
            }}
          >
            <Button>Show & Rearrange Faqs</Button>
          </p>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div className="flex justify-center">
          <Tooltip content="Delete">
            <div
              onMouseOver={() => setIndexProductHover(index)}
              onMouseOut={() => setIndexProductHover(-1)}
              onClick={(event: SyntheticEvent) => {
                event.stopPropagation();
                deleteProduct(product.id);
              }}
            >
              <Button
                tone={indexProductHover === index ? "critical" : "success"}
                icon={DeleteMajor}
              ></Button>
            </div>
          </Tooltip>
        </div>
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      {products && products?.length > 0 && (
        <Card padding={"0"}>
          <IndexFilters
            queryValue={queryValue}
            queryPlaceholder="Searching in all"
            onQueryChange={handleQueryValueChange}
            onQueryClear={() => setQueryValue("")}
            cancelAction={{
              onAction: onHandleCancel,
              disabled: false,
              loading: false,
            }}
            tabs={tabs}
            selected={selected}
            onSelect={setSelected}
            canCreateNewView
            filters={[]}
            onClearAll={() => {}}
            mode={mode}
            setMode={setMode}
          />
          <IndexTable
            promotedBulkActions={promotedBulkActions}
            resourceName={resourceName}
            itemCount={products?.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "" },
              { title: "Product Title" },
              { title: "Embedded FAQs", alignment: "center" },
              { title: "Action", alignment: "center" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
          <div>
            <Modal
              open={active}
              onClose={handleChange}
              title="Product title....."
            >
              <Modal.Section>
                <div>
                  <BlockStack gap="300">
                    {productFaqsRelationships.map((item, index) => (
                      <div
                        key={item.id}
                        className="border rounded p-2 flex justify-between items-center"
                      >
                        <div>
                          <p className="">{item.faq_title}</p>
                          <div className="opacity-70 pointer-events-none">
                            <p className="text-xs text-teal-700">
                              {item.category_title}
                            </p>
                          </div>
                        </div>
                        <Tooltip content="Delete">
                          <div
                            onClick={() =>
                              deleteProductFaqRelationship(
                                item.id.toString(),
                                item.product_id || 0
                              )
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
                    ))}
                  </BlockStack>
                </div>
              </Modal.Section>
            </Modal>
          </div>
        </Card>
      )}
    </>
  );
}
