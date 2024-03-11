import { InlineGrid } from "@shopify/polaris";
import { StarFilledMinor } from "@shopify/polaris-icons";

const Reviews = () => {
  const reviewList = [
    {
      name: "La Foresta Orchids",
      address: "United States",
      comment:
        "I recently tried Yanet FAQ, and I must say, the service is excellent! The app is user-friendly, and the customer support is top-notch. They respond quickly to any questions or doubts, and their team is very diligent and professional in addressing all inquiries. They handle adjustments efficiently and guide you through the process patiently. Overall, the experience with Yanet FAQ is delightful. I highly recommend it to anyone looking for a reliable and user-friendly app with great customer support. Kudos to Tracy and the team for their dedication to excellence!",
    },
    {
      name: "Sticker Joint",
      address: "United States",
      comment:
        "My old FAQ app deleted all my FAQ's because they switched to a paid service. switched to this one and it's made my page look better. app is easy to use and customer service actually helps resolve your issues! thanks for free app!",
    },
    {
      name: "luxurcar",
      address: "China",
      comment:
        "I used it very carefully, the FAQ function is what I need, it also has the search function, which is great for me and my customers. The customer service is very professional. I am very satisfied with everything!",
    },
    {
      name: "WILFLAND",
      address: "France",
      comment:
        "The application is very intuitive and easy to use. It is possible to create categories of questions and answers, organise them in a logical way and make them easily accessible for customers. It is also possible to customise the look and feel of the FAQ section to fit in with the design of the site.",
    },
    {
      name: "BeautiLu",
      address: "Israel",
      comment:
        "Perfect app everything works great without anyproblems, alot of great features, the customer service is amazing helping with everthing you need and reply in less than a minute recommend for everyone that needs an faq page!",
    },
    {
      name: "Impulse Shop",
      address: "Netherlands",
      comment:
        "Great app for a clean, professional FAQ page and contact widget. A lot of customizations, works fast, can be easily translated. Responsive and friendly technical support team. Totally recommend. 10/10",
    },
  ];

  return (
    <div className="mt-6 mb-4">
      <div className="text-center mt-12 mb-8">
        <h3 className="font-bold text-[20px] mb-2">
          Positive Feedback from Merchants on the Shopify App Store
        </h3>
      </div>
      <InlineGrid gap="400" columns={{ xs: 1, sm: 2, md: 3 }}>
        {reviewList.map((review, index) => (
          <div
            key={index}
            className="bg-white p-4 flex flex-col h-100 rounded-[1rem]"
          >
            <div className="flex text-sm h-[20px] w-[100px] star-review">
              <StarFilledMinor></StarFilledMinor>
              <StarFilledMinor></StarFilledMinor>
              <StarFilledMinor></StarFilledMinor>
              <StarFilledMinor></StarFilledMinor>
              <StarFilledMinor></StarFilledMinor>
            </div>
            <div className="flex flex-col justify-between flex-1 mt-3">
              {review.comment}
              <div className="text-end mt-6">
                <p className="font-bold">{review.name}</p>
                <p>{review.address}</p>
              </div>
            </div>
          </div>
        ))}
      </InlineGrid>
    </div>
  );
};

export default Reviews;
