module.exports = (sequelize, Sequelize) => {
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
    return Faq_Category;
};