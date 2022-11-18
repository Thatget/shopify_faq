module.exports = (sequelize, Sequelize) => {
  const User = require("./user.model.js")(sequelize, Sequelize);
  const MerchantRating = sequelize.define("merchants_setting",
    {
      user_id: {
          type: Sequelize.INTEGER,
      },
      star: {
        type: Sequelize.STRING,
      },
      comment: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      domain: {
        type: Sequelize.STRING,
      },
    },
    {
    uniqueKeys: {
        Items_unique: {
            fields: ['user_id']
        }
    },
    freezeTableName: true
    });
  MerchantRating.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return MerchantRating;
};