import { Checkbox, Button } from "@shopify/polaris";
import { FaqMorePageProps } from "../../../@type/faq_more_page";
import ShowListFaq from "./ShowListFaq";

export default function CartPage(props: FaqMorePageProps) {

  return (
    <div>
       <div className="flex items-center justify-between">
        <Checkbox
          label="FAQs on Cart page"
          checked={props.cartPageVisible}
          onChange={(value) => props.setCartPageVisible(value)}
        />
        <Button onClick={() => props.setShowModal(true)} variant='primary'>Add Faqs</Button>
      </div>
      <div className="mt-3">
        <ShowListFaq {...props}></ShowListFaq>
      </div>
    </div>
  )
}