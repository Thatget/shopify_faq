module.exports = (sequelize, Sequelize) => {
    const Setting = sequelize.define("setting", {
        user_id: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        }
    }, {
        freezeTableName: true
    });
    return Setting;
};
