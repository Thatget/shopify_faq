const db = require("../models");
const Product = db.product;
const errorLog = require('../helpers/log.helper');
const User = db.user;

exports.create = async (req, res) => {
    
    const product = req.body;
    const user_id = req.jwtDecoded.data.user_id;
    product.user_id = user_id;

    // Create product when identify is not set
    if (!req.body.product_id) {
        res.status(500).send({
            message: "Some error occurred while creating the Product."
        });
        return;
    } else {
        // Create a product
        await Product.create(product)
            .then(data => {
                res.send(data);
                return;
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the product."
                });
                return;
            });
    }
};

// Retrieve all Product of a category from the database.
exports.findAll = (req, res) => {
    if (!req.jwtDecoded.data.user_id) {
        res.status(400).send({
            message: "Error not user selected ?"
        });
        return;
    }
    const user_id = req.jwtDecoded.data.user_id;
    Product.findAll({ where: {
        user_id:user_id
     } })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving product."
            })});
};

exports.findAllProduct = async (req, res) => {
    let userID = null;
    const shop = req.params.shop;
    await User.findOne({ where: { shopify_domain: shop}})
    .then( async userData => {
        if (userData) {
            userID = userData.dataValues.id;
            await Product.findAll({
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
                            err.message || "Some error occurred while retrieving Product."
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

// Find a single Product with an id
exports.findOne = async (req, res) => {
    if (!req.params.product_id) {
        res.status(400).send({
            message: "Product product_id not selected"
        });
        return;
    }
    const product_id = req.params.product_id
    console.log(product_id)
    await Product.findOne({
        where: {
            product_id: product_id
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find product with product_id=${product_id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving product with product_id=" + product_id
            });
        });
};

// Update a Product by the id in the request
exports.update = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Product update missing params!"
        });
        return;
    }
    const id = req.params.id;

    // Check this product is exits or not
    await Product.findByPk(id)
        .then(async data => {
            if (data) {
                // const user_id = data.dataValues.user_id;
                let product = {
                    faq_id: req.body.faq_id,
                };
                await Product.update(product, {
                    where: { id: id }
                })
                    .then( num => {
                        if (num == 1) {
                            res.send({
                                message: "Product was updated successfully."
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
            message: "Missing product data!"
        });
        return;
    }
    let condition = { id: req.params.id };
    Product.destroy({
        where: condition
    })
        .then( num => {
            if (num == 1) {
                res.send({
                    message: "Product was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete this product Maybe product was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete product"
            });
        });
};


