module.exports = (sequelize, Sequelize) => {
  const User = require("./user.model.js")(sequelize, Sequelize);
  const scans_shopify_cartpage = sequelize.define("scans_shopify_cartpage",
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qr_code_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    scans_address:{
      type: Sequelize.STRING
    },
    scans_brower:{
      type: Sequelize.STRING
    },
    scans_platform:{
      type: Sequelize.STRING
    },
    scans_device:{
      type: Sequelize.STRING
    },
  },
  {
    freezeTableName: true
  });
  scans_shopify_cartpage.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  return scans_shopify_cartpage;
};