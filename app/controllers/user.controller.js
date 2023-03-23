const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const Scans_Shopify_Homepage = db.scans_shopify_homepage;
const Scans_Shopify_Productpage = db.scans_shopify_productpage;
const QR_code = db.qr_code;
const QR_code_setting = db.qr_code_setting;
const QR_code_style = db.qr_code_style;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.store_name) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    // Create a user
    const user = {
      store_name: req.body.store_name,
      shopify_domain: req.body.shopify_domain,
      shopify_access_token: req.body.shopify_access_token,
      email: req.body.email,
      phone: req.body.phone,
    };

    User.create(user)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
    });
};

exports.findAllData = async(req, res) => {
  let Qr_code_data = []
  let Qr_code_style_data = []
  let Qr_code_setting_data = []
  let Scans_shopify_home_data = []
  let Scans_shopify_product_data = []

  const id = req.jwtDecoded.data.user_id;
  await User.findByPk(id)
  .then(async data => {
    if(data){
      Qr_code_data = await findAllQrCode(id)
      Qr_code_style_data = await findAllQrCodeStyle(id)
      Qr_code_setting_data = await findAllQrCodeSetting(id)
      Scans_shopify_home_data = await findAllScanShopifyHome(id)
      Scans_shopify_product_data = await findAllScanShopifyProduct(id)
      let allData = {
        user: data,
        qr_code: Qr_code_data? Qr_code_data : [],
        qr_code_style : Qr_code_style_data? Qr_code_style_data : [],
        qr_code_setting : Qr_code_setting_data? Qr_code_setting_data: [],
        scans_shopify_home : Scans_shopify_home_data? Scans_shopify_home_data: [],
        scans_shopify_product : Scans_shopify_product_data? Scans_shopify_product_data: [],
      }
      res.send(allData)
    }
    else{
      res.status(404).send({
        message: `Cannot find User with id=${id}.`
      });
    }
  })
  .catch(e => {
    console.log(e)
  })
}

async function findAllQrCode(user_id) {
  await QR_code.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    return data
  })
  .catch(() => {
    console.log(`Cannot find All QR Code with user_id = ${user_id}`)
  })
}

async function findAllQrCodeStyle(user_id) {
  await QR_code_style.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    return data
  })
  .catch(() => {
    console.log(`Cannot find All QR_Code_Style with user_id = ${user_id}`)
  })
}

async function findAllQrCodeSetting(user_id) {
  await QR_code_setting.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    return data
  })
  .catch(() => {
    console.log(`Cannot find All QR_Code_Style with user_id = ${user_id}`)
  })
}

async function findAllScanShopifyHome(user_id) {
  await Scans_Shopify_Homepage.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    return data
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Shopify_Homepage with user_id = ${user_id}`)
  })
}

async function findAllScanShopifyProduct(user_id) {
  await Scans_Shopify_Productpage.findAll({
    where: {
      user_id: user_id
    }
  })
  .then(data => {
    return data
  })
  .catch(() => {
    console.log(`Cannot find All Scans_Shopify_Productpage with user_id = ${user_id}`)
  })
}

// Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.jwtDecoded.data.user_id;
  User.findByPk(id,
    {
      attributes:['shopify_domain','store_name','shopLocales','phone','email']
    })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id
      });
    });
  };


// // Find all user
// exports.findAll = (req, res) => {
//   User.findAll(
//   {
//     attributes:['shopify_domain','id', 'email', 'createdAt'],
//     order:['id']
//   })
//   .then(data => {
//     if (data) {
//       res.send(data);
//     } else {
//       res.status(404).send({
//         message: `Cannot find User with id=${id}.`
//       });
//     }
//   })
//   .catch(err => {
//     res.status(500).send({
//       message: "Error retrieving user with id=" + id
//     });
//   });
// };

// exports.findAllData = async(req, res) => {
//   let locale = req.query.locale
//   let userInfo = []
//   let settingData = []
//   let categoryData = []
//   let allCategoryData = []
//   let faqData = []
//   let allFaqData = []
//   let productData = []
//   let faqMorePageData = []
//   let faqMorePageSettingData = []
//   let ratingData = []
//   let planData = []
//   const user_id = req.jwtDecoded.data.user_id;
//   await User.findByPk(user_id,
//     {
//       attributes:['shopify_domain','store_name','shopLocales','phone','email','shopify_access_token','plan_extra']
//     })
//   .then(async data => {
//     if (data) {
//       userInfo = data
//       settingData = await findSetting(user_id)

//       const allDataCategory = await findAllCategory(user_id, settingData, locale)
//       categoryData = allDataCategory.categoryData
//       allCategoryData = allDataCategory.allCategoryData

//       const allDataFaq = await findFaq(user_id, settingData, locale)
//       faqData = allDataFaq.faqData
//       allFaqData = allDataFaq.allFaqData

//       productData = await findProduct(user_id)

//       faqMorePageData = await findFaqMorePage(user_id)

//       faqMorePageSettingData = await findFaqMorePageSetting(user_id)

//       ratingData = await findRating(user_id)

//       planData = await findPlan(user_id)
//     }
//     else {
//       res.status(404).send({
//         message: `Cannot find User with id=${user_id}.`
//       });
//     }
//   })
//   .catch(err => {
//     errorLog.error(err)
//   });
//   let data = {
//     user: userInfo,
//     faq: faqData, 
//     allFaq: allFaqData,
//     category: categoryData, 
//     setting: settingData, 
//     allCategory: allCategoryData, 
//     faqMorePage : faqMorePageData, 
//     faqMorePageSetting : faqMorePageSettingData, 
//     product : productData, 
//     rating : ratingData,
//     plan: planData
//   }
//   return res.send({data})
// }; 

// async function findSetting(user_id){
//   let return_setting_data = {};
//   let template_setting = {};
//   let settingData = []
//   await Setting.findOne({ where: { user_id : user_id}})
//   .then(async data => {
//     if (data) {
//       if (data.dataValues.faq_template_number) {
//         await TemplateSetting.findOne({ where: { setting_id : data.dataValues.id, template_number: data.dataValues.faq_template_number}})
//         .then(template_setting_data => {
//           if (template_setting_data) {
//             template_setting = template_setting_data.dataValues;
//             delete template_setting.id;
//           }
//         })
//         .catch()
//       }
//       return_setting_data = Object.assign(data.dataValues, template_setting);
//       settingData.push(return_setting_data)
//     } 
//     else {
//       errorLog.error(`Cannot find Setting with user_id=${user_id}.`)
//     }
//   })
//   .catch(err => {
//     errorLog.error(err)
//   });
//   return settingData
// }

// async function findAllCategory(user_id, settingData, locale){
//   let condition = { user_id: user_id, locale: locale };
//   let categoryDatas = {}
//   let categoryData = []
//   let allCategoryData = []
//   if(settingData.category_sort_name === true){
//     await FaqCategory.findAll({ where: condition, order:['title']})
//       .then(async data => {
//         data.forEach(item => {
//           categoryData.push(item.dataValues)
//         })
//         categoryDatas.categoryData = categoryData
//         await FaqCategory.findAll({
//           where: {user_id: user_id}
//         })
//         .then(response => {
//           response.forEach(item => {
//             allCategoryData.push(item.dataValues)
//           })
//           categoryDatas.allCategoryData = allCategoryData
//         })
//       })
//       .catch(err => {
//         errorLog.error(err)
//       });
//   }
//   else{
//     await FaqCategory.findAll({ where: condition, order:['position']})
//       .then(async data => {
//         data.forEach(item => {
//           categoryData.push(item.dataValues)
//         })
//         categoryDatas.categoryData = categoryData
//         await FaqCategory.findAll({
//           where: {user_id: user_id}
//         })
//         .then(response => {
//           response.forEach(item => {
//             allCategoryData.push(item.dataValues)
//           })
//           categoryDatas.allCategoryData = allCategoryData
//         })
//       })
//       .catch(err => {
//         errorLog.error(err)
//       });  
//   }
//   return categoryDatas
// }

// async function findFaq(user_id, settingData, locale){
//   let condition = { user_id: user_id, locale: locale };
//   let faqDatas = {}
//   let faqData = []
//   let allFaqData = []
//   if(settingData.category_sort_name === true){
//     await Faq.findAll({ where: condition, order:['title']})
//     .then(async data => {
//       data.forEach(item => {
//         faqData.push(item.dataValues)
//       })
//       faqDatas.faqData = faqData
//       await Faq.findAll({
//         where: {user_id: user_id}
//       })
//       .then(response => {
//         response.forEach(item => {
//           allFaqData.push(item.dataValues)
//         })
//         faqDatas.allFaqData = allFaqData
//       })
//     })
//     .catch(err => {
//       errorLog.error(err)
//     });  }
//   else{
//     await Faq.findAll({ where: condition, order:['position']})
//     .then(async data => {
//       data.forEach(item => {
//         faqData.push(item.dataValues)
//       })
//       faqDatas.faqData = faqData
//       await Faq.findAll({
//         where: {user_id: user_id}
//       })
//       .then(response => {
//         response.forEach(item => {
//           allFaqData.push(item.dataValues)
//         })
//         faqDatas.allFaqData = allFaqData
//       })
//     })
//     .catch(err => {
//       errorLog.error(err)
//     });  
//   }
//   return faqDatas
// }

// async function findProduct(user_id){
//   let productData = []
//   await Product.findAll({ where: {
//     user_id: user_id} 
//   })
//   .then(data => {
//     data.forEach(item => {
//       productData.push(item.dataValues)
//     })
//   })
//   .catch(err => {
//     errorLog.error(err)
//   });
//   return productData
// }

// async function findFaqMorePage(user_id){
//   let faqMorePageData = []
//   await FaqMorePage.findAll({
//     where: {
//         user_id: user_id
//     }
//   })
//   .then(data => {
//     data.forEach(item => {
//       faqMorePageData.push(item.dataValues)
//     })
//   })
//   .catch(err => {
//     errorLog.error(err)
//   });
//   return faqMorePageData
// }

// async function findFaqMorePageSetting(user_id){
//   let faqMorePageSettingData = []
//   FaqMorePageSetting.findAll({
//     where: {
//       user_id: user_id
//     }
//   })
//   .then(data => {
//     data.forEach(item => {
//       faqMorePageSettingData.push(item.dataValues)
//     })
//   })
//   .catch(err => {
//     errorLog.error(err)
//   });
//   return faqMorePageSettingData
// }

// async function findRating(user_id){
//   let ratingData = {}
//   await Rating.findOne({
//     where: {user_id : user_id}
//   })
//   .then(data => {
//     ratingData = data
//   })
//   .catch(err => {
//     errorLog.error(err)
//   });
//   return ratingData
// }

// async function findPlan(user_id){
//   let planData = {}
//   await Plan.findOne({
//     where: {user_id : user_id}
//   })
//   .then(data => {
//     planData = data  
//   })
//   .catch(err => {
//     errorLog.error(err)
//   });
//   return planData
// }



