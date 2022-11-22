const db = require("../models");
const Rating = db.merchants_rating;
const errorLog = require('../helpers/log.helper');

// Create a rating
exports.create = async (req, res) => {
  const rating = req.body;
  const user_id = req.jwtDecoded.data.user_id;
  rating.user_id = user_id
  await Rating.create(rating)
    .then(data => {
      res.send(data);
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the rating."
      });
      return;
    });
};

exports.findAll = async (req, res) => {
  await Rating.findAll()
    .then(data => {
      res.send(data);
      return;
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving rating."
      });
      return;
    });
};

exports.update = async (req, res) => {
  const rating = req.body;
  const user_id = req.jwtDecoded.data.user_id;
  rating.user_id = user_id
  await Rating.update(rating, {
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
        message: err.message || "Some error occurred while creating the rating."
      });
      return;
    });
};