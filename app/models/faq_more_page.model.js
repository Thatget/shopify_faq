module.exports = (sequelize, Sequelize) => {
<<<<<<< HEAD
    const Faq = require("./faq.model.js")(sequelize, Sequelize);
    const User = require("./user.model.js")(sequelize, Sequelize);

    const FaqMorePage = sequelize.define("faq_more_page", {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            // primaryKey: true
        },
        faq_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            // primaryKey: true
        },
        faq_identify: {
            type: Sequelize.STRING,
            allowNull: false,
            // primaryKey: true
        },
        category_identify: {
            type: Sequelize.STRING,
            allowNull: false,
            // primaryKey: true
        },
        page_name: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    }, {
        freezeTableName: true,
        uniqueKeys: {
            Items_unique: {
                fields: ['user_id', 'faq_identify', 'category_identify', 'page_name']
            }
        },
    });
    FaqMorePage.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
    FaqMorePage.belongsTo(Faq, {foreignKey: 'faq_id', targetKey: 'id', onDelete: 'CASCADE',});
    return FaqMorePage;
=======
  const Faq = require("./faq.model.js")(sequelize, Sequelize);
  const User = require("./user.model.js")(sequelize, Sequelize);

  const FaqMorePage = sequelize.define("faq_more_page", {
      user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // primaryKey: true
      },
      faq_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // primaryKey: true
      },
      faq_identify: {
          type: Sequelize.STRING,
          allowNull: false,
          // primaryKey: true
      },
      category_identify: {
          type: Sequelize.STRING,
          allowNull: false,
          // primaryKey: true
      },
      page_name: {
          type: Sequelize.STRING,
          allowNull: false,
      }
  }, {
      freezeTableName: true,
      uniqueKeys: {
          Items_unique: {
              fields: ['user_id', 'faq_identify', 'category_identify', 'page_name']
          }
      },
  });
  FaqMorePage.belongsTo(User, {foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE',});
  FaqMorePage.belongsTo(Faq, {foreignKey: 'faq_id', targetKey: 'id', onDelete: 'CASCADE',});
  return FaqMorePage;
>>>>>>> 313dd214473269cb4ac2f6119c0cee935e61e527
};