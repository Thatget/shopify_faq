const db = require("../app/models");
const Faq = db.faq;
const User = db.user;
const Setting = db.setting;
const FaqCategory = db.faq_category;
const errorLog = require('../app/helpers/log.helper');


// Using in nodeJs
exports.findAllInFaqPageNodejs = async (shop, locale = 'en') => {
    let data = [];
    await User.findOne({ where: { shopify_domain: shop}})
        .then( async userData => {
            if (userData) {
                let userID = userData.dataValues.id;
                await Setting.findOne({where: {
                        user_id: userID
                    }}).then(settingData => {
                        data['settingData'] = settingData;
                }).catch(error => {
                    data['settingData'] = null;
                });
                await Faq.findAll({
                    where: {
                        user_id: userID, locale: locale
                    },
                    order:[[db.sequelize.literal('position'), 'DESC']],
                })
                    .then(faqData => {
                        data['faqData'] = faqData;
                    })
                    .catch(err => {
                        data['faqData'] = []
                    });
                await FaqCategory.findAll({
                    where: {
                        user_id: userID, locale: locale
                    }
                }).then(cateData => {
                    data['cateData'] = cateData;
                })
                    .catch(err => {
                        data['cateData'] = [];
                    });
            } else {
                data = [];
            }
        }).catch(error => {
            data = []
        })
    return data;
};