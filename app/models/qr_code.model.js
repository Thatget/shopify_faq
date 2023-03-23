module.exports = (sequelize, Sequelize) => {
  const user = require("./user.model.js")(sequelize, Sequelize);
  const qr_code = sequelize.define("qr_code",
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qr_code_name:{
      type: Sequelize.STRING
    },
  },
  {
    freezeTableName: true
  });
  qr_code.belongsTo(user, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return qr_code;
};