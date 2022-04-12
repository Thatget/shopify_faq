const db = require("../models");
const setting = db.setting;
const templateSetting = db.template_setting;

const path = require('path');
const Resize = require('../helpers/resizeImage.helper');

exports.upload = async (req, res) => {

// Upload image <have header and template_number>
    const imagePath = path.join(__dirname, '../../var/images/banner');
    const fileUpload = new Resize(imagePath);
    if (!req.file && !req.body.template_number) {
        res.status(401).json({error: 'Please provide an image'});
    }

    const user_id = req.jwtDecoded.data.user_id;

    const filename = await fileUpload.save(req.file.buffer);
    return res.status(200).json({ name: filename });
};

async function getSettingId() {
    await setting.findOne(id, {where: {user_id: user_id}})
        .then( data => {
            if (data) {
                setting_id = data.dataValues.id;
            }
        })
}


