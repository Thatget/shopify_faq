const db = require("../models");
const QR_code = db.qr_code;
const Op = db.Sequelize.Op;
const Qr_code_style = db.qr_code_style
const Qr_code_setting = db.qr_code_setting

exports.create = async(req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  console.log(req.body)
  var qr_code_data
  // Validate request
  if (!req.body.qr_code_style || !req.body.qr_code_setting) {
    res.status(400).send({
      message: "qr_code_setting, qr_code_style can not be empty!"
    });
    return;
  }
  // Create a qr_code
  if(req.body.qr_code_create){
    const qr_code = {
      user_id : user_id,
      qr_code_name : req.body.qr_code_create.qr_code_name
    };
    await QR_code.create(qr_code)
  }
  await QR_code.findOne({
    where: {
      qr_code_name: req.body.qr_code_setting.qr_code_name
    }
  })
  .then(async(data) => {
    if(data){
      qr_code_data = data
      if(req.body.qr_code_style){
        req.body.qr_code_style.user_id = user_id
        req.body.qr_code_style.qr_code_name = qr_code_data.qr_code_name
        console.log(req.body.qr_code_style)
        await Qr_code_style.create(req.body.qr_code_style)
      }
      if(req.body.qr_code_setting){
        req.body.qr_code_setting.user_id = user_id
        req.body.qr_code_setting.qr_code_name = qr_code_data.qr_code_name
        await Qr_code_setting.create(req.body.qr_code_setting)
      }
      res.send('Create Qr code success !');
    }
    else{
      if(req.body.qr_code_style){
        req.body.qr_code_style.user_id = user_id
        await Qr_code_style.create(req.body.qr_code_style)
      }
      if(req.body.qr_code_setting){
        req.body.qr_code_setting.user_id = user_id
        await Qr_code_setting.create(req.body.qr_code_setting)
      }
      res.send('Create Qr code success !');
    }
  })

};

// Find a single QR_code with an id
exports.findOne = (req, res) => {
  const id = req.jwtDecoded.data.user_id;
  QR_code.findByPk(id,
    )
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find QR_code with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id
      });
    });
  };


// Find all of user
exports.findAll = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  QR_code.findAll(
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
        message: `Cannot find QR_code with user_id=${user_id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving user with user_id=" + user_id
    });
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const data = req.body
  await QR_code.update(data, {
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



