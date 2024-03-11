import { Page } from "@shopify/polaris";
import CreateOrEditCategory from "./CreateOrEditCategory";

export default function CreateCategory() {

  return (
    <Page
      title="Add Category"
      backAction={{content: '', url: '/categories'}}
    >
      <CreateOrEditCategory></CreateOrEditCategory>
    </Page>
  )
}