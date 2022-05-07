const db = require("../models");
const Faq = db.faq;
const errorLog = require('../helpers/log.helper');

const XLSX = require("xlsx");
const outputPath = 'storage/outputs'



exports.index = async (req, res) => {
    const movies = await Movie.findAll();
    return res.render('index', { movies });
}

exports.import = async (req, res) => {
    const wb = XLSX.readFile(req.file.path);
    const sheets = wb.SheetNames;

    if(sheets.length > 0) {
        const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
        const movies = data.map(row => ({
            movie: row['Movie'],
            category: row['Category'],
            director: row['Director'],
            rating: row['Rating']
        }))
        await Movie.bulkCreate(movies);
    }
    return res.redirect('/');
}

exports.export = async (req, res) => {
    var faqData = [];
    const user_id = req.jwtDecoded.data.user_id;
    let condition = { user_id:user_id, locale: req.query.locale };
    const faqs = await Faq.findAll({
        attributes: ['id', 'title', 'content', 'locale'],
        where: condition,
        raw: true
    });
    const headings = [
        ['id', 'title', 'content', 'locale']
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(faqs, {
        origin: 'A2',
        skipHeader: true
    });
    XLSX.utils.sheet_add_aoa(ws, headings);
    XLSX.utils.book_append_sheet(wb, ws, 'Faqs');

    const buffer = XLSX.write(wb, { bookType: 'csv', type: 'buffer' });
    res.attachment('movies.csv');

    return res.send(buffer);
}
