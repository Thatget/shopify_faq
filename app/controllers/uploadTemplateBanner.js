const db = require("../models");
const QR_code_style = db.qr_code_style;
const fs = require('fs');
const errorLog = require('../helpers/log.helper');

const path = require('path');
const Resize = require('../helpers/resizeImage.helper');

exports.upload = async (req, res) => {
  console.log(req.file.buffer)
// Upload image <have header and template_number>
    const imagePath = path.join(__dirname, '../../var/images/qr_image');
    const fileUpload = new Resize(imagePath);
    console.log(fileUpload, 'fileUpload')
    if (!req.file || !req.body.qr_code_id || !req.file.buffer) {
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
    console.log(filename, 'filename')
    if (!continueCheck) {
        res.status(500).json({error: 'can\'t upload image !'});
        return;
    }

    return res.status(200).json({ name: filename });
};

async function getSettingId(user_id) {
    let settingId = 0;
    await setting.findOne(
        {
            attributes: ['id'],
            where: {user_id: user_id}
        })
        .then( data => {
            if (data) {
                settingId = data.dataValues.id;
            }
        }).catch(e => {
            errorLog.error(e.message)
        })
    return settingId;
}