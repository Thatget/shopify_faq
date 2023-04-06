module.exports = (sequelize, Sequelize) => {
  const Qr_code = require("./qr_code.model.js")(sequelize, Sequelize);
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
    qr_data_domain:{
      type: Sequelize.STRING
    },
    qr_link:{
      type: Sequelize.TEXT
    },
    qr_text_fontsize:{
      type: Sequelize.INTEGER
    },
    qr_code_type:{
      type: Sequelize.STRING
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
  qr_code_setting.belongsTo(Qr_code, {foreignKey: 'qr_code_id', targetKey: 'id', onDelete: 'CASCADE',});
  return qr_code_setting;
};