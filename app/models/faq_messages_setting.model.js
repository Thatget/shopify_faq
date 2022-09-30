module.exports = (sequelize, Sequelize) => {
  const User = require("./user.model.js")(sequelize, Sequelize);
  const MessageSetting = sequelize.define("faq_messages_setting", {
      user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // primaryKey: true
      },
      faq_messages_visible: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          // primaryKey: true
      },
      sort_by: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      contact_us_visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        // primaryKey: true
      },
      phone_visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        // primaryKey: true
      },
      whatsApp_visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        // primaryKey: true
      },
      message_visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        // primaryKey: true
      },
      email_visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        // primaryKey: true
      },
      animation_visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        // primaryKey: true
      },
      email_link: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      whatsApp_number: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      message_link: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      welcome_title: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      description_title: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      theme_color: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      text_color: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      icon_number: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      button_background_color: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      aligment_faq_messages: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      button_title: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
      font_family: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: true
      },
  }, {
    freezeTableName: true,
  });
  MessageSetting.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return MessageSetting;
};