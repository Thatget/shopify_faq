module.exports = (sequelize, Sequelize) => {
  const user = require("./user.model.js")(sequelize, Sequelize);
  const qr_code_style = sequelize.define("qr_code_style",
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qr_code_name: {
      type: Sequelize.STRING,
      allowNull: false,
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
      type: Sequelize.STRING
    },
    qr_frame_color:{
      type: Sequelize.STRING
    },
    qr_shape_dot:{
      type: Sequelize.STRING
    },
    qr_corner:{
      type: Sequelize.STRING
    },
    qr_corner_dot:{
      type: Sequelize.STRING
    },
  },
  {
    freezeTableName: true
  });
  qr_code_style.belongsTo(user, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return qr_code_style;
};