module.exports = (sequelize, Sequelize) => {
  const user = require("./user.model.js")(sequelize, Sequelize);
  const qr_code_setting = sequelize.define("qr_code_setting",
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qr_code_id:{
      type: Sequelize.INTEGER
    },
    qr_code_name:{
      type: Sequelize.STRING
    },
    qr_destination:{
      type: Sequelize.STRING
    },
    qr_data:{
      type: Sequelize.STRING
    },
    qr_link:{
      type: Sequelize.STRING
    },
    qr_type:{
      type: Sequelize.STRING
    },
    qr_code_type:{
      type: Sequelize.STRING
    },
    qr_text_fontsize:{
      type: Sequelize.INTEGER
    },
    qr_utm_enable:{
      type: Sequelize.BOOLEAN
    },
    auto_add_discount:{
      type: Sequelize.BOOLEAN
    },
  },
  {
    freezeTableName: true
  });
  qr_code_setting.belongsTo(user, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return qr_code_setting;
};