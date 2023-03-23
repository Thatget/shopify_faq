const db = require("../models");
const QR_code_style = db.qr_code_style;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    const qr_code_style = req.body

    QR_code_style.create(qr_code_style)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the QR_code_style."
        });
    });
};

// Find a single QR_code_style with an id
exports.findOne = (req, res) => {
  const id = req.param.id;
  QR_code_style.findOne(id,
    {
      where: {
        id: id
      }
    })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find QR_code_style with qr_code_id=${qr_code_id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving QR_code_style with qr_code_id=" + qr_code_id
      });
    });
  };


// Find all user
exports.findAll = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  QR_code_style.findAll(
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
        message: `Cannot find QR_code_style with user_id=${user_id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving QR_code_style with user_id=" + user_id
    });
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const data = req.body
  await QR_code_style.update(data, {
    where: { id: id }
  })
  .then(() => {
    res.send({
      message: "update QR_code Success !"
    });
  })
  .catch(err => {
      errorLog.error('error update QR_code 500 status'+err.message)
  });
};





