const db = require("../models");
const Faq = db.faq;
const FaqCategory = db.faq_category;
const User = db.user;
const errorLog = require('../helpers/log.helper');
const { response } = require("express");
const Op = db.Sequelize.Op;
const Setting = db.setting

exports.create = async (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Title can not be empty!"
        });
        return;
    }
    if (!req.body.content) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    if (!req.jwtDecoded.data.user_id) {
        res.status(400).send({
            message: "no user selected ?"
        });
        return;
    }
    if (!req.body.locale) {
        res.status(400).send({
            message: "Locale must be selected!"
        });
        return;
    }
    if (!req.body.category_identify) {
        res.status(400).send({
            message: "Category must be selected!"
        });
        return;
    } else {
        let checkCategory = await checkFaqCategory(req.body.category_identify, req.jwtDecoded.data.user_id)
        if (!checkCategory.status) {
            res.status(400).send({
                message: checkCategory.message
            });
            return;
        }
    }
    // const title = req.body.title;
    const locale = req.body.locale;
    const user_id = req.jwtDecoded.data.user_id;
    const category_identify = req.body.category_identify;
    const faq = req.body;
    faq.user_id = user_id;
    let identify = '';

    // Create faq when identify is not set
    if (!req.body.identify) {
        identify = locale + user_id + category_identify;
        identify = await generateIdentify(user_id, identify, locale, category_identify);
        if (!identify) {
            res.status(500).send({
                message: "Some error occurred while creating the Faq."
            });
            return;
        } else {
            faq.identify = identify;
            // Create a faq
            await Faq.create(faq)
                .then(data => {
                    res.send(data);
                    return;
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the faq."
                    });
                    return;
                });
        }
    } else {
        identify = req.body.identify;
        // Check if this faq is exit
        await Faq.findOne({
            where: {user_id: user_id, identify: identify, locale: locale, category_identify: category_identify}
        })
            .then(async data => {
                if (data) {
                    await Faq.update(faq, {
                        where: {
                            user_id: user_id,
                            identify: identify,
                            locale: locale,
                            category_identify: category_identify
                        }
                    }).then(num => {
                        if (num == 1) {
                            res.send({
                                message: "Faq was updated successfully."
                            });
                            return;
                        } else {
                            res.send({
                                message: `Cannot update category. Maybe category was not found or req.body is empty!`
                            });
                            return;
                        }
                    })
                        .catch(err => {
                            res.status(500).send({
                                message: "Error updating faq with id"
                            });
                            return
                        });
                } else {
                    identify = await generateIdentify(user_id, identify, locale, category_identify);
                    if (!identify) {
                        res.status(500).send({
                            message: "Some error occurred while creating the Faq. Identify is not defined in update in create"
                        });
                        return
                    } else {
                        faq.identify = identify;
                        await Faq.create(faq)
                            .then(data => {
                                res.send(data);
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while creating the faq."
                                });
                            });
                    }
                }
            }).catch(err => {
                res.status(500).send({
                    message: "Error retrieving faq with identify=" + identify + ` in locale ${locale}`
                });
            });
    }
};

exports.getByIdentify = async (req, res) => {
    if(req.query.locale){
        Faq.findAll({ 
            where: {
                identify:  req.query.identify, 
                category_identify: req.query.category_identify, 
                locale: req.query.locale, 
                user_id:  req.jwtDecoded.data.user_id 
            } 
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving faq."
            })
        });
    }
    else{
        Faq.findAll({ 
            where: {
                identify:  req.query.identify, 
                category_identify: req.query.category_identify, 
                user_id:  req.jwtDecoded.data.user_id 
            } 
        })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving faq."
            })
        });
    }
}

exports.findAllFaq = async (req, res) => {
    // Validate request
    // if (!req.params.shop) {
    //     return  res.status(400).send({
    //         message: "Shop can not be empty!"
    //     });
    //     return false;
    // }
    let userID = null;
    const shop = req.params.shop;
    await User.findOne({ where: { shopify_domain: shop}})
        .then( async userData => {
            if (userData) {
                userID = userData.dataValues.id;
                await Faq.findAll({
                    where: {
                        user_id: userID
                    },
                })
                    .then(data => {
                        return  res.send(data);
                    })
                    .catch(err => {
                        return res.status(500).send({
                            message:
                                err.message || "Some error occurred while retrieving faq."
                        })
                    });
            } else {
                return res.status(400).send({
                    message: "Shop name is not found !"
                });
                return false;
            }
        }).catch(error => {
        return res.status(500).send("some error");
    })
};

// Retrieve all Faq of a category from the database.
exports.findAll = (req, res) => {
    if (!req.query.locale) {
        res.status(400).send({
            message: "Locale must be selected!"
        });
        return;
    }
    if (!req.jwtDecoded.data.user_id) {
        res.status(400).send({
            message: "Error not user selected ?"
        });
        return;
    }
    const user_id = req.jwtDecoded.data.user_id;
    let settingData = []

    Setting.findOne({
        where:{
            user_id: user_id
        }
    })
    .then(data => {
        settingData = data.dataValues
        if(settingData.faq_sort_name === true){
            Faq.findAll({ 
                where: {
                    user_id: user_id, locale: req.query.locale
                },
                order:['title'],
            })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving faq."
                })
            });
        }
        else{
            Faq.findAll({ 
                where: {
                    user_id: user_id, locale: req.query.locale
                },
                order:['position'],
            })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving faq."
                })
            });
        }
    })
    .catch(e =>{
        errorLog.error(e)
    })

};

exports.getAll = (req, res) => {
    if (!req.jwtDecoded.data.user_id) {
        res.status(400).send({
            message: "Error not user selected ?"
        });
        return;
    }
    const user_id = req.jwtDecoded.data.user_id;
    Faq.findAll({ where: {
            user_id: user_id
        } 
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving faq."
        })
    });
};

exports.findAllFeatureFaq = async (req, res) => {
    let Faqs = [];
    let Categories = [];
    let user_id = ''
    const shop = req.params.shop;
    if (!shop) {
        res.status(400).send({
            message: "Error not user selected ?"
        });
        return;
    }
    await User.findOne({
        where: { shopify_domain: shop}
    })
    .then(async data => {
        user_id = data.dataValues.id
        await Faq.findAll({ 
            where: { user_id: user_id }
        })
        .then(data => {
            Faqs = data
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving faq."
            })
        });
        await FaqCategory.findAll({
            where: {
                user_id: user_id,
                feature_category: true
            }
        })
        .then(data => {
            Categories = data
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving faq."
            })
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving faq."
        })
    });
    return res.send({faq: Faqs, category: Categories})
};
// Find a single Faq with an id
exports.findOne = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Faq id not selected"
        });
        return;
    }
    const id = req.params.id;
    Faq.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find faq with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving faq with id=" + id
            });
        });
};

// Update a Faq by the id in the request
exports.update = async (req, res) => {
    // Check requirement params
    // if (!req.params.id || !req.body.title || !req.body.content ) {
    //     res.status(400).send({
    //         message: "Faq update missing params!"
    //     });
    //     return;
    // }
    const id = req.params.id;
    // Check this faq is exits or not
    await Faq.findByPk(id)
        .then(async response => {
            if (response) {
                const user_id = response.dataValues.user_id;
                let identify = response.dataValues.identify;
                let locale = response.dataValues.locale;
                let category_identify = response.dataValues.category_identify;
                let faq = {
                    title: req.body.title,
                    content: req.body.content,
                    is_visible: req.body.is_visible,
                    list_id: req.body.list_id,
                    feature_faq: req.body.feature_faq,
                };
                if (req.body.position) {
                    faq.position = req.body.position;
                }
                let continueCondition = {};
                continueCondition.check = false;
                if ((req.body.locale && (locale !== req.body.locale)) && (req.body.category_identify && (category_identify !== req.body.category_identify)))  {
                    identify = await generateIdentify(user_id, identify, req.body.locale, req.body.category_identify);
                    if (!identify) {
                        continueCondition.check = true;
                        continueCondition.message = "Error generate faq identify !";
                    } else category_identify = req.body.category_identify;
                    faq.locale = req.body.locale;
                    category_identify = req.body.category_identify;
                }
                else if ((req.body.locale && (locale !== req.body.locale)) && !(req.body.category_identify && (category_identify !== req.body.category_identify))) {
                    faq.locale = req.body.locale;
                    await Faq.findOne({
                        where: {identify: identify, locale: locale, category_identify: category_identify, user_id: user_id}
                    })
                        .then(subData => {
                            if (subData.dataValues.id !== id) {
                                continueCondition.check = true;
                                continueCondition.message = "Faq for this locale already exist!";
                            }
                        }).catch(error => {
                            continueCondition.check = true;
                            continueCondition.message = `Error when checking faq ${error.message}`;
                        });
                }


                else if (!(req.body.locale && (locale !== req.body.locale)) && (req.body.category_identify && (category_identify !== req.body.category_identify))) {
                    identify = await generateIdentify(user_id, identify, locale, req.body.category_identify);
                    if (!identify) {
                        continueCondition.check = true;
                        continueCondition.message = "Error generate faq identify !";
                    } else category_identify = req.body.category_identify;
                }
                if (continueCondition.check) {
                    throw new Error(continueCondition.message);
                }
                faq.identify = identify;
                faq.category_identify = category_identify;
                const data = {
                    user_id: user_id,
                    locale: req.body.locale,
                    is_visible: req.body.is_visible,
                    identify : identify,
                    category_identify: category_identify,
                    title: req.body.title,
                    content: req.body.content,
                    feature_faq: req.body.feature_faq,
                }
                await Faq.update(data, {
                    where: { id: id}
                })
                .then(async num => {
                    if (num == 1) {
                        await Faq.update({category_identify: category_identify, is_visible: req.body.is_visible, feature_faq: req.body.feature_faq}, {
                            where: {
                                user_id: user_id,
                                identify: response.dataValues.identify,
                                category_identify: response.dataValues.category_identify
                            } 
                        })
                        .then(num => {
                            errorLog.error(num)
                        })
                        // .catch(e => {
                        //     console.log(e)
                        // })
                        res.send({
                            message: "Faq was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update faq with id=${id}. Maybe faq was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error updating faq with id=" + id
                    });
                    return;
                });
                if(req.body.title_translate){
                    const dataTranslate = {
                        is_visible: req.body.is_visible,
                        identify : identify,
                        category_identify: category_identify,
                        title: req.body.title_translate,
                        content: req.body.content_translate,
                        feature_faq: req.body.feature_faq,
                    }
                    await Faq.update(dataTranslate,
                        {
                            where: {id: req.body.id_translate}
                        }
                    )
                }
            }
        }).catch(error => {
            res.status(500).send({
                message: error.message
            });
            return;
        });
};

exports.updateWhenDeleteCategory = async (req, res) => {
    let listId = req.body
    let listIdentify = []
    let data = []
    let dataUpdate = []
    if(listId.length > 0){
        await Faq.findAll({
            where: {
                id : listId
            }
        })
        .then(response => {
            response.forEach(item => {
                data.push(item.dataValues)
                if(item.locale === 'default')
                listIdentify.push(
                    {
                        faq_id: item.dataValues.id,
                        faq_identify: item.dataValues.identify
                    }
                )
            })
    
            listIdentify.forEach(item => {
                let faqByIdentify = []
                faqByIdentify = data.filter(element => {
                    return item.faq_identify === element.identify
                })
                let count = []
                count = faqByIdentify.filter(e => {
                    return e.locale === 'default'
                })[0].id
                faqByIdentify.forEach(ele => {
                    ele.identify = ele.identify + count
                    dataUpdate.push(ele)
                })
            })
        })
        .catch(e => {
            errorLog.error(e)
        })
        dataUpdate.forEach(item => {
            Faq.update({
                identify: item.identify,
                category_identify: 'Uncategorized1'
            },{
                where: {
                    id: item.id
                }
            })
        })
        res.send({
            message: 'Update Successfully !'
        })
    }
};

exports.updateRearrangeFaqs = async (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  let faqs = req.body
  if(!faqs){
    res.status(400).send({
        message: "Could not update Faqs !"
    });
    return;
  }
  faqs.forEach(item => {
    Faq.update({
      position: item.position,
    },{
      where: {
        user_id : user_id,
        identify: item.identify
      }
    })
  })
  res.send({
      message: 'Update Successfully !'
  })
};

exports.updateAnalytics = async (req, res) => {
  const faq_id = req.params.id;
  if(faq_id){
    Faq.findOne({
      where: {
        id : faq_id
      }
    })
    .then(response => {
      let data_update = {
        readed_faq: response.readed_faq + 1
      }
      Faq.update(data_update,{
        where: {
          id : faq_id,
        }
      })
      .then(() => {
        res.status(200).send({
            message: 'Update Successfully !'
        })
      })
    })
  }
};

exports.updateAnalyticsFaq = async (req, res) => {
  const faq_id = req.params.id;
  const type = req.query.type
  if(faq_id){
    Faq.findOne({
      where: {
        id : faq_id
      }
    })
    .then(response => {
      var data_update
      if(type === 'like'){
        data_update = {
          liked_faq: response.liked_faq + 1
        }
      }
      else{
        data_update = {
          disliked_faq: response.disliked_faq + 1
        }
      }
      console.log(data_update)
      Faq.update(data_update,{
        where: {
          id : faq_id,
        }
      })
      .then(() => {
        res.status(200).send({
            message: 'Update Successfully !'
        })
      })
    })
  }
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Missing faq data!"
        });
        return;
    }
    let condition = { id: req.params.id };
    if (req.query.identify && req.query.category_identify && req.jwtDecoded.data.user_id) {
        condition = { identify:  req.query.identify, category_identify: req.query.category_identify, user_id:  req.jwtDecoded.data.user_id}
    }

    Faq.destroy({
        where: condition
    })
        .then( num => {
            if (num == 1) {
                res.send({
                    message: "Faq was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete this faq Maybe faq was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete faq"
            });
        });
};

// Delete all Faq from the database.
exports.deleteAll = (req, res) => {
    if (!req.jwtDecoded.data.user_id) {
        res.status(400).send({
            message: "Missing user_id param!"
        });
        return;
    }
    const user_id = req.jwtDecoded.data.user_id;
    Faq.destroy({
        where: {user_id: user_id},
        truncate: false
    })
        .then( nums => {
            res.send({ message: `${nums} faqs were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all faqs."
            });
        });
};

// Full text search
// Faq.findAll({
//     attributes: { include:[[Sequelize.literal(`MATCH (name, altName) AGAINST('shakespeare' IN NATURAL LANGUAGE MODE)`), 'score']] },
//     where: Sequelize.literal(`MATCH (name, altName) AGAINST('shakespeare' IN NATURAL LANGUAGE MODE)`),
//     order:[[Sequelize.literal('score'), 'DESC']],
// });

exports.searchFaqTitle = async (req, res) =>{
    if (!req.params.shop || !req.query.title || !req.query.locale) {
        return res.status(400).send({
            message: "Data is missing!"
        });
        return false;
    }
        const shop = req.params.shop;
        const title = req.query.title;
        const locale = req.query.locale;
        var userID = null;
        await User.findOne({ where: { shopify_domain: shop}})
            .then( async userData => {
                if (userData) {
                    userID = userData.dataValues.id;
                    await Faq.findAll({
                        where: db.sequelize.literal(`MATCH (title) AGAINST ('${title}') and user_id = ${userID} and locale = ${locale}`),
                        // order:[[db.sequelize.literal('score'), 'DESC']],
                    })
                        .then(data => {
                            return  res.send(data);
                        })
                        .catch(err => {
                            return res.status(500).send({
                                message:
                                    err.message || "Some error occurred while retrieving faq."
                            })
                        });
                } else {
                    return res.status(400).send({
                        message: "Shop name is not found !"
                    });
                    return false;
                }
            }).catch(error => {
                return res.status(500).send("some error");
            })

}

// Faq page
// Retrieve all Faq of a category from the database.
exports.findAllInFaqPage = async (req, res) => {
    // Validate request
    if (!req.params.shop || !req.query.locale) {
        return  res.status(400).send({
            message: "Shop and locale can not be empty!"
        });
        return false;
    }
    const shop = req.params.shop;
    let locale = req.query.locale;
    let userID = null;
    await User.findOne({ where: { shopify_domain: shop}})
        .then( async userData => {
            if (userData) {
                userID = userData.dataValues.id;

                if(locale === JSON.parse(userData.dataValues.shopLocales).shopLocales.filter(item => {return item.primary === true})[0].locale){
                    locale = 'default'
                }
                else{
                    locale = req.query.locale                    
                }

                await Faq.findAll({
                    where: {
                        user_id: userID, locale: locale
                    },
                    order:[[db.sequelize.literal('position'), 'DESC']],
                })
                    .then(data => {
                        return  res.send(data);
                    })
                    .catch(err => {
                        return res.status(500).send({
                            message:
                                err.message || "Some error occurred while retrieving faq."
                        })
                    });
            } else {
                return res.status(400).send({
                    message: "Shop name is not found !"
                });
                return false;
            }
        }).catch(error => {
        return res.status(500).send("some error");
    })
};

async function generateIdentify(user_id, identify, locale, category_identify) {
    let count = 0;
    let checked = false;
    let newIdentify = identify;
    do {
        if (count) {
            newIdentify = identify + count;
        }
        checked = await checkFaqIdentify(user_id, newIdentify, locale, category_identify);
        count++;
    } while (checked);
    return newIdentify;
}

async function checkFaqIdentify(user_id, identify, locale, category_identify) {
    let checkedIdentify = false;
    await Faq.findOne({ where: { user_id: user_id, identify: identify, locale: locale, category_identify: category_identify}})
        .then( async data => {
            if (data) {
                checkedIdentify = true;
            }
        }).catch(err => {
            errorLog.error(`faq generate identify error ${err.message}`)
    });
    return checkedIdentify;
}
// async function checkFaqIdentifyUpdate(user_id, identify, category_identify) {
//     let checkedIdentify = null;
//     await Faq.findOne({ where: { user_id: user_id, identify: identify, category_identify: category_identify}})
//         .then( async data => {
//             if (data) {
//                 identify = identify + '_1';
//                 checkedIdentify = await checkFaqIdentifyUpdate(user_id, identify, category_identify);
//             } else {
//                 checkedIdentify = identify
//             }
//         }).catch(err => {
//             errorLog.error(`faq generate identify error not locale ${err.message}`)
//     })
//     return checkedIdentify;
// }


async function checkFaqCategory(identify, user_id) {
    let responseData = {};
    await FaqCategory.findOne({
        attributes: ['id'],
        where: {identify: identify, locale: 'default', user_id: user_id }
    })
        .then(data =>{
            if (data) {
                responseData.status = true
            } else {
                responseData.status = false
                responseData.message = "not found category in this locale"
            }
        }).catch(err => {
            responseData.status = false
            responseData.message =  err.message || "not found category in this locale"
        });
    return responseData
}