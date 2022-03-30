module.exports = (sequelize, Sequelize) => {
    const User = require("./user.model.js")(sequelize, Sequelize);
    const Faq = sequelize.define("faq", {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        category_identify: {
            type: Sequelize.STRING,
            allowNull: false
        },
        identify: {
            type: Sequelize.STRING,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
        },
        is_visible: {
            type: Sequelize.BOOLEAN
        },
        position: {
            type: Sequelize.INTEGER
        },
        locale: {
            type: Sequelize.STRING,
            allowNull: false
        },
    },{
        indexes: [
            // add a FULLTEXT index
            { type: 'FULLTEXT', name: 'text_idx', fields: ['title'] }
        ],
        uniqueKeys: {
            Items_unique: {
                fields: ['user_id', 'identify', 'category_identify']
            }
        },
        freezeTableName: true
    });
    Faq.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
    return Faq;
};
