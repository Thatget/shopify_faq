module.exports = (sequelize, Sequelize) => {
  const Qr_code = require("./qr_code.model.js")(sequelize, Sequelize);
  const scans_shopify_cartpage = sequelize.define("scans_shopify_cartpage",
  {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qr_code_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    qr_code_name: {
      type: Sequelize.STRING,
    },
    qr_code_type: {
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
  scans_shopify_cartpage.belongsTo(Qr_code, {foreignKey: 'qr_code_id', targetKey: 'id', onDelete: 'CASCADE',});
  return scans_shopify_cartpage;
};