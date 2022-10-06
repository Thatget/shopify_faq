const db = require("../models");
const Messages = db.faq_messages;
// const errorLog = require('../helpers/log.helper')

exports.create = async (req, res) => {
  // Create a setting
  const messages = req.body;
  const data = {
    user_id: messages.user_id,
    customer_name: messages.customer_name,
    customer_contact: messages.customer_contact,
    faq_title: messages.faq_title,
    time: messages.time
  }
  if(data){
    Messages.create(data)
    .then(data => {
      res.send('create success!');
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
exports.findAll = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  Messages.findAll({
    where:{
      user_id: user_id
    }
  })
  .then(data => {
      if (data) {
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

exports.findAllEmbedApp = async (req, res) => {
  const shop = req.params.shop
  let userID = null;
  let messagesSetting = []
  const user_id = req.jwtDecoded.data.user_id;
  await User.findOne({ where: { shopify_domain: shop}})
  .then(async response => {
    userID = response.dataValues.id
    await Messages.findAll({
      where:{
        user_id: userID
      }
    })
    .then(data => {
        if (data) {
          messagesSetting = data.dataValues
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
    return res.send({message_setting: messagesSetting}) 
  })
  .catch(e => {
    console.log(e)
  })

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
