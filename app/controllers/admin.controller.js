const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const Setting = db.setting;
const FaqMorePageSetting = db.faq_more_page_setting;
const Rating = db.merchants_rating;
const Plan = db.merchants_plan;

const errorLog = require('../helpers/log.helper');

exports.findAllData = async(req, res) => {
  const count = await User.count();
  let userInfo = []
  let settingData = []
  let faqMorePageSettingData = []
  let ratingData = []
  userInfo = await findUser(parseInt(req.params.offset), parseInt(req.params.limit), count)
  settingData = await findSetting(parseInt(req.params.offset), parseInt(req.params.limit), count)
  faqMorePageSettingData = await findFaqMorePageSetting(parseInt(req.params.offset), parseInt(req.params.limit), count)
  ratingData = await findRating(parseInt(req.params.offset), parseInt(req.params.limit), count)
  let data = {
    user: userInfo,
    setting: settingData, 
    faqMorePageSetting : faqMorePageSettingData,
    rating : ratingData
  }
  return res.send({data})
}; 

async function findUser(offset, limit, count){
  let userInfo = []
  await User.findAll(
  {
    attributes:['shopify_domain','id', 'email', 'createdAt', 'plan_extra'],
    order:['id'],
    offset: parseInt(count - (offset + limit)),
    limit: parseInt(limit),
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
  console.log(userInfo)
  return userInfo
}

async function findSetting(offset, limit, count){
  let settingData = []
  await Setting.findAll({
    attributes:['user_id','id', 'yanet_logo_visible'],
    order:['user_id'],
    offset: parseInt(count - (offset + limit)),
    limit: parseInt(limit),
  })
  .then(data => {
    settingData = data
  })
  .catch(err => {
    errorLog.error(err)
  });
  return settingData
}

async function findFaqMorePageSetting(offset, limit, count){
  let faqMorePageSettingData = []
  await FaqMorePageSetting.findAll(
    {
      attributes:['user_id','id', 'active_feature', 'active_template'],
      order:['user_id'],
      offset: parseInt(count - (offset + limit)),
      limit: parseInt(limit),  
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

async function findRating(offset, limit, count){
  let rattingData = []
  await Rating.findAll({
    order:['user_id'],
    offset: parseInt(count - (offset + limit)),
    limit: parseInt(limit),
  })
  .then(data => {
    rattingData = data
  })
  .catch(err => {
    errorLog.error(err)
  });
  return rattingData
}

exports.searchByDomain = async(req, res) =>{
  let userInfo = []
  let userData = []
  let settingData = []
  let faqMorePageSettingData = []
  let ratingData = []
  let planData = []
  userInfo = await searchUser(req.query)
  if(userInfo.length > 0){
    userData.push(userInfo[0])
    settingData = await searchUserSetting(userInfo[0].dataValues.id)
    faqMorePageSettingData = await searchUserFaqMorePageSetting(userInfo[0].dataValues.id)
    ratingData = await searchUserRating(userInfo[0].dataValues.id)
    planData = await searchUserPlan(userInfo[0].dataValues.id)
  }
  let data = {
    user: userData,
    setting: settingData,
    faqMorePageSetting : faqMorePageSettingData,
    rating : ratingData,
    plan : planData
  }
  return res.send({data})
}

async function searchUser(shop){
  let userInfo = []
  if(shop.shop){
    await User.findAll(
    {
      attributes:['id','email', 'shopify_domain', 'createdAt'],
      where:{
        shopify_domain: shop.shop
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
  }
  else{
    await User.findAll(
      {
        attributes:['id','email', 'shopify_domain', 'createdAt'],
        where:{
          email: shop.email
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
  }
  return userInfo
}

async function searchUserSetting(user_id){
  let settingData = []
  await Setting.findAll({
    attributes:['yanet_logo_visible'],
    where:{
      user_id: user_id
    }
  })
  .then(data => {
    settingData = data
  })
  .catch(err => {
    errorLog.error(err)
  });
  return settingData
}

async function searchUserFaqMorePageSetting(user_id){
  let faqMorePageSettingData = []
  await FaqMorePageSetting.findAll(
    {
      attributes:['active_feature', 'active_template'],
      where:{
        user_id: user_id
      }
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

async function searchUserRating(user_id){
  let rattingData = []
  await Rating.findAll({
    where: {
      user_id: user_id
    },
    attributes:['star', 'comment'],
  })
  .then(data => {
    rattingData = data
  })
  .catch(err => {
    errorLog.error(err)
  });
  return rattingData
}

async function searchUserPlan(user_id){
  let planData = []
  await Plan.findAll({
    where: {
      user_id: user_id
    },
    attributes:['plan'],
  })
  .then(data => {
    planData = data
  })
  .catch(err => {
    errorLog.error(err)
  });
  return planData
}
