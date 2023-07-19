const db = require("../models");
const User = db.user;
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
  let listUserId = []
  let planData
  if(req.params.plan == 'Pro' || req.params.plan == 'Ultimate'){
    planData = await findPlan(userInfo, parseInt(req.params.offset), parseInt(req.params.limit), req.params.plan)
    planData.forEach(item => {
      listUserId.push(item.user_id)
    })
    userInfo = await findUser(parseInt(req.params.offset), parseInt(req.params.limit), count, listUserId)
  }
  else if(req.params.plan == 'Free'){
    planData = await findPlan(userInfo, parseInt(req.params.offset), parseInt(req.params.limit), req.params.plan)
    planData.forEach(item => {
      listUserId.push(item.user_id)
    })
    userInfo = await findUser(parseInt(req.params.offset), parseInt(req.params.limit), count, listUserId)
  }
  else{
    userInfo = await findUser(parseInt(req.params.offset), parseInt(req.params.limit), count, listUserId)
    userInfo.forEach(item => {
      listUserId.push(item.id)
    })
    planData = await findPlan(listUserId)
  }
  settingData = await findSetting(listUserId)
  faqMorePageSettingData = await findFaqMorePageSetting(listUserId)
  ratingData = await findRating()
  let data = {
    user: userInfo,
    setting: settingData, 
    faqMorePageSetting : faqMorePageSettingData,
    rating : ratingData,
    plan: planData
  }
  return res.send({data})
}; 


async function findUser(offset, limit, count, listUserId){
  let userInfo = []
  if(listUserId.length > 0){
    await User.findAll(
    {
      attributes:['shopify_domain','id', 'email', 'createdAt', 'plan_extra'],
      order:['id'],
      offset: listUserId.length > (offset + limit)? parseInt(listUserId.length - (offset + limit)) : 0,
      limit: parseInt(limit),
      where: {
        id: listUserId
      }
    })
    .catch(err => {
      errorLog.error(err)
    });
  }
  else{
    await User.findAll(
    {
      attributes:['shopify_domain','id', 'email', 'createdAt', 'plan_extra'],
      order:['id'],
      offset: count > 50? parseInt(count - (offset + limit)) : 0,
      limit: limit,
    })
    .catch(err => {
      errorLog.error(err)
    });
  }
  return userInfo
}

async function findSetting(listUserId){
  let settingData = []
  await Setting.findAll({
    attributes:['user_id','id', 'yanet_logo_visible'],
    order:['user_id'],
    where: {
      user_id : listUserId
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

async function findFaqMorePageSetting(listUserId){
  let faqMorePageSettingData = []
  await FaqMorePageSetting.findAll(
    {
      attributes:['user_id','id', 'active_feature', 'active_template'],
      order:['user_id'],
      where: {
        user_id : listUserId
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

async function findRating(){
  let rattingData = []
  await Rating.findAll({
    order:['user_id'],
  })
  .then(data => {
    rattingData = data
  })
  .catch(err => {
    errorLog.error(err)
  });
  return rattingData
}

async function findPlan(listUserId, offset, limit, plan){
  let planData = []
  if(listUserId.length > 0){
    await Plan.findAll({
      order:['user_id'],
      where: {
        user_id: listUserId
      }
    })
    .then(data => {
      planData = data
    })
    .catch(err => {
      errorLog.error(err)
    });
  }
  else{
    if(plan != 'Pro' && plan != 'Ultimate'){
      await Plan.findAll({
        order:['user_id'],
        limit: limit,
        where: {
          plan: ['Free', 'Free extra', 'Free_01']
        }
      })
      .then(data => {
        planData = data
      })
      .catch(err => {
        errorLog.error(err)
      });
    }
    else{
      await Plan.findAll({
        order:['user_id'],
        // limit: limit,
        where: {
          plan: plan
        }
      })
      .then(data => {
        planData = data
      })
      .catch(err => {
        errorLog.error(err)
      });
    }
  }
  return planData
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
