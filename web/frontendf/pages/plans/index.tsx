import { Page } from "@shopify/polaris";
import PlanList from "./modules/Plans";
import Reviews from "./modules/Review";

export default function Plans () {
  return (
    <Page title={'Plans'}>
      <div className="flex flex-col h-[3rem] text-center justify-between mb-8">
        <p className="text-[1.5rem] font-bold">
          FAQs Professional Pro Plans
        </p>
        <p className="text-[1rem] font-bold">
          07-day free trial with any plan
        </p>
      </div>
      <PlanList></PlanList>
      <Reviews></Reviews>
    </Page>
  )
}