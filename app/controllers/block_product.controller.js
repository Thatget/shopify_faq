const db = require("../models");
const FaqCategory = db.faq_category;
const User = db.user;
const Product = db.product
const Faq = db.faq
const Setting = db.setting
const TemplateSetting = db.template_setting
let listFaqId = []
const FaqProduct = db.faq_product;

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
            Setting.findOne({
                where:{
                    user_id: userID
                }
            })
            .then(data => {
                TemplateSetting.findOne({
                    where: {
                        template_number: data.dataValues.faq_template_number
                    }
                })
                .then(data => {
                    templateSetting = data.dataValues
                })
                .catch(e =>{
                    console.log(e)
                })
            })
            .catch(e =>{
                console.log(e)
            })
            await getProduct(userID, product_id, locale, Faqs, Categories)
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

async function getProduct(userID, product_id, locale, Faqs, Categories){
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
            await getFaqsId(productId, locale, Faqs, userID, Categories)
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

async function getFaqsId(product_id , locale, Faqs, userID){
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
            locale: 'default',
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
