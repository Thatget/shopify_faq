import Template01 from "./components/templates-preview/Template01"
import Template02 from "./components/templates-preview/Template02"
import Template03 from "./components/templates-preview/Template03"
import Template05 from "./components/templates-preview/Template05"
import Template06 from "./components/templates-preview/Template06"
import Template07 from "./components/templates-preview/Template07"
import Template08 from "./components/templates-preview/Template08"
import Template04 from "./components/templates-preview/Template04"
import { templateProps } from "../TemplateSelection"

const TemplatePreview = (props: templateProps) => {

  return(
    <div>
      { props.templateSelected === '1' &&
        <Template01></Template01>
      }
      { props.templateSelected === '2' && 
        <Template02></Template02>
      }
      { props.templateSelected === '3' && 
        <Template03></Template03>
      }
      { props.templateSelected === '4' && 
        <Template04></Template04>
      }
      { props.templateSelected === '5' && 
        <Template05></Template05>
      }
      { props.templateSelected === '6' && 
        <Template06></Template06>
      }
      { props.templateSelected === '7' && 
        <Template07></Template07>
      }
      { props.templateSelected === '8' && 
        <Template08></Template08>
      }

    </div>
  )
}

export default TemplatePreview
