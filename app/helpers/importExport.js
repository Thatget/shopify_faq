const db = require("../models");
const Faq = db.faq;
const Category = db.faq_category;
const errorLog = require('../helpers/log.helper');

const XLSX = require("xlsx");


exports.import = async (req, res) => {
    const wb = XLSX.read(req.file.buffer);
    const sheets = wb.SheetNames;
    const user_id = req.jwtDecoded.data.user_id;

    if(sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

        const faqs = data.map(row => ({
            user_id: user_id,
            identify: row['identify'],
            title: row['title'],
            content: row['content'],
            locale: row['locale'],
            category_identify: row['category_identify'],
            is_visible: row['is_visible'],
            position: row['position'],
        }));

        const category = data.map(row => ({
            user_id: user_id,
            identify: row['category_identify'],
            title: row['category'],
            locale: row['locale']

        }))

        importFaqs(faqs)
    }
    return res.redirect('/');
}

exports.export = async (req, res) => {
    const user_id = req.jwtDecoded.data.user_id;
    let condition = { user_id:user_id };
    if (req.query.locale) {
        condition.locale = req.query.locale;
    }
    const category = await Category.findAll({
        attributes: ['identify', 'title', 'content', 'locale', 'is_visible', 'position'],
        where: condition
    })
    const faqs = await Faq.findAll({
        attributes: ['identify', 'title', 'content', 'locale', 'category_identify', 'is_visible', 'position'],
        where: condition,
        raw: true
    });
    let selectQuery = "SELECT `faq_category`.`title` as `category_title`, `faq`.`title`,`faq`.`content`" +
        ", `faq_category`.`identify` as `category_identify`, `faq`.`identify`"+
        " FROM `faq` join `faq_category` on `faq`.`category_identify` = `faq_category`.`identify`" +
        "' where `faq`.`user_id` = " + userID + " and `faq_category`.`user_id` = " + userID ;
    if (req.query.locale) {
        selectQuery + " and `faq`.`locale` = '" + locale + "' and `faq_category`.`locale` = '" + locale;
    }
    data = await db.sequelize.query(
        selectQuery+";",
        {type: QueryTypes.SELECT});
    const headings = [
        ['identify', 'title', 'content', 'locale', 'category_identify', 'is_visible', 'position']
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(faqs, {
        origin: 'A2',
        skipHeader: true
    });
    XLSX.utils.sheet_add_aoa(ws, headings);
    XLSX.utils.book_append_sheet(wb, ws, 'Faqs');

    const buffer = XLSX.write(wb, { bookType: 'csv', type: 'buffer' });
    res.attachment('faqs.csv');

    return res.send(buffer);
}

async function importFaqs(faqs) {
    Category.bulkCreate(faqs,
        {
            fields:['user_id', 'identify as category_identify', 'title', 'content', 'locale', 'is_visible', 'position'],
            updateOnDuplicate: ["identify", "user_id", "locale"]
        }
        ).catch(e=>{
            console.log(e.message)
    })
    Faq.bulkCreate(faqs,
        {
            fields:['user_id', 'identify', 'title', 'content', 'locale', 'category_identify', 'is_visible', 'position'],
            updateOnDuplicate: ["identify", "user_id", "category_identify", "locale"]
        } ).then(data=> {
            console.log(data)
        }).catch(errorLog =>{
            console.log(errorLog.message)
    })
}