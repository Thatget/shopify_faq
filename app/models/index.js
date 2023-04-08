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
db.scans_shopify_productpage = require("./scans_shopify_productpage.model.js")(sequelize, Sequelize);
db.scans_shopify_homepage = require("./scans_shopify_homepage.model.js")(sequelize, Sequelize);
db.scans_shopify_collectionpage = require("./scans_shopify_collectionpage.model.js")(sequelize, Sequelize);
db.scans_shopify_shopifypage = require("./scans_shopify_shopifypage.model.js")(sequelize, Sequelize);
db.scans_shopify_cartpage = require("./scans_shopify_cartpage.model.js")(sequelize, Sequelize);
db.scans_shopify_checkoutpage = require("./scans_shopify_checkoutpage.model.js")(sequelize, Sequelize);
db.scans_custom_text = require("./scans_custom_text.model.js")(sequelize, Sequelize);
db.scans_custom_pdf = require("./scans_custom_pdf.model.js")(sequelize, Sequelize);
db.scans_custom_images = require("./scans_custom_images.model.js")(sequelize, Sequelize);
db.scans_custom_url = require("./scans_custom_url.model.js")(sequelize, Sequelize);
db.scans_custom_vcard = require("./scans_custom_vcard.model.js")(sequelize, Sequelize);
db.scans_custom_mobile = require("./scans_custom_mobile.model.js")(sequelize, Sequelize);
db.qr_code_setting = require("./qr_code_setting.model.js")(sequelize, Sequelize);
db.qr_code = require("./qr_code.model.js")(sequelize, Sequelize);
db.qr_code_style = require("./qr_code_style.model.js")(sequelize, Sequelize);
db.qr_code_images = require("./qr_code_images.model.js")(sequelize, Sequelize);

module.exports = db;