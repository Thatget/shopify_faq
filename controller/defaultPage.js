const db = require("../app/models");
const User = db.user;
const Setting = db.setting;
const MessageSetting = db.faq_messages_setting;
const TemplateSetting = db.template_setting;
const forwardingAddress = process.env.HOST;
const errorLog = require('../app/helpers/log.helper');
const { QueryTypes } = require('sequelize');

// Using in nodeJs
exports.findFaqs = async (shop, locale, path_prefix = "") => {
    let send_data = []
    let selectCondition = {}
    await User.findOne({
        attributes: ['id', 'shopLocales'],
        where: { shopify_domain: shop}
    })
        .then( async userData => {
            if (userData) {
                if(locale === JSON.parse(userData.dataValues.shopLocales).shopLocales.filter(item => {return item.primary === true})[0].locale){
                    locale = 'default'
                }
                else{
                    locale = locale
                }
                let userID = userData.dataValues.id;
                if ( path_prefix ) {
                    try {
                        await Setting.update({ faq_page_url: path_prefix}, { where:{ user_id: userID } });
                    } catch (error) {
                        errorLog.error(error.message)
                    }
                }
                await Setting.findOne({
                    attributes: ['category_sort_name','faq_sort_name'],
                    where: {
                        user_id: userID
                    }
                }).then(settingData => {
                    selectCondition = settingData.dataValues
                })
                try {
                    let selectQueryFaqs = "SELECT `faq`.`title`,`faq`.`content`,`faq`.`locale`,`faq`.`identify`,`faq`.`category_identify` FROM faq" +
                        " where `faq`.`user_id` = ? and `faq`.`is_visible` = 1 and (`faq`.`locale` = 'default' or `faq`.`locale` = ?)";
					
					if (selectCondition.faq_sort_name) {
                        selectQueryFaqs += " ORDER BY `faq`.`title`"
                    }
                    else{
                        selectQueryFaqs += " ORDER BY `faq`.`position`"
                    }

                    dataFaqs = await db.sequelize.query(
                        selectQueryFaqs+";",
                        {
                            replacements: [userID, locale],
                            type: QueryTypes.SELECT
                        }
                    );
                    let listCategoryIdentify = []
                    let listFaqIdentify = []
                    let listCategory = []
                    let listCategoryDefault = []
                    let listFaq = []
                    let listFaqDefault = []

                    dataFaqs.forEach(item => {
                        listCategoryIdentify.push(item.category_identify)
                        listFaqIdentify.push(item.identify)
                    })
                    listCategoryIdentify = [...new Set(listCategoryIdentify)]
                    listFaqIdentify = [...new Set(listFaqIdentify)]
					if (listCategoryIdentify.length > 0 ) {
						let selectQueryCategories = "SELECT `faq_category`.`title`,`faq_category`.`locale`,`faq_category`.`identify` FROM faq_category" +
						" where `faq_category`.`user_id` = ? and `faq_category`.`is_visible` = 1 and `faq_category`.`identify` in (?) and (`faq_category`.`locale` = 'default' or `faq_category`.`locale` = ?)";

						if (selectCondition.category_sort_name) {
                            selectQueryCategories += " ORDER BY `faq_category`.`title`"
                        }
                        else{
                            selectQueryCategories += " ORDER BY `faq_category`.`position`"
                        }


						dataCategories = await db.sequelize.query(
							selectQueryCategories+";",
							{
								replacements: [userID, listCategoryIdentify, locale],
								type: QueryTypes.SELECT
							}
						);
						dataCategories.forEach(item => {
							if(item.locale === locale){
								listCategory.push(item)
							}
							else{
								listCategoryDefault.push(item)
							}
						})

						listCategoryDefault.forEach(item => {
							if(!listCategory.some(ele => {
								return ele.identify === item.identify
							})){
								listCategory.push(item)
							}
						})
					}
                    dataFaqs.forEach(item => {
                        if(item.locale === locale){
                            listFaq.push(item)
                        }
                        else{
                            listFaqDefault.push(item)
                        }
                    })
                    for(let i = 0; i < listFaqDefault.length; i++){
                        for(let j = 0; j < listFaq.length; j++){
                            if((listFaqDefault[i].identify === listFaq[j].identify && listFaqDefault[i].category_identify === listFaq[j].category_identify)){
                                listFaqDefault.splice(i,1)
                            }
                        }
                    }
                    if(listFaqDefault.length > 0){
                        listFaqDefault.forEach(item => {
                            listFaq.push(item)
                        })
                    }
                    for(let i = 0; i < listFaq.length; i++){
                        for(let j = 0; j < listCategory.length; j++){
                            if(listFaq[i].category_categry === listCategory[j].category){
                                listFaq[i]['category_title'] = listCategory[j].title
                            }
                        }
                    }
                    listCategory.forEach(item => {
                        let faqInCategory = []
                        listFaq.forEach(element => {
                            if(item.identify === element.category_identify){
                                faqInCategory.push(element)
                            }
                        })
                        item.faqs = faqInCategory
                    })
                    send_data = {
                        faq: listFaq,
                        categories: listCategory
                    }
                }catch (e) {
                    errorLog.error(e.message)
                }
            }
        }).catch(error => {
            errorLog.error(`get faqs nodejs proxy error ${error.message}`)
        });
    return send_data;
};
exports.findSetting = async (shop, locale) => {
    let returnData = {};
    let data = {};
    let templateSetting = {};
    await User.findOne({
        attributes: ['id', 'shopLocales'],
        where: { shopify_domain: shop}
    })
        .then( async userData => {
            if (userData) {
                if(locale === JSON.parse(userData.dataValues.shopLocales).shopLocales.filter(item => {return item.primary === true})[0].locale){
                    locale = 'default'
                }
                else{
                    locale = locale
                }
                
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
                                } else if(v.locale === 'default'){
                                    data.search_not_found = v.content;
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
                                } else if(v.locale === 'default') {
                                    data.intro_text_content = v.content;
                                }
                                return true;
                            });
                        } catch (e) {
                            errorLog.error(`setting json parse error ${e.message}`)
                        }
                    }
                    if (settingData.page_under_contruction) {
                        try {
                            JSON.parse(settingData.page_under_contruction).every(v => {
                                if (v.locale === locale) {
                                    data.page_under_contruction = v.content;
                                    return false;
                                } else if(v.locale === 'default') {
                                    data.page_under_contruction = v.content;
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
                                } else if(v.locale === 'default') {
                                    data.search_placehoder = v.content;
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
                                } else if(v.locale === 'default') {
                                    data.page_title_content = v.content;
                                }
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
                                } else if(v.locale === 'default') {
                                    data.footer_text_content = v.content;
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
                if (templateSetting.image_banner && templateSetting.banner_visible === true) {
                    templateSetting.image_banner = forwardingAddress +"/var/images/banner/"+templateSetting.image_banner
                }
                else{
                    templateSetting.image_banner = ''
                }
                if (templateSetting.banner_default && templateSetting.banner_visible === true) {
                    templateSetting.banner_default = forwardingAddress +"/var/images/banner/"+templateSetting.banner_default
                }
                else{
                    templateSetting.banner_default = ''
                }
            }
        }).catch(e => {
            errorLog.error(`template Setting ${e.message}`)
    });
    return templateSetting;
}

exports.findMessagesSetting = async (shop) => {
    let returnData = {};
    await User.findOne({
        attributes: ['id'],
        where: { shopify_domain: shop}
    })
        .then( async userData => {
            if (userData) {
                await MessageSetting.findOne({
                    where: {
                        user_id: userData.dataValues.id
                    }
                }).then(async settingData => {
                    returnData = settingData.dataValues;
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