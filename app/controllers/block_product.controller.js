const db = require("../models");
const FaqCategory = db.faq_category;
const User = db.user;
const Product = db.product
const Faq = db.faq
let Faqs = []

exports.findAllProduct = async (req, res) => {
    let userID = null;
    const shop = req.params.shop;
    const product_id = req.params.product_id
    const locale = req.params.locale
    console.log(typeof(locale))
    await User.findOne({ where: { shopify_domain: shop}})
    .then( async userData => {
        if (userData) {
            userID = userData.dataValues.id;
           await getProduct(userID, product_id, locale)
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
    // console.log(result);
    return res.send({faq: Faqs})
};

async function getProduct(userID, product_id, locale){
    let Products = null
    await Product.findAll({
        where: {
            user_id: userID,
            product_id: product_id
        },
    })
    .then(async data => {
        Products = data[0].dataValues
        let faqId = JSON.parse(Products.faq_id).faq_id
        for(let i = 0; i < faqId.length; i++){
            await getFaqs(faqId[i], locale)
        }
    })
    // .catch(err => {
    //     return res.status(500).send({
    //         message:
    //             err.message || "Some error occurred while retrieving Product."
    //     })
    // });
    return Products;
}
async function getFaqs(faq_id, locale){
    console.log(locale)
    await Faq.findAll({
        where: {
            id : faq_id ,
            locale : locale
        },
    })
    .then( data => {
        if(data && data.length > 0){
            Faqs.push(data[0].dataValues)
        }
        // getCategoryName(data[0].dataValues.category_identify)
    })
    // .catch(err => {
    //     return res.status(500).send({
    //         message:
    //             err.message || "Some error occurred while retrieving Product."
    //     })
    // });
    console.log(Faqs)
    return Faqs;
}

// async function getCategoryName(identify){
//     await FaqCategory.get({
//         where: {
//             identify: identify
//         }
//     })
// }
