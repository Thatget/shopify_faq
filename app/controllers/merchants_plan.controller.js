
const db = require("../models");
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

