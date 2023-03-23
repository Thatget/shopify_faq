const db = require("../models");
const QR_code_setting = db.qr_code_setting;
const Op = db.Sequelize.Op;
const Scans_shopify_homepage = db.scans_shopify_homepage
const Scans_shopify_productpage = db.scans_shopify_productpage
const Scans_shopify_cartpage = db.scans_shopify_cartpage
const Scans_shopify_checkoutpage = db.scans_shopify_checkoutpage
const Scans_shopify_shopifypage = db.scans_shopify_shopifypage
const Scans_shopify_collectionpage = db.scans_shopify_collectionpage
const Scans_custom_images = db.scans_custom_images
const Scans_custom_pdf = db.scans_custom_pdf
const Scans_custom_url = db.scans_custom_url
const Scans_custom_vcard = db.scans_custom_vcard
const Scans_custom_mobile = db.scans_custom_mobile
const Scans_custom_text = db.scans_custom_text

exports.create = (req, res) => {
    const qr_code_setting = req.body
    QR_code_setting.create(qr_code_setting)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the QR_code_setting."
        });
    });
};

// Find a single QR_code_setting with an id
exports.findOne = (req, res) => {
  const id = req.body.id;
  QR_code_setting.findByPk(id)
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find QR_code_setting with id=${id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving QR_code_setting with id=" + id
    });
  });
};

exports.findAll = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  QR_code_setting.findAll(
  {
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find QR_code_style with user_id=${user_id}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving QR_code_style with user_id=" + user_id
    });
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const data = req.body
  await QR_code_setting.update(data, {
    where: { id: id }
  })
  .then(() => {
    res.send({
      message: "update QR_code_setting Success !"
    });
  })
  .catch(err => {
      errorLog.error('error update QR_code_setting 500 status'+err.message)
  });
};
  
exports.generatorQR = async (req, res) => {
  QR_code_setting.findOne({
    attributes:['user_id', 'qr_link', 'qr_code_type', 'qr_utm_enable', 'auto_add_discount', 'qr_code_name'],
    where: {
      qr_data: req.query.data
    },
  })
  .then(async data => {
    if (data) {
      let data_scans = {
        user_id: data.user_id,
        qr_code_name: data.qr_code_name
      }
      switch(data.qr_code_type){
        case 'Home page':
          await Scans_shopify_homepage.create(data_scans)
        break;
        case 'Product page':
          await Scans_shopify_homepage.create(data_scans)
        break;
        case 'Checkout page':
          await Scans_shopify_homepage.create(data_scans)
        break;
        case 'Cart page':
          await Scans_shopify_homepage.create(data_scans)
        break;
        case 'Collection page':
          await Scans_shopify_homepage.create(data_scans)
        break;
        case 'Shopify page':
          await Scans_shopify_homepage.create(data_scans)
        break;
        case 'Images':
          await Scans_shopify_homepage.create(data_scans)
        break;
        case 'Mobile App':
          await Scans_shopify_homepage.create(data_scans)
        break;
        case 'Text':
          await Scans_shopify_homepage.create(data_scans)
        break;
        case 'V-card':
          await Scans_shopify_homepage.create(data_scans)
        break;
        case 'Pdf File':
          await Scans_shopify_homepage.create(data_scans)
        break;
        case 'Custom Url':
          await Scans_shopify_homepage.create(data_scans)
        break;
      }
      return res.send(data)
    } else {
      return res.status(404).send({
        message: `Cannot find QR_code_setting with qr_data=${req.query.data}.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving QR_code_setting with qr_data=" + req.query.data
    });
  });
}

