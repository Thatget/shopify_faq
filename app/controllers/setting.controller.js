const db = require("../models");
const Setting = db.setting;
const User = db.user;

exports.create = (req, res) => {

    // Create a setting
    const setting = req.body;
    setting.user_id = req.jwtDecoded.data.user_id;

  Setting.create(setting)
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Setting."
      });
  });
};

// Find a single Setting with an id
exports.findOne = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  Setting.findOne({ where: { user_id : user_id}})
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Setting with user_id=${user_id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving setting with user_id=" + user_id
      });
    });
  };

// Update a Setting by the id in the request
exports.update = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  const setting = req.body;
  if (setting.user_id) {
      delete setting.user_id;
  }
  Setting.update(setting, {
    where: { user_id: user_id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Setting was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Setting with user_id=${user_id}. Maybe Setting was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};

// Delete a Setting with the specified id in the request
exports.delete = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  Setting.destroy({
    where: { user_id: user_id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Setting was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete setting with user_id=${user_id}. Maybe setting was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete setting with user_id=" + user_id
      });
    });
  };

// Faq page
// Find a single Setting with an id
exports.findOneInFaqPage = async (req, res) => {
    // Validate request
    if (!req.params.shop) {
        res.status(400).send({
            message: "Shop can not be empty!"
        });
        return false;
    }
    const shop = req.params.shop;
    var userID = null;
    await User.findOne({ where: { shopify_domain: shop}})
        .then( async userData => {
            if (userData) {
                userID = userData.dataValues.id;
                await Setting.findOne({ where: { user_id : userID}})
                    .then(data => {
                        if (data) {
                            res.send(data);
                        } else {
                            res.status(404).send({
                                message: `Cannot find Setting with user_id=${userID}.`
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    });
            } else {
                res.status(400).send({
                    message: "Shop name is not found!"
                });
                return;
            }
        }).catch(error => {
        console.log(error)
        return;
    })
};
