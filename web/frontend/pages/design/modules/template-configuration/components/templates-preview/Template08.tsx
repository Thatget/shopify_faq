const Template08 = () => {
  return (
    <div>
      <div
        className="flex flex-col justify-between items-center text-center"
        style={{
          backgroundImage: `url(https://backend-faq.yanet.io/var/images/banner/banner-default-3.png1)`,
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
                border: "1px solid #ccc",
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
                  border: "1px solid #ccc",
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
      <div className="flex flex-col items-center m-auto py-8 px-4">
        <div className="flex">
          <div className="w-4/12">
            <div className="flex flex-col me-8 mt-9">
              <div
                className="px-2 pb-5"
              >
                Placing an order
              </div>
              <div
                className="px-2"
              >
                Refunds
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div>
              <p className="pb-1 pt-3 mb-3">Placing an Order</p>
              <div
                className="flex flex-col"
              >
                <div className="flex items-start rounded cursor-pointer">
                  <div className="flex flex-col">
                    <p>When will I be charged for my order?</p>
                    <p className="mt-2">
                      Payment is taken at the point of ordering. If for any reason
                      your item is not dispatched we will ensure you are refunded
                      within 3-5 working days.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col mt-4"
              >
                <div className="flex items-start rounded cursor-pointer">
                  <div className="flex flex-col">
                    <p>How do I redeem my One 4 All card?</p>
                    <p className="mt-2">
                      We are currently accepting One 4 All cards instore only.
                      Please retain your card after making your purchase, as
                      should you wish to return any items bought using a One 4 All
                      card, we will use this payment method to refund you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <p className="pb-1 pt-3 mb-3">Refunds</p>
              <div>
                <div className="flex items-center justify-between rounded cursor-pointer">
                  <p>I have returned my order – will you refund my delivery?</p>
                </div>
                <div>
                  <p>
                    If you have returned your full order within 30 days of
                    receipt, we will refund the full amount, including delivery
                    costs. Please note, delivery costs are refunded additionally
                    and will show as a separate refund.
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

export default Template08;
