const db = require("../models");
const Setting = db.setting;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.store_name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    // Create a setting
    const setting = {
        user_id: req.body.user_id,
        status: req.body.status,
        slug: req.body.slug,
        title: req.body.title
    };

    Setting.create(setting)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};

// Retrieve all User from the database.
exports.findAll = (req, res) => {
    const user_id = req.query.user_id;
    var condition = user_id ? { user_id: { [Op.eq]: `${user_id}` } } : null;
    Setting.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving user."
            });
        });
};

// Find a single Setting with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Setting.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Setting with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving setting with id=" + id
            });
        });
};

// Update a Setting by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Setting.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Setting was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Setting with id=${id}. Maybe Setting was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating user with id=" + id
            });
        });
};

// Delete a Setting with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Setting.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Setting was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete setting with id=${id}. Maybe setting was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete setting with id=" + id
            });
        });
};

// Delete all Setting from the database.
exports.deleteAll = (req, res) => {
    const user_id = req.query.user_id;
    var condition = user_id ? { user_id: { [Op.eq]: `${user_id}` } } : null;
    Setting.destroy({
        where: {condition},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} user were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        });
};
