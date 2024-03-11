import { Page } from "@shopify/polaris"
import { CategoriesList } from "./modules/CategoriesList"
import { useNavigate } from "react-router-dom"

const Categories = () => {
  const navigate = useNavigate()

  return(
    <Page 
      title="Store Category"
      primaryAction={{
        content: 'Add Category',
        onAction: () => navigate('/add-category')
      }}
    >
      <CategoriesList></CategoriesList>
    </Page>
  )
}

export default Categories
