const db = require("../models");
const Faq = db.faq;
const Category = db.faq_category;
const { QueryTypes } = require('sequelize');
const errorLog = require('../helpers/log.helper');
let localeDefault = 'default'
const XLSX = require("xlsx");


exports.import = async (req, res) => {
    const wb = XLSX.read(req.file.buffer);
    const sheets = wb.SheetNames;
    const user_id = req.jwtDecoded.data.user_id;
    let allCategory = []
    let allFaq = []
    // var responseResult = {}
    if(sheets.length > 0) {
        let categoryCreate = []
        let categoryOrigin = []
        let faqCreate = []
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        // console.log(data)
            // Prepare for category data
        allCategory = await getAllCategory(user_id)
        allFaq = await getAllFaq(user_id)
        // console.log(allFaq)
        let category = []
        let faqs = []
        var checkExitsCategory
        data.forEach(item => {
            item.user_id = user_id
            item.category_identify = localeDefault + user_id
        })
        data.forEach(item => {
            checkExitsCategory = true
            let dataFaqPush = {
                user_id : item.user_id,
                title: item.Question,
                content: item.Answer,
                locale: localeDefault,
                category_name: item.Category
            }
            faqs.push(dataFaqPush)
            if(category.length === 0) {
                checkExitsCategory = false
                let dataPush = {
                    user_id : item.user_id,
                    title: item.Category,
                    is_visible: item.Category_visible,
                    locale: localeDefault,
                    identify: item.category_identify,
                }
                category.push(dataPush)
                return
            }
            else{
                category.forEach(element => {
                    if(element.title === item.Category){
                        checkExitsCategory = false
                    }
                })
            }
            if(checkExitsCategory === true){
                let dataPush = {
                    user_id : item.user_id,
                    title: item.Category,
                    is_visible: item.Category_visible,
                    locale: localeDefault,
                    identify: item.category_identify
                }
                category.push(dataPush)
            }
        })
        categoryCreate = checkCategory(allCategory, category)
        categoryCreate = generateCategoryIdentify(categoryCreate, allCategory)
        // for(let i = 0; i < categoryCreate.length; i++){
        //     let category_identify = localeDefault + user_id
        //     categoryCreate[i].user_id = user_id
        //     categoryCreate[i].identify = category_identify
        // }
        await createCategory(categoryCreate)
        allCategory = await getAllCategory(user_id)
        // Prepare for Faqs data
        faqCreate = checkFaq(allFaq, faqs)
        console.log(faqCreate)
        for(let i = 0; i < faqCreate.length; i++){
            for(let j = 0; j < allCategory.length; j++){
                if(allCategory[j].title === faqCreate[i].category_name){
                    // console.log(faqCreate[i].title)
                    faqCreate[i].category_identify = allCategory[j].identify
                    let identify = localeDefault + user_id + allCategory[j].identify
                    identify = await generateFaqIdentify(faqCreate[i], identify)
                    faqCreate[i].identify = identify
                }
            }
        }
        console.log(faqCreate)
        // await createFaq(faqCreate)
        // await importFaqs(categoryCreate, faqCreate)
        // Import faqs to database !
        // console.log(faqCreate)
        // responseResult = await importFaqs(category, faqs);
    }
    // if (responseResult && !responseResult.status){
    //     return res.status(responseResult.statusCode).send({
    //         message:
    //             responseResult.message || "Some error occurred while import Faqs."
    //     });
    // }
    return res.send({
        message: `Import data import successful !`
    });
}

async function generateFaqIdentify(faq, identify){
    let count = 0;
    let checked = false;
    let newIdentify = identify;
    do {
        checked = false;
        if (count) {
            newIdentify = faq.identify + count;
        }
        await Faq.findOne({ where: { user_id: faq.user_id, identify: newIdentify, locale: localeDefault, category_identify: faq.category_identify}})
        .then( async data => {
            if (data) {
                checked = true;
            }
        })
        .catch(err => {
            errorLog.error(`faq generate identify error ${err.message}`)
        });
        count++;
    } while (checked);
    return newIdentify;
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
        [ 'title', 'content', 'category name', 'locale', 'Faq Visible', 'Category Visible']
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


async function createCategory(category){
    await Category.bulkCreate(category,{
        fields:['user_id', 'identify', 'title', 'locale', 'is_visible'],
        updateOnDuplicate: ["identify", "user_id", "locale"]
    })
    .then( async () => {
        console.log('create success')
    })
    .catch(e=>{
        console.log(e)
    })
}

async function createFaq(faqs){
    // console.log(faqs)
    await Faq.bulkCreate(faqs,
    {
        fields: ['user_id', 'identify', 'title', 'content', 'locale', 'category_identify', 'is_visible'],
        updateOnDuplicate: ["identify", "user_id", "category_identify", "locale"]            
    }
    ).then( async () => {
        console.log('create success')
    })
    .catch(e=>{
        console.log(e)
    })
}

async function getAllCategory(user_id){
    let allCategory = []
    let condition = { user_id: user_id, locale: 'default' };
    await Category.findAll({ where: condition })
    .then(data => {
        data.forEach(item => {
            allCategory.push(item.dataValues)
        })
    })
    .catch(err => {
        console.log(err)
    });    
    return allCategory
}

function generateCategoryIdentify(categoryCreate, allCategory) {
    // let newCategoryCreate = []
    let count = 1;
    // let newIdentify = identify;
    categoryCreate.forEach(item => {
        let checked = false;
        allCategory.forEach(element => {
            if(item.identify === element.identify){
                checked = true
            }
        })
        if(checked){
            item.identify += count
        }
        else{
            return
        }
        count++
    })
    return categoryCreate;
}

// async function checkCategoryIdentify(user_id, identify) {
//     let checkedIdentify = false;
//     await Category.findOne({ where: { user_id: user_id, identify: identify, locale: localeDefault}})
//         .then( async data => {
//             if (data) {
//                 checkedIdentify = true;
//             }
//         }).catch(err => {
//             errorLog.error(`category generate identify error ${err.message}`)
//         });
//     return checkedIdentify;
// }

async function getAllFaq(user_id){
    let allFaq = []
    let condition = { user_id: user_id, locale: 'default' };
    await Faq.findAll({ where: condition })
    .then(data => {
        data.forEach(item => {
            allFaq.push(item.dataValues)
        })
    })
    .catch(err => {
        console.log(err)
    });    
    return allFaq
}

function checkCategory(allCategory, category) {
    let categoryCreate = []
    var checkTitle
    category.forEach(item => {
        checkTitle = true
        allCategory.forEach(element => {
            if(item.title === element.title){
                checkTitle = false
            }
        })
        if(checkTitle === true){
            categoryCreate.push(item)
        }
    })
    return categoryCreate
}

function checkFaq(allFaq, faqs) {
    let faqCreate = []
    var checkTitle
    faqs.forEach(item => {
        checkTitle = true
        allFaq.forEach(element => {
            if(item.title === element.title){
                checkTitle = false
            }
        })
        if(checkTitle === true){
            faqCreate.push(item)
        }
    })
    
    return faqCreate
}

