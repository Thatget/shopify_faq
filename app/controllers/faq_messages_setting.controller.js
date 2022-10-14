const db = require("../models");
const MessagesSetting = db.faq_messages_setting;
// const errorLog = require('../helpers/log.helper')
const User = db.user

// Create a messages setting
exports.create = async (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  const messages_setting = req.body;
  messages_setting.user_id = user_id
  if(messages_setting){
    MessagesSetting.create(messages_setting)
    .then(data => {
      if(data){
        res.send(data);
      }
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the MessagesSetting settings."
        });
    });
    }
};

exports.findAllEmbedApp = async (req, res) => {
  const shop = req.params.shop
  let userID = null;
  let messagesSetting = []
  await User.findOne({ where: { shopify_domain: shop}})
  .then(async response => {
    response.dataValues.id? userID = response.dataValues.id : ''
    if(userID){
      await MessagesSetting.findOne({
        where:{
          user_id: userID
        }
      })
      .then(data => {
          if (data) {
            messagesSetting = data.dataValues
            console.log(messagesSetting.help_desk_visible)
          } else {
            res.status(404).send({
                message: `Cannot find messages with user_id=${userID}.`
            });
          }
      })
      .catch(err => {
          res.status(500).send({
              message: "Error retrieving messages with user_id =" + userID
          });
      }); 
    }
    return res.send({message_setting: messagesSetting}) 
  })
  .catch(e => {
    console.log(e)
  })

};

// Find a single MessagesSetting with an id
exports.findOne = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  MessagesSetting.findOne({
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

// Update faq_messages_setting
exports.update = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  const faq_messages_settings = req.body
  console.log(faq_messages_settings)
  MessagesSetting.update(faq_messages_settings, {
    where:{
      user_id: user_id
    }
  })
  .then(data => {
      if (data) {
          res.send(data);
      } else {
          res.status(404).send({
              message: `Cannot update messages setting with user_id=${user_id}.`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: "Error update messages setting with user_id =" + user_id
      });
  });
};

