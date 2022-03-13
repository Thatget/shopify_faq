const db = require("../models");
const request = require("request-promise");
const User = db.user;
const Category = db.faq_category;
const Faq = db.faq;

const accessTokendRequestUrl = 'https://' + shop +
    '/admin/oauth/access_token';
const accessTokenPayload = {
    client_id: apiKey,
    client_secret: apiSecret,
    code
};

const debug = console.log.bind(console);

/**
 * controller generateContent
 * @param {*} shopify_domain
 */
let generateContent = async (shopify_domain) => {
    var content = '';
    try {
        let user_id = '';
        let page_id = '';
        let hasUser = true;
        await User.findOne({where: {shopify_domain: shopify_domain}})
            .then(data => {
                if (data) {
                    user_id = data.dataValues.id;
                    page_id = data.dataValues.page_id;
                }else {
                    hasUser = false;
                }
            })
            .catch(err => {
                debug(err);
            });
        if (!hasUser) {
            return ;
        }

        await Faq.findAll({where: {user_id: user_id}})
            .then(data => {
                faq = data
            })

        await Category.findAll({where: {user_id: user_id}})
            .then(data => {
                data.forEach(element => {
                    if (element.dataValues.is_visible) {
                        content += `<div><div>${element.dataValues.title}</div>`;
                        faq.forEach(subElement => {
                            if (subElement.dataValues.category_id === element.dataValues.id) {
                                content += `<div>${subElement.dataValues.title}</div><div>${subElement.dataValues.content}</div>`;
                            }
                        })
                        content += `</div>`;
                    }
                })
            })
            .catch(e)
        if (page_id) {
            request
        } else {

        }
        return ;
    } catch (error) {
        return ;
    }
};


module.exports = {
    generateContent: generateContent,
}
