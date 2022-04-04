const db = require("../models");
const FaqCategory = db.faq_category;
const User = db.user;
const Op = db.Sequelize.Op;
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
    const title = req.body.title;
    // const faq_category = {
    //     title: title,
    //     description: req.body.description,
    //     is_visible: req.body.is_visible,
    // };
    const faq_category = req.body;
    faq_category.user_id = user_id;
    let identify = '';
    if (!req.body.identify) {
        identify = title.trim().replace(' ', '_') + user_id;
        identify = await checkCategoryIdentify(user_id, identify, locale)
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
            return
        }
    } else {
        identify = req.body.identify;
        await FaqCategory.findOne({
            where: { user_id: user_id, identify: identify, locale: locale }
        })
            .then( async data =>{
                if (data) {
                    await FaqCategory.update(req.body, {
                        where: { user_id: user_id, identify: identify, locale: locale }
                    })
                        .then( num => {
                            if (num == 1) {
                                res.send({
                                    message: "Category was updated successfully."
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
                                message: "Error updating category with id=" + id
                            });
                            return
                        });
                } else {
                    identify = await checkCategoryIdentify(user_id, identify, locale);
                    if (!identify) {
                        res.status(500).send({
                            message: "Some error occurred while creating the Category. Identify is not defined in update in create"
                        });
                        return
                    } else {
                        faq_category.identify = identify;
                        await FaqCategory.create(faq_category)
                            .then(data => {
                                res.send(data);
                            })
                            .catch(err => {
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while creating the Category."
                                });
                            });
                    }
                }
            }).catch(err => {
                res.status(500).send({
                    message: "Error retrieving category with identify=" + identify + ` in locale ${locale}`
                });
            });
    }
};

// Retrieve all faq_category from the database of a user.
exports.findAll = (req, res) => {
    if (!req.query.locale) {
        res.status(400).send({
            message: "Locale must be selected!"
        });
        return;
    }
    const user_id = req.jwtDecoded.data.user_id;
    let condition = { user_id: { [Op.eq]: `${user_id}` }, locale: req.query.locale };
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
    const id = req.params.id;
    if (req.query.identify && req.query.locale) {
        await FaqCategory.findOne({where: {identify: req.query.identify, locale: req.query.locale }})
            .then(data =>{
                if (data) {
                    res.send(data);
                } else {
                    res.status(404).send({
                        message: `Cannot find category with identify=${req.query.identify} in locale ${req.query.locale}.`
                    });
                }
            }).catch(err => {
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
            .catch(err => {
                res.status(500).send({
                    message: "Error retrieving category with id=" + id
                });
            });
    }
};

// Update a Category by the id in the request
exports.update = async (req, res) => {
    if (!req.params.id || !req.body.title || req.body.description || req.body.is_visible) {
        res.status(400).send({
            message: "Category update missing params!"
        });
        return;
    }
    const id = req.params.id;

    // Check this faq_category is exits or not
    await FaqCategory.findByPk(id)
        .then(async data => {
            if (data) {
                    let faq_category = {
                        title: req.body.title,
                        description: req.body.description,
                        is_visible: req.body.is_visible,
                    };
                    if (req.body.position) {
                        faq_category.position = req.body.position;
                    }
                    await FaqCategory.update(faq_category, {
                        where: { id: id }
                    })
                        .then( num => {
                            if (num == 1) {
                                res.send({
                                    message: "Category was updated successfully."
                                });
                            } else {
                                res.send({
                                    message: `Cannot update category with id=${id}. Maybe category was not found or req.body is empty!`
                                });
                            }
                        })
                        .catch(err => {
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
        }).catch(error => {
            res.status(500).send({
                message: "Can't find category with id=" + id
            });
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
        .catch(err => {
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
                    order:[[db.sequelize.literal('position'), 'DESC']],
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
            console.log(error)
            return;
    });
};

async function checkCategoryIdentify(user_id, identify, locale) {
    let checkedIdentify = null;
    await FaqCategory.findOne({ where: { user_id: user_id, identify: identify, locale: locale}})
        .then( async data => {
            if (data) {
                identify = identify + '_1';
                checkedIdentify = await checkCategoryIdentify(user_id, identify, locale);
            } else {
                checkedIdentify = identify
            }
        }).catch(e => {
        checkedIdentify = null
    });
    return checkedIdentify;
}