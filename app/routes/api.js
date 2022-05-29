const express = require("express");
const router = express.Router();
const AuthMiddleWare = require("../middleware/AuthMiddleware");
const AuthController = require("../controllers/AuthController");
const faq = require("../controllers/faq.controller");
const user = require("../controllers/user.controller");
const setting = require("../controllers/setting.controller");
const category = require("../controllers/faq_category.controller.js");
const uploadBanner = require("../controllers/uploadTemplateBanner");
const importExport = require("../helpers/importExport");

const shopifyApi = require("../helpers/shopifyApi.helper");

const ensureEnpoint = require("../helpers/ensureEnpoint.helper");

/**
 * Init all APIs
 * @param {*} app from express
 */
let initAPIs = (app) => {
// Api

    // Get image
    router.get('/var/images/*', (req,res)=>{
        const path = require('path');
        const imagePath = path.join(__dirname, '../../var/images/');
        res.sendFile(imagePath+req.params[0]);
    });

    router.post("/login", AuthController.login);

    router.post("/refresh-token", AuthController.refreshToken);

    router.get("/api/shop/faq/:shop", faq.findAllInFaqPage);
    router.get("/api/shop/faq/search/:shop", faq.searchFaqTitle);
    router.get("/api/shop/setting/:shop", setting.findOneInFaqPage);
    router.get("/api/shop/faq-category/:shop", category.findAllInFaqPage);

    router.get("/api/gdpr/customer-redact", ensureEnpoint.customerRedact);
    router.get("/api/gdpr/customer-data", ensureEnpoint.customerData);
    router.get("/api/gdpr/shop-redact", ensureEnpoint.shopRedact);

    // Sử dụng authMiddleware.isAuth trước những api cần xác thực
    router.use(AuthMiddleWare.isAuth);

    //Faq router
    router.post("/api/faq", faq.create);
    router.get("/api/faq", faq.findAll);
    router.get("/api/faq/:id", faq.findOne);
    router.put("/api/faq/:id", faq.update);
    router.delete("/api/faq/:id", faq.delete);
    router.delete("/api/faq", faq.deleteAll);

    //Setting router
    router.post("/api/setting/", setting.create);
    router.get("/api/setting", setting.findOne);
    router.put("/api/setting", setting.update);
    router.delete("/api/setting", setting.delete);
    router.get("/api/template/:faq_template_number", setting.findTemplateSetting);

    //Category
    router.post("/api/faq-category", category.create);
    router.get("/api/faq-category", category.findAll);
    router.get("/api/faq-category/:id", category.findOne);
    router.put("/api/faq-category/:id", category.update);
    router.delete("/api/faq-category/:id", category.delete);
    router.delete("/api/faq-category", category.deleteAll);

    //User
    //  require("../routes/user.routes");
    // router.post("/api/user", user.create);
    router.get("/api/user", user.findOne);
    // router.put("/api/user", user.update);
    // router.delete("/api/user", user.delete);
    // router.delete("/api/user", user.deleteAll);

    // get Product list
    router.get("/api/shop/product-list", shopifyApi.getProductList);
    router.get("/api/shop/search-product", shopifyApi.searchProductByTitle);

    // Upload image
    const multer = require('multer');
    const upload = multer({
        limits: {
            fileSize: 8 * 1024 * 1024,
        }
    });
    router.post("/api/upload-profile-pic", upload.single('profile_pic'), uploadBanner.upload);
    // Import Faqs
    // router.post("/api/import-faq", upload.single('faq-list'), importExport.import);
    // Export Faqs
    router.get("/api/export-faq",importExport.export);

    //Router using
    return app.use("/", router);
}
module.exports = initAPIs;