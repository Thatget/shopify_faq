const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const Scans_Shopify_Homepage = db.scans_shopify_homepage;
const Scans_Shopify_Productpage = db.scans_shopify_productpage;
const Scans_Shopify_Cartpage = db.scans_shopify_cartpage;
const Scans_Shopify_Collectionpage = db.scans_shopify_collectionpage;
const Scans_Shopify_Checkoutpage = db.scans_shopify_checkoutpage;
const Scans_Shopify_Shopifypage = db.scans_shopify_shopifypage;
const Scans_Custom_text = db.scans_custom_text;
const Scans_Custom_Images = db.scans_custom_images;
const Scans_Custom_Vcard = db.scans_custom_vcard;
const Scans_Custom_Url = db.scans_custom_url;
const Scans_Custom_Pdf = db.scans_custom_pdf;
const Scans_Custom_Mobile = db.scans_custom_mobile;

const QR_code = db.qr_code;
const QR_code_setting = db.qr_code_setting;
const QR_code_style = db.qr_code_style;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.store_name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    // Create a user
    const user = {
      store_name: req.body.store_name,
      shopify_domain: req.body.shopify_domain,
      shopify_access_token: req.body.shopify_access_token,
      email: req.body.email,
      phone: req.body.phone,
    };

    User.create(user)
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

exports.findAllData = async(req, res) => {
  let Qr_code_data = []
  let Qr_code_style_data = []
  let Qr_code_setting_data = []
  let Scans_data = []
  const user_id = req.jwtDecoded.data.user_id;
  await User.findByPk(user_id)
  .then(async data => {
    if(data){
      await findAllQrCode(user_id, Qr_code_data)
      await findAllQrCodeStyle(user_id, Qr_code_style_data)
      await findAllQrCodeSetting(user_id, Qr_code_setting_data)
      await findAllScan(user_id, Scans_data)
      let allData = {
        user: data,
        qr_code: Qr_code_data? Qr_code_data : [],
        qr_code_style : Qr_code_style_data? Qr_code_style_data : [],
        qr_code_setting : Qr_code_setting_data? Qr_code_setting_data: [],
        scans_data : Scans_data? Scans_data: [],
      }
      res.send(allData)
    }
    else{
      res.status(404).send({
        message: `Cannot find User with id=${user_id}.`
      });
    }
  })
  .catch(e => {
    console.log(e)
  })
}

async function findAllQrCode(user_id, qr_code) {
  await QR_code.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    data.forEach(item => {
      date = new Date(item.dataValues.createdAt).toString()
      item.dataValues.createdAt = date.slice(0, date.indexOf('GMT'))
      qr_code.push(item.dataValues)
    })
    return qr_code
  })
  .catch(() => {
    console.log(`Cannot find All QR Code with user_id = ${user_id}`)
  })
}

async function findAllQrCodeStyle(user_id, qr_code_style) {
  await QR_code_style.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    data.forEach(item => {
      qr_code_style.push(item.dataValues)
    })
    return qr_code_style
  })
  .catch(() => {
    console.log(`Cannot find All QR_Code_Style with user_id = ${user_id}`)
  })
}

async function findAllQrCodeSetting(user_id, qr_code_setting) {
  await QR_code_setting.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    data.forEach(item => {
      qr_code_setting.push(item.dataValues)
    })
    return qr_code_setting
  })
  .catch(() => {
    console.log(`Cannot find All QR_Code_Style with user_id = ${user_id}`)
  })
}

async function findAllScan(user_id, scans_list) {
  await Scans_Shopify_Homepage.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Shopify_Homepage with user_id = ${user_id}`)
  })
  await Scans_Shopify_Productpage.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Shopify_Productpage with user_id = ${user_id}`)
  })

  await Scans_Shopify_Cartpage.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Shopify_Cartpage with user_id = ${user_id}`)
  })
  await Scans_Shopify_Checkoutpage.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Shopify_Checkoutpage with user_id = ${user_id}`)
  })
  await Scans_Shopify_Collectionpage.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Shopify_Collectionpage with user_id = ${user_id}`)
  })
  await Scans_Shopify_Shopifypage.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Shopify_Shopifypage with user_id = ${user_id}`)
  })
  await Scans_Custom_text.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Custom_text with user_id = ${user_id}`)
  })
  await Scans_Custom_Images.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Custom_Images with user_id = ${user_id}`)
  })
  await Scans_Custom_Mobile.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Custom_Mobile with user_id = ${user_id}`)
  })
  await Scans_Custom_Pdf.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Custom_Pdf with user_id = ${user_id}`)
  })

  await Scans_Custom_Url.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Custom_Url with user_id = ${user_id}`)
  })

  await Scans_Custom_Vcard.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if(data.length > 0){
      data.forEach(item => {
        scans_list.push(item.dataValues)
      })
    }
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Custom_Vcard with user_id = ${user_id}`)
  })
  // if(scans_list.length > 0){
  //   scans_list.forEach(item => {
  //     date = new Date(item.createdAt).toString()
  //     item.createdAt = date.slice(0, date.indexOf('GMT'))
  //   })
  // }
  return scans_list
}

// async function findAllScanShopifyProduct(user_id, scans_product) {
//   await Scans_Shopify_Productpage.findAll({
//     where: {
//       user_id: user_id
//     }
//   })
//   .then(data => {
//     data.forEach(item => {
//       date = new Date(item.dataValues.createdAt).toString()
//       item.dataValues.createdAt = date.slice(0, date.indexOf('GMT'))
//       console.log(item.dataValues.createdAt)
//       scans_product.push(item.dataValues)
//     })
//     return scans_product
//   })
//   .catch(() => {
//     console.log(`Cannot find All Scans_Shopify_Productpage with user_id = ${user_id}`)
//   })
// }

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.jwtDecoded.data.user_id;
  User.findByPk(id,
    {
      attributes:['shopify_domain','store_name','shopLocales','phone','email']
    })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id
      });
    });
  };


