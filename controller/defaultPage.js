const db = require("../app/models");
const Faq = db.faq;
const User = db.user;
const Setting = db.setting;
const TemplateSetting = db.template_setting;
const FaqCategory = db.faq_category;
const errorLog = require('../app/helpers/log.helper');


// Using in nodeJs
exports.findAllInFaqPageNodejs = async (shop, locale = 'en') => {
    let data = [];
    await User.findOne({ where: { shopify_domain: shop}})
        .then( async userData => {
            if (userData) {
                let userID = userData.dataValues.id;
                data['settingData'] = await getSetting(userID, locale);
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
async function getSetting(userID, locale) {
    let returnData = {};
    let data = {};
    let templateSetting = {};
    await Setting.findOne({where: {
            user_id: userID
        }}).then(async settingData => {
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
                }catch (e) {
                    errorLog.error(`setting json parse error ${e.message}`)
                }
            };
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
                }catch (e) {
                    errorLog.error(`setting json parse error ${e.message}`)
                }
            };
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
                }catch (e) {
                    errorLog.error(`setting json parse error ${e.message}`)
                }
            };
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
                }catch (e) {
                    errorLog.error(`setting json parse error ${e.message}`)
                }
            };
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
                }catch (e) {
                    errorLog.error(`setting json parse error ${e.message}`)
                }
            };
            templateSetting = await getTemplateSetting(settingData.id, settingData.faq_template_number);
        returnData = {data, templateSetting}
    }).catch(error => {
        errorLog.error(`get setting frontend proxy ${error.message}`)
    });
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