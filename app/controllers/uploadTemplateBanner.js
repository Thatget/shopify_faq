const db = require("../models");
const QR_code_style = db.qr_code_style;
const fs = require('fs');
const errorLog = require('../helpers/log.helper');

const path = require('path');
const Resize = require('../helpers/resizeImage.helper');

exports.upload = async (req, res) => {
  errorLog.error(req.params.qr_code_id)
// Upload image <have header and template_number>
    const imagePath = path.join(__dirname, '../../var/images/banner');
    const fileUpload = new Resize(imagePath);
    errorLog.error(fileUpload, 'fileUpload')
    if (!req.file || !req.params.qr_code_id || !req.file.buffer) {
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
    QR_code_style.update(data_update,{
      where: {
        id : req.body.qr_code_id
      }
    })
    return res.status(200).json({ name: filename });
};

