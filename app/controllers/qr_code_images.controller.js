const db = require("../models");
const QR_code_images = db.qr_code_images;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const qr_code_images = req.body
    QR_code_images.create(qr_code_images)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the QR_code_images."
        });
    });
};

exports.findAll = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  QR_code_images.findAll(
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
        message: `Cannot find QR_code_images with user_id=${user_id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving QR_code_images with user_id=" + user_id
    });
  });
};
