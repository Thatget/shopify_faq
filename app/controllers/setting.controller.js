const db = require("../models");
const Setting = db.setting;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

    let setting = req.body;
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

// Retrieve all Setting from the database.
exports.findAll = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  Setting.findAll({ where: { user_id : user_id} })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving setting."
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
  Setting.update(req.body, {
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
        message: "Error updating setting with user_id=" + user_id
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
