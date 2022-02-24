module.exports = (sequelize, Sequelize) => {
    const Faq = sequelize.define("faq", {
        category_id: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING
        },
        is_visible: {
            type: Sequelize.BOOLEAN
        }
    }, {
        freezeTableName: true
    });
    return Faq;
};
