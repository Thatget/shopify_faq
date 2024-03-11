const db = require("../models");
const Rating = db.merchants_rating;
const errorLog = require('../helpers/log.helper');
const User = db.user;

// Create a rating
exports.create = async (req, res) => {
  const rating = req.body;
  await User.findOne({
    where: {
      shopify_domain: rating.domain
    }
  })
  .then(async response => {
    if(response.dataValues.id){
      rating.email = response.dataValues.email
      rating.user_id = response.dataValues.id
      await Rating.findOne({
        where: {
          domain: rating.domain
        }
      })
      .then(async resp => {
        if(!resp){
          await Rating.create(rating)
          .then((data) => {
            res.send(data);
          })
        }
        else{
          await Rating.update({
            comment: rating.comment,
            star : rating.star
          }, {
            where: {
              id: resp.dataValues.id
            }
          })
          .then((data) => {
            res.send(data);
          })
        }
      })
    }
    else{
      res.status(500).send({
        message: "Some error occurred while creating the rating."
      });
    }
  })
  .catch(e => {
    errorLog.error(e)
  })
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

exports.findOne = async (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  await Rating.findOne({
    where: {user_id : user_id}
  })
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