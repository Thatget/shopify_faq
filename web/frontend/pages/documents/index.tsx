import { Card, Page } from "@shopify/polaris";
import { Outlet, useNavigate } from "react-router-dom";
import "../../assets/css/document.css";

export default function Documents() {
  const navigate = useNavigate();

  return (
    <Page
      title="Documentations"
      backAction={{content: '', url: '/faqs'}}
    >
      <Card>
        <div className="flex mb-3">
          <div
            className='px-2 py-1 cursor-pointer rounded-[8px] document-button'
            style={{backgroundColor: `${window.location.pathname.includes('add-faq-page-to-menu')? '#eeeeee' : '#fff'}`}}
            onClick={() => {
              navigate("/documents/add-faq-page-to-menu");
            }}
          >
            Add Faq page to Menu
          </div>
          <div
            className="ms-2 px-2 py-1 cursor-pointer rounded-[8px] document-button"
            style={{backgroundColor: `${window.location.pathname.includes('add-faq-to-product-page')? '#eeeeee' : '#fff'}`}}
            onClick={() => {
              navigate("/documents/add-faq-to-product-page");
            }}
          >
            Add Product FAQs block
          </div>
          <div
            className="ms-2 px-2 py-1 cursor-pointer rounded-[8px] document-button"
            style={{backgroundColor: `${window.location.pathname.includes('add-faq-to-other-pages')? '#eeeeee' : '#fff'}`}}
            onClick={() => {
              navigate("/documents/add-faq-to-other-pages");
            }}
          >
            Add FAQs on other pages
          </div>
        </div>
        <Outlet></Outlet>
      </Card>
    </Page>
  );
}
