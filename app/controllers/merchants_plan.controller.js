
const db = require("../models");
const Shopify = require("@shopify/shopify-api");
const Plan = db.merchants_plan;
const errorLog = require('../helpers/log.helper');

// Create a plan
exports.create = async (req, res) => {
  const plan = req.body;
  const user_id = req.jwtDecoded.data.user_id;
  plan.user_id = user_id
  await Plan.create(plan)
    .then(data => {
      res.send(data);
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the plan."
      });
      return;
    });
};

exports.findAll = async (req, res) => {
  await Plan.findAll()
    .then(data => {
      res.send(data);
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving plan."
      });
      return;
    });
};

exports.findOne = async (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  await Plan.findOne({
    where: {user_id : user_id}
  })
    .then(data => {
      res.send(data);
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving plan."
      });
      return;
    });
};

exports.update = async (req, res) => {
  const plan = req.body;
  const user_id = req.jwtDecoded.data.user_id;
  plan.user_id = user_id
  await Plan.update(plan, {
      where: {
        user_id: user_id
      }
    })
    .then(data => {
      res.send(data);
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the plan."
      });
      return;
    });
};

exports.select = async (req, res) => {
  console.log(Shopify)
  console.log(Shopify.default.Utils.loadCurrentSession(req, res))
  // const client = Shopify.default.Utils.loadCurrentSession(req, res, true);
  // console.log(client)
  // const checkBilling = await billingMiddleware()
  // console.log(checkBilling)
  // await shopify()
};

// const shopify = shopifyApi({
//   billing: {
//     'My billing plan': {
//       interval: BillingInterval.Every30Days,
//       amount: 1,
//       currencyCode: 'USD',
//       replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
//     },
//   },
// });

async function billingMiddleware(req, res, next) {
  const sessionId = Shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });
  console.log(sessionId)
  // use sessionId to retrieve session from app's session storage
  // In this example, getSessionFromStorage() must be provided by app
  // const session = await getSessionFromStorage(sessionId);

  // const hasPayment = await Shopify.Billing.check({
  //   session,
  //   plans: ['My billing plan'],
  //   isTest: true,
  // });

  // if (hasPayment) {
  //   next();
  // } else {
  //   // Either request payment now (if single plan) or redirect to plan selection page (if multiple plans available), e.g.
  //   const confirmationUrl = await shopify.billing.request({
  //     session,
  //     plan: 'My billing plan',
  //     isTest: true,
  //   });

  //   res.redirect(confirmationUrl);
  // }
}