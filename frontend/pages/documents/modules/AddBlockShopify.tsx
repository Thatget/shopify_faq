import imageStep1 from "../../../assets/images/add-block-shopify/Step-1.png";
import imageStep1_1 from "../../../assets/images/add-block-shopify/Step-1-1.png";
import imageStep2 from "../../../assets/images/add-block-shopify/Step-2.png";
import imageStep3 from "../../../assets/images/add-block-shopify/Step-3.png";
import { useAppContext } from "../../../hook";
import React from "react";

export default function AddBlockShopify() {
  const { state } = useAppContext();

  return (
    <div className="flex items-center text-sm">
      <div className="bg-white m-auto">
        <div className="border-b pb-3">
          <p className="font-bold text-lg mb-3">Add Product FAQs block</p>
          <span className="fs-6">
            Your published theme supports app blocks on the Product page. This
            makes installation a breeze! Alternatively we provide instructions
            for legacy themes at the bottom. If you need help,{" "}
            <b style={{ color: "#ff8200", cursor: "pointer" }}>
              Contact with us
            </b>{" "}
            or email <b><a style={{ color: '#ff8200' }} href="mailto:support@yanet.io">support@yanet.io</a></b> for assistance.
          </span>
        </div>
        <div className="py-3 border-b">
          <p className="text-md">
            <b>Step 1: </b>
          </p>
          <span>
            From the shopify sidebar navigate to{" "}
            <b>
              {" "}
              Sales Channels {">"} Online Store {">"} Themes
            </b>
            .{" "}
            <a
              href={`https://${state.user.shopify_domain}/admin/themes/current/editor?template=product&activateAppId=3c16d53e-037f-4a3a-abf1-e054532428ff/app-block`}
              target="_blank"
              rel="noreferrer"
            >
              Go to theme editor{" "}
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </span>
          <img src={imageStep1} className="w-full my-3" alt="" />
          <span>
            Find the theme you wish to add our block to and click Customize.
          </span>
          <img src={imageStep1_1} className="w-full my-3" alt="" />
        </div>
        <div className="py-3 border-b">
          <p className="text-md">
            <b>Step 2: </b>
          </p>
          <span>
            From the top bar select the template you wish to add our block to.
            Most commonly this will be the default product template. We support
            product, collection, home, cart and page templates.{" "}
          </span>
          <img src={imageStep2} className="w-full my-3" alt="" />
        </div>
        <div className="py-3">
          <p className="text-md">
            <b>Step 3: </b>
          </p>
          <span>
            Find the section you wish to add our block to and click{" "}
            <b>Add block</b>. In the apps section of the add block popup you
            will find the <b>Yanet Professional FAQs</b> block. Click to add it
            and <b>Save</b>.
          </span>
          <img src={imageStep3} className="w-full mt-3" alt="" />
        </div>
      </div>
    </div>
  );
}
