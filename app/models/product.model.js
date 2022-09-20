module.exports = (sequelize, Sequelize) => {
    const User = require("./user.model.js")(sequelize, Sequelize);
    const Product = sequelize.define("product", {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        product_id:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        product_image:{
            type: Sequelize.STRING,
            // allowNull: false
        },
        product_title:{
            type: Sequelize.STRING,
            allowNull: false
        },
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
<<<<<<< HEAD
};
=======
};
>>>>>>> 313dd214473269cb4ac2f6119c0cee935e61e527
