import {
  ResourceList,
  ResourceItem,
  Text,
  Button,
  Card,
  Thumbnail,
  Modal,
  IndexTable,
  IndexFilters,
  useSetIndexFiltersMode,
  IndexFiltersMode,
  useBreakpoints,
  useIndexResourceState,
  Pagination,
} from "@shopify/polaris";
import type { ResourceListProps, TabProps } from "@shopify/polaris";
import { AddProductMajor } from "@shopify/polaris-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useGetProductsShopifyApi,
  useSearchProductsShopifyApi,
} from "../../../hook/api/product_faqs";
import {
  ProductShopify,
  ProductsSearchApi,
  ProductShopifyIdString,
} from "../../../@type/product";
import { debounce, isEmpty } from "lodash-es";
import {
  ProductSelected,
  ProductSelectedString,
} from "../../../@type/product_faqs";

type ChooseProductProps = {
  listProductShow: ProductSelected[];
  setListProductShow: (listProductSelected: ProductSelected[]) => void;
};

export default function ChooseProducts(props: ChooseProductProps) {
  const limit = "50";
  const [page, setPage] = useState<number>(1);
  const [cursor] = useState("");
  const [countProducts, setCountProducts] = useState<number>(0);
  const tabs: TabProps[] = [];
  const [selected, setSelected] = useState(0);
  const [pageInfo, setPageInfo] = useState<string>();
  const [queryValue, setQueryValue] = useState<string | undefined>(undefined);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Filtering);
  const [filterQueryData, setFilterQueryData] = useState<string | undefined>();
  const [active, setActive] = useState(false);
  const [productsShopify, setProductsShopify] = useState<ProductShopify[]>([]);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);
  const [productsSearch, setProductsSearch] = useState<ProductsSearchApi>();
  const [productsShopifyIdString, setProductsShopifyIdString] = useState<
    ProductShopifyIdString[]
  >([]);
  let listProducts: ProductSelectedString[] = [];
  const [selectedItems, setSelectedItems] = useState<
    ResourceListProps["selectedItems"]
  >([]);

  const { data } = useGetProductsShopifyApi({
    limit: limit,
    page_info: pageInfo,
  });

  if (props.listProductShow.length > 0) {
    props.listProductShow.forEach((item) => {
      listProducts.push({
        ...item,
        id: item.id.toString(),
      });
    });
  }

  const { data: dataProductSearch, isLoading: searchProductLoading } =
    useSearchProductsShopifyApi({
      limit: limit,
      title: filterQueryData,
      cursor: cursor,
    });

  const onHandleCancel = () => {
    setQueryValue("");
    setFilterQueryData("");
  };

  const debounceEnterName = useRef(
    debounce((name: string) => {
      setFilterQueryData(name);
    }, 500)
  ).current;

  const handleQueryValueChange = useCallback(
    (value: string) => {
      setQueryValue(value);
      debounceEnterName(value);
    },
    [debounceEnterName]
  );

  useEffect(() => {
    if (dataProductSearch) {
      setProductsSearch(dataProductSearch);
    }
  }, [dataProductSearch]);

  useEffect(() => {
    if (productsShopify) {
      let productShopifyNew: ProductShopifyIdString[] = [];
      productsShopify.forEach((item) => {
        productShopifyNew.push({
          ...item,
          id: item.id.toString(),
        });
      });
      setProductsShopifyIdString(productShopifyNew);
    }
  }, [productsShopify]);

  useEffect(() => {
    if (
      data &&
      data.products &&
      data.products.products &&
      data.products.products?.length > 0
    ) {
      setProductsShopify(data?.products.products);
      setCountProducts(data?.count?.count || 0)
    }
    if (data?.paginate) {
      setHasNext(isEmpty(data.paginate.next) ? false : true);
      setHasPrevious(isEmpty(data.paginate.previous) ? false : true);
    }
  }, [data, data?.paginate, data?.products.products]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(productsShopifyIdString);

  const toggleModalProduct = useCallback(() => {
    
    setActive(!active);
  }, [active]);

  const resourceName = { singular: "product", plural: "products" };

  const addProducts = () => {
    let productAddItem: ProductSelected[] = [];

    if (selectedResources.length <= 0) {
      toggleModalProduct();
      return;
    }

    if (!filterQueryData && productsShopifyIdString.length > 0) {
      productsShopifyIdString.forEach((item) => {
        selectedResources.forEach((id) => {
          if (item.id.toString().replace("gid://shopify/Product/", "") === id) {
            productAddItem.push({
              id: parseInt(
                item.id.toString().replace("gid://shopify/Product/", "")
              ),
              url: item.images.length > 0 ? item.images[0].src : "",
              name: item.title,
            });
          }
        });
      });
    } else if (
      filterQueryData &&
      productsSearch &&
      productsSearch?.edges.length > 0
    ) {
      productsSearch?.edges.forEach((item) => {
        selectedResources.forEach((id) => {
          if (item.node.id === id) {
            productAddItem.push({
              id: parseInt(item.node.id),
              url: item.node.images.edges[0].node.url,
              name: item.node.title,
            });
          }
        });
      });
    }
    let uniqueArray = productAddItem.filter((value, index, self) => {
      return index === self.findIndex((obj) => obj.id === value.id);
    });
    props.setListProductShow(uniqueArray);
    toggleModalProduct();
  };

  const rowMarkup = !(filterQueryData && filterQueryData?.length > 0)
    ? productsShopifyIdString.map((product, index) => (
        <IndexTable.Row
          id={product.id.toString()}
          key={product.id.toString()}
          selected={selectedResources.includes(product.id.toString())}
          position={index}
        >
          <IndexTable.Cell>
            <Thumbnail
              source={product.images[0] ? product.images[0].src : ""}
              alt="Black choker necklace"
            />
          </IndexTable.Cell>
          <IndexTable.Cell>{product.title}</IndexTable.Cell>
        </IndexTable.Row>
      ))
    : productsSearch?.edges.map((product, index) => (
        <IndexTable.Row
          id={product.node.id.replace("gid://shopify/Product/", "")}
          key={product.node.id.replace("gid://shopify/Product/", "")}
          selected={selectedResources.includes(
            product.node.id.replace("gid://shopify/Product/", "")
          )}
          position={index}
        >
          <IndexTable.Cell>
            <Thumbnail
              source={
                product.node.images.edges[0]
                  ? product.node.images.edges[0].node.url
                  : ""
              }
              alt="Black choker necklace"
            />
          </IndexTable.Cell>
          <IndexTable.Cell>{product.node.title}</IndexTable.Cell>
        </IndexTable.Row>
      ));

  const removeProducts = () => {
    let newListProductShow: ProductSelected[] = props.listProductShow;

    if (selectedItems?.length) {
      for (let i = 0; i <= selectedItems.length; i++) {
        newListProductShow = newListProductShow.filter(
          (item) => item.id !== selectedItems[i]
        );
      }
    }
    setSelectedItems([]);
    props.setListProductShow(newListProductShow);
  };

  const promotedBulkActions = [
    {
      content: "Remove products",
      onAction: () => {
        removeProducts();
      },
    },
  ];

  return (
    <Card padding={"0"}>
      <div className="flex flex-col">
        <div
          style={{ borderBottom: "1px solid rgb(229 229 229)" }}
          className="flex justify-between items-center p-4"
        >
          <b>Choose Products</b>
          <Button onClick={toggleModalProduct} icon={AddProductMajor}>
            Add Products
          </Button>
        </div>
        <div
          className="scroll-bar-custom"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          <ResourceList
            resourceName={resourceName}
            items={listProducts}
            renderItem={renderItem}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            selectable
            promotedBulkActions={promotedBulkActions}
          />
        </div>
      </div>
      <div className="relative">
        <Modal
          open={active}
          onClose={toggleModalProduct}
          title="Add products"
          primaryAction={{
            content: "Add products",
            onAction: () => addProducts(),
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: toggleModalProduct,
            },
          ]}
        >
          <div className="select-products-shopify mb-4">
            <Modal.Section>
              <IndexFilters
                queryValue={queryValue}
                queryPlaceholder="Searching in all"
                onQueryChange={handleQueryValueChange}
                onQueryClear={() => {
                  setQueryValue("");
                  setFilterQueryData("");
                }}
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
                loading={searchProductLoading}
              />
              <IndexTable
                condensed={useBreakpoints().smDown}
                resourceName={resourceName}
                itemCount={productsShopifyIdString.length}
                selectedItemsCount={
                  allResourcesSelected ? "All" : selectedResources.length
                }
                onSelectionChange={handleSelectionChange}
                headings={[{ title: "" }, { title: "Product Title" }]}
              >
                {rowMarkup}
              </IndexTable>
            </Modal.Section>
          </div>
          { !filterQueryData && productsShopifyIdString.length > 0 && 
            <div className="product-paginate">
              <Pagination
                onPrevious={() => {
                  setPage((page) => page - 1);
                  setPageInfo(data?.paginate?.previous?.replace(/\s/g, ""));
                }}
                onNext={() => {
                  setPage((page) => page + 1);
                  setPageInfo(data?.paginate?.next?.replace(/\s/g, ""));
                }}
                type="table"
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                label={`${1 + parseInt(limit) * (page - 1)}-${
                  parseInt(limit) * page > (countProducts)
                    ? countProducts
                    : parseInt(limit) * page
                } of ${countProducts} products`}
              />
            </div>
          }
        </Modal>
      </div>
    </Card>
  );

  function renderItem(item: ProductSelectedString) {
    const { id, url, name } = item;
    const media = <Thumbnail source={url || ""} alt="Black choker necklace" />;

    return (
      <ResourceItem
        id={id}
        url={""}
        media={media}
        accessibilityLabel={`View details for ${name}`}
      >
        <Text variant="bodyMd" fontWeight="bold" as="h3">
          {name}
        </Text>
      </ResourceItem>
    );
  }
}
