import { Page } from "@shopify/polaris"
import { useNavigate } from "react-router-dom"

const DashBoard = () => {
  const navigate = useNavigate()

  return(
    <Page title="DashBoard">
      <div onClick={() => {navigate('/faqs')}}>Faq</div>
      <div onClick={() => {navigate('/categories')}}>Categories</div>
      <div onClick={() => {navigate('/design')}}>Design</div>
      <div onClick={() => {navigate('/setting')}}>Setting</div>
      <div onClick={() => {navigate('/product-faqs')}}>Product Faqs</div>
      <div onClick={() => {navigate('/plans')}}>Plan</div>
      <div onClick={() => {navigate('/widget')}}>Widget</div>

    </Page>
  )
}

export default DashBoard
