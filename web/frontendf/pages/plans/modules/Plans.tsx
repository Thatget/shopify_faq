import classNames from "classnames";
import { Plan, plans } from "../../../@type/plans";
import { Button, InlineGrid, List } from "@shopify/polaris";
import { useState } from "react";
import SelectPlan from "./SelectPlan";
import { useAppContext } from "../../../hook";

export default function PlanList() {
  const listPlans: Plan[] = plans;
  const [selectPlan, setSelectPlan] = useState(false);
  const [planFeature, setPlanFeature] = useState<Plan>();
  const { currentLevelPlan } = useAppContext();
  console.log(currentLevelPlan);
  const modalProps = {
    selectPlan,
    setSelectPlan,
    planFeature,
  };

  return (
    <>
      <InlineGrid gap="400" columns={{ md: 1, lg: 3 }}>
        {listPlans.map((plan, index) => (
          <div
            key={index}
            className={classNames(
              "p-6 rounded-[1rem] relative",
              currentLevelPlan === plan.level ? "bg-[#F1F8F5]" : "bg-white",
              {
                "border-[2px] border-solid border-[#007F5F]":
                currentLevelPlan === plan.level,
              }
            )}
          >
            <div className="flex flex-col text-center justify-between mb-[2.125rem]">
              <p className="uppercase mb-3 text-lg leading-[1.25rem] font-bold text-[var(--p-color-text)]">
                {plan.name}
              </p>
              <div className="leading-[1.5rem] my-2  flex items-center justify-center text-[#202223]">
                <span className="text-[1.5rem] font-bold">{plan.price}</span>
                &nbsp; &nbsp;
                <span className="text-[.8rem]">USD / mo</span>
              </div>
              <div>
                <Button
                  onClick={() => {
                    setSelectPlan(!selectPlan);
                    setPlanFeature(plan);
                  }}
                  disabled={currentLevelPlan === plan.level}
                  variant={
                    // currentLevelPlan === plan.level ? 
                    // "plain" : 
                    "primary"
                  }
                >
                  {`${
                    currentLevelPlan === plan.level
                      ? "Current plan"
                      : index === 0
                      ? "Continue with Free plan"
                      : "Start 07-day free trial"
                  }`}
                </Button>
              </div>
              {plan.name !== "Free" && (
                <p className="Polaris-Text--success mt-2">Cancel anytime</p>
              )}
            </div>
            <List>
              {plan.features.map((item, index) => (
                <List.Item key={`benefit-${index}`}>
                  <span
                    className="mr-2"
                    dangerouslySetInnerHTML={{ __html: item }}
                  ></span>
                </List.Item>
              ))}
            </List>
          </div>
        ))}
      </InlineGrid>
      <SelectPlan {...modalProps}></SelectPlan>
    </>
  );
}
