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
let freeLimitFaqs = 30
const shopifyApi = require('./../helpers/shopifyApi.helper')

exports.findAllProduct = async (req, res) => {
  console.log(req)
    let Faqs = [];
    let Categories = [];
    let userID = null;
    let templateSetting = []
    const shop = req.shop;
    const product_id = req.product_id
    let locale = req.locale
    await User.findOne({ where: { shopify_domain: shop}})
    .then( async userData => {
        if (userData) {
            userID = userData.dataValues.id;
            if(locale === JSON.parse(userData.dataValues.shopLocales).shopLocales.filter(item => {return item.primary === true})[0].locale){
                locale = 'default'
            }
            else{
                locale = req.locale
            }
            let settingData = []
            // let plan = await getPlan(userID)
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
            // }
        }
         else {
            // return res.status(400).send({
            //     message: "Shop name is not found !"
            // });
        }
    })
    .catch(error => {
        errorLog.error(error)
        // return res.status(500).send("some error");
    })
    // const result = await User.findOne({ where: { shopify_domain: shop}}).catch(error => {
    //     return res.status(500).send("some error");
    // });
    let dataa = {
      faq: Faqs, category: Categories, templateSetting: templateSetting
    }
    return dataa
    // return res.send({faq: Faqs, category: Categories, templateSetting: templateSetting})
};

// async function getPlan(userID){
//   let PlanData = null
//     await Plan.findOne({
//         where: {
//             user_id: userID,
//         },
//     })
//     .then(async data => {
//         if(data){
//           console.log(data)
//           PlanData = data.dataValues.plan
//         }
//     })
//     .catch(err => {
//         return res.status(500).send({
//             message:
//                 err.message || "Some error occurred while retrieving plan."
//         })
//     });
//     return PlanData;
// }

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
          console.log(data, 'Product')
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
    attributes:['faq_id'],
    where: {
        product_id: product_id
    },
  })
  .then( async data => {
    console.log(data, 'Product FAQs')
    if(data){
      listFaqId = JSON.parse(data[0].dataValues.faq_id)
      console.log(listFaqId)
      await getFaqs(listFaqId, locale, Faqs, userID)
    }
  })
}

async function getFaqs(listFaqId, locale, Faqs, userID){
    await Faq.findAll({
        where: {
            id: listFaqId,
            user_id : userID
        },
        limit: freeLimitFaqs
    })
    .then(async data => {
        if(data && data.length > 0){
            if(data.some(element => {
                return element.dataValues.locale == locale
            })){
                var checkFaq = data.filter(item => {
                    return item.dataValues.locale == locale
                })
            }
            else{
                var checkFaq = data.filter(item => {
                    return item.dataValues.locale == 'default'
                })
            }
            if(checkFaq.length > 0){
                Faqs.push(checkFaq[0])
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