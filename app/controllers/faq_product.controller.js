const db = require("../models");
const FaqProduct = db.faq_product;
const errorLog = require('../helpers/log.helper');

exports.create = async (req, res) => {
    // Validate request
    if (!req.body.product_id) {
        res.status(400).send({
            message: "Faq id can not be empty!"
        });
        return;
    }
    // if (!req.body.identify) {
    //     res.status(400).send({
    //         message: "FaqProduct id can not be empty!"
    //     });
    //     return;
    // }
    // if (!req.jwtDecoded.data.user_id) {
    //     res.status(400).send({
    //         message: "no user selected ?"
    //     });
    //     return;
    // }
    // if (!req.body.locale) {
    //     res.status(400).send({
    //         message: "Locale must be selected!"
    //     });
    //     return;
    // }
    // if (!req.body.product_image) {
    //     res.status(400).send({
    //         message: "FaqProduct image must be selected!"
    //     });
    //     return;
    // }
    // if (!req.body.product_name) {
    //     res.status(400).send({
    //         message: "FaqProduct name must be selected!"
    //     });
    //     return;
    // } else {
    //     let checkCategory = await checkFaqCategory(req.body.identify, req.body.locale, req.jwtDecoded.data.user_id)
    //     if (!checkCategory.status) {
    //         res.status(400).send({
    //             message: checkCategory.message
    //         });
    //         return;
    //     }
    // }
    // const title = req.body.title;
    const faq_product = req.body;
    // Create faq_product when identify is not set
    if (!req.body.faq_id) {
        res.status(500).send({
            message: "Some error occurred while creating the FaqProduct."
        });
        return;
    } else {
        // Create a faq_product
        await FaqProduct.create(faq_product)
            .then(data => {
                res.send(data);
                return;
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the faq_product."
                });
                return;
            });
    }
};

// Retrieve all FaqProduct of a category from the database.
exports.findAll = (req, res) => {
    const product_id = req.params.product_id;
    FaqProduct.findAll({ where: { product_id: product_id }})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving faq_product."
            })});
};

// exports.findAllProduct = async (req, res) => {
//     let userID = null;
//     const shop = req.params.shop;
//     await User.findOne({ where: { shopify_domain: shop}})
//     .then( async userData => {
//         if (userData) {
//             userID = userData.dataValues.id;
//             console.log(userID)
//             await FaqProduct.findAll({
//                 where: {
//                     user_id: userID
//                 },
//             })
//                 .then(data => {
//                     console.log(data)
//                     return  res.send(data);
//                 })
//                 .catch(err => {
//                     return res.status(500).send({
//                         message:
//                             err.message || "Some error occurred while retrieving FaqProduct."
//                     })
//                 });
//         } else {
//             return res.status(400).send({
//                 message: "Shop name is not found !"
//             });
//             return false;
//         }
//     }).catch(error => {
//     return res.status(500).send("some error");
// })

// };

// Find a single FaqProduct with an id

exports.findOne = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "FaqProduct id not selected"
        });
        return;
    }
    const id = req.params.id;
    FaqProduct.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find faq_product with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving faq_product with id=" + id
            });
        });
};

// Update a FaqProduct by the id in the request
exports.update = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "FaqProduct update missing params!"
        });
        return;
    }
    const id = req.params.id;

    // Check this faq_product is exits or not
    await FaqProduct.findByPk(id)
        .then(async data => {
            if (data) {
                // const user_id = data.dataValues.user_id;
                let faq_product = {
                    faq_id: req.body.faq_id,
                };
                await FaqProduct.update(faq_product, {
                    where: { id: id }
                })
                    .then( num => {
                        if (num == 1) {
                            res.send({
                                message: "FaqProduct was updated successfully."
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
// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Missing faq_product data!"
        });
        return;
    }
    let condition = { id: req.params.id };
    // if (req.query.identify && req.query.category_identify && req.jwtDecoded.data.user_id) {
    //     condition = { identify:  req.query.identify, category_identify: req.query.category_identify, user_id:  req.jwtDecoded.data.user_id}
    // }

    FaqProduct.destroy({
        where: condition
    })
        .then( num => {
            if (num == 1) {
                res.send({
                    message: "FaqProduct was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete this faq_product Maybe faq_product was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete faq_product"
            });
        });
};

// Delete all FaqProduct from the database.
exports.deleteAll = (req, res) => {
    if (!req.params.product_id) {
        res.status(400).send({
            message: "Missing product_id param!"
        });
        return;
    }
    const product_id = req.params.product_id
    FaqProduct.destroy({
        where: {product_id: product_id},
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

