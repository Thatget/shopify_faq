import { Card, Page } from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { QuestionMarkMinor } from "@shopify/polaris-icons";
import { ESessionStorageKeys } from "../../@type/common";
import { useEffect, useState } from "react";
import { FaqMorePageUpdateApi } from "../../@type/faq_more_page";
import CartPage from "./modules/CartPage";
import CmsPage from "./modules/CmsPage";
import CollectionPage from "./modules/CollectionPage";
import HomePage from "./modules/HomePage";
import { useAppContext } from "../../hook";
import {
  useGetFaqMorePagesApi,
  useUpdateFaqsMorePageApi,
} from "../../hook/api/faq_more_page";
import ChooseFaqs from "./modules/ChooseFaqs";
import { setFaqMorePage } from "../store/actions";
import { useUpdateFaqsMorePageSettingApi } from "../../hook/api/faqs_more_page_setting";
import { BannerWithDismiss } from "@/components copy/component/BannerWithDismiss";

export default function FaqMorePage() {
  const navigate = useNavigate();
  const { mutate, isLoading } = useUpdateFaqsMorePageApi();
  const { mutate: updateFaqMorePageSetting } =
    useUpdateFaqsMorePageSettingApi();
  const { state, dispatch } = useAppContext();
  const [pageSelected, setPageSelected] = useState<string>("home");
  const [homePageVisible, setHomePageVisible] = useState<boolean>(false);
  const [cartPageVisible, setCartPageVisible] = useState<boolean>(false);
  const [cmsPageVisible, setCmsPageVisible] = useState<boolean>(false);
  const [collectionPageVisible, setCollectionPageVisible] =
    useState<boolean>(false);
  const [faqMorePage, Data] = useState<FaqMorePageUpdateApi[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [faqsMorePageSelected, setFaqsMorePageSelected] = useState<
    FaqMorePageUpdateApi[]
  >([]);
  const { data: faqMorePageData, refetch } = useGetFaqMorePagesApi();

  useEffect(() => {
    if (faqMorePageData) {
      Data(faqMorePageData);
      dispatch(setFaqMorePage(faqMorePageData));
    }
  }, [dispatch, faqMorePageData]);

  useEffect(() => {
    const dataUpdate = {
      user_id: parseInt(state.user.id),
      cart_page_visible: cartPageVisible,
      cms_page_visible: cmsPageVisible,
      home_page_visible: homePageVisible,
      collection_page_visible: collectionPageVisible,
    };
    updateFaqMorePageSetting(dataUpdate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartPageVisible, cmsPageVisible, collectionPageVisible, homePageVisible]);

  useEffect(() => {
    if (state.faq_more_page_setting.length > 0) {
      setHomePageVisible(
        state.faq_more_page_setting[0]?.home_page_visible || false
      );
      setCartPageVisible(
        state.faq_more_page_setting[0]?.cart_page_visible || false
      );
      setCmsPageVisible(
        state.faq_more_page_setting[0]?.cms_page_visible || false
      );
      setCollectionPageVisible(
        state.faq_more_page_setting[0]?.collection_page_visible || false
      );
    }
  }, [state.faq_more_page_setting]);

  const props = {
    homePageVisible,
    cartPageVisible,
    cmsPageVisible,
    collectionPageVisible,
    faqMorePage,
    setCartPageVisible,
    setCmsPageVisible,
    setCollectionPageVisible,
    setFaqMorePage,
    setHomePageVisible,
    pageSelected,
    showModal,
    setShowModal,
    faqsMorePageSelected,
    setFaqsMorePageSelected,
    refetch
  };

  const Save = () => {
    console.log(faqsMorePageSelected, " faqsMorePageSelected");
    if (!(faqsMorePageSelected.length > 0)) {
      return;
    }

    mutate(faqsMorePageSelected, {
      onSuccess: () => {
        refetch();
        setFaqsMorePageSelected([]);
      },
    });
  };

  return (
    <>
      <Page
        title="Show FAQs on different pages of store"
        backAction={{ content: "", url: "/faqs" }}
        primaryAction={{
          content: "Save",
          onAction: () => Save(),
          loading: isLoading,
        }}
        secondaryActions={[
          {
            content: "Add Faqs block",
            icon: QuestionMarkMinor,
            onAction: () => navigate("/documents/add-faq-to-other-pages"),
          },
        ]}
      >
        <BannerWithDismiss
          icon={AlertMinor}
          title="FAQs on different pages of store"
          sessionKey={ESessionStorageKeys.SSK_FAQ_MORE_PAGE_BANNER}
        >
          <p>
            By default your FAQs get a dedicated page. Following feature allows
            you to show FAQs on other pages of your store. (ex. Homepage, Cart
            etc...). Note that this feature only works with Online Store 2.0
            compatible themes and don't forget to add a faq block to page
            detail.
          </p>
        </BannerWithDismiss>
        <Card>
          <div className="flex mb-3">
            <div
              className="px-2 py-1 cursor-pointer rounded-[8px] document-button"
              style={{
                backgroundColor: `${
                  pageSelected === "home" ? "#eeeeee" : "#fff"
                }`,
              }}
              onClick={() => {
                setPageSelected("home");
              }}
            >
              Add on Home page
            </div>
            <div
              className="ms-2 px-2 py-1 cursor-pointer rounded-[8px] document-button"
              style={{
                backgroundColor: `${
                  pageSelected === "cms" ? "#eeeeee" : "#fff"
                }`,
              }}
              onClick={() => {
                setPageSelected("cms");
              }}
            >
              Add on CMS page
            </div>
            <div
              className="ms-2 px-2 py-1 cursor-pointer rounded-[8px] document-button"
              style={{
                backgroundColor: `${
                  pageSelected === "cart" ? "#eeeeee" : "#fff"
                }`,
              }}
              onClick={() => {
                setPageSelected("cart");
              }}
            >
              Add on Cart page
            </div>
            <div
              className="ms-2 px-2 py-1 cursor-pointer rounded-[8px] document-button"
              style={{
                backgroundColor: `${
                  pageSelected === "collection" ? "#eeeeee" : "#fff"
                }`,
              }}
              onClick={() => {
                setPageSelected("collection");
              }}
            >
              Add on Collection page
            </div>
          </div>
          {pageSelected === "cart" && <CartPage {...props}></CartPage>}
          {pageSelected === "home" && <HomePage {...props}></HomePage>}
          {pageSelected === "collection" && (
            <CollectionPage {...props}></CollectionPage>
          )}
          {pageSelected === "cms" && <CmsPage {...props}></CmsPage>}
        </Card>
      </Page>
      <ChooseFaqs {...props}></ChooseFaqs>
    </>
  );
}
