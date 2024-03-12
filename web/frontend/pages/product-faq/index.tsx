import { Badge, BlockStack, Page } from "@shopify/polaris";
import {
  QuestionMarkMinor,
  StatusActiveMajor,
  CircleDisabledMajor,
  ProductsMajor,
} from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import ChooseProducts from "./modules/ChooseProducts";
import ChooseFaqs from "./modules/ChooseFaqs";
import ProductFaqsRelationships from "./modules/ProductFaqsRelationships";
import { ESessionStorageKeys } from "../../@type/common";
import "../../assets/css/product-faqs.css";
import { useUpdateFaqsMorePageSettingApi } from "../../hook/api/faqs_more_page_setting";
import { useAppContext } from "../../hook";
import { useNavigate } from "react-router-dom";
import {
  ProductFaqs,
  ProductSelected,
  ProductUpdate,
} from "../../@type/product_faqs";
import {
  useCreateProductsApi,
  useGetProductFaqsApi,
  useUpdateProductFaqsApi,
} from "../../hook/api/product_faqs";
import { setProduct, setProductFaqs } from "../store/actions";
import { ProductApi } from "../../@type/product";
import { useGetProductsApi } from "../../hook/api/product";
import { BannerWithDismiss } from "@/components/component/BannerWithDismiss";

const ProductFaq = () => {
  let listProductUpdate: ProductUpdate[] = [];
  const [isActiveProductFaqs, setIsActiveProductFaqs] = useState<boolean>(true);
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [listProductShow, setListProductShow] = useState<ProductSelected[]>([]);
  const { data: productFaqsData, refetch } = useGetProductFaqsApi();
  const { data: productData, refetch: refetchProduct } = useGetProductsApi();
  const { mutate: mutationUpdateProductFaqs } = useUpdateProductFaqsApi();
  const { mutate: createProducts } = useCreateProductsApi();
  const [listFaqsUpdate, setListFaqsUpdate] = useState<ProductFaqs[]>([]);
  const { mutate: mutateUpdateStatus, isLoading: updateStatusLoading } =
    useUpdateFaqsMorePageSettingApi();

  useEffect(() => {
    if (productData) {
      dispatch(setProduct(productData));
    }
  }, [dispatch, productData]);

  useEffect(() => {
    if (productFaqsData) {
      dispatch(setProductFaqs(productFaqsData));
    }
  }, [dispatch, productFaqsData]);

  const selectProductsProps = {
    listProductShow,
    setListProductShow,
  };

  const selectFaqsProps = {
    listFaqsUpdate,
    setListFaqsUpdate,
  };

  const submit = () => {
    if (
      (listProductShow.length === 0 && !state.all_product) ||
      listFaqsUpdate.length < 1
    ) {
      return;
    }

    listProductUpdate = [];
    listProductShow.forEach((item) => {
      listProductUpdate.push({
        product_id: parseInt(item.id.toString()),
        product_title: item.name,
        product_image: item.url,
      });
    });

    if (state.all_product && state.all_product?.length > 0) {
      state.all_product.forEach((item) => {
        let foundElement = listProductUpdate.find((product) => {
          return product.product_id === item.product_id;
        });

        if (foundElement) {
          listProductUpdate = listProductUpdate.filter((item) => {
            return item.product_id !== foundElement?.product_id;
          });
        }
      });
    }

    createProducts(listProductUpdate, {
      onSuccess: (data) => {
        refetchProduct();
        setListProductShow([]);
        let stateProduct: ProductApi = [];

        if (state.all_product && state.all_product?.length > 0) {
          state.all_product?.forEach((item) => {
            stateProduct.push(item);
          });
        }

        if (data && data.length > 0) {
          data.forEach((item) => {
            stateProduct.push(item);
          });
        }

        dispatch(setProduct(stateProduct));
        let faqsUpdate: ProductFaqs[] = [];
        stateProduct.forEach((item) => {
          listFaqsUpdate.forEach((element) => {
            faqsUpdate.push({
              ...element,
              product_id: item.id,
            });
          });
        });

        const [resultArray1] = deleteCommonObjects(
          faqsUpdate,
          state.faq_product || []
        );

        if (resultArray1.length > 0) {
          updateProductFaqs(resultArray1);
        }
      },
    });
  };

  function updateProductFaqs(data: ProductFaqs[]) {
    mutationUpdateProductFaqs(data, {
      onSuccess: (dataProductFaqs) => {
        let stateProductFaqs: ProductFaqs[] = [];

        if (state.faq_product && state.faq_product?.length > 0) {
          state.faq_product?.forEach((item) => {
            stateProductFaqs.push(item);
          });
        }

        if (dataProductFaqs && dataProductFaqs.length > 0) {
          dataProductFaqs.forEach((item) => {
            stateProductFaqs.push(item);
          });
        }
        refetch();
        dispatch(setProductFaqs(stateProductFaqs));
      },
    });
  }

  function deleteCommonObjects(
    faqs_update: ProductFaqs[],
    faq_product: ProductFaqs[]
  ) {
    const setListId = new Set(
      faq_product.map((obj) => obj["product_id"] && obj["faq_id"])
    );
    const resultArr1 = faqs_update.filter(
      (obj) =>
        !setListId.has(obj["product_id"]) && !setListId.has(obj["faq_id"])
    );

    return [resultArr1];
  }

  const changeProductFaqsStatus = () => {
    const dataUpdate = {
      id: state.faq_more_page_setting[0]?.id,
      user_id: parseInt(state.user.id),
      product_page_visible: !isActiveProductFaqs,
    };
    mutateUpdateStatus(dataUpdate, {
      onSuccess: () => {
        setIsActiveProductFaqs(!isActiveProductFaqs);
      },
    });
  };

  return (
    <Page
      title="Product FAQs"
      titleMetadata={
        isActiveProductFaqs ? (
          <Badge tone="success">Active</Badge>
        ) : (
          <Badge tone="attention">Inactive</Badge>
        )
      }
      primaryAction={{
        content: "Save",
        onAction: () => {
          submit();
        },
      }}
      secondaryActions={[
        {
          content: isActiveProductFaqs ? "Deactivate" : "Active",
          onAction: () => {
            changeProductFaqsStatus();
          },
          loading: updateStatusLoading,
          icon: isActiveProductFaqs ? CircleDisabledMajor : StatusActiveMajor,
        },
        {
          content: "Add Product FAQs block",
          onAction: () => {
            navigate("/documents/add-faq-to-product-page");
          },
          icon: QuestionMarkMinor,
        },
      ]}
    >
      <BannerWithDismiss
        icon={ProductsMajor}
        title="Product Faqs Overview"
        sessionKey={ESessionStorageKeys.SSK_PRODUCT_BANNER}
      >
        <p>
          If you would like to show faqs on product page, please implement
          configuration on this. Anymore, don't forget to add a faq block to
          product details. Note this only works with Online Store 2.0 compatible
          themes.
        </p>
      </BannerWithDismiss>
      <BlockStack gap={"400"}>
        <ChooseProducts {...selectProductsProps}></ChooseProducts>
        <ChooseFaqs {...selectFaqsProps}></ChooseFaqs>
        <ProductFaqsRelationships
          refetch={refetch}
          refetchProduct={refetchProduct}
        ></ProductFaqsRelationships>
      </BlockStack>
    </Page>
  );
};

export default ProductFaq;
