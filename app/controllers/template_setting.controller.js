const db = require("../models");
const TemplateSetting = db.template_setting;
const errorLog = require('../helpers/log.helper');

// Create template
exports.create = async (req, res) => {
  const template = req.body;
  if(template.length < 0){
      res.status(500).send({
          message: "Some error occurred while creating the Template."
      });
      return;
  }
  else{
      await TemplateSetting.create(template)
          .then(data => {
              res.send(data);
              return;
          })
          .catch(err => {
              res.status(500).send({
                  message:
                      err.message || "Some error occurred while creating the Template."
              });
              return;
          });

  }
};


// Retrieve all TemplateSetting of a category from the database.
exports.findAll = (req, res) => {
  TemplateSetting.findAll({
    where: {
      setting_id: req.params.setting_id
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving template_settings."
    })
  });
};
exports.getAll = (req, res) => {
  TemplateSetting.findAll({
    attributes:['id', 'custom_css', 'setting_id']
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving template_settings."
    })
  });
};
exports.update = (req, res) => {
  const data = req.body
  TemplateSetting.update({
      custom_css: data.custom_css
    },{
    where:{
      id: req.params.id
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving template_settings."
    })
  });
};
