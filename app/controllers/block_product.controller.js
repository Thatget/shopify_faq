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
            if(plan == 'Pro'){
              await Setting.findOne({
                  where:{
                      user_id: userID
                  }
              })
              .then(async data => {
                  settingData = data.dataValues
                  await TemplateSetting.findOne({
                      where: {
                          template_number: data.dataValues.faq_template_number,
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
                      }
                  })
                  .catch(e =>{
                      errorLog.error(e)
                  })
              })
              .catch(e =>{
                  errorLog.error(e)
              })
              await getProduct(userID, product_id, locale, Faqs, templateSetting)
              await getCategory(locale, userID, Categories, templateSetting)
            }
        }
         else {
            return res.status(400).send({
                message: "Shop name is not found !"
            });
        }
    })
    .catch(error => {
        errorLog.error(error)
        return res.status(500).send("some error");
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
          console.log(data)
          PlanData = data.dataValues.plan
        }
    })
    .catch(err => {
        return res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving plan."
        })
    });
    return PlanData;
}

async function getProduct(userID, product_id, locale, Faqs, templateSetting){
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
            await getFaqsId(productId, locale, Faqs, userID, templateSetting)
        }
        else{
            productId = data
        }
    })
    .catch(err => {
        return res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Product."
        })
    });
    return Product;
}

async function getFaqsId(product_id , locale, Faqs, userID, templateSetting){
    await FaqProduct.findAll({
        where: {
            product_id: product_id
        },
    })
    .then( async data => {
        if(data){
            listFaqId = data
            for(let i = 0; i < listFaqId.length; i++){
                await getFaqs(listFaqId[i].dataValues.faq_identify,listFaqId[i].dataValues.category_identify, locale, Faqs, userID)
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
            if(data.some(element => {
                return element.dataValues.locale == locale
            })){
                var aaa = data.filter(item => {
                    return item.dataValues.locale == locale
                })
            }
            else{
                var aaa = data.filter(item => {
                    return item.dataValues.locale == 'default'
                })
            }
            if(aaa.length > 0){
                Faqs.push(aaa[0])
            }
        }
    })
    .catch(err => {
        return res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Product."
        })
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
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Product."
            })
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
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Product."
            })
        });
    }
    return Categories;
}