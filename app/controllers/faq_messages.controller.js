const db = require("../models");
const Messages = db.faq_messages;
// const errorLog = require('../helpers/log.helper')

exports.create = async (req, res) => {
  // Create a setting
  const messages = req.body;
  console.log(messages)
  if(messages){
    Messages.create(messages)
    .then(data => {
        console.log(data)
        res.send(return_data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Messages."
        });
    });
    }
};

// Find a single Messages with an id
exports.findOne = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  Messages.findOne({
    where:{
      user_id: user_id
    }
  })
  .then(data => {
      if (data) {
        console.log(data)
          res.send(data);
      } else {
          res.status(404).send({
              message: `Cannot find messages with user_id=${user_id}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: "Error retrieving messages with user_id =" + user_id
      });
  });
};

// Delete a Messages with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  const user_id = req.jwtDecoded.data.user_id;
  Messages.destroy({
    where: { 
      user_id: user_id,
      id: id
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Messages was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete messages with id=${id}. Maybe messages was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete messages with id=" + id
      });
    });
  };


// Delete all Messages with the specified id in the request
exports.deleteAll = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  Messages.destroy({
    where: { user_id: user_id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Messages was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete messages with user_id=${user_id}. Maybe messages was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete messages with user_id=" + user_id
      });
    });
  };
