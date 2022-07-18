const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
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
db.user = require("./user.model.js")(sequelize, Sequelize);
db.faq = require("./faq.model.js")(sequelize, Sequelize);
db.product = require("./product.model.js")(sequelize, Sequelize);
db.faq_product = require("./faq_product.model.js")(sequelize, Sequelize);
db.faq_category = require("./faq_category.model.js")(sequelize, Sequelize);
db.setting = require("./setting.model.js")(sequelize, Sequelize);
db.template_setting = require("./template_setting.model.js")(sequelize, Sequelize);
module.exports = db;