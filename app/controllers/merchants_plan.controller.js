
const db = require("../models");
const Shopify = require("@shopify/shopify-api");
const Plan = db.merchants_plan;
const errorLog = require('../helpers/log.helper');
const apiSecret = process.env.SHOPIFY_API_SECRET;
const apiKey = process.env.SHOPIFY_API_KEY;
const scopes = process.env.SCOPES;
const forwardingAddress = process.env.HOST;
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

exports.cancel = async (req, res) => {
  const client = new Shopify.Clients.Graphql(
    req.body.shop,
    req.body.accessToken,
  );
  
  const currentSubscription = await this.getCurrentSubscription(
    req.body,
    currentPlan,
  );
  
  if (currentSubscription) {
    try {
      const session = await client.query({
        data: {
          query: APP_SUBSCRIPTION_CANCEL,
          variables: {
            id: currentSubscription.id,
          },
        },
      });
  
      if (
        (session?.body)?.data?.appSubscriptionCancel?.appSubscription?.id
      ) {
        return true;
      }
    } catch (error) {
      this.logger.error(
        {
          shop: req.body.shop,
          plan: req.body.plan,
          error,
          errorMessage: error.message,
        },
        new Error().stack,
      );
    }
  }  
};
