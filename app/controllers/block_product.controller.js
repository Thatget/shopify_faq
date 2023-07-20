const db = require("../models");
const FaqCategory = db.faq_category;
const User = db.user;
const Product = db.product
const Faq = db.faq
const Setting = db.setting
const TemplateSetting = db.template_setting
const Plan = db.merchants_plan
let listFaqId = []
const FaqProduct = db.faq_product;
const errorLog = require('../helpers/log.helper');
let freeLimitFaqs = 15
let free01LimitFaqs = 30
const shopifyApi = require('./../helpers/shopifyApi.helper')
const freePlan = 'Free'
const freePlan01 = 'Free_01'
const freeExtraPlan = 'Free extra'

exports.findAllProduct = async (req, res) => {
    let Faqs = [];
    let Categories = [];
    let userID = null;
    let templateSetting = []
    const shop = req.params.shop;
    const product_id = req.params.product_id
    let locale = req.params.locale
    await User.findOne({ where: { shopify_domain: shop}})
    .then( async userData => {
        if (userData) {
            userID = userData.dataValues.id;
            if(locale === JSON.parse(userData.dataValues.shopLocales).shopLocales.filter(item => {return item.primary === true})[0].locale){
                locale = 'default'
            }
            else{
                locale = req.params.locale
            }
            let settingData = []
            let plan = await getPlan(userID)
            let currentPlan = await shopifyApi.getCurrentPlan(shop, userData.dataValues.shopify_access_token)
            // if(plan != 'Free' || userData.plan_extra){
              await Setting.findOne({
                  where:{
                    user_id: userID
                  }
              })
              .then(async data => {
                  settingData = data.dataValues
                  let template_number = settingData.faq_template_number
                  if((currentPlan.length == 0 && !userData.plan_extra) && settingData.faq_template_number > 3){
                    template_number = 2
                  }
                  await TemplateSetting.findOne({
                      where: {
                          template_number: template_number,
                          setting_id: data.dataValues.id
                      }
                  })
                  .then(data => {
                      templateSetting = data.dataValues
                      if(settingData){
                          templateSetting.category_sort_name = settingData.category_sort_name
                          templateSetting.faq_sort_name = settingData.faq_sort_name
                          templateSetting.faq_uncategory_hidden = settingData.faq_uncategory_hidden
                          templateSetting.dont_category_faq = settingData.dont_category_faq
                          templateSetting.more_page_schema = settingData.more_page_schema
                      }
                  })
                  .catch(e =>{
                      errorLog.error(e)
                  })
              })
              .catch(e =>{
                  errorLog.error(e)
              })
              await getProduct(userID, product_id, locale, Faqs, templateSetting, plan)
              await getCategory(locale, userID, Categories, templateSetting)
            // }
        }
         else {
            return res.status(400).send({
                message: "Shop name is not found !"
            });
        }
    })
    .catch((e) => {
        return res.status(500).send(e);
    })
    // const result = await User.findOne({ where: { shopify_domain: shop}}).catch(error => {
    //     return res.status(500).send("some error");
    // });

    return res.send({faq: Faqs, category: Categories, templateSetting: templateSetting})
};

async function getPlan(userID){
  let PlanData = null
    await Plan.findOne({
      where: {
        user_id: userID,
      },
    })
    .then(async data => {
        if(data){
          PlanData = data.dataValues.plan
        }
    })
    .catch(err => {
      errorLog.error(err)
    });
    return PlanData;
}

async function getProduct(userID, product_id, locale, Faqs, templateSetting, plan){
    let productId = null
    await Product.findOne({
        where: {
            user_id: userID,
            product_id: product_id
        },
    })
    .then(async data => {
        if(data){
            productId = data.dataValues.id
            await getFaqsId(productId, locale, Faqs, userID, templateSetting, plan)
        }
        else{
            productId = data
        }
    })
    .catch(err => {
      errorLog.error(err)
    });
    return Product;
}

async function getFaqsId(product_id , locale, Faqs, userID, templateSetting, plan){
  await FaqProduct.findAll({
      where: {
          product_id: product_id
      },
  })
  .then( async data => {
    if(data){
      listFaqId = data
      let limit = 0
      if(plan == freePlan){
        limit = freeLimitFaqs
      }
      else if(plan == freePlan01 || plan == freeExtraPlan){
        limit = free01LimitFaqs
      }    
      for(let i = 0; i < listFaqId.length; i++){
        if(i < limit && limit > 0){
          await getFaqs(listFaqId[i].dataValues.faq_identify,listFaqId[i].dataValues.category_identify, locale, Faqs, userID)
        }
        else{
          await getFaqs(listFaqId[i].dataValues.faq_identify,listFaqId[i].dataValues.category_identify, locale, Faqs, userID)
        }
      }
    }
  })
}

async function getFaqs(faq_identify, category_identify, locale, Faqs, userID){
  await Faq.findAll({
    where: {
      identify : faq_identify ,
      category_identify : category_identify,
      user_id : userID
    },
  })
  .then(async data => {
    if(data && data.length > 0){
      let checkFaq
      if(data.some(element => {
        return element.dataValues.locale == locale
      })){
        checkFaq = data.filter(item => {
          return item.dataValues.locale == locale
        })
      }
      else{
        checkFaq = data.filter(item => {
          return item.dataValues.locale == 'default'
        })
      }
      if(checkFaq.length > 0){
        Faqs.push(checkFaq[0])
      }
    }
  })
  .catch(err => {
    errorLog.error(err)
  });
}

async function getCategory(locale, userID, Categories, templateSetting){
    if(templateSetting.category_sort_name === true){
        await FaqCategory.findAll({
            where: {
                locale: locale,
                user_id: userID
            },
            order:['title']
        })
        .then(data => {
          Categories.push(data)
        })
        .catch(err => {
           errorLog.error(err)
        });
    }
    else{
        await FaqCategory.findAll({
            where: {
                locale: locale,
                user_id: userID
            },
            order:['position']
        })
        .then(data => {
          Categories.push(data)
        })
        .catch(err => {
          errorLog.error(err)
        });
        }
    return Categories;
}