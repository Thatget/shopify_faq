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
    let categoryCreate = []
    let faqCreate = []
    let allFaq = []
    let category = []
    let faqs = []
    let checkTypeOfFile = false

    if(sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        console.log(data)
        allCategory = await getAllCategory(user_id)
        allFaq = await getAllFaq(user_id)
        var checkExitsCategory
        data.forEach(item => {
            if(item.Question && item.Answer && item.Category && item.Category_visible && item.Faq_visible){
                item.user_id = user_id
                item.category_identify = localeDefault + user_id
                checkTypeOfFile = true
                if(item.Question == '' || item.Answer == '' || item.Category == ''){
                    checkTypeOfFile = false
                    return res.send({
                        message: `Question, Answer and Category is requied !`
                    });                
                }
            }
            else{
                checkTypeOfFile = false
                return res.send({
                    message: `File type is invalid !`
                });            
            }
        })
        if(checkTypeOfFile){
            data.forEach(item => {
                checkExitsCategory = true
                let dataFaqPush = {
                    user_id : item.user_id,
                    title: item.Question,
                    content: item.Answer,
                    locale: localeDefault,
                    category_name: item.Category,
                    is_visible: item.Faq_visible
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
                        is_visible: item.Category_visible
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
                        identify: item.category_identify,
                        is_visible: item.Category_visible
                    }
                    category.push(dataPush)
                }
            })
            categoryCreate = checkCategory(allCategory, category)
            for(let i = 0; i < categoryCreate.length; i++){
                let identify = categoryCreate[i].identify
                identify = await generateCategoryIdentify(identify, allCategory)
                categoryCreate[i].identify = identify
                allCategory.push(categoryCreate[i])
            }
            // categoryCreate = generateCategoryIdentify(categoryCreate, allCategory)
            await createCategory(categoryCreate)
            allCategory = await getAllCategory(user_id)
            // Prepare for Faqs data
            if(allFaq.length > 0){
                faqCreate = checkFaq(allFaq, faqs)
                for(let i = 0; i < faqCreate.length; i++){
                    for(let j = 0; j < allCategory.length; j++){
                        if(allCategory[j].title === faqCreate[i].category_name){
                            faqCreate[i].category_identify = allCategory[j].identify
                            let identify = localeDefault + user_id + allCategory[j].identify
                            identify = await generateFaqIdentify(identify, allFaq)
                            faqCreate[i].identify = identify
                            allFaq.push(faqCreate[i])
                        }
                    }
                }
            }
            else{
                faqCreate = faqs
                for(let i = 0; i < faqCreate.length; i++){
                    for(let j = 0; j < allCategory.length; j++){
                        if(allCategory[j].title === faqCreate[i].category_name){
                            faqCreate[i].category_identify = allCategory[j].identify
                            let identify = localeDefault + user_id + allCategory[j].identify
                            identify = await generateFaqIdentify(identify, faqs)
                            faqCreate[i].identify = identify
                            allFaq.push(faqCreate[i])
                        }
                    }
                }
            }
            if(faqCreate.length === 0){
                return res.send({
                    message: `No faq added !`
                });
            }
            else{
                await createFaq(faqCreate)
                return res.send({
                    message: `Import successful ${faqCreate.length} FAQ!`
                });
            }
        }
    }
}

async function generateFaqIdentify(identify, allFaq){
    let count = 0;
    let checked = false;
    let newIdentify = identify;
    do {
        checked = false;
        if (count) {
            newIdentify = identify + count;
        }
        allFaq.forEach(element => {
            if(newIdentify === element.identify){
                checked = true
            }
        })
        count++;
    } while (checked);
    return newIdentify;
}

function generateCategoryIdentify(identify, allCategory) {
    let count = 0;
    let checked = false;
    let newIdentify = identify;
    do {
        checked = false;
        if (count) {
            newIdentify = identify + count;
        }
        allCategory.forEach(element => {
            if(newIdentify === element.identify){
                checked = true
            }
        })
        count++;
    } while (checked);
    return newIdentify;
}

exports.export = async (req, res) => {
    const user_id = req.jwtDecoded.data.user_id;

    let selectQuery = "SELECT `faq`.`title`, `faq`.`content`, `faq_category`.`title` as `category_title`," +
        " `faq`.`is_visible`, `faq_category`.`is_visible` as `category_visible`"+
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
    console.log(data)
    const headings = [
        [ 'Question', 'Answer', 'Category', 'Faq_visible', 'Category_visible']
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data, {
        origin: 'A2',
        skipHeader: true
    });
    XLSX.utils.sheet_add_aoa(ws, headings);
    XLSX.utils.book_append_sheet(wb, ws, 'Professional-FAQs');

    const buffer = XLSX.write(wb, { bookType: 'csv', type: 'buffer' });
    res.attachment('Professional-FAQs.csv');

    return res.send(buffer);
}

exports.downSampleFile = async (req, res) => {
    let data = [{
        question: 'How do I redeem my One 4 All card?',
        answer: 'We are currently accepting One 4 All cards instore only. Please retain your card after making your purchase, as should you wish to return any items bought using a One 4 All card, we will use this payment method to refund you.',
        category: 'Plancing an Order',
        faq_visible: 1,
        category_visible: 1
    }]
    const headings = [
        [ 'Question', 'Answer', 'Category', 'Faq_visible', 'Category_visible']
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data, {
        origin: 'A2',
        skipHeader: true
    });
    XLSX.utils.sheet_add_aoa(ws, headings);
    XLSX.utils.book_append_sheet(wb, ws, 'Professional-FAQ-Import');

    const buffer = XLSX.write(wb, { bookType: 'csv', type: 'buffer' });
    res.attachment('Professional-FAQ-Import.csv');

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

