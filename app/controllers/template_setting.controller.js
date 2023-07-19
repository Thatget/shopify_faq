const db = require("../models");
const TemplateSetting = db.template_setting;
const Setting = db.setting;
// const errorLog = require('../helpers/log.helper');

// Create template
exports.create = async (req, res) => {
  const template = req.body;
  if(template){
    await TemplateSetting.create(template)
    .then(data => {
        res.status(200).send(data);
        return;
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Template."
        });
        return;
    })
  }
  else{
    res.status(500).send({
        message: "Some error occurred while creating the Template."
    });
    return;
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
    res.status(200).send(data);
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
    res.status(200).send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving template_settings."
    })
  });
};


exports.update = async(req, res) => {
  const data = req.body
  await Setting.update({
    faq_template_number: data.template_number
  },{
    where: { id: data.setting_id }
  })
  await TemplateSetting.update(data,{
    where:{
      id: req.params.id
    }
  })
  .then(() => {
    res.status(200).send({
      message: 'Updated!'
    })
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving template_settings."
    })
  });
};

exports.delete = (req, res) => {
  let list_number = [1,2,3,4,5,6,7,8]
  const setting_id = req.params.setting_id
  var list_template_number = list_number.filter(item => item != req.query.template_number)
  TemplateSetting.destroy({
    where:{
      template_number: list_template_number,
      setting_id: setting_id
    }
  })
  .then(() => {
    res.status(200).send({
      message: 'Delete success!'
    })
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving template_settings."
    })
  });
};
