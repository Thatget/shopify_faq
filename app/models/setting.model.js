module.exports = (sequelize, Sequelize) => {
  const User = require("./user.model.js")(sequelize, Sequelize);
  const Setting = sequelize.define("setting",
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true
    },
    show_page_title: {
      type: Sequelize.BOOLEAN
    },
    show_intro_text: {
      type: Sequelize.BOOLEAN
    },
    show_footer_text: {
      type: Sequelize.BOOLEAN
    },
    intro_text_content: {
      type: Sequelize.TEXT
    },
    page_title_content: {
      type: Sequelize.TEXT
    },
    footer_text_content: {
      type: Sequelize.TEXT
    },
    faq_sort_name: {
      type: Sequelize.BOOLEAN
    },
    faq_uncategory_hidden: {
      type: Sequelize.BOOLEAN
    },
    category_sort_name: {
      type: Sequelize.BOOLEAN
    },
    dont_category_faq: {
      type: Sequelize.BOOLEAN
    },
    faq_page_url: {
      type: Sequelize.STRING
    },
    faq_template_number: {
      type: Sequelize.INTEGER
    },
    page_under_contruction: {
      type: Sequelize.TEXT
    },
    search_placehoder: {
      type: Sequelize.STRING
    },
    search_not_found: {
      type: Sequelize.STRING
    },
    show_page_construction: {
      type: Sequelize.BOOLEAN
    },
    faq_messages_visible: {
      type: Sequelize.BOOLEAN
    },
    yanet_logo_visible:{
      type: Sequelize.BOOLEAN
    }  
  },
  {
    freezeTableName: true
  });
  Setting.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return Setting;
};