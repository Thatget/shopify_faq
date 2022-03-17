module.exports = (sequelize, Sequelize) => {
    const User = require("./user.model.js")(sequelize, Sequelize);
    const Faq_Category = sequelize.define("faq_category", {
        user_id: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        is_visible: {
            type: Sequelize.BOOLEAN
        }
    }, {
        freezeTableName: true
    });
    Faq_Category.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
    return Faq_Category;
};
