const db = require("../models");
const Faq = db.faq;
const User = db.user;

const debug = console.log.bind(console);

exports.create = (req, res) => {
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
    }if (!req.jwtDecoded.data.user_id) {
        res.status(400).send({
            message: "no user selected ?"
        });
        return;
    }
    // Create a faq
    const faq = {
        category_id: req.body.category_id,
        user_id: req.jwtDecoded.data.user_id,
        title: req.body.title,
        content: req.body.content,
        is_visible: req.body.is_visible
    };

    Faq.create(faq)
        .then( data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the faq."
            });
        });
};

// Retrieve all Faq of a category from the database.
exports.findAll = (req, res) => {
    const user_id = req.jwtDecoded.data.user_id;
    Faq.findAll({ where: {
        user_id:user_id
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
exports.update = (req, res) => {
    const id = req.params.id;
    Faq.update(req.body, {
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
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Missing faq id!"
        });
        return;
    }
    const id = req.params.id;
    Faq.destroy({
        where: { id: id }
    })
        .then( num => {
            if (num == 1) {
                res.send({
                    message: "Faq was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete faq with id=${id}. Maybe faq was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete faq with id=" + id
            });
        });
};

// Delete Faq by Category from the database.
exports.deleteByCategory = (req, res) => {
    if (!req.query.category_id) {
        res.status(400).send({
            message: "Missing category param!"
        });
        return;
    }
    const category_id = req.query.category_id;
    Faq.destroy({
        where: {category_id: category_id},
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
    if (!req.params.shop || !req.query.title) {
        return res.status(400).send({
            message: "Shop can not be empty!"
        });
        return false;
    }
        const shop = req.params.shop;
        const title = req.query.title;
        var userID = null;
        await User.findOne({ where: { shopify_domain: shop}})
            .then( async userData => {
                if (userData) {
                    userID = userData.dataValues.id;
                    await Faq.findAll({
                        where: db.sequelize.literal(`MATCH (title) AGAINST ('${title}') and user_id = ${userID}`),
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
    if (!req.params.shop) {
        return  res.status(400).send({
            message: "Shop can not be empty!"
        });
        return false;
    }
    const shop = req.params.shop;
    var userID = null;
    await User.findOne({ where: { shopify_domain: shop}})
        .then( async userData => {
            if (userData) {
                userID = userData.dataValues.id;
                await Faq.findAll({
                    where: {
                        user_id: userID
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
