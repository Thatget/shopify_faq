module.exports = (sequelize, Sequelize) => {
    const Setting = require("./setting.model.js")(sequelize, Sequelize);
    const TemplateSetting = sequelize.define("template_setting",
        {
            setting_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            template_number: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            image_banner: {
                type: Sequelize.STRING
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
            custom_css: {
                type: Sequelize.TEXT
            },
            banner_height: {
                type: Sequelize.INTEGER
            },
            banner_default: {
                type: Sequelize.STRING
            },
            banner_visible: {
                type: Sequelize.BOOLEAN
            },
            page_title_fontsize: {
                type: Sequelize.INTEGER
            },
            page_title_paddingtop: {
                type: Sequelize.INTEGER
            },
            page_title_paddingbottom: 
            {
                type: Sequelize.INTEGER
            },
            page_title_color: {
                type: Sequelize.STRING
            },
            search_input_style: {
                type: Sequelize.STRING
            },
            intro_text_fontsize: {
                type: Sequelize.INTEGER
            },
            intro_text_paddingtop: {
                type: Sequelize.INTEGER
            },
            intro_text_paddingbottom: 
            {
                type: Sequelize.INTEGER
            },
            intro_text_color: {
                type: Sequelize.STRING
            },
            footer_text_fontsize: {
                type: Sequelize.INTEGER
            },
            footer_text_paddingtop: 
            {
                type: Sequelize.INTEGER
            },
            footer_text_paddingbottom: 
            {
                type: Sequelize.INTEGER
            },
            footer_text_color: {
                type: Sequelize.STRING
            },
            show_search_input: {
                type: Sequelize.BOOLEAN
            },
            page_title_font: {
                type: Sequelize.STRING
            },
            intro_text_font: {
                type: Sequelize.STRING
            },
            search_placeholder_font: 
            {
                type: Sequelize.STRING
            },
            footer_text_font: {
                type: Sequelize.STRING
            },
            show_category_bar: {
                type: Sequelize.BOOLEAN
            },
            page_background_color: {
                type: Sequelize.STRING
            },
            micro_scope_color: {
                type: Sequelize.STRING
            },
            placeholder_color: {
                type: Sequelize.STRING
            },
            category_bar_number: {
                type: Sequelize.INTEGER
            },
            category_bar_background: {
                type: Sequelize.STRING
            },
            category_bar_color: {
                type: Sequelize.STRING
            },
            btn_top_background: {
                type: Sequelize.STRING
            },
            btn_top_hover: {
                type: Sequelize.STRING
            },
            btn_top_visible: {
                type: Sequelize.BOOLEAN
            }
        },
        {
            uniqueKeys: {
                Items_unique: {
                    fields: ['setting_id', 'template_number']
                }
            },
            freezeTableName: true
        });
    TemplateSetting.belongsTo(Setting, {foreignKey: 'setting_id', targetKey: 'id', onDelete: 'CASCADE',});
    return TemplateSetting;
};