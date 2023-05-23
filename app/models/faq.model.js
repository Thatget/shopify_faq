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
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        is_visible: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        feature_faq: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
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
        liked_faq: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        disliked_faq: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        readed_faq: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
    },{
        indexes: [
            // add a FULLTEXT index
            { type: 'FULLTEXT', name: 'text_idx', fields: ['title'] }
        ],
        uniqueKeys: {
            Items_unique: {
                fields: ['user_id', 'identify', 'category_identify', 'locale']
            }
        },
        freezeTableName: true
    });
    Faq.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
    return Faq;
};
