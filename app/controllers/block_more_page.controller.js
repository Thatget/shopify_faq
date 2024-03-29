const db = require("../models");
const FaqCategory = db.faq_category;
const User = db.user;
const Faq = db.faq
const Setting = db.setting
const TemplateSetting = db.template_setting
let listFaqId = []
const FaqMorePageSetting = db.faq_more_page_setting;
const FaqMorePage = db.faq_more_page;
const errorLog = require('../helpers/log.helper');
// const Plan = db.merchants_plan
const shopifyApi = require('./../helpers/shopifyApi.helper')

exports.findFaqOnPage = async (req, res) => {
    let Faqs = [];
    let Categories = [];
    let userID = null;
    let templateSetting = []
    const shop = req.params.shop;
    const page_name = req.params.page
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
            let settingMorePageData = []
            // let plan = await getPlan(userID)
            let currentPlan = await shopifyApi.getCurrentPlan(shop, userData.dataValues.shopify_access_token)
            if(currentPlan.length > 0 || userData.plan_extra){
              await FaqMorePageSetting.findAll({
                  where:{
                      user_id: userID
                  }
              })
              .then(async data => {
                  settingMorePageData = data[0].dataValues
                  if((page_name === 'index' && settingMorePageData.home_page_visible === false) ||
                      (page_name === 'cart' && settingMorePageData.cart_page_visible === false) ||
                      (page_name === 'page' && settingMorePageData.cms_page_visible === false) ||
                      (page_name === 'collection' && settingMorePageData.collection_page_visible === false)
                  ){
                      return
                  }
                  else{
                      let settingData = []
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
                      await getFaqsId(userID, page_name, locale, Faqs)
                      await getCategory(locale, userID, Categories,templateSetting)
                  }
              })
              .catch(e => {
                  errorLog.error(e)
              })
            }
        }
        else {
            return res.status(400).send({
                message: "Shop name is not found !"
            });
        }
    })
    .catch(() => {
        return res.status(500).send("some error");
    })
    // const result = await User.findOne({ where: { shopify_domain: shop}}).catch(error => {
    //     return res.status(500).send("some error");
    // });
    return res.send({faq: Faqs, category: Categories, templateSetting: templateSetting})
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

async function getFaqsId(userID, page_name , locale, Faqs){
    await FaqMorePage.findAll({
        where: {
            user_id: userID,
            page_name: page_name
        },
    })
    .then( async data => {
        if(data){
            listFaqId = data
            for(let i = 0; i < listFaqId.length; i++){
                await getFaqs(listFaqId[i].dataValues.faq_identify,listFaqId[i].dataValues.category_identify, locale, Faqs)
            }
        }
    })
    .catch(err => {
        errorLog.error(err)
    });
}

async function getFaqs(faq_identify, category_identify, locale, Faqs){
    await Faq.findAll({
        where: {
            locale: locale,
            identify : faq_identify ,
            category_identify : category_identify,
        },
    })
    .then(async data => {
        if(data && data.length > 0){
          let faqData
            if(data.some(element => {
                return element.dataValues.locale == locale
            })){
                faqData = data.filter(item => {
                    return item.dataValues.locale == locale
                })
            }
            else{
                faqData = data.filter(item => {
                    return item.dataValues.locale == 'default'
                })
            }
            if(faqData.length > 0){
                Faqs.push(faqData[0])
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