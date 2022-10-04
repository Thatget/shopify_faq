const db = require("../models");
const TemplateSetting = db.template_setting;
const errorLog = require('../helpers/log.helper');

// Retrieve all TemplateSetting of a category from the database.
exports.findAll = (req, res) => {
  console.log(req.params.setting_id,'ssssssssssssssssssssssssssssssssss')
  TemplateSetting.findAll({
    where: {
      setting_id: req.params.setting_id
    }
  })
  .then(data => {
    res.send(data);
    console.log(data)
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving template_settings."
    })
  });
};

