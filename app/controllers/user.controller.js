const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.store_name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    // Create a user
    const user = {
      store_name: req.body.store_name,
      shopify_domain: req.body.shopify_domain,
      shopify_access_token: req.body.shopify_access_token,
      email: req.body.email,
      phone: req.body.phone,
    };

    User.create(user)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.jwtDecoded.data.user_id;
    User.findByPk(id,
        {
            attributes:['shopify_domain','store_name','shopLocales','phone','email']
        })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving user with id=" + id
        });
      });
  };


// Find all user
exports.findAll = (req, res) => {
  User.findAll(
      {
          attributes:['shopify_domain','id', 'email', 'createdAt'],
          order:['id']
      })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id
      });
    });
};
