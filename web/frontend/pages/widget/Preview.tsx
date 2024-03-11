/* eslint-disable jsx-a11y/anchor-is-valid */
import { useMemo, useState } from "react";
import { Icon } from "@shopify/polaris";
import { CartMajor, SearchMajor } from "@shopify/polaris-icons";
import { WidgetProps } from "../../@type/widget"

export default function Preview(props: WidgetProps) {
  const [activeWidget, setActiveWidget] = useState(true);
  const [hoverCategory, setHoverCategory] = useState<number>()
  const [hoverFaq, setHoverFaq] = useState<number>()
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
    <div
      className="border-4 mt-4 overflow-hidden bg-gray-100 relative w-[310px]"
      style={{ borderRadius: "30px", borderColor: "#ccc" }}
    >
      {activeWidget ? (
        <div className="h-[600px] product-scroll" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
          <div className="help__desk-home">
            <div
              style={{ height: "100px", margin: "-35px", position: "relative" }}
            >
              <div className="help__desk-background" style={{ backgroundColor: props.widgetProps.backgroundColor}}></div>
              <div
                className="help__desk-header text-white m-3 p-4"
                style={{
                  position: "absolute",
                  top: "0",
                  width: "calc(100% - 32px)",
                }}
              >
                <div className="ms-[20px]" style={{ color: props.widgetProps.headerColor}}>
                  <p className="help__desk-hi">Hi✌️</p>
                  <span className="help__desk-title">May I help you?</span>
                </div>
                <div onClick={() => setActiveWidget(false)} className="help__desk-icon" title="Close">
                  <svg
                    width="26"
                    height="26"
                    fill="#fff"
                    style={{ margin: "auto" }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
                  </svg>
                </div>
              </div>
            </div>
            <div
              className="help__desk-body help__desk-scroll mx-2"
              style={{
                position: "relative",
                marginTop: "45px",
                paddingBottom: "1px",
                borderRadius: "6px",
              }}
            >
              <div className="mb-4" style={{ borderRadius: "6px" }}>
                {props.widgetProps.isActiveContactUs && 
                  <div
                    // v-if="messages_settings.contact_us_visible"
                    className="help__desk-contact-items help__desk-component mb-3 bg-white p-3 border"
                    style={{ borderRadius: "6px" }}
                  >
                    <span className="help__desk-label m-0" style={{ color: props.widgetProps.textColor}}>Contact Us</span>
                    <div
                      // v-if="messages_settings.phone_visible || messages_settings.message_visible || messages_settings.email_visible || messages_settings.whatsApp_visible"
                      className="help__desk-items flex items-center"
                    >
                      {props.widgetProps.isActivePhone &&
                        <a
                          href=""
                          // v-if="messages_settings.phone_visible"
                          target="_blank"
                          style={{
                            height: "40px",
                            width: "40px",
                            textDecoration: "none",
                            marginLeft: '18px'
                          }}
                          className="border bg-green-700 rounded flex items-center justify-center "
                        >
                          <i className="fa-solid fa-phone p-1 px-2 text-xl text-white"></i>
                        </a>
                        // <a
                        //   href=""
                        //   style={{
                        //     height: "40px",
                        //     width: "40px",
                        //     display: 'none'
                        //   }}
                        //   target="_blank"
                        //   // v-if="messages_settings.message_visible && messages_settings.user_id == 1202"
                        // >
                        //   <svg width="40" height="40" viewBox="0 0 40 40">
                        //     <defs>
                        //       <radialGradient
                        //         id="radial-gradient"
                        //         cx="0.372"
                        //         cy="1.001"
                        //         r="1.247"
                        //         gradientUnits="objectBoundingBox"
                        //       >
                        //         <stop offset="0" stopColor="#fd5" />
                        //         <stop offset="0.328" stopColor="#ff543f" />
                        //         <stop offset="0.348" stopColor="#fc5245" />
                        //         <stop offset="0.504" stopColor="#e64771" />
                        //         <stop offset="0.643" stopColor="#d53e91" />
                        //         <stop offset="0.761" stopColor="#cc39a4" />
                        //         <stop offset="0.841" stopColor="#c837ab" />
                        //       </radialGradient>
                        //       <radialGradient
                        //         id="radial-gradient-2"
                        //         cx="0.161"
                        //         cy="-0.012"
                        //         r="0.828"
                        //         gradientTransform="translate(0 -0.004) scale(1 0.666)"
                        //         gradientUnits="objectBoundingBox"
                        //       >
                        //         <stop offset="0" stopColor="#4168c9" />
                        //         <stop
                        //           offset="0.999"
                        //           stopColor="#4168c9"
                        //           stopOpacity="0"
                        //         />
                        //       </radialGradient>
                        //     </defs>
                        //     <g
                        //       id="icons8-instagram"
                        //       transform="translate(-5.99 -5.99)"
                        //     >
                        //       <path
                        //         id="Path_1"
                        //         data-name="Path 1"
                        //         d="M37.115,45.969,14.9,45.99a8.911,8.911,0,0,1-8.893-8.875L5.99,14.9a8.911,8.911,0,0,1,8.875-8.893l22.21-.021a8.911,8.911,0,0,1,8.893,8.875l.021,22.21A8.909,8.909,0,0,1,37.115,45.969Z"
                        //         fill="url(#radial-gradient)"
                        //       />
                        //       <path
                        //         id="Path_2"
                        //         data-name="Path 2"
                        //         d="M37.115,45.969,14.9,45.99a8.911,8.911,0,0,1-8.893-8.875L5.99,14.9a8.911,8.911,0,0,1,8.875-8.893l22.21-.021a8.911,8.911,0,0,1,8.893,8.875l.021,22.21A8.909,8.909,0,0,1,37.115,45.969Z"
                        //         fill="url(#radial-gradient-2)"
                        //       />
                        //       <path
                        //         id="Path_3"
                        //         data-name="Path 3"
                        //         d="M24,31a7,7,0,1,1,7-7A7.008,7.008,0,0,1,24,31Zm0-12a5,5,0,1,0,5,5A5.006,5.006,0,0,0,24,19Z"
                        //         transform="translate(1.991 1.991)"
                        //         fill="#fff"
                        //       />
                        //       <circle
                        //         id="Ellipse_1"
                        //         data-name="Ellipse 1"
                        //         cx="1.5"
                        //         cy="1.5"
                        //         r="1.5"
                        //         transform="translate(32.895 16.086)"
                        //         fill="#fff"
                        //       />
                        //       <path
                        //         id="Path_4"
                        //         data-name="Path 4"
                        //         d="M32.909,40.981H19.072A8.081,8.081,0,0,1,11,32.909V19.072A8.081,8.081,0,0,1,19.072,11H32.909a8.081,8.081,0,0,1,8.072,8.072V32.909A8.081,8.081,0,0,1,32.909,40.981ZM19.072,13.306a5.772,5.772,0,0,0-5.766,5.766V32.909a5.772,5.772,0,0,0,5.766,5.766H32.909a5.772,5.772,0,0,0,5.766-5.766V19.072a5.772,5.772,0,0,0-5.766-5.766Z"
                        //         fill="#fff"
                        //       />
                        //     </g>
                        //   </svg>
                        // </a>
                      }
                      {props.widgetProps.isActiveMessage &&
                        <a
                          // v-if="messages_settings.message_visible && messages_settings.user_id != 1202"
                          target="_blank"
                          style={{
                            height: "40px",
                            width: "40px",
                            textDecoration: "none",
                            marginLeft: '18px'
                          }}
                          className="rounded flex items-center justify-center border bg-blue-600"
                        >
                          <i className="fa-brands fa-facebook-messenger p-1 px-2 text-xl text-white"></i>
                        </a>
                      }
                      {props.widgetProps.isActiveEmail &&
                        <a
                          // v-if="messages_settings.email_visible"
                          target="_blank"
                          style={{
                            height: "40px",
                            width: "40px",
                            textDecoration: "none",
                            backgroundColor: "#479dde",
                            marginLeft: '18px'
                          }}
                          className="rounded border flex items-center justify-center"
                        >
                          <i
                            className="fa-solid fa-envelope p-1 px-2 text-xl text-white"
                          ></i>
                        </a>
                      }
                      {props.widgetProps.isActiveWhatsApp &&
                        <a
                          target="_blank"
                          // v-if="messages_settings.whatsApp_visible"
                          style={{
                            height: "40px",
                            width: "40px",
                            textDecoration: "none",
                            marginLeft: '18px'
                          }}
                          className="rounded border bg-green-700 flex items-center justify-center"
                        >
                          <i className="fa-brands fa-whatsapp p-1 px-2 text-xl text-white"></i>
                        </a>
                      }
                    </div>
                  </div>
                }
                {props.widgetProps.isActiveFaqs &&
                  <div
                    v-if="messages_settings.feature_questions_visible"
                    className="help__desk-contact-items help__desk-component mb-3 bg-white border"
                    style={{ borderRadius: "6px" }}
                  >
                    <span className="help__desk-label m-0 px-3 pt-3" style={{ color: props.widgetProps.textColor}}>FAQs</span>
                    <div className="help__desk-search px-3 py-2">
                      <div
                        className="help__desk-search-main flex justify-between items-center"
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: "20px",
                          overflow: "hidden",
                          height: "36px",
                        }}
                      >
                        <i
                          className="fa-solid fa-magnifying-glass ps-2 pe-2"
                          style={{ paddingTop: "2px" }}
                        ></i>
                        <input
                          className="text-sm"
                          id="search-faq"
                          style={{ flex: "1", border: "none", outline: "none" }}
                          type="text"
                          placeholder="Search"
                        />
                      </div>
                    </div>
                    <div
                      className="help__desk-main mb-2 product-scroll"
                      style={{ maxHeight: "190px", overflowY: "auto" }}
                    >
                      <div
                        // v-for="(item,index) in faqs"
                        className="help__desk-list"
                      >
                        <div
                          // v-if="item.feature_faq"
                          className="help__desk-item flex justify-between items-center px-4 py-2"
                          style={{ cursor: "pointer", fontSize: "13px", backgroundColor: `${hoverFaq === 1? '#e9edf1' : ''}` }}
                          onMouseOver={() => setHoverFaq(1)}
                          onMouseOut={() => setHoverFaq(0)}
                        >
                          <span
                            style={{ wordBreak: "break-all", fontWeight: "400" }}
                          >Why should I choose your lactation cookies over other products on the market?</span>
                          <i className="fa-solid fa-angle-right ms-3 pt-1"></i>
                        </div>
                        <div
                          // v-if="item.feature_faq"
                          className="help__desk-item flex justify-between items-center px-4 py-2"
                          style={{ cursor: "pointer", fontSize: "13px" }}
                        >
                          <span
                            style={{ wordBreak: "break-all", fontWeight: "400" }}
                          >Why should I choose your lactation cookies over other products on the market?</span>
                          <i className="fa-solid fa-angle-right ms-3 pt-1"></i>
                        </div>
                        <div
                          // v-if="item.feature_faq"
                          className="help__desk-item flex justify-between items-center px-4 py-2"
                          style={{ cursor: "pointer", fontSize: "13px" }}
                        >
                          <span
                            style={{ wordBreak: "break-all", fontWeight: "400" }}
                          >Why should I choose your lactation cookies over other products on the market?</span>
                          <i className="fa-solid fa-angle-right ms-3 pt-1"></i>
                        </div>
                        <div
                          // v-if="item.feature_faq"
                          className="help__desk-item flex justify-between items-center px-4 py-2"
                          style={{ cursor: "pointer", fontSize: "13px" }}
                        >
                          <span
                            style={{ wordBreak: "break-all", fontWeight: "400" }}
                          >Why should I choose your lactation cookies over other products on the market?</span>
                          <i className="fa-solid fa-angle-right ms-3 pt-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                {props.widgetProps.isActiveCategories &&
                  <div
                    v-if="messages_settings.feature_categories_visible"
                    className="help__desk-contact-items help__desk-component bg-white border"
                    style={{ borderRadius: "6px" }}
                  >
                    <span className="help__desk-label m-0 p-3 border-b" style={{ color: props.widgetProps.textColor}}>
                      Categories
                    </span>
                    <div
                      className="help__desk-main mb-2 product-scroll"
                      style={{ maxHeight: "190px", overflowY: "auto" }}
                    >
                      <div
                        v-for="(item, index) in categories"
                        className="help__desk-list"
                      >
                        <div
                          v-if="item.feature_category"
                          className="help__desk-item border-bottom flex justify-between items-center py-2 px-4"
                          onMouseOver={() => setHoverCategory(1)}
                          onMouseOut={() => setHoverCategory(0)}
                          style={{ cursor: "pointer", backgroundColor: `${hoverCategory === 1? '#e9edf1' : ''}` }}
                        >
                          <div>
                            <span style={{ wordBreak: "break-all" }}>Category1</span>
                            <br />
                            <span
                              style={{
                                color: "#98c6cd",
                                fontSize: "13px",
                                fontWeight: "400",
                              }}
                            >
                              {" "}
                              FAQs
                            </span>
                          </div>
                          <i className="fa-solid fa-angle-right ms-3 pt-1"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[600px]">
          <div className="pt-5 mx-4 flex justify-between">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height={"20px"}
              width={"20px"}
              viewBox="0 0 448 512"
            >
              <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
            </svg>
            <p>YOUR STORE</p>
            <div className="flex">
              <Icon source={SearchMajor} tone="base" />
              <div className="ms-3">
                <Icon source={CartMajor} tone="base" />
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`absolute bottom-[10px] ${
          props.widgetProps.alignment === "left" ? "left-[10px]" : "right-[10px]"
        }`}
      >
        <div className="flex">
          {!activeWidget &&
            listIconWidget.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setActiveWidget(!activeWidget);
                }}
                className="p-1 mt-2 rounded me-3 me-sm-4"
                style={{
                  cursor: "pointer",
                  display: props.widgetProps.iconNumber === item.id ? "" : "none",
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
          {/* {activeWidget && (
            <div
              onClick={() => {
                setActiveWidget(!activeWidget);
              }}
              className="p-1 mt-2 rounded me-3 me-sm-4"
              style={{
                cursor: "pointer",
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
                <i className="fa-solid fa-angle-down text-white text-2xl"></i>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
