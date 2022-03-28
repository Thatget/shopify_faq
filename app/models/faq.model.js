module.exports = (sequelize, Sequelize) => {
    const User = require("./user.model.js")(sequelize, Sequelize);
    const Faq = sequelize.define("faq", {
        category_id: {
            type: Sequelize.INTEGER
        },
        user_id: {
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
        },
        position: {
            type: Sequelize.INTEGER
        },
    },{
        indexes: [
            // add a FULLTEXT index
            { type: 'FULLTEXT', name: 'text_idx', fields: ['title'] }
        ]
    },{
        freezeTableName: true
    });
    Faq.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
    return Faq;
};
