module.exports = (sequelize, Sequelize) => {
  const user = require("./user.model.js")(sequelize, Sequelize);
  const qr_code_images = sequelize.define("qr_code_images",
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qr_logo_name:{
      type: Sequelize.STRING
    },
  },
  {
    freezeTableName: true
  });
  qr_code_images.belongsTo(user, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return qr_code_images;
};