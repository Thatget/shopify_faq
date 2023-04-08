const db = require("../models");
const QR_code_style = db.qr_code_style;
const fs = require('fs');
const errorLog = require('../helpers/log.helper');
const Qr_code_images = db.qr_code_images;
const forwardingAddress = process.env.HOST;

const path = require('path');
const Resize = require('../helpers/resizeImage.helper');

exports.upload = async (req, res) => {
  errorLog.error(forwardingAddress)
  errorLog.error(req.params.qr_code_id)
  const user_id = req.jwtDecoded.data.user_id;
// Upload image <have header and template_number>
  const imagePath = path.join(__dirname, '../../var/images/banner');
  const fileUpload = new Resize(imagePath);
  errorLog.error(`${fileUpload} fileUpload`)
  if (!req.file || !req.file.buffer) {
    res.status(401).json({error: 'Please provide an image'});
    return ;
  }

  // Save file
  let continueCheck = true
  const filename = await fileUpload.save(req.file.buffer)
    .catch(error => {
      continueCheck = false
      errorLog.error(error.message)
    })
  if (!continueCheck) {
    res.status(500).json({error: 'can\'t upload image !'});
    return;
  }
  let data_update = {
    qr_code_image: filename
  }
  let data_images = {
    qr_logo_name: `${forwardingAddress}/var/images/banner/${filename}`,
    user_id: user_id
  }
  if(req.params.qr_code_id){
    await QR_code_style.update(data_update,{
      where: {
        qr_code_id : req.params.qr_code_id
      }
    })
    .catch(e => {
      errorLog.error(`${e} fileUpload error`)
    })
    await Qr_code_images.create(data_images)
    .catch(e => {
      errorLog.error(`${e} fileUpload error`)
    })
  }
  return res.status(200).json({ name: filename });
};

