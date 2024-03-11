const Template02 = () => {
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
      </div>
      <div
        className="flex flex-col items-center m-auto py-8 px-4"
        style={{ maxWidth: "800px" }}
      >
        <div className="flex mb-5">
          <button className="px-3 py-2 border rounded">Placing an Order</button>
          <button className="px-3 py-2 border rounded ms-3">Refunds</button>
        </div>
        <div className="flex mb-5">
          <button className="px-3 py-2 border rounded-full">
            Placing an Order
          </button>
          <button className="px-3 py-2 border rounded-full ms-3">
            Refunds
          </button>
        </div>
        <div>
          <div>
            <p className="pb-1 pt-3">Placing an Order</p>
            <div className="flex items-center justify-between p-3 bg-red-300 rounded cursor-pointer">
              <p>When will I be charged for my order?</p>
              <i className="fas fa-angle-right"></i>
            </div>
            <div>
              <div className="flex items-center justify-between p-3 bg-red-300 rounded cursor-pointer mt-3">
                <p>How do I redeem my One 4 All card?</p>
                <i className="fas fa-angle-down"></i>
              </div>
              <div>
                <p>
                  We are currently accepting One 4 All cards instore only.
                  Please retain your card after making your purchase, as should
                  you wish to return any items bought using a One 4 All card, we
                  will use this payment method to refund you.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <p className="pb-1 pt-3">Refunds</p>
            <div className="flex items-center justify-between p-3 bg-red-300 rounded cursor-pointer">
              <p>I have returned my order – will you refund my delivery?</p>
              <i className="fas fa-angle-right"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
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

export default Template02;
