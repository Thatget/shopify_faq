const db = require("../models");
const MessagesSetting = db.faq_messages_setting;
const errorLog = require('../helpers/log.helper')
const User = db.user
const Plan = db.merchants_plan

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
     userID = response.dataValues.id
     let userData = response.dataValues
    if(userID){
      if(userID != 3329){
        // let plan = await getPlan(userID)
        // if(plan != 'Free' || userData.plan_extra){
          await MessagesSetting.findOne({
            where:{
              user_id: userID
            }
          })
          .then(data => {
              if (data) {
                messagesSetting = data.dataValues
              } else {
                res.status(404).send({
                    message: `Cannot find messages with user_id=${userID}.`
                });
              }
          })
          .catch(() => {
              res.status(500).send({
                  message: "Error retrieving messages with user_id =" + userID
              });
          }); 
        // }
      }
      else{
        let plan = await getPlan(userID)
        if(plan != 'Free' || userData.plan_extra){
          await MessagesSetting.findOne({
            where:{
              user_id: userID
            }
          })
          .then(data => {
              if (data) {
                messagesSetting = data.dataValues
              } else {
                res.status(404).send({
                    message: `Cannot find messages with user_id=${userID}.`
                });
              }
          })
          .catch(() => {
              res.status(500).send({
                  message: "Error retrieving messages with user_id =" + userID
              });
          }); 
        }
      }
    }
    else{
      let plan = await getPlan(userID)
      if(plan != 'Free' || userData.plan_extra){
        await MessagesSetting.findOne({
          where:{
            user_id: userID
          }
        })
        .then(data => {
            if (data) {
              messagesSetting = data.dataValues
            } else {
              res.status(404).send({
                  message: `Cannot find messages with user_id=${userID}.`
              });
            }
        })
        .catch(() => {
            res.status(500).send({
                message: "Error retrieving messages with user_id =" + userID
            });
        }); 
      }
    }
    return res.send({message_setting: messagesSetting}) 
  })
  .catch(e => {
    errorLog.error(e)
  })

};

async function getPlan(userID){
  let PlanData = null
    await Plan.findOne({
        where: {
            user_id: userID,
        },
    })
    .then(async data => {
        if(data){
          PlanData = data.dataValues.plan
        }
    })
    .catch(e => {
      errorLog.error(e)
    })
      return PlanData;
}

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
  .catch((e) => {
      res.status(500).send({
          message: e
      });
  });
};

// Update faq_messages_setting
exports.update = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  const faq_messages_settings = req.body
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
  .catch(() => {
      res.status(500).send({
          message: "Error update messages setting with user_id =" + user_id
      });
  });
};

