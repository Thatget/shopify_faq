const db = require("../app/models");
const Faq = db.faq;
const User = db.user;
const errorLog = require('../app/helpers/log.helper')


// Using in nodeJs
exports.findAllInFaqPageNodejs = async (shop, locale = 'en') => {
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
                        return  data;
                    })
                    .catch(err => {
                        return []
                    });
            } else {
                return []
            }
        }).catch(error => {
            return []
        })
}