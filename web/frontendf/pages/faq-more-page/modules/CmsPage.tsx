import { Checkbox, Button } from "@shopify/polaris";
import { FaqMorePageProps } from "../../../@type/faq_more_page";
import ShowListFaq from "./ShowListFaq";

export default function CmsPage(props: FaqMorePageProps) {

  return (
    <div>
       <div className="flex items-center justify-between">
        <Checkbox
          label="FAQs on Cms page"
          checked={props.cmsPageVisible}
          onChange={(value) => props.setCmsPageVisible(value)}
        />
        <Button onClick={() => props.setShowModal(true)} variant='primary'>Add Faqs</Button>
      </div>
      <div className="mt-3">
        <ShowListFaq {...props}></ShowListFaq>
      </div>
    </div>
  )
}