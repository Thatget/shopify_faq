const { user } = require("../models");
const db = require("../models");
const Faq_category = db.faq_category;
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
      user_id: req.body.user_id,
      title: req.body.title,
      description: req.body.description,
      is_visible: req.body.is_visible,
    };

    Faq_category.create(faq_category)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Faq_category."
        });
    });
};

// Retrieve all Faq_category from the database.
exports.findAll = (req, res) => {
    const user_id = req.params.user_id;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null; 
    Faq_category.findAll({ where: { user_id : user_id} })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving faq_category."
        });
      });
  };

// Find a single Faq_category with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Faq_category.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Faq_category with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving faq_category with id=" + id
        });
      });
  };

  // exports.findOne = (req, res) => {
  //   const user_id = req.params.user_id;
  //   Faq_category.findOne({ where: { user_id : user_id} })
  //     .then(data => {
  //       if (data) {
  //         res.send(data);
  //       } else {
  //         res.status(404).send({
  //           message: `Cannot find Faq_category with user_id=${user_id}.`
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       res.status(500).send({
  //         message: "Error retrieving faq_category with user_id=" + user_id
  //       });
  //     });
  // };

// Update a Faq_category by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Faq_category.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Faq_category was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Faq_category with id=${id}. Maybe Faq_category was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating faq_category with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Faq_category.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Faq_category was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete faq_category with id=${id}. Maybe faq_category was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete faq_category with id=" + id
        });
      });
  };

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  const user_id = req.params.user_id;
  Faq_category.destroy({
    where: { user_id: user_id},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} faq_category were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all faq_categorys."
      });
    });
};