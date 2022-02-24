const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.faqs = require("./faq.model.js")(sequelize, Sequelize);
db.faq_categorys = require("./faq_category.model.js")(sequelize, Sequelize);
db.users = require("./user.model")(sequelize, Sequelize);
db.settings = require("./setting.model")(sequelize, Sequelize);
module.exports = db;
