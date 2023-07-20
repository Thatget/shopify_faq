module.exports = (sequelize, Sequelize) => {
  const User = require("./user.model.js")(sequelize, Sequelize);
  const MerchantPlan = sequelize.define("merchants_plan",
    {
      user_id: {
          type: Sequelize.INTEGER,
      },
      plan: {
        type: Sequelize.STRING,
      },
      // check_subscription: {
      //   type: Sequelize.BOOLEAN,
      // },
      plan_extra: {
        type: Sequelize.STRING,
      },
      shopify_plan_id:{
        type: Sequelize.STRING,
      },
      expiry_date: {
        type: Sequelize.STRING
      },
      purchase_date: {
        type: Sequelize.STRING
      }
    },
    {
    uniqueKeys: {
        Items_unique: {
            fields: ['user_id']
        }
    },
    freezeTableName: true
    });
  MerchantPlan.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return MerchantPlan;
};