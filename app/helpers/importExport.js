const db = require("../models");
const Faq = db.faq;
const User = db.user;
const CsvParser = require("json2csv").Parser;
const errorLog = require('../helpers/log.helper');

exports.exportToCsv = async (req, res) =>{
    if (!req.jwtDecoded.data.user_id) {
        res.status(400).send({
            message: "Error not user selected ?"
        });
        return;
    }
    const user_id = req.jwtDecoded.data.user_id;
    let condition = { user_id:user_id, locale: req.query.locale };
    Faq.findAll({ where: condition })
        .then((objs) => {
        let tutorials = [];
        objs.forEach((obj) => {
            const { id, title, description, published } = obj;
            tutorials.push({ id, title, description, published });
        });
        const csvFields = ["Id", "Title", "Description", "Published"];
        const csvParser = new CsvParser({ csvFields });
        const csvData = csvParser.parse(tutorials);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=tutorials.csv");
        res.status(200).end(csvData);
    });
}
