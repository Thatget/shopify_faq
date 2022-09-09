module.exports = (sequelize, Sequelize) => {
    const User = require("./user.model.js")(sequelize, Sequelize);
    const Faq_Category = sequelize.define("faq_category", {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        identify: {
            type: Sequelize.STRING,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING
        },
        position: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        locale: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'en',
        },
        is_visible: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        // show_on_cart: {
        //     type: Sequelize.BOOLEAN,
        //     defaultValue: true,
        // }
    }, {
        uniqueKeys: {
            Items_unique: {
                fields: ['user_id', 'identify', 'locale']
            }
        },
        freezeTableName: true
    });
    Faq_Category.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
    return Faq_Category;
};