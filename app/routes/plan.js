const express = require("express");
const router = express.Router();
const Shopify = require("@shopify/shopify-api");
const planName = require('../../constant/planName');
const errorLog = require('../helpers/log.helper');
const appName = process.env.SHOPIFY_APP_NAME;

const db = require("./app/models");
const Plan = db.merchants_plan;
/**
 * Init all APIs
 * @param {*} app from express
 */

var host
var shopAccessToken
var shopRefreshToken
var linkApproveSupcription

const APP_SUBSCRIPTION_CREATE = `mutation createAppSubscription(
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
}`

const APP_SUBSCRIPTION_CANCEL = `
  mutation AppSubscriptionCancel($id: ID!) {
    appSubscriptionCancel(id: $id) {
      userErrors {
        field
        message
      }
      appSubscription {
        id
        status
      }
    }
  }`

let plan = (app) => {
  app.get('/select/plan', async (req, res) => {
  let query = {
    shop: req.query.shop,
    accessToken: req.query.accessToken,
    price: req.query.price,
    plan: req.query.plan
  }
  linkApproveSupcription = await getlinkApproveSupcription(query)
  if(req.query.price != '0' && req.query.plan != planName.freePlan){
    if(!linkApproveSupcription){
      // return res.redirect(app_link+'?accessToken=' + shopAccessToken + '&refreshToken=' + shopRefreshToken);  
    }
    if(linkApproveSupcription){
      return res.render('appSupcription', {
        shop: req.query.shop,
        host: host,
        apiKey: apiKey,
        scopes: scopes,
        forwardingAddress: linkApproveSupcription
      });
    }
  }
  if(req.query.price == '0' && req.query.plan == planName.freePlan && req.query.redirect == 'true'){
    await Plan.update({
      plan: planName.freePlan
    }, {
      where: {
        shopify_plan_id: req.query.shopify_plan_id
      }
    })
    .then(() => {
      return res.send({ accessToken: shopAccessToken, refreshToken: shopRefreshToken });
    })      
  }
  if(req.query.price == '0' && req.query.plan != planName.freePlan){
    Shopify.Shopify.Context.initialize({
      API_KEY: apiKey,
      API_SECRET_KEY: apiSecret,
      API_VERSION: Shopify.ApiVersion.January22,
      SCOPES: scopes,
      HOST_NAME: forwardingAddress,
      HOST_SCHEME: 'https',
      IS_EMBEDDED_APP: true,
      IS_PRIVATE_APP: false,
      SESSION_STORAGE: new Shopify.Shopify.Session.MemorySessionStorage(),
    });
    let query = {
      shop: req.query.shop,
      accessToken: req.query.accessToken,
    }
    const client = new Shopify.Shopify.Clients.Graphql(
      query.shop,
      query.accessToken,
    );
    const session = await client.query({
      data: {
        query : APP_SUBSCRIPTION_CANCEL,
        variables: {
          id : req.query.shopify_plan_id
        },
      },
    }); 
    if(session.body.data.appSubscriptionCancel.appSubscription.status === 'CANCELLED'){
      await Plan.update({
        plan: planName.freePlan,
        shopify_plan_id: ''
      }, {
        where: {
          shopify_plan_id: req.query.shopify_plan_id
        }
      })
      .then(() => {
        return res.send({ accessToken: shopAccessToken, refreshToken: shopRefreshToken });
      })              
    }
  }
});
    //Router using
    return app.use("/", router);
}
module.exports = plan;



async function getlinkApproveSupcription(query) {
  Shopify.Shopify.Context.initialize({
    API_KEY: apiKey,
    API_SECRET_KEY: apiSecret,
    API_VERSION: Shopify.ApiVersion.January22,
    SCOPES: scopes,
    HOST_NAME: forwardingAddress,
    HOST_SCHEME: 'https',
    IS_EMBEDDED_APP: true,
    IS_PRIVATE_APP: false,
    SESSION_STORAGE: new Shopify.Shopify.Session.MemorySessionStorage(),
  });
    const client = new Shopify.Shopify.Clients.Graphql(
      query.shop,
      query.accessToken,
    )
    try {
      const session = await client.query({
        data: {
          query: APP_SUBSCRIPTION_CREATE,
          variables: {
            lineItems: [
              {
                plan: {
                  appRecurringPricingDetails: {
                    interval: 'EVERY_30_DAYS',
                    price: {
                      amount: query.price,
                      currencyCode: 'USD',
                    },
                  },
                },
              },
            ],
            name: `${query.plan}`,
            trialDays: 7,
            returnUrl:`https://admin.shopify.com/store/${query.shop.slice(0, query.shop.indexOf('.'))}/apps/${appName}`,
            // test: true
          },
        },
      });
      if(session.body.data.appSubscriptionCreate.confirmationUrl){
        return session.body.data.appSubscriptionCreate.confirmationUrl
      }
      else{
        errorLog.error('getlinkApproveSupcription error')
      }
    } catch (error) {
      errorLog.error(
        {
          shop: query.shop,
          plan: query.plan,
          error,
          errorMessage: error.message,
        },
        new Error().stack,
      );
    }
}

