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
        }, 
        plan_extra: {
          type: Sequelize.BOOLEAN
        }
    }, {
        freezeTableName: true
    });
    return User;
};
