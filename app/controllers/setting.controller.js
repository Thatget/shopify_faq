const db = require("../models");
const Setting = db.setting;
const TemplateSetting = db.template_setting;
const User = db.user;
const errorLog = require('../helpers/log.helper')

// Create a setting
exports.create = async (req, res) => {
  let setting_data = req.body;
  setting_data.user_id = req.jwtDecoded.data.user_id;
  Setting.create(setting_data)
  .then(data => {
    res.send(data.dataValues);
  })
  .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Setting."
      });
  });
};

// Find a single Setting with an id
exports.findOne = async (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  let setting_data = {};
  await Setting.findOne({ where: { user_id : user_id}})
  .then(async data => {
    if (data) {
        setting_data = data.dataValues;
      res.send(setting_data);
    } else {
      res.status(404).send({
        message: `Cannot find Setting with user_id=${user_id}.`
      });
    }
  })
  .catch(() => {
      res.status(500).send({
          message: "Error retrieving setting with user_id=" + user_id
      });
  });
};

// Update a Setting by the id in the request
exports.update = async (req, res) => {
  const setting = req.body;
  if (setting.user_id) {
    delete setting.user_id;
  }
  await Setting.update(setting,{
    where: { id: setting.id }
  })
  .then(() => {
    res.status(200).send('Updated !')
  })
  .catch(err => {
    res.status(500).send('Update false!')
    errorLog.error('error update setting 500 status'+err.message)
  });
};

exports.updateActiveFeature = async(req, res) => {
    const user_id = req.params.user_id
    const yanet_logo_visible = req.body
    await Setting.update(yanet_logo_visible, {
        where: { user_id: user_id }
    }).then(num => {
      if (num == 1) {
          res.send({
              message: "Setting was update successfully!"
          });
      } else {
          errorLog.error('error update setting')
      }
    }).catch(err => {
        errorLog.error('error update setting 500 status'+err.message)
    });
}

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
    .catch(() => {
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
    let userID = null;
    await User.findOne({ where: { shopify_domain: shop}})
        .then( async userData => {
            if (userData) {
                userID = userData.dataValues.id;
                await Setting.findOne({ where: { user_id : userID}})
                    .then(data => {
                        if (data) {
                            res.status(200).send(data);
                        } else {
                            res.status(404).send({
                                message: `Cannot find Setting with user_id=${userID}.`
                            });
                        }
                    })
                    .catch(err => {
                        errorLog.error(err.message)
                    });
            } else {
                res.status(400).send({
                    message: "Shop name is not found!"
                });
                return;
            }
        }).catch(() => {
            res.status(400).send({
                message: "Shop name is not found!"
            });
        return;
    })
};

// async function createFaqTemplate(templateSetting) {
//   let template_setting = null;
//   if (templateSetting.createdAt) {
//       delete templateSetting.createdAt;
//   }
//   if (templateSetting.updatedAt) {
//       delete templateSetting.updatedAt;
//   }
//   templateSetting.template_number = templateSetting.faq_template_number;
//   await TemplateSetting.create(templateSetting)
//       .then(data => {
//           template_setting = data.dataValues;
//       })
//       .catch(() => {}
//       );
//   return template_setting;
// }

exports.findTemplateSetting = async (req, res) => {
  // Validate request
  if (!req.params.faq_template_number) {
      res.status(400).send({
          message: "Please select template number!"
      });
      return false;
  }
  const template_number = req.params.faq_template_number
  const user_id = req.jwtDecoded.data.user_id;
  var templateSetting = {}
  let continueCondition = {}
  continueCondition.condition = true
  await Setting.findOne({
      attributes: ['id'],
      where: {user_id: user_id}
  }).then(async settingData => {
      if (settingData) {
          let setting_id = settingData.dataValues.id;
          await TemplateSetting.findOne({where: {template_number: template_number, setting_id: setting_id}})
              .then(templateSettingData => {
                  if (templateSettingData) {
                      templateSetting = templateSettingData.dataValues
                  }
              }).catch(e=> errorLog.error(e.message))
      }
  }).catch(error => {
      errorLog.error(error.message)
      continueCondition.condition = false
      continueCondition.errmessage = error.message
  })
  if (!continueCondition.condition) {
      res.status(404).send({
          message:
              continueCondition.errmessage || "Some error occurred !"
      });
      return;
  }
  res.send(templateSetting);
};

exports.getAll = (res) => {
  Setting.findAll()
  .then(data => {
    res.status(200).send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving template_settings."
    })
  });
};