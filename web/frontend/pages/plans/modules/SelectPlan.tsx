import { Modal, BlockStack } from "@shopify/polaris";
import { useCallback } from "react";
import { Plan } from "../../../@type/plans";
import { useAppContext } from "../../../hook";

export type ModalPlanProps = {
  selectPlan: boolean;
  setSelectPlan: (active: boolean) => void;
  planFeature?: Plan;
};

const SelectPlan = (props: ModalPlanProps) => {
  const { selectPlan, setSelectPlan, planFeature } = props;
  const { state, currentLevelPlan } = useAppContext();
  const cancelPlan = async () => {
    // if(state.user.level === Level.FREE){
    //   handleChange()
    //   return
    // }
    // const plan = {
    //   level: planFeature?.level,
    //   host: state.shopify.host,
    // }
    // try{
    //   await cancelCharge(JSON.stringify(plan))
    //   dispatch(setMultipleState({
    //     user: {...state.user, level: Level.FREE},
    //     plan: plans.find(plan => plan.level == Level.FREE) || defaultPlan
    //   }))
    //   toast.show('Success')
    // } catch(e) {
    //   toast.show('Error')
    // }
    // handleChange()
  };

  const submitPlan = async () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/select/plan?plan=${planFeature?.name}&price=${planFeature?.price}&shopify_plan_id=${state.plan?.shopify_plan_id}&shop=${state.user.shopify_domain}&accessToken=${state.auth.accessToken}&redirect=true`;
    // const plan = {
    //   level: planFeature?.level,
    //   host: state.shopify.host,
    //   redirectPageUrl: redirectPageUrl, // redirect url after charge return
    //   redirectHash: '', // redirect url after charge return
    // }

    // try {
    //   const result = await charge(JSON.stringify(plan))
    //   toast.show('Success')
    //   navigate(result.confirmationUrl)
    // } catch(e) {
    //   handleChange()
    //   toast.show('Error')
    // }
  };

  const handleChange = useCallback(() => {
    setSelectPlan(!selectPlan);
  }, [selectPlan, setSelectPlan]);

  return (
    <Modal
      open={selectPlan}
      onClose={handleChange}
      title={
        currentLevelPlan &&
        planFeature?.level &&
        currentLevelPlan < planFeature?.level
          ? "Upgrade"
          : "Downgrade"
      }
      primaryAction={{
        content:
          currentLevelPlan &&
          planFeature?.level &&
          currentLevelPlan < planFeature?.level
            ? "Upgrade"
            : "Downgrade",
        onAction: () =>
          planFeature?.level === 1 ? cancelPlan() : submitPlan(),
      }}
    >
      <Modal.Section>
        <BlockStack gap="600">
          <div>Are you sure you want to select {planFeature?.name} Plan?</div>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
};

export default SelectPlan;
