module.exports = (sequelize, Sequelize) => {
  const User = require("./user.model.js")(sequelize, Sequelize);
  const FaqMorePageSetting = sequelize.define("faq_more_page_setting", {
      user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // primaryKey: true
      },
      home_page_visible: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          // primaryKey: true
      },
      product_page_visible: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          // primaryKey: true
      },
      cart_page_visible: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          // primaryKey: true
      },
      collection_page_visible: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          // primaryKey: true
      },
      cms_page_visible: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          // primaryKey: true
      },
      active_feature: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        // primaryKey: true
      },
  }, {
      freezeTableName: true,
      uniqueKeys: {
          Items_unique: {
              fields: ['user_id']
          }
      },

  });
  FaqMorePageSetting.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return FaqMorePageSetting;
};