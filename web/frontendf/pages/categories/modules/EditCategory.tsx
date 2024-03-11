import { useEffect, useState } from "react";
import { Category } from "../../../@type/category";
import { Page } from "@shopify/polaris";
import CreateOrEditCategory from "./CreateOrEditCategory";
import { useGetCategoryByIdApi } from "../../../hook/api/category";
import { Params, useParams } from "react-router-dom";

export default function EditCategory() {
  const id = useParams<Params<string>>()
  const { data } = useGetCategoryByIdApi(id);
  const [ category, setCategory ] = useState<Category>()
  
  useEffect(() => {
    if(data) setCategory(data)
  }, [data])

  return(
    <Page
      title="Edit Category"
      backAction={{content: '', url: '/categories'}}
    >
      <CreateOrEditCategory {...category}></CreateOrEditCategory>
    </Page>
  )
}