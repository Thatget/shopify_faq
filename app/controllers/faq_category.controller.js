const db = require("../models");
const FaqCategory = db.faq_category;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a faq_category
    const faq_category = {
        user_id: req.jwtDecoded.data.user_id,
        title: req.body.title,
        description: req.body.description,
        is_visible: req.body.is_visible
    };

    FaqCategory.create(faq_category)
        .then( data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Category."
            });
        });
};

// Retrieve all faq_category from the database of a user.
exports.findAll = (req, res) => {
    const user_id = req.jwtDecoded.data.user_id;
    var condition = user_id ? { user_id: { [Op.eq]: `${user_id}` } } : null;
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
exports.findOne = (req, res) => {
    const id = req.params.id;
    FaqCategory.findByPk(id)
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
};

// Update a Category by the id in the request
exports.update = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Not category selected!"
        });
        return;
    }
    const id = req.params.id;
    FaqCategory.update(req.body, {
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
};

// Delete a Category with the specified id in the request
exports.delete = (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Not category selected!"
        });
        return;
    }
    const id = req.params.id;
    FaqCategory.destroy({
        where: { id: id }
    })
        .then( num => {
            if (num == 1) {
                res.send({
                    message: "Category was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete category with id=${id}. Maybe category was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete category with id=" + id
            });
        });
};

// Delete all Category of a User from the database.
exports.deleteAll = (req, res) => {
    const  user_id = req.jwtDecoded.data.user_id;
    FaqCategory.destroy({
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
