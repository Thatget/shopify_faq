const db = require("../app/models");
const Faq = db.faq;
const User = db.user;
const FaqCategory = db.faq_category;
const errorLog = require('../app/helpers/log.helper')


// Using in nodeJs
exports.findAllInFaqPageNodejs = async (shop, locale = 'en') => {
    let data = [];
    await User.findOne({ where: { shopify_domain: shop}})
        .then( async userData => {
            if (userData) {
                let userID = userData.dataValues.id;
                await Faq.findAll({
                    where: {
                        user_id: userID, locale: locale
                    },
                    order:[[db.sequelize.literal('position'), 'DESC']],
                })
                    .then(data => {
                        data = data;

                    })
                    .catch(err => {
                        data = []
                    });
                await FaqCategory.findAll({
                    where: {
                        user_id: userID, locale: locale
                    }
                }).then(cateData => {

                })
                    .catch(err => {
                        data = []
                    });
            } else {
                data = [];
            }
        }).catch(error => {
            data = []
        })
    return data;
}