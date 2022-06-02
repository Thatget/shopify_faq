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
    const locale = req.params.locale
    await User.findOne({ where: { shopify_domain: shop}})
    .then( async userData => {
        if (userData) {
            userID = userData.dataValues.id;
            Setting.findOne({
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
            await getProduct(userID, product_id, locale, Faqs)
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
    // console.log(Categories, 'aaa')
    return res.send({faq: Faqs, category: Categories, templateSetting: templateSetting})
};

async function getProduct(userID, product_id, locale, Faqs){
    let productId = null
    await Product.findOne({
        where: {
            user_id: userID,
            product_id: product_id
        },
    })
    .then(async data => {
        productId = data.dataValues.id
        await getFaqsId(productId, locale, Faqs, userID)
    })
    // .catch(err => {
    //     return res.status(500).send({
    //         message:
    //             err.message || "Some error occurred while retrieving Product."
    //     })
    // });
    return Product;
}

async function getFaqsId(product_id , locale, Faqs, userID){
    await FaqProduct.findAll({
        where: {
            product_id: product_id
        },
    })
    .then( async data => {
        listFaqId = data
        for(let i = 0; i < listFaqId.length; i++){
            await getFaqs(listFaqId[i].dataValues.faq_id, locale, Faqs, userID)
        }
        // getCategoryName(data[0].dataValues.category_identify)
    })
    // .catch(err => {
    //     return res.status(500).send({
    //         message:
    //             err.message || "Some error occurred while retrieving Product."
    //     })
    // });
}

async function getFaqs(faq_id, locale, Faqs){
    await Faq.findAll({
        where: {
            id : faq_id ,
            locale : locale
        },
    })
    .then(async data => {
        if(data && data.length > 0){
            Faqs.push(data[0].dataValues)
        }
        // console.log(listCategoryIdentify, 'list')
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
