const Template06 = () => {
  return (
    <div>
      <div
        className="flex flex-col justify-between items-center text-center"
        style={{
          backgroundImage: `url(https://backend-faq.yanet.io/var/images/banner/banner-default-2.png)`,
          backgroundSize: "cover",
          height: "250px",
        }}
      >
        <div className="w-full">
          <p className="text-xl py-5 text-3xl font-bold">
            Frequently Asked Questions
          </p>
          <div
            className="text-center w-100 m-auto text-base"
            style={{
              position: "relative",
              width: "70%",
              borderRadius: "100px",
            }}
          >
            <input
              type="text"
              placeholder="What can we help you with?"
              className="form-control m-auto rounded"
              style={{
                boxShadow: "none",
                outline: "none",
                border: "none",
                width: "100%",
                padding: "16px",
                lineHeight: "1",
              }}
            />
          </div>
          <div className="text-center w-100">
            <div
              className="m-auto text-base"
              style={{
                position: "relative",
                width: "70%",
                borderRadius: "100px",
              }}
            >
              <input
                type="text"
                placeholder="What can we help you with?"
                className=""
                style={{
                  boxShadow: "none",
                  outline: "none",
                  border: "none",
                  borderRadius: "100px",
                  width: "100%",
                  padding: "16px 16px 16px 50px",
                  lineHeight: "1",
                }}
              />
              <i
                className="fa-solid fw-none fa-magnifying-glass"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "0",
                  transform: "translateY(-50%)",
                  marginLeft: "17px",
                }}
              ></i>
            </div>
          </div>
        </div>
        <div>
          <p>Check most frequently asked questions here</p>
        </div>
        <div className="col-12">
          <div className="">
            <div className="category-nav flex justify-center flex-wrap">
              <div className="" style={{ padding: '10px 16px', cursor: 'pointer' }} >
                <a href="#category-bar-config">
                  <span>Account</span>                        
                </a>
              </div>
              <div className="bg-white" style={{ padding: '10px 16px', cursor: 'pointer', borderRadius: '4px 4px 0 0' }} >
                <a href="#category-bar-config">
                  <span>Placing an Order</span>
                </a>
              </div>
              <div className="" style={{ padding: '10px 16px', cursor: 'pointer' }}>
                <a href="#category-bar-config">
                  <span>Shipping</span>                        
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col items-center m-auto py-8 px-4"
        style={{ maxWidth: "800px" }}
      >
        <div>
          <div>
            <p className="pb-1 pt-3">Placing an Order</p>
            <div className="flex items-center cursor-pointer">
              <svg fill="#696969" viewBox="0 0 448 512" style={{ width: '14px', height: '14px' }}><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
              <p className="ms-3">When will I be charged for my order?</p>
            </div>
            <div>
              <div className="flex items-start cursor-pointer mt-3">
                <svg fill="#696969" viewBox="0 0 448 512" style={{ minWidth: '14px', height: '14px' }}><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
                <div className="ms-3">
                  <p>How do I redeem my One 4 All card?</p>
                  <p>
                    We are currently accepting One 4 All cards instore only.
                    Please retain your card after making your purchase, as should
                    you wish to return any items bought using a One 4 All card, we
                    will use this payment method to refund you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <div style={{ padding: "12px" }}>
          <p>Thanks for visiting our page!</p>
        </div>
        <div>
          <div style={{ paddingBottom: "10px", textAlign: "center" }}>
            <span
              style={{
                color: "rgb(75, 75, 75)",
                fontSize: "15px",
                textDecoration: "none",
                fontFamily: "Times New Roman, Times, serif",
              }}
            >
              Powered by Yanet
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template06;
