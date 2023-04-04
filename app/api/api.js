const express = require("express");
const router = express.Router();
const AuthMiddleWare = require("../middleware/AuthMiddleware");
const user = require("../controllers/user.controller");
const productData = require('../controllers/productData.controller')
const qr_code = require('../controllers/qr_code.controller')
const qr_code_style = require('../controllers/qr_code_style.controller')
const qr_code_setting = require('../controllers/qr_code_setting.controller')
const scans_shopify_homepage = require('../controllers/scans_shopify_homepage.controller')
const scans_shopify_productpage = require('../controllers/scans_shopify_productpage.controller')
const collectionData = require('../controllers/collectionData.controller')
const uploadBanner = require("./../controllers/uploadTemplateBanner");
/**
 * Init all APIs
 * @param {*} app from express
 */
let initAPIs = (app) => {
// Api
  router.get("/api/qr-generator", qr_code_setting.generatorQR);

  // Sử dụng authMiddleware.isAuth trước những api cần xác thực
  router.use(AuthMiddleWare.isAuth);
  //User
  router.get("/api/user", user.findOne);
  router.get("/api/get-all-data", user.findAllData);

  //Product Data
  router.get("/api/shopify/products", productData.getProductList)
  router.get("/api/shopify/product-variants", productData.getProductVariants)

  //Collection Data
  router.get("/api/shopify/collection", collectionData.getCollection)

  //QR code api
  router.post("/api/qr-code", qr_code.create);
  router.get("/api/getAll/qr-code", qr_code.findAll);
  router.get("/api/get/qr-code", qr_code.findOne);
  router.put("/api/update/qr-code/:id", qr_code.update);

  //QR code style
  router.post("/api/qr-code-style", qr_code_style.create);
  router.get("/api/getAll/qr-code-style", qr_code_style.findAll);
  router.get("/api/get/qr-code-style", qr_code_style.findOne);
  router.put("/api/update/qr-code-style/:id", qr_code_style.update);

  //QR code setting
  router.post("/api/qr-code-setting", qr_code_setting.create);
  router.get("/api/getAll/qr-code-setting", qr_code_setting.findAll);
  router.get("/api/get/qr-code-setting", qr_code_setting.findOne);
  router.put("/api/update/qr-code-setting/:id", qr_code_setting.update);
  
  //Scans shopify home page
  router.post("/api/scans-shopify-home", scans_shopify_homepage.create);
  router.get("/api/getAll/scans-shopify-home", scans_shopify_homepage.findAll);
  router.get("/api/get/scans-shopify-home", scans_shopify_homepage.findOne);
  router.put("/api/update/scans-shopify-home/:id", scans_shopify_homepage.update);

  //Scans shopify product page
  router.post("/api/scans-shopify-product", scans_shopify_productpage.create);
  router.get("/api/getAll/scans-shopify-product", scans_shopify_productpage.findAll);
  router.get("/api/get/scans-shopify-product", scans_shopify_productpage.findOne);
  router.put("/api/update/scans-shopify-product/:id", scans_shopify_productpage.update);

  // Upload image
  const multer = require('multer');
  const upload = multer({
    limits: {
      fileSize: 3 * 1024 * 1024,
    }
  });
  router.post("/api/upload-profile-pic/", upload.single('profile_pic'), uploadBanner.upload);
  
  //Router using
  return app.use("/", router);
}
module.exports = initAPIs;