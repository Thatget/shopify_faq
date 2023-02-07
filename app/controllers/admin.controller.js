const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const Setting = db.setting;
const FaqMorePageSetting = db.faq_more_page_setting;
const Rating = db.merchants_rating;
const errorLog = require('../helpers/log.helper');

exports.findAllData = async(req, res) => {
  let userInfo = []
  let settingData = []
  let faqMorePageSettingData = []
  let ratingData = []
  userInfo = await findUser()
  settingData = await findSetting()
  faqMorePageSettingData = await findFaqMorePageSetting()
  ratingData = await findRating()
  let data = {
    user: userInfo,
    setting: settingData, 
    faqMorePageSetting : faqMorePageSettingData, 
    rating : ratingData
  }
  return res.send({data})
}; 

async function findUser(){
  let userInfo = []
  await User.findAll(
  {
    attributes:['shopify_domain','id', 'email', 'createdAt'],
    order:['id'],
    limit: 2,
    where:{
      id : 10
    }
  })
  .then(data => {
    if (data) {
      userInfo = data
    } 
    else {
      res.status(404).send({
        message: `Cannot find User with id=${id}.`
      });
    }
  })
  .catch(err => {
    errorLog.error(err)
  });
  return userInfo
}

async function findSetting(){
  let settingData = []
  await Setting.findAll({
    attributes:['user_id','id', 'yanet_logo_visible']
  })
  .then(data => {
    settingData = data
  })
  .catch(err => {
    errorLog.error(err)
  });
  return settingData
}

async function findFaqMorePageSetting(){
  let faqMorePageSettingData = []
  await FaqMorePageSetting.findAll(
    {
      attributes:['user_id','id', 'active_feature', 'active_template']
    }
  )
  .then(data => {
    faqMorePageSettingData = data
  })
  .catch(err => {
    errorLog.error(err)
  });
  return faqMorePageSettingData
}

async function findRating(){
  let rattingData = []
  await Rating.findAll()
  .then(data => {
    rattingData = data
  })
  .catch(err => {
    errorLog.error(err)
  });
  return rattingData
}