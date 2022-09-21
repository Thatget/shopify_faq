module.exports = (sequelize, Sequelize) => {
  const User = require("./user.model.js")(sequelize, Sequelize);

  const FaqMessages = sequelize.define("faq_messages", {
      user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // primaryKey: true
      },
      faq_title: {
          type: Sequelize.STRING,
          allowNull: false,
          // primaryKey: true
      },
      customer_name: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      customer_contact: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      time: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
  }, {
      freezeTableName: true,
      uniqueKeys: {
        Items_unique: {
            fields: ['user_id', 'faq_title', 'customer_name', 'customer_contact']
        }
    },
  });
  FaqMessages.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return FaqMessages;
};