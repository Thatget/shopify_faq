import { Page } from "@shopify/polaris";
import { AddNoteMajor } from "@shopify/polaris-icons";
import CreateOrEditFaq from "./CreateOrEditFaq";
import { Params, useNavigate, useParams } from "react-router-dom";
import { useGetFaqByIdApi } from "../../../hook/api/faqs";
import { Faq } from "../../../@type/faq";
import { useEffect, useState } from "react";

export default function EditFaq() {
  const navigate = useNavigate()
  const id = useParams<Params<string>>()
  const { data } = useGetFaqByIdApi(id);
  const [ faq, setFaq ] = useState<Faq>()

  useEffect(() => {
    if(data) setFaq(data)
  }, [data])
  
  return (
    <Page 
      title="Edit Faq"
      backAction={{content: '', url: '/faqs'}}
      // primaryAction={{content: 'Save'}}
      secondaryActions={[
        {
          content: 'Add new Faq',
          accessibilityLabel: 'Secondary action label',
          onAction: () => navigate('/add-faq'),
          icon: AddNoteMajor
        }
      ]}
    >
      { faq &&
        <CreateOrEditFaq {...faq}></CreateOrEditFaq>
      }
    </Page>
  )
}
