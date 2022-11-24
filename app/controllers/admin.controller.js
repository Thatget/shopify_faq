const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const Setting = db.setting;
const FaqMorePageSetting = db.faq_more_page_setting;
const Rating = db.merchants_rating;

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
    order:['id']
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
   console.log(err)
  });
  return userInfo
}

async function findSetting(){
  let settingData = []
  await Setting.findAll()
  .then(data => {
    settingData = data
  })
  .catch(err => {
    console.log(err)
  });
  return settingData
}

async function findFaqMorePageSetting(){
  let faqMorePageSettingData = []
  await FaqMorePageSetting.findAll()
  .then(data => {
    faqMorePageSettingData = data
  })
  .catch(err => {
    console.log(err)
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
    console.log(err)
  });
  return rattingData
}