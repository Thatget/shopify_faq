const db = require("../models");
const Setting = db.setting;
const TemplateSetting = db.template_setting;
const User = db.user;

exports.create = async (req, res) => {

    // Create a setting
    const setting = req.body;
    setting.user_id = req.jwtDecoded.data.user_id;

    let template_setting = {};
    let setting_data = {};
  Setting.create(setting)
  .then(async data => {
      let return_data = {};
      setting_data = data.dataValues;
      setting.setting_id = setting_data.id;
      try {
          template_setting = await createFaqTemplate(setting);
          delete template_setting.id;
      } catch (e) {
      }
      return_data = {setting_data,template_setting};
      res.send(return_data);
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
  let return_setting_data = {};
  let template_setting = {};
  let setting_data = {};
  await Setting.findOne({ where: { user_id : user_id}})
    .then(data => {
      if (data) {
          setting_data = data.dataValues;
          if (setting_data.template_number) {
              TemplateSetting.findOne({ where: { setting_id : setting_data.id, template_number: setting_data.template_number}})
                  .then(template_setting_data => {
                      if (template_setting_data) {
                          template_setting = template_setting_data.dataValues;
                          delete template_setting.id;
                      }
                  }).catch()
          }
          return_setting_data = Object.assign(setting_data, template_setting);
        res.send(return_setting_data);
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
exports.update = async (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  const setting = req.body;
  if (setting.user_id) {
      delete setting.user_id;
  }
  if (setting.id) {
      delete setting.id;
  }
    await Setting.findOne({ where: { user_id : user_id}})
        .then(async data => {
            if (data) {
                let setting_data_id = data.dataValues.id;
                // Update Setting
                await Setting.update(setting, {
                    where: { id: setting_data_id }
                })
                    .then(num => {
                        if (num == 1) {
                        } else {
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message
                        });
                    });
                if (req.body.faq_template_number) {
                    await TemplateSetting.findOne({where: {template_number: req.body.faq_template_number, setting_id: setting_data_id}})
                        .then(async data => {
                            if (data) {
                                // Update template setting
                                await TemplateSetting.update(setting, {where: {template_number: req.body.faq_template_number, setting_id: setting_data_id}})
                                    .then(num => {
                                        if (num == 1) {
                                        } else {
                                        }
                                    })
                                    .catch(err => {});
                            } else {
                                // Create template setting
                                setting.setting_id = setting_data_id;
                                template_setting = await createFaqTemplate(setting);
                            }
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: "Error retrieving category with id=" + id
                            });
                        });
                    res.send(setting);
                }
            } else {
                res.status(404).send({
                    message: `Cannot find Setting with user_id=${user_id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                // message: "Error retrieving setting in updating with user_id=" + user_id
                message: 'setting update 130 '+ err.message
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
    let userID = null;
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

async function createFaqTemplate(templateSetting) {
    let template_setting = null;
    if (templateSetting.createdAt) {
        delete templateSetting.createdAt;
    }
    if (templateSetting.updatedAt) {
        delete templateSetting.updatedAt;
    }
    templateSetting.template_number = templateSetting.faq_template_number;
    await TemplateSetting.create(templateSetting)
        .then(data => {
            template_setting = data.dataValues;
        })
        .catch(err => {}
        );
    return template_setting;
}