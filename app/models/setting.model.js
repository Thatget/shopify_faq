module.exports = (sequelize, Sequelize) => {
  const Setting = sequelize.define("setting", 
  {
    user_id: {
      type: Sequelize.INTEGER
    },
    faq_font_color: {
      type: Sequelize.STRING
    },
    faq_bg_color: {
      type: Sequelize.STRING
    },
    faq_font_size: {
      type: Sequelize.INTEGER
    },
    faq_font_weight: {
      type: Sequelize.STRING
    },
    faq_font_family: {
      type: Sequelize.STRING
    },
    faq_hover_color: {
      type: Sequelize.STRING
    },
    width_faqs_accordian: {
      type: Sequelize.INTEGER
    },
    category_font_size: {
      type: Sequelize.INTEGER
    },
    category_font_weight: {
      type: Sequelize.STRING
    },
    category_font_family: {
      type: Sequelize.STRING
    },
    category_text_style: {
      type: Sequelize.STRING
    },
    category_font_color: {
      type: Sequelize.STRING
    },
    category_text_align: {
      type: Sequelize.STRING
    },
    answer_font_size: {
      type: Sequelize.INTEGER
    },
    answer_font_weight: {
      type: Sequelize.STRING
    },
    answer_font_family: {
      type: Sequelize.STRING
    },
    answer_font_color: {
      type: Sequelize.STRING
    },
    answer_bg_color: {
      type: Sequelize.STRING
    },
    show_page_title: {
      type: Sequelize.BOOLEAN
    },
    status: {
      type: Sequelize.BOOLEAN
    },
    show_intro_text: {
      type: Sequelize.BOOLEAN
    },
    show_footer_text: {
      type: Sequelize.BOOLEAN
    },
    intro_text_content: {
      type: Sequelize.STRING
    },
    page_title_content: {
      type: Sequelize.STRING
    },
    footer_text_content: {
      type: Sequelize.STRING
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
    main_page_url: {
      type: Sequelize.STRING
    },
    faq_page_url: {
      type: Sequelize.STRING
    },
  }, 
  {
    freezeTableName: true
  });
  return Setting;
};