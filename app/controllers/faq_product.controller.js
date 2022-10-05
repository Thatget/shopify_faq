const db = require("../models");
const FaqProduct = db.faq_product;
const errorLog = require('../helpers/log.helper');

exports.create = async (req, res) => {
    // Validate request
    const faq_product = req.body;
    const user_id = req.jwtDecoded.data.user_id;
    faq_product.forEach(async element => {
        // await checkProductId(user_id, element.product_id)
        // console.log(checkProductId(user_id, element.product_id))
        element.user_id = user_id;
    }) 
    if (!req.body) {
        res.status(400).send({
            message: "Faq id can not be empty!"
        });
        return;
    }
    // Create faq_product when identify is not set
    else {
        // Create a faq_product
        await FaqProduct.bulkCreate(faq_product)
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
    const user_id = req.jwtDecoded.data.user_id;
    FaqProduct.findAll({
        where: {
            user_id: user_id
        },
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving faq_product."
        })
    });
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
    // Check this faq_product is exits or not
    await FaqProduct.findByPk(req.body.id)
        .then(async data => {
            if (data) {
                // const user_id = data.dataValues.user_id;
                await FaqProduct.update(req.body, {
                    where: { id: req.body.id }
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

// Update position a FaqProduct by the id in the request

exports.updatePosition = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "FaqProduct update missing params!"
        });
        return;
    }
    // Check this faq_product is exits or not
    const faq_product = req.body
    // const user_id = data.dataValues.user_id;
    faq_product.forEach(item => {
        FaqProduct.update({
            position: item.position,
        },{
            where: {
                id: item.id
            }
        })
    })
    res.send({
        message: 'Update Successfully !'
    })
};


//Update FAQs in FaqProduct
exports.updateFaqs = async (req, res) => {
    const data = req.body
    const user_id = req.jwtDecoded.data.user_id;
    if(data){
        for(let i = 0; i < data.length; i++){
            await FaqProduct.update({
                category_identify: 'Uncategorized1',
                faq_identify : data[i].identify
            }, {
                where: {
                    faq_id : data[i].id,
                    user_id : user_id
                }
            })
        }
        res.send({
            message: "FaqProduct was updated successfully."
        });
    }
    else{
        res.send({
            message: `Cannot update FaqProduct!`
        });
    }
};

exports.updateFaqsWhenChangeCategory = async (req, res) => {
    const data = req.body
    const user_id = req.jwtDecoded.data.user_id;
    if(data){
        await FaqProduct.update({
            category_identify: data.category_identify,
            faq_identify : data.identify
        }, {
            where: {
                faq_id : data.id,
                user_id : user_id
            }
        })
        res.send({
            message: "FaqProduct was updated successfully."
        });
    }
    else{
        res.send({
            message: `Cannot update FaqProduct!`
        });
    }
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
    if (!req.body) {
        res.status(400).send({
            message: "Missing product_id param!"
        });
        return;
    }
    const product_id = req.body
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