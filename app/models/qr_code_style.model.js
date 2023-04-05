module.exports = (sequelize, Sequelize) => {
  const user = require("./user.model.js")(sequelize, Sequelize);
  const qr_code_style = sequelize.define("qr_code_style",
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qr_code_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qr_text_title:{
      type: Sequelize.TEXT
    },
    qr_product_name:{
      type: Sequelize.STRING
    },
    qr_collection_name:{
      type: Sequelize.STRING
    },
    qr_logo_link:{
      type: Sequelize.STRING
    },
    qr_logo_size:{
      type: Sequelize.INTEGER
    },
    qr_data:{
      type: Sequelize.STRING
    },
    qr_text_header:{
      type: Sequelize.STRING
    },
    qr_text_footer:{
      type: Sequelize.STRING
    },
    qr_text_left:{
      type: Sequelize.STRING
    },
    qr_text_right:{
      type: Sequelize.STRING
    },
    text_header_color:{
      type: Sequelize.STRING
    },
    text_footer_color:{
      type: Sequelize.STRING
    },
    text_left_color:{
      type: Sequelize.STRING
    },
    text_right_color:{
      type: Sequelize.STRING
    },
    text_header_size:{
      type: Sequelize.INTEGER
    },
    text_footer_size:{
      type: Sequelize.INTEGER
    },
    text_left_size:{
      type: Sequelize.INTEGER
    },
    text_right_size:{
      type: Sequelize.INTEGER
    },
    qr_frame:{
      type: Sequelize.INTEGER
    },
    qr_frame_color:{
      type: Sequelize.STRING
    },
    qr_code_image: {
      type: Sequelize.STRING
    },
    hide_bg_dots: {
      type: Sequelize.BOOLEAN
    },
    image_margin: {
      type: Sequelize.INTEGER
    },
    qr_code_image_size: {
      type: Sequelize.INTEGER
    },
    corner_dot_rotation: {
      type: Sequelize.INTEGER
    },
    corner_dot_gradient_color_2: {
      type: Sequelize.STRING
    },
    corner_dot_gradient_color_1: {
      type: Sequelize.STRING
    },
    corner_dot_single_color: {
      type: Sequelize.STRING
    },
    corner_dot_color_type: {
      type: Sequelize.STRING
    },
    corner_dot_style: {
      type: Sequelize.STRING
    },
    corner_square_rotation: {
      type: Sequelize.INTEGER
    },
    corner_square_gradient_color_1: {
      type: Sequelize.STRING
    },
    corner_square_gradient_color_2: {
      type: Sequelize.STRING
    },
    corner_square_single_color: {
      type: Sequelize.STRING
    },
    corner_square_color_type: {
      type: Sequelize.STRING
    },
    corner_square_style: {
      type: Sequelize.STRING
    },
    qr_type: {
      type: Sequelize.INTEGER
    }, 
    error_correction_level: {
      type: Sequelize.STRING
    },
    dot_rotation: {
      type: Sequelize.INTEGER
    },
    dot_gradient_color_2: {
      type: Sequelize.STRING
    },
    dot_gradient_color_1: {
      type: Sequelize.STRING
    },
    dot_single_color: {
      type: Sequelize.STRING
    },
    dot_color_type: {
      type: Sequelize.STRING
    },
    dot_style: {
      type: Sequelize.STRING
    },
  },
  {
    freezeTableName: true
  });
  qr_code_style.belongsTo(user, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return qr_code_style;
};