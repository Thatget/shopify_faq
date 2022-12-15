const db = require("../models");
const errorLog = require('../helpers/log.helper')
const Setting = db.setting
const Faq = db.faq;
const FaqCategory = db.faq_category;

// Create a messages setting
exports.create = async (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  const dataCreate = req.body;
  const faqData = dataCreate.faq
  const category = dataCreate.category
  const setting = dataCreate.setting
  category.user_id = user_id
  setting.user_id = user_id
  category.identify = "default" + user_id
  faqData.user_id = user_id
  faqData.category_identify = "default" + user_id
  faqData.identify = "default" + user_id + "default" + user_id
  await createCategoryData(category, faqData)
  await updateSetting(setting)
  res.send({
    message: "Tutorial Complete !"
  });
};

exports.update = async (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  await Setting.update({
    tutorial_active : false,
  }, {
    where: { user_id: user_id }
  })
  .then(() => {
    res.send({
      message: "Tutorial skip Complete !"
    });
  })
  .catch(err => {
      errorLog.error('error update setting 500 status'+err.message)
  });
};

async function createCategoryData(category, faq) {
  await FaqCategory.create(category)
  .then(async () => {
    await Faq.create(faq)
    .then(data => {
      errorLog.error(data)
    })
    .catch(err => {
      errorLog.error(err)
    });
  })
  .catch(err => {
    errorLog.error(err)
  });
}

async function updateSetting(setting) {
  let faq_template_number = setting.faq_template_number
  let tutorial_active = setting.tutorial_active
  await Setting.update({
    faq_template_number,
    tutorial_active
  }, {
      where: { user_id: setting.user_id }
  })
  .then(() => {
    errorLog.error('update setting success !')
  })
  .catch(err => {
      errorLog.error('error update setting 500 status'+err.message)
  });
}


