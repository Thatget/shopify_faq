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

// db.faq = require("./faq.model.js")(sequelize, Sequelize);
// db.faq_messages = require("./faq_messages.model.js")(sequelize, Sequelize);
// db.faq_messages_setting = require("./faq_messages_setting.model.js")(sequelize, Sequelize);
// db.product = require("./product.model.js")(sequelize, Sequelize);
// db.faq_product = require("./faq_product.model.js")(sequelize, Sequelize);
// db.faq_more_page = require("./faq_more_page.model.js")(sequelize, Sequelize);
// db.faq_more_page_setting = require("./faq_more_page_setting.model.js")(sequelize, Sequelize);
// db.faq_category = require("./faq_category.model.js")(sequelize, Sequelize);
// db.setting = require("./setting.model.js")(sequelize, Sequelize);
// db.template_setting = require("./template_setting.model.js")(sequelize, Sequelize);
// db.merchants_rating = require("./merchants_rating.model.js")(sequelize, Sequelize);
// db.merchants_plan = require("./merchants_plan.model.js")(sequelize, Sequelize);
module.exports = db;