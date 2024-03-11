// import { useCallback } from "react"
import { Crisp } from "crisp-sdk-web";
import { useNavigate } from "react-router-dom";

interface IInitializeArgs {
  id: string;
  email: string, 
  name: string, 
  shopDomain: string
}

enum ChatboxColors {
  Default = "default",
  Amber = "amber",
  Black = "black",
  Blue = "blue",
  BlueGrey = "blue_grey",
  LightBlue = "light_blue",
  Brown = "brown",
  Cyan = "cyan",
  Green = "green",
  LightGreen = "light_green",
  Grey = "grey",
  Indigo = "indigo",
  Orange = "orange",
  DeepOrange = "deep_orange",
  Pink = "pink",
  Purple = "purple",
  DeepPurple = "deep_purple",
  Red = "red",
  Teal = "teal"
}


export function useCrisp() {
  
  const navigate = useNavigate()
  
  const initialize = ({
    id, email, name, shopDomain
  }: IInitializeArgs) => {
    if (Crisp.isCrispInjected()) {
      return
    }
    Crisp.configure('35cbcb5a-831c-47fb-9064-0bced009fca9');
    Crisp.setTokenId(id);
    Crisp.user.setEmail(email);
    Crisp.user.setNickname(`[FAQ] - ${name} - ${shopDomain}`);
    Crisp.setColorTheme(ChatboxColors.Brown)
    Crisp.session.setSegments(['faq'], true)
  }

  const redirectToProductPage = () => {
    navigate('/product')
  }

  const redirectToGiftCardPage = () => {
    navigate('/gift-card')
  }

  const redirectToSettingPage = () => {
    navigate('/setting')
  }

  const redirectToThemeExtensionPage = () => {
    navigate('/theme-extension')
  }

  const showTutorialDashBoard = () => {
    setTimeout(() => {
      if(Crisp.isCrispInjected()){
        const html =
          `<div>
            <p style="font-size: 14px !important; font-weight: 800 !important">Welcome to your VIFY Gift Card dashboard!</p>
        
            <p style="font-size: 12.6px !important">Now you can set up your new gift card and rewards program with these simple steps 👇:</p>
            <ol type="1">
              <li style="font-size: 12.6px !important;">Make sure you have enabled our theme app extension</li>
              <li style="font-size: 12.6px !important; margin-top: 4px !important">Set up your first <span id="vify-product" style="font-size: 12.6px !important; color: white !important; text-decoration: underline !important; cursor: pointer !important">Gift Card product</span></li>
              <li style="font-size: 12.6px !important; margin-top: 4px !important">Go to the <span id="vify-setting" style="font-size: 12.6px !important; color: white !important; text-decoration: underline !important; cursor: pointer !important">Settings</span> section, customize your gift card email automation and every other aspects of email delivering to your customers.</li>
              <li style="font-size: 12.6px !important; margin-top: 4px !important">Start sending gift codes directly to your customers by <span id="vify-gift-card" style="font-size: 12.6px !important; color: white !important; text-decoration: underline !important; cursor: pointer !important">issuing your gift cards</span> to them.</li>
              <li style="font-size: 12.6px !important; margin-top: 4px !important">Go to the <span id="vify-theme-extension" style="font-size: 12.6px !important; color: white !important; text-decoration: underline !important; cursor: pointer !important">Customize Storefront</span> page to set up the appearance of your gift card product on your online store.</li>
            </ol>
            
            <p style="font-size: 12.6px !important">Feel free to reply here,</p>
            <p style="font-size: 12.6px !important">Vify support team.</p>
          </div>`

        const cloneList = document.querySelectorAll('.cc-1sbg')

        if(cloneList.length > 0){
          for (let i = (cloneList.length - 1); i >= 0; i--) {
            if(cloneList[i].getElementsByClassName('cc-1v0h').length > 0){
              const newElement = cloneList[i].cloneNode(true);
              const parent = document.getElementsByClassName('wp-exclude-emoji')[0]
              parent.insertBefore(newElement, parent.children[parent.children.length - 1])

              //add event click
              document.getElementById('vify-product')?.addEventListener("click", redirectToProductPage)
              document.getElementById('vify-gift-card')?.addEventListener("click", redirectToGiftCardPage)
              document.getElementById('vify-setting')?.addEventListener("click", redirectToSettingPage)
              document.getElementById('vify-theme-extension')?.addEventListener("click", redirectToThemeExtensionPage)

              //insert html content
              document.querySelectorAll('.cc-1sbg .cc-1vkl .cc-1v0h')[document.querySelectorAll('.cc-1sbg .cc-1vkl .cc-1v0h').length - 1].getElementsByClassName('cc-s3gl')[0].innerHTML = html
              break
            }
          }
        }

      }
    }, 0)
  }

  const toggle = () => {
    try {
      const element: HTMLElement = document.getElementsByClassName('cc-nsge')[0] as HTMLElement
      element.click()
    } catch (e) {
      window.open('https://go.crisp.chat/chat/embed/?website_id=0e918bf3-b422-4c6c-af8a-9f8644982184', '_blank')
    }
  }

  return {
    toggle,
    initialize,
    showTutorialDashBoard
  }
}
