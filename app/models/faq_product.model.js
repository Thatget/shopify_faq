module.exports = (sequelize, Sequelize) => {
    const Faq = require("./faq.model.js")(sequelize, Sequelize);
    const Product = require("./product.model.js")(sequelize, Sequelize);
    const ProductFaq = sequelize.define("faq_product", {
        product_id: {
            type: Sequelize.INTEGER,
            // allowNull: false,
            primaryKey: true
        },
        faq_id: {
            type: Sequelize.INTEGER,
            // allowNull: false,
            primaryKey: true
        }
    }, {
        freezeTableName: true
    });
    ProductFaq.belongsTo(Faq, {foreignKey: 'faq_id', targetKey: 'id', onDelete: 'CASCADE',});
    ProductFaq.belongsTo(Product, {foreignKey: 'product_id', targetKey: 'id', onDelete: 'CASCADE',});

    return ProductFaq;
};
