const db = require("../app/models");
const User = db.user;
const Setting = db.setting;
const TemplateSetting = db.template_setting;
const errorLog = require('../app/helpers/log.helper');
const { QueryTypes } = require('sequelize');

// Using in nodeJs
exports.findFaqs = async (shop, locale = 'en') => {
    let data = [];
    await User.findOne({
        attributes: ['id'],
        where: { shopify_domain: shop}
    })
        .then( async userData => {
            if (userData) {
                let userID = userData.dataValues.id;
                await Setting.findOne({
                    where: {
                        user_id: userID
                    }
                }).then(async settingData => {})
                try {
                    data = await db.sequelize.query(
                        "SELECT `faq_category`.`title` as `category_title`, `faq`.`title`,`faq`.`content`" +
                        " "+
                        " FROM `faq` join `faq_category` on `faq`.`category_identify` = `faq_category`.`identify`" +
                        " where `faq`.`locale` = '" + locale + "' and `faq_category`.`locale` = '" + locale +
                        "' and `faq`.`user_id` = " + userID + " and `faq_category`.`user_id` = " + userID +
                        " and `faq`.`is_visible` = true and `faq_category`.`is_visible` = true",
                        {type: QueryTypes.SELECT});
                }catch (e) {
                    console.log(e.message)
                }
            }
        }).catch(error => {
            errorLog.error(`get faqs nodejs proxy error ${error.message}`)
        });
    console.log(data)
    return data;
};
exports.findSetting = async (shop, locale = 'en') => {
    let returnData = {};
    let data = {};
    let templateSetting = {};
    await User.findOne({
        attributes: ['id'],
        where: { shopify_domain: shop}
    })
        .then( async userData => {
            if (userData) {
                await Setting.findOne({
                    where: {
                        user_id: userData.dataValues.id
                    }
                }).then(async settingData => {
                    data = settingData.dataValues;
                    if (settingData.search_not_found) {
                        try {
                            JSON.parse(settingData.search_not_found).every(v => {
                                if (v.locale === locale) {
                                    data.search_not_found = v.content;
                                    return false;
                                } else {
                                    data.search_not_found = null;
                                }
                                return true;
                            });
                        } catch (e) {
                            errorLog.error(`setting json parse error ${e.message}`)
                        }
                    }
                    if (settingData.intro_text_content) {
                        try {
                            JSON.parse(settingData.intro_text_content).every(v => {
                                if (v.locale === locale) {
                                    data.intro_text_content = v.content;
                                    return false;
                                } else {
                                    data.intro_text_content = null;
                                }
                                return true;
                            });
                        } catch (e) {
                            errorLog.error(`setting json parse error ${e.message}`)
                        }
                    }
                    if (settingData.search_placehoder) {
                        try {
                            JSON.parse(settingData.search_placehoder).every(v => {
                                if (v.locale === locale) {
                                    data.search_placehoder = v.content;
                                    return false;
                                } else {
                                    data.search_placehoder = null;
                                }
                                return true;
                            });
                        } catch (e) {
                            errorLog.error(`setting json parse error ${e.message}`)
                        }
                    }
                    if (settingData.page_title_content) {
                        try {
                            JSON.parse(settingData.page_title_content).every(v => {
                                if (v.locale === locale) {
                                    data.page_title_content = v.content;
                                    return false;
                                } else {
                                    data.page_title_content = null;
                                }
                                return true;
                            });
                        } catch (e) {
                            errorLog.error(`setting json parse error ${e.message}`)
                        }
                    }
                    if (settingData.footer_text_content) {
                        try {
                            JSON.parse(settingData.footer_text_content).every(v => {
                                if (v.locale === locale) {
                                    data.footer_text_content = v.content;
                                    return false;
                                } else {
                                    data.footer_text_content = null;
                                }
                                return true;
                            });
                        } catch (e) {
                            errorLog.error(`setting json parse error ${e.message}`)
                        }
                    }
                    templateSetting = await getTemplateSetting(settingData.id, settingData.faq_template_number);
                    returnData = {data, templateSetting}
                }).catch(error => {
                    errorLog.error(`get setting frontend proxy ${error.message}`)
                });
            }
        })
        .catch(e =>{
            errorLog.error(`get setting frontend proxy get user error ${e.message}`)
        })
    return returnData;
}

async function getTemplateSetting(setting_id, template_number) {
    let templateSetting = {};
    await TemplateSetting.findOne({ where: { setting_id: setting_id, template_number: template_number}})
        .then(data => {
            if (data){
                templateSetting = data.dataValues;
                delete templateSetting.id;
            }
        }).catch(e => {
            errorLog.error(`template Setting ${e.message}`)
    });
    return templateSetting;
}