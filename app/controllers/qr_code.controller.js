const db = require("../models");
const QR_code = db.qr_code;
const Op = db.Sequelize.Op;
const QR_code_setting = db.qr_code_setting;
const QR_code_style = db.qr_code_style;
const path = require('path');
const Resize = require('../helpers/resizeImage.helper');
const errorLog = require('./../helpers/log.helper');

exports.create = async(req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  // Validate request
  if (!req.body.qr_code_create) {
    res.status(400).send({
      message: "qr_code_name can not be empty!"
    });
    return;
  }
  // Create a qr_code
  const qr_code = {
    user_id : user_id,
    qr_code_name : req.body.qr_code_create.qr_code_name,
    qr_code_type : req.body.qr_code_create.qr_code_type
  };
  await QR_code.create(qr_code)
  .then(async data => {
    if (data) {
      await QR_code.findOne({
        where: {
          user_id: user_id
        },
        attributes:['id'],
        order: [
          ['id', 'DESC']
        ],
        limit: 1,          
      })
      .then(async qr_code => {
        if(qr_code){
          req.body.qr_code_setting.qr_code_id = qr_code.dataValues.id
          req.body.qr_code_setting.user_id = user_id
          req.body.qr_code_style.user_id = user_id
          req.body.qr_code_style.qr_code_id = qr_code.dataValues.id
        }
        await QR_code_setting.create(req.body.qr_code_setting)
        .catch(e => {
          errorLog.error(`error create qr_code_setting ${e}`)
        })
        await QR_code_style.create(req.body.qr_code_style)
        .catch(e => {
          errorLog.error(`error create qr_code_style ${e}`)
        })
      })
    } else {
      res.status(404).send({
        message: `Cannot create QR_code with user_id=${user_id}.`
      });
    }
    res.send('Create Qr code success !');
  })
  .catch(err => {
    res.status(500).send({
      message: "Error create qr_code with id=" + user_id
    });
  });
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
  const user_id = req.jwtDecoded.data.user_id;
  const qr_id = req.params.id;
  req.body.qr_code_setting.user_id = user_id
  req.body.qr_code_style.user_id = user_id
  const qr_code = {
    qr_code_name : req.body.qr_code_create.qr_code_name
  };
  await QR_code.update(qr_code,{
    where: {
      user_id: user_id,
      id: qr_id
    }
  })
  .then( async() => {
    await QR_code_setting.update( req.body.qr_code_setting, {
      where: {
        user_id: user_id,
        qr_code_id: qr_id
      }
    })
    await QR_code_style.update(req.body.qr_code_style, {
      where: {
        user_id: user_id,
        qr_code_id: qr_id
      }
    })
    res.send('Update Qr code success !');
  })
  .catch(() => {
    res.status(500).send({
      message: "Error update qr_code with qr_code=" + qr_id
    });
  })
};

exports.delete = async (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  const qr_id = req.params.id;
  await QR_code.destroy({
    where: {
      user_id: user_id,
      id: qr_id
    }
  })
  .then( async() => {
    res.send('Delete Qr code success !');
  })
  .catch(() => {
    res.status(500).send({
      message: "Error delete qr_code with qr_code=" + qr_id
    });
  })
};




