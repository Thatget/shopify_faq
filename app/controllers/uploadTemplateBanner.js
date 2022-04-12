const db = require("../models");
const setting = db.setting;
const templateSetting = db.template_setting;
const fs = require('fs');
const errorLog = require('../helpers/log.helper');

const path = require('path');
const Resize = require('../helpers/resizeImage.helper');

exports.upload = async (req, res) => {

    let setingId = 0;
// Upload image <have header and template_number>
    const imagePath = path.join(__dirname, '../../var/images/banner');
    const fileUpload = new Resize(imagePath);
    if (!req.file && !req.body.template_number) {
        res.status(401).json({error: 'Please provide an image'});
    }

    // Save file
    const filename = await fileUpload.save(req.file.buffer);

    const user_id = req.jwtDecoded.data.user_id;w

    let template_data = {};

    setingId = await getSettingId(user_id);
    if (setingId) {
        await templateSetting.findOne({
            attributes: ['id', 'image_banner'],
            where: {setting_id: setingId, template_number: req.body.template_number}
        })
            .then(data => {
                template_data.image_banner = filename;
                if (data) {
                    const templateId = data.dataValues.id;
                    if (data.dataValues.image_banner) {
                        fs.unlink(imagePath + '/' + data.dataValues.image_banner, (err => {
                            if (err) errorLog.error('error unlink image' + err.message);
                        }));
                    }
                    templateSetting.update(template_data, {
                        where: {id: templateId}
                    }).then(num => {
                        if (num == 1) {
                        } else {
                            errorLog.error('update template setting error <update image>')
                        }
                    }).catch(e => {
                        errorLog.error(e.message)
                    })
                }
            }).catch(error => {
                errorLog.error(error.message)
            })
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
