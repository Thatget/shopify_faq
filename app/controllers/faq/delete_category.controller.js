const db = require("../models");
const FaqCategory = db.faq_category;
const Faq = db.faq;
const Op = db.Sequelize.Op;

// Delete a Category with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteFaq([id])
    /**
     * Delete this category !
     */
    FaqCategory.destroy({
        where: { id: id }
    })
        .then(num => {
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
    const user_id = req.query.user_id;
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
    FaqCategory.destroy({
        where: {condition},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} categories were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while removing all users."
        });
    });
};

    /**
     * Delete all faq of this category !
     */
    function deleteFaq ( category_id ) {
        var condition = category_id ? { category_id: { [Op.in]: `${category_id}` } } : null;
        Faq.destroy({
            where: {condition}
        })
        .then(num => {
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
    }
