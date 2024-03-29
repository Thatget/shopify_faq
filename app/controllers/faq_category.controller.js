const db = require("../models");
const FaqCategory = db.faq_category;
const User = db.user;
const Op = db.Sequelize.Op;
const Setting = db.setting
const errorLog = require('../helpers/log.helper');

exports.create = async (req, res) => {
    // Validate request
    if (!req.body.title || !req.body.locale || !req.jwtDecoded.data.user_id) {
        res.status(400).send({
            message: "Title and Locale can not be empty!"
        });
        return;
    }
    // Create a faq_category
    const user_id = req.jwtDecoded.data.user_id;
    const locale = req.body.locale;
    // const title = req.body.title;
    // const faq_category = {
    //     title: title,
    //     description: req.body.description,
    //     is_visible: req.body.is_visible,
    // };
    const faq_category = req.body;
    faq_category.user_id = user_id;
    let identify = locale + user_id;
    if (!req.body.identify) {
        identify = await generateIdentify(user_id, identify, locale);
    }else {
        identify = await generateIdentify(user_id,  req.body.identify, locale);
    }
        if (identify) {
            faq_category.identify = identify;
            await FaqCategory.create(faq_category)
                .then(data => {
                    res.send(data);
                    return;
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Category. ??"
                    });
                });
        }else {
            res.status(500).send({
                message: "Some error occurred while creating the Category. Identify is not defined in create"
            });
            return;
        }
};

exports.findAllCategory = async (req, res) => {
    FaqCategory.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving product."
            })});
};

// Retrieve all faq_category from the database of a user.
exports.findAll = (req, res) => {
    const user_id = req.jwtDecoded.data.user_id;
    let settingData = false
    if (!req.query.locale) {
        res.status(400).send({
            message: "Locale must be selected!"
        });
        return;
    }
    Setting.findOne({
        where:{
            user_id: user_id
        }
    })
    .then(data => {
        settingData = data.dataValues
        let condition = { user_id: { [Op.eq]: `${user_id}` }, locale: req.query.locale };
        if(settingData.category_sort_name === true){
            FaqCategory.findAll({ where: condition, order:['title']})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving category."
                });
            });
        }
        else{
            FaqCategory.findAll({ where: condition, order:['position']})
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving category."
                });
            });
        }
    })
    .catch(e =>{
        errorLog.error(e)
    })

};

exports.getAll = (req, res) => {
    const user_id = req.jwtDecoded.data.user_id;
    let condition = { user_id: { [Op.eq]: `${user_id}` }};
    FaqCategory.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving category."
            });
        });
};

// Find a single Category with an id
exports.findOne = async (req, res) => {
    const user_id = req.jwtDecoded.data.user_id;
    const id = req.params.id;
    if (req.query.identify && req.query.locale) {
        await FaqCategory.findOne({where: {identify: req.query.identify, locale: req.query.locale, user_id: user_id }})
        .then(data =>{
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find category with identify=${req.query.identify} in locale ${req.query.locale}.`
                });
            }
        }).catch(() => {
            res.status(500).send({
                message: "Error retrieving category with identify=" + req.query.identify + ` in locale ${req.query.locale}`
            });
        });
    } else {
        await FaqCategory.findByPk(id)
            .then(data => {
                if (data) {
                    res.send(data);
                } else {
                    res.status(404).send({
                        message: `Cannot find category with id=${id}.`
                    });
                }
            })
            .catch(() => {
                res.status(500).send({
                    message: "Error retrieving category with id=" + id
                });
            });
    }
};

// Update a Category by the id in the request
exports.update = async (req, res) => {
    if (!req.params.id || !req.body.title) {
        res.status(400).send({
            message: "Category update missing params!"
        });
        return;
    }
    const id = req.params.id;
    const id_translate = req.body.category_translate_id
    // Check this faq_category is exits or not
    await FaqCategory.findByPk(id)
        .then(async data => {
            if (data) {
                const user_id = data.dataValues.user_id;
                let identify = data.dataValues.identify;
                let locale = data.dataValues.locale;
                let faq_category = {
                    title: req.body.title,
                    description: req.body.description? req.body.description : '',
                    is_visible: req.body.is_visible,
                    feature_category: req.body.feature_category,
                    // show_on_cart : req.body.show_on_cart
                };
                if (req.body.position) {
                    faq_category.position = req.body.position;
                }
                let continueCondition = {};
                continueCondition.check = false;

                if (req.body.locale && (locale !== req.body.locale)) {
                    faq_category.locale = req.body.locale;
                    // Check to update with locale data
                    await FaqCategory.findOne({where: {identify: identify, locale: locale, user_id: user_id }})
                        .then(subData => {
                            if (subData.dataValues.id !== id) {
                                continueCondition.check = true;
                                continueCondition.message = "Category for this locale already exist!";
                            }
                        }).catch(() => {
                            res.status(400).send({
                                message: "Error when checking category !"
                            });
                            return;
                        })
                }
                if (continueCondition.check) {
                    throw new Error(continueCondition.message);
                }
                await FaqCategory.update(faq_category, {
                    where: { id: id }
                })
                    .then(async num => {
                        if (num == 1) {
                            await FaqCategory.update({
                                // show_on_cart : req.body.show_on_cart,
                                is_visible: req.body.is_visible,
                                feature_category: req.body.feature_category,
                            },{
                                where: {
                                    user_id: user_id,
                                    identify: identify,
                                    [Op.not]: [{id: id}]
                                }
                            })
                            if(req.body.locale_translate){
                                let category_translate = {
                                    title: req.body.title_translate,
                                    description: req.body.description_translate,
                                    is_visible: req.body.is_visible,
                                    feature_category: req.body.feature_category,
                                    // show_on_cart : req.body.show_on_cart,
                                    locale : req.body.locale_translate,
                                    position: req.body.position
                                }
                                await FaqCategory.update(category_translate, {
                                    where: { id: id_translate }
                                })
                            }  
                            res.send({
                                message: "Category was updated successfully."
                            });          
                        } else {
                            res.send({
                                message: `Cannot update category with id=${id}. Maybe category was not found or req.body is empty!`
                            });
                        }
                    })
                    .catch(() => {
                        res.status(500).send({
                            message: "Error updating category with id=" + id
                        });
                    });
    
            } else {
                res.send({
                    message: `Cannot find category with id=${id}.`
                });
                return;
            }
        }).catch(() => {
            res.status(500).send({
                message: "Can't find category with id=" + id
            });
        })
};

// Update rearrange Categories
exports.updateRearrangeCategories = async (req, res) => {
  let categories = req.body
  if(!categories){
      res.status(400).send({
          message: "Could not update Categories !"
      });
      return;
  }
  await FaqCategory.bulkCreate(categories,{
    updateOnDuplicate: ["position"],
  })  
  .then(() => {
    res.send({
      message: 'Update Successfully !'
    })
  })
  .catch(e => {
    errorLog.error(e)
  })  
};

// Delete a Category with the specified id in the request
exports.delete = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Not category selected!"
        });
        return;
    }
    let condition = { id: req.params.id };
    if (req.query.identify && req.jwtDecoded.data.user_id) {
        condition = { identify:  req.query.identify, user_id:  req.jwtDecoded.data.user_id}
    }

    await FaqCategory.destroy({
        where: condition
    })
        .then( num => {
            if (num == 1) {
                res.send({
                    message: "Category was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete category Maybe category was not found!`
                });
            }
        })
        .catch(() => {
            res.status(500).send({
                message: "Could not delete category"
            });
        });
};

// Delete all Category of a User from the database.
exports.deleteAll = async (req, res) => {
    const  user_id = req.jwtDecoded.data.user_id;
    await FaqCategory.destroy({
        where: {user_id: user_id},
        truncate: false
    })
        .then( nums => {
            res.send({ message: `${nums} categories were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        });
};

//Faq Page
// Retrieve all faq_category from the database of a user.
exports.findAllInFaqPage = async (req, res) => {
    // Validate request
    if (!req.params.shop || !req.query.locale) {
        res.status(400).send({
            message: "Shop and locale can not be empty!"
        });
        return false;
    }
    const shop = req.params.shop;
    const locale = req.query.locale
    var userID = null;
    await User.findOne({ where: { shopify_domain: shop}})
        .then(async userData => {
            if (userData) {
                userID = userData.dataValues.id;
                await FaqCategory.findAll({
                    where: {user_id: userID, locale: locale},
                    order:['position']
                })
                    .then(data => {
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while retrieving category."
                        });
                    });
            } else {
                res.status(400).send({
                    message: "Shop name is not found!"
                });
                return;
            }
        }).catch(error => {
            errorLog.error(error)
            return;
    });
};

async function generateIdentify(user_id, identify, locale) {
    let count = 0;
    let checked = false;
    let newIdentify = identify;
    do {
        if (count) {
            newIdentify = identify + count;
        }
        checked = await checkCategoryIdentify(user_id, newIdentify, locale);
        count++;
    } while (checked);
    return newIdentify;
}

async function checkCategoryIdentify(user_id, identify, locale) {
    let checkedIdentify = false;
    await FaqCategory.findOne({ where: { user_id: user_id, identify: identify, locale: locale}})
        .then( async data => {
            if (data) {
                checkedIdentify = true;
            }
        }).catch(err => {
            errorLog.error(`category generate identify error ${err.message}`)
        });
    return checkedIdentify;
}