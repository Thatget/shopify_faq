module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        store_name: {
            type: Sequelize.STRING
        },
        shopify_domain: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        shopify_access_token: {
            type: Sequelize.STRING
        },  
        email: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        shopLocales: {
            type: Sequelize.TEXT
        }
    }, {
        freezeTableName: true
    });
    return User;
};
