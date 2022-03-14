const db = require("../../models");
const request = require("request-promise");
const User = db.user;
const Category = db.faq_category;
const Faq = db.faq;

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
        let removeFaqList = [];
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
            return false;
        }
        await Faq.findAll({where: {user_id: user_id}})
            .then(data => {
                faq = data
            }).catch(error => {
                debug(error.message);
                return false;
            });
        await Category.findAll({where: {user_id: user_id}})
            .then(data => {
                data.forEach(element => {
                    if (element.dataValues.is_visible) {
                        content += `<div><div>${element.dataValues.title}</div>`;
                        for( var i = 0; i < faq.length; i++){
                            if (faq[i].dataValues.category_id === element.dataValues.id) {
                                content += `<div>${faq[i].dataValues.title}</div><div>${faq[i].dataValues.content}</div>`;
                                removeFaqList.push(i);
                            }
                        }
                        content += `</div>`;
                    }
                });
                removeFaqList.forEach(list => {
                    faq.splice(list,1);
                });
                faq.forEach( e => {
                    content += `<div>${e.dataValues.title}</div><div>${e.dataValues.content}</div>`;
                });
            })
            .catch(e => {
                debug(e.message);
                return false;
            });
        if (page_id) {
            const shopRequestUrl = 'https://' + shopify_domain + `/admin/api/2022-01/pages/${page_id}.json`;
            const shopRequestHeaders = {
                'X-Shopify-Access-Token': global.accessToken
            };
            const page = {
                page:{
                    body_html: content
                }
            };
            await request.put(shopRequestUrl, {headers: shopRequestHeaders, json: page})
                .then( (data) => {
                })
                .catch((error) => {
                    debug(error);
                    return false;
                });
        } else {
            const shopRequestUrl = 'https://' + shopify_domain + '/admin/api/2022-01/pages.json';
            const shopRequestHeaders = {
                'X-Shopify-Access-Token': global.accessToken
            };
            const page = {
                page:{
                    title: "Faqs",
                    body_html: content
                }
            };
            await request.post(shopRequestUrl, {headers: shopRequestHeaders, json: page})
                .then( async (data) => {
                    await User.update({
                        page_id: data.page.id,
                        page_path: data.page.handle
                    },{where: { id: user_id }})
                        .then(response => {
                            console.log(response.data);
                            this.message = 'User was updated successfully!';
                        })
                        .catch(e => {
                            console.log(e);
                        });
                })
                .catch((error) => {
                    debug(error);
                    return false;
                });
        }
        return true;
    } catch (error) {
        return false;
    }
};


module.exports = {
    generateContent: generateContent,
};
