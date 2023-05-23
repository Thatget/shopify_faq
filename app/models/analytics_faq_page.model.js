module.exports = (sequelize, Sequelize) => {
  const User = require("./user.model.js")(sequelize, Sequelize);
  const Analytics_faq_page = sequelize.define("analytics_faq_page", {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    view_faq_page: {
      type: Sequelize.INTEGER,
    },
  },{
    uniqueKeys: {
        Items_unique: {
            fields: ['user_id', 'view_faq_page']
        }
    },
    freezeTableName: true
  });
  Analytics_faq_page.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return Analytics_faq_page;
};
