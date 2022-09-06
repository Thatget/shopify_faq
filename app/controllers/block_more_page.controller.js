const db = require("../models");
const FaqCategory = db.faq_category;
const User = db.user;
const Faq = db.faq
const Setting = db.setting
const TemplateSetting = db.template_setting
let listFaqId = []
const FaqMorePage = db.faq_more_page;
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
            let settingData = []
            Setting.findOne({
                where:{
                    user_id: userID
                }
            })
            .then(data => {
                settingData = data.dataValues
                TemplateSetting.findOne({
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
                    console.log(e)
                })
            })
            .catch(e =>{
                console.log(e)
            })
            await getFaqsId(userID, page_name, locale, Faqs)
            await getCategory(locale, userID, Categories)
        }
        //  else {
        //     return res.status(400).send({
        //         message: "Shop name is not found !"
        //     });
        // }
    })
    // .catch(error => {
    //     return res.status(500).send("some error");
    // })
    // const result = await User.findOne({ where: { shopify_domain: shop}}).catch(error => {
    //     return res.status(500).send("some error");
    // });
    return res.send({faq: Faqs, category: Categories, templateSetting: templateSetting})
};

async function getFaqsId(userID, page_name , locale, Faqs){
    console.log(userID, page_name , locale, Faqs)
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
    // .catch(err => {
    //     return res.status(500).send({
    //         message:
    //             err.message || "Some error occurred while retrieving Product."
    //     })
    // });
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

async function getCategory(locale, userID, Categories){
    await FaqCategory.findAll({
        where: {
            locale: locale,
            user_id: userID
        }
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
    return Categories;
}