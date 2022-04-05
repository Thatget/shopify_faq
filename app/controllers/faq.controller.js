const db = require("../models");
const Faq = db.faq;
const User = db.user;
const errorLog = require('../helpers/log.helper')

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
    }
    const title = req.body.title;
    const locale = req.body.locale;
    const user_id = req.jwtDecoded.data.user_id;
    const category_identify = req.body.category_identify;
    const faq = req.body;
    faq.user_id = user_id;
    let identify = '';

    // Create faq when identify is not set
    if (!req.body.identify) {
        identify = title.trim().replace(' ', '_') + user_id + category_identify;
        identify = await checkFaqIdentify(user_id, identify, locale, category_identify);
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
                    identify = await checkFaqIdentify(user_id, identify, locale, category_identify);
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
    Faq.findAll({ where: {
        user_id:user_id, locale: req.query.locale
     } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving faq."
            })});
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
    if (!req.params.id || !req.body.title || !req.body.content || !req.body.is_visible) {
        res.status(400).send({
            message: "Category update missing params!"
        });
        return;
    }
    const id = req.params.id;
    // Check this faq is exits or not
    await Faq.findByPk(id)
        .then(async data => {
            if (data) {
                const user_id = data.dataValues.user_id;
                let identify = data.dataValues.identify;
                let locale = data.dataValues.locale;
                let category_identify = data.dataValues.category_identify;
                let faq = {
                    title: req.body.title,
                    description: req.body.content,
                    is_visible: req.body.is_visible,
                };
                if (req.body.position) {
                    faq.position = req.body.position;
                }
                if (req.body.locale) {
                    if (!(locale !== req.body.locale)) {
                        faq.locale = req.body.locale;
                        await Faq.findOne({where: {identify: identify, locale: locale, category_identify: category_identify, user_id: user_id }})
                            .then(subData =>{
                                if (!(subData.dataByValue.id === id)) {
                                    res.status(400).send({
                                        message: "Faq for this locale already exist!"
                                    });
                                    return;
                                }
                            }).catch(error => {
                                res.status(400).send({
                                    message: "Error when checking faq !"
                                });
                                return;
                            })
                    }
                }
                if (req.body.category_identify) {
                    if (!(category_identify === req.body.category_identify)) {
                        // faq.category_identify = req.body.category_identify;
                        identify = await checkFaqIdentifyUpdate(user_id, identify, req.body.category_identify);
                        if (!identify) {
                            res.status(400).send({
                                message: "Error generate faq identify !"
                            });
                            return;
                        }

                    }
                }
                faq.identify = identify;
                faq.category_identify = category_identify;
                Faq.update(faq, {
                    where: { id: id }
                })
                    .then( num => {
                        if (num == 1) {
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
                    });
            }
        }).catch()
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
                console.log(error)
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
    const locale = req.query.locale;
    let userID = null;
    await User.findOne({ where: { shopify_domain: shop}})
        .then( async userData => {
            if (userData) {
                userID = userData.dataValues.id;
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
        console.log(error)
        return res.status(500).send("some error");
    })
};

async function checkFaqIdentify(user_id, identify, locale, category_identify) {
    let checkedIdentify = null;
    await Faq.findOne({ where: { user_id: user_id, identify: identify, locale: locale, category_identify: category_identify}})
        .then( async data => {
            if (data) {
                identify = identify + '_1';
                checkedIdentify = await checkFaqIdentify(user_id, identify, locale, category_identify);
            } else {
                checkedIdentify = identify
            }
        }).catch(err => {
            errorLog.error(`faq generate identify error ${err.message}`)
    })
    return checkedIdentify;
}
async function checkFaqIdentifyUpdate(user_id, identify, category_identify) {
    let checkedIdentify = null;
    await Faq.findOne({ where: { user_id: user_id, identify: identify, category_identify: category_identify}})
        .then( async data => {
            if (data) {
                identify = identify + '_1';
                checkedIdentify = await checkFaqIdentify(user_id, identify, category_identify);
            } else {
                checkedIdentify = identify
            }
        }).catch(err => {
            errorLog.error(`faq generate identify error ${err.message}`)
    })
    return checkedIdentify;
}