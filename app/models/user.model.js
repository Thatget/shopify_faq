module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
      store_name: {
          type: Sequelize.STRING
      },
      shopify_domain: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      shop_domain: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shopify_access_token: {
          type: Sequelize.STRING,
          allowNull: false,
      },  
      email: {
          type: Sequelize.STRING,
          allowNull: false,
      },
      phone: {
          type: Sequelize.STRING
      },
      shopLocales: {
          type: Sequelize.TEXT
      }, 
  }, {
      freezeTableName: true
  });
  return User;
};
