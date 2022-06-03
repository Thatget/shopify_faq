module.exports = (sequelize, Sequelize) => {
    const User = require("./user.model.js")(sequelize, Sequelize);
    const Product = sequelize.define("product", {
        user_id: {
            type: Sequelize.INTEGER,
            // allowNull: false
        },
        product_id:{
            type: Sequelize.STRING,
            // allowNull: false
        }
    },{
        uniqueKeys: {
            Items_unique: {
                fields: ['user_id', 'product_id']
            }
        },
        freezeTableName: true
    });
    Product.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
    return Product;
};
