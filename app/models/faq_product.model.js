module.exports = (sequelize, Sequelize) => {
    const Faq = require("./faq.model.js")(sequelize, Sequelize);
    const Product = require("./product.model.js")(sequelize, Sequelize);
    const User = require("./user.model.js")(sequelize, Sequelize);

    const ProductFaq = sequelize.define("faq_product", {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            // primaryKey: true
        },
        product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            // primaryKey: true
        },
        faq_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            // primaryKey: true
        },
        faq_identify: {
            type: Sequelize.STRING,
            allowNull: false,
            // primaryKey: true
        },
        category_identify: {
            type: Sequelize.STRING,
            allowNull: false,
            // primaryKey: true
        },
    }, {
        uniqueKeys: {
            Items_unique: {
                fields: ['user_id', 'product_id', 'faq_id', 'faq_identify','category_identify']
            }
        },
        freezeTableName: true
    });
    ProductFaq.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
    ProductFaq.belongsTo(Faq, {foreignKey: 'faq_id', targetKey: 'id', onDelete: 'CASCADE',});
    ProductFaq.belongsTo(Product, {foreignKey: 'product_id', targetKey: 'id', onDelete: 'CASCADE',});
    return ProductFaq;
};