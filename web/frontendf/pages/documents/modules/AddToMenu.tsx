import React from "react";
import { useAppContext } from "../../../hook";
import imageMenu1 from "../../../assets/images/add-block-shopify/Menu-item-1.png";
import imageMenu2 from "../../../assets/images/add-block-shopify/Menu-item-2.png";
import imageMenu3 from "../../../assets/images/add-block-shopify/Menu-item-3.png";

export default function AddToMenu() {
  const { state } = useAppContext()

  return (
    <div className="bg-white">
      <div className="">
        <div className="border-b mb-3 pb-3">
          <p className="font-bold text-lg">Add FAQ page to your store navigation/menu.</p>
        </div>
        <div className="mb-4">
          <p>
            <b className="text-base">Step 1: </b>
            <span>Visit your store admin panel. </span> 
            <a target={"_blank"} href={`https://${state.user.shopify_domain}/admin/menus`} rel="noreferrer">
              Go to store admin{" "}
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </p>
        </div>
        <div className="mb-4">
          <p>
            <b className="text-base">Step 2: </b>
            <span>
              Click on <b>"Online store"</b>
              <b>"Navigation"</b> from left side menu and <b></b>click on{" "}
              <b>"Main menu"</b> or <b>"Footer menu"</b> where you would like to
              add FAQs page
            </span>
          </p>
          <img src={imageMenu1} className="w-100 my-3" alt="" />
        </div>
        <div className="mb-4">
          <b className="text-base">Step 3: </b> Click <b>"Add menu item"</b>.
          <img src={imageMenu2} className="w-100 mb-3 mt-2" alt="" />
        </div>
        <div className="mb-4">
          <p>
            <b className="text-base">Step 4:</b> Enter a menu name you would like
            along with your FAQ page URL which you got from app and click{" "}
            <b>"Add" {' '}</b>
            <span className="text-center">
              (FAQ page Url:{" "}
              <a
                target={"_blank"}
                href="https://742b5e-2.myshopify.com/apps/faqs"
                rel="noreferrer"
              >
                https://742b5e-2.myshopify.com/apps/faqs {" "}
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>{" "}
              or <b>/apps/faqs</b> )
            </span>
          </p>
          <img src={imageMenu3} className="w-100 mb-3 mt-2" alt="" />
        </div>
        <p>
          <b className="text-base">Step 5: </b>Final click <b>"Save"</b> on{" "}
          <b>"Main menu"</b> page and you should be all set.
        </p>
      </div>
    </div>
  );
}
