import { BlockStack, Card, Checkbox, TextField } from "@shopify/polaris";
import { useMemo } from "react";
import { WidgetProps } from "../../../@type/widget";

const ConfigWidgetButton = (props: WidgetProps) => {

  const listIconWidget = useMemo(() => {
    return [
      {
        id: "1",
        content: (
          <i
            className={`text-white text-2xl fa-regular fa-envelope ${
              props.widgetProps.isActiveAnimation && props.widgetProps.iconNumber === "1"
                ? "help__desk-open-icon"
                : ""
            }`}
          ></i>
        ),
      },
      {
        id: "2",
        content: (
          <i
            className={`text-white text-2xl fa-regular fa-message ${
              props.widgetProps.isActiveAnimation && props.widgetProps.iconNumber === "2"
                ? "help__desk-open-icon"
                : ""
            }`}
          ></i>
        ),
      },
      {
        id: "3",
        content: (
          <i
            className={`text-white text-2xl fa-regular fa-comments ${
              props.widgetProps.isActiveAnimation && props.widgetProps.iconNumber === "3"
                ? "help__desk-open-icon"
                : ""
            }`}
          ></i>
        ),
      },
      {
        id: "4",
        content: (
          <i
            className={`text-white text-2xl fa-solid fa-question${
              props.widgetProps.isActiveAnimation && props.widgetProps.iconNumber === "4"
                ? " help__desk-open-icon"
                : ""
            }`}
          ></i>
        ),
      },
      {
        id: "5",
        content: (
          <i
            className={`${
              props.widgetProps.isActiveAnimation && props.widgetProps.iconNumber === "5"
                ? "text-white text-2xl fa-solid fa-info help__desk-open-icon"
                : "text-white text-2xl fa-solid fa-info"
            }`}
          ></i>
        ),
      },
    ];
  }, [props.widgetProps.iconNumber, props.widgetProps.isActiveAnimation]);

  return (
    <>
      <Card>
        <BlockStack gap={"400"}>
          <b>Widget Button</b>
          <div className="ms-7">
            <Checkbox
              label="Icon animation"
              checked={props.widgetProps.isActiveAnimation}
              onChange={() =>
                props.widgetProps.setIsActiveAnimation(!props.widgetProps.isActiveAnimation)
              }
            />
            <div></div>
          </div>
          <div className="ms-7">
            <p>Select icon</p>
            <div className="flex">
              {listIconWidget.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    props.widgetProps.setIconNumber(item.id);
                  }}
                  className="p-1 mt-2 rounded me-3 me-sm-4 border-2"
                  style={{
                    cursor: "pointer",
                    borderColor: `${
                      props.widgetProps.iconNumber === item.id ? "#ff8200" : ""
                    }`,
                  }}
                >
                  <div
                    style={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "50%",
                      backgroundColor: props.widgetProps.backgroundColor,
                    }}
                    className="px-2 flex items-center justify-center"
                  >
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ms-7">
            <p>Background color</p>
            <div className="flex items-center">
              <input
                type="color"
                className="h-[36px] me-1 w-[60px] cursor-pointer"
                onChange={() => {}}
                value={props.widgetProps.backgroundColor}
              ></input>
              <div className="flex-1">
                <TextField
                  label=""
                  value={props.widgetProps.backgroundColor}
                  onChange={(value) => props.widgetProps.setBackgroundColor(value)}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
          <div className="ms-7">
            <p>Alignment</p>
            <div className="flex text-center  ">
              <div>
                <div
                  onClick={() => props.widgetProps.setAlignment("left")}
                  className="w-[80px] h-[130px] border-[3px] relative cursor-pointer"
                  style={{
                    borderColor: props.widgetProps.alignment === "left" ? "#ff8200" : "",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    className="absolute w-6 h-6 rounded-full bottom-[6px] left-[6px]"
                    style={{
                      backgroundColor:
                        props.widgetProps.alignment === "left" ? "#ff8200" : "#cccccc",
                    }}
                  ></div>
                </div>
                <p>Bottom left</p>
              </div>
              <div>
                <div
                  onClick={() => props.widgetProps.setAlignment("right")}
                  className="w-[80px] h-[130px] border-[3px] relative cursor-pointer ms-4"
                  style={{
                    borderColor: props.widgetProps.alignment === "right" ? "#ff8200" : "",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    className="absolute w-6 h-6 rounded-full bottom-[6px] right-[6px]"
                    style={{
                      backgroundColor:
                        props.widgetProps.alignment === "right" ? "#ff8200" : "#cccccc",
                    }}
                  ></div>
                </div>
                <p className="ms-3">Bottom right</p>
              </div>
            </div>
          </div>
        </BlockStack>
      </Card>
    </>
  );
};

export default ConfigWidgetButton;
