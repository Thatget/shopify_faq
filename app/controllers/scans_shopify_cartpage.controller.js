const db = require("../models");
const Scans_Shopify_Cartpage = db.scans_shopify_cartpage;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  const data = req.body
  data.user_id = user_id
  Scans_Shopify_Cartpage.create(data)
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Scans_Shopify_Cartpage."
      });
  });
};

// Find a single Scans_Shopify_Cartpage with an id
exports.findOne = (req, res) => {
  const id = req.jwtDecoded.data.user_id;
  Scans_Shopify_Cartpage.findByPk(id,
    )
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Scans_Shopify_Cartpage with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Scans_Shopify_Cartpage with id=" + id
      });
    });
  };


// Find all of Scans_Shopify_Cartpage
exports.findAll = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  Scans_Shopify_Cartpage.findAll(
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
        message: `Cannot find Scans_Shopify_Cartpage with user_id=${user_id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Scans_Shopify_Cartpage with user_id=" + user_id
    });
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const data = req.body
  await Scans_Shopify_Cartpage.update(data, {
    where: { id: id }
  })
  .then(() => {
    res.send({
      message: "update Scans_Shopify_Cartpage Success !"
    });
  })
  .catch(err => {
      errorLog.error('error update Scans_Shopify_Cartpage 500 status'+err.message)
  });
};



