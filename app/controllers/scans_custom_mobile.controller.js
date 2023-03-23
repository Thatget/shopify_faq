const db = require("../models");
const Scans_Custom_Mobile = db.scans_custom_mobile;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  const data = req.body
  data.user_id = user_id
  Scans_Custom_imIges.create(data)
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Scans_Custom_Mobile."
      });
  });
};

// Find a single Scans_Custom_Mobile with an id
exports.findOne = (req, res) => {
  const id = req.jwtDecoded.data.user_id;
  Scans_Custom_Mobile.findByPk(id,
    )
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Scans_Custom_Mobile with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Scans_Custom_Mobile with id=" + id
      });
    });
  };


// Find all of Scans_Custom_Mobile
exports.findAll = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  Scans_Custom_Mobile.findAll(
  {
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Scans_Custom_Mobile with user_id=${user_id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Scans_Custom_Mobile with user_id=" + user_id
    });
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const data = req.body
  await Scans_Custom_imIges.update(data, {
    where: { id: id }
  })
  .then(() => {
    res.send({
      message: "update Scans_Custom_Mobile Success !"
    });
  })
  .catch(err => {
      errorLog.error('error update Scans_CustomIimages 500 status'+err.message)
  });
};



