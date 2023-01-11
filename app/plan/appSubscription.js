export const APP_SUBSCRIPTION_CREATE = `
  mutation createAppSubscription(
    $lineItems: [AppSubscriptionLineItemInput!]!
    $name: String!
    $returnUrl: URL!
    $test: Boolean = false
    $trialDays: Int
  ) {
    appSubscriptionCreate(
      lineItems: $lineItems
      name: $name
      returnUrl: $returnUrl
      test: $test
      trialDays: $trialDays
    ) {
      appSubscription {
        id
      }
      confirmationUrl
      userErrors {
        field
        message
      }
    }
  }
`;

export const APP_SUBSCRIPTION_CANCEL = `
  mutation cancelAppSubscription($id: ID!) {
    appSubscriptionCancel(id: $id) {
      appSubscription {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;