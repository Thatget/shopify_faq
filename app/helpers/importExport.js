const db = require("../models");
const Faq = db.faq;
const Category = db.faq_category;
const { QueryTypes } = require('sequelize');
const errorLog = require('../helpers/log.helper');

const XLSX = require("xlsx");


exports.import = async (req, res) => {
    const wb = XLSX.read(req.file.buffer);
    const sheets = wb.SheetNames;
    const user_id = req.jwtDecoded.data.user_id;
    var responseResult = {}

    if(sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        console.log(data)
        // Prepare for Faqs data
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
        // Prepare for category data
        const uniqueCategory = Array.from(new Set(data.map(a => a.category_identify)))
            .map(category_identify => {
                return data.find(a => a.category_identify === category_identify)
            })
        const category = uniqueCategory.map(row => ({
            user_id: user_id,
            identify: row['category_identify'],
            title: row['category name'],
            is_visible: row['Category Visible'],
            locale: row['locale']

        }))
        // Import faqs to database !
        responseResult = await importFaqs(category, faqs);
    }
    if (responseResult && !responseResult.status){
        return res.status(responseResult.statusCode).send({
            message:
                responseResult.message || "Some error occurred while import Faqs."
        });
    }
    return res.send({
        message: `Import data import successful !`
    });
}

exports.export = async (req, res) => {
    const user_id = req.jwtDecoded.data.user_id;

    let selectQuery = "SELECT `faq`.`title`, `faq`.`content`, `faq_category`.`title` as `category_title`," +
        " `faq`.`locale`, `faq`.`is_visible`, `faq_category`.`is_visible` as `category_visible`"+
        " FROM `faq` join `faq_category` on `faq`.`category_identify` = `faq_category`.`identify`" +
        " and `faq`.`user_id` = `faq_category`.`user_id`" +
        " where `faq`.`user_id` = ? " ;

    if (req.query.locale) {
        if (typeof req.query.locale === 'string') {
            selectQuery += " and `faq`.`locale` = ?";
        }
    }
    data = await db.sequelize.query(
        selectQuery+";",
        {
            replacements: [user_id, req.query.locale],
            type: QueryTypes.SELECT
        });
    const headings = [
        [ 'title', 'content', 'category name', 'locale', 'is Visible', 'Category Visible']
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data, {
        origin: 'A2',
        skipHeader: true
    });
    XLSX.utils.sheet_add_aoa(ws, headings);
    XLSX.utils.book_append_sheet(wb, ws, 'Faqs');

    const buffer = XLSX.write(wb, { bookType: 'csv', type: 'buffer' });
    res.attachment('faqs.csv');

    return res.send(buffer);
}

async function importFaqs(category, faqs) {
    let responseResult = {};
    responseResult.status = true;
    // await Category.bulkCreate(category,
    //     {
    //         fields:['user_id', 'identify', 'title', 'locale', 'is_visible'],
    //         updateOnDuplicate: ["identify", "user_id", "locale"]
    //     }
    //     ).then( async () => {
    //         await Faq.bulkCreate(faqs,
    //             {
    //                 fields: ['user_id', 'identify', 'title', 'content', 'locale', 'category_identify', 'is_visible'],
    //                 updateOnDuplicate: ["identify", "user_id", "category_identify", "locale"]
    //             }).catch(errorLog => {
    //                 responseResult.message = errorLog.message;
    //                 responseResult.status = false;
    //                 responseResult.statusCode = 500;
    //         })
    //     })
    //     .catch(e=>{
    //         responseResult.message = e.message;
    //         responseResult.status = false;
    //         responseResult.statusCode = 500;
    // })
    return responseResult;
}