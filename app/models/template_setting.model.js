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
