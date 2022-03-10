const db = require("../models");
const Faq = db.faq;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    // Create a faq
    const faq = {
      user_id : req.body.user_id,
      category_id: req.body.category_id,
      title: req.body.title,
      content: req.body.content,
      is_visible: req.body.is_visible,
    };
    Faq.create(faq)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Faq."
        });
    });
};

// Retrieve all Faq from the database.
exports.findAll = (req, res) => {
    const user_id = req.params.user_id;
    // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null; 
    Faq.findAll({ where: { user_id : user_id } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving faq."
        });
      });
  };

// exports.findByTitle = (req, res) => {
//   const title = req.query.title;
//   var condition = title ? { title: { [Op.like]: `%${title}%` } } : null; 
//   Faq.findAll({ where: condition })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving faq."
//       });
//     });
// };

// Find a single Faq with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Faq.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Faq with id=${id}.`
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
    .then(num => {
      if (num == 1) {
        // console.log(req.body)
        console.log(req.params.id)
        res.send({
          message: "Faq was updated successfully."
        });
      } else {
        console.log(req.body)
        res.send({
          message: `Cannot update Faq with id=${id}. Maybe Faq was not found or req.body is empty!`
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
    const id = req.params.id;
    Faq.destroy({
      where: { id: id }
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
  };

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  const user_id = req.params.user_id;
  Faq.destroy({
    where: {  user_id : user_id },
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} faq were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all faqs."
      });
    });
};