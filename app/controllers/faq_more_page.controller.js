const db = require("../models");
const FaqMorePage = db.faq_more_page;
const errorLog = require('../helpers/log.helper');

exports.create = async (req, res) => {
    // Validate request
    const faq_more_page = req.body;
    const user_id = req.jwtDecoded.data.user_id;
    faq_more_page.forEach(async element => {
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
    // Create faq_more_page when identify is not set
    else {
        // Create a faq_more_page
        await FaqMorePage.bulkCreate(faq_more_page)
            .then(data => {
                res.send(data);
                return;
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the faq_more_page."
                });
                return;
            });
    }
};

// Retrieve all FaqMorePage of a category from the database.
exports.findAll = (req, res) => {
    const user_id = req.jwtDecoded.data.user_id;
    FaqMorePage.findAll({
        where: {
            user_id: user_id
        }
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving faq_more_page."
        })
    });
};

exports.findByPage = (req, res) => {
    if (!req.params.page) {
        res.status(400).send({
            message: "FaqMorePage page not selected"
        });
        return;
    }
    const user_id = req.jwtDecoded.data.user_id;
    const page_name = req.params.page
    FaqMorePage.findAll({
        where: {
            user_id: user_id,
            page_name: page_name
        }
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving faq_more_page."
        })
    });
};


// Find a single FaqMorePage with an id
exports.findOne = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "FaqMorePage id not selected"
        });
        return;
    }
    const id = req.params.id;
    FaqMorePage.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find faq_more_page with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving faq_more_page with id=" + id
            });
        });
};

// Update a FaqMorePage by the id in the request
exports.update = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "FaqMorePage update missing params!"
        });
        return;
    }
    // Check this faq_more_page is exits or not
    await FaqMorePage.findByPk(req.body.id)
        .then(async data => {
            if (data) {
                // const user_id = data.dataValues.user_id;
                await FaqMorePage.update(req.body, {
                    where: { id: req.body.id }
                })
                    .then( num => {
                        if (num == 1) {
                            res.send({
                                message: "FaqMorePage was updated successfully."
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

//Update FAQs in FaqMorePage
exports.updateFaqs = async (req, res) => {
    const data = req.body
    await FaqMorePage.update({
        faq_identify: data.faq_identify,
        category_identify: data.category_identify
    }, {
        where: { id: data.list_id }
    })
        .then( num => {
            if (num == 1) {
                res.send({
                    message: "FaqMorePage was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update FaqMorePage!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating FaqMorePage"
            });
        });

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Missing faq_more_page data!"
        });
        return;
    }
    let condition = { id: req.params.id };
    // if (req.query.identify && req.query.category_identify && req.jwtDecoded.data.user_id) {
    //     condition = { identify:  req.query.identify, category_identify: req.query.category_identify, user_id:  req.jwtDecoded.data.user_id}
    // }

    FaqMorePage.destroy({
        where: condition
    })
        .then( num => {
            if (num == 1) {
                res.send({
                    message: "FaqMorePage was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete this faq_more_page Maybe faq_more_page was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete faq_more_page"
            });
        });
};

// Delete all FaqMorePage from the database.
exports.deleteAll = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Missing product_id param!"
        });
        return;
    }
    const product_id = req.body
    FaqMorePage.destroy({
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
