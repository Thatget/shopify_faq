const express = require("express");
const router = express.Router();
const AuthMiddleWare = require("../middleware/AuthMiddleware");
const AuthController = require("../controllers/AuthController");
const faq = require("../controllers/faq.controller");
const block = require("../controllers/block_product.controller");
const product = require("../controllers/product.controller");
const faq_product = require("../controllers/faq_product.controller");
const faq_more_page = require("../controllers/faq_more_page.controller");
const faq_more_page_setting = require("../controllers/faq_more_page_setting.controller");
const block_faq_more_page = require("../controllers/block_more_page.controller");
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
    router.get("/api/product/:product_id", product.findOne);
    router.get("/api/shop/faq/:shop", faq.findAllInFaqPage);
    router.get("/api/shop/faq/search/:shop", faq.searchFaqTitle);
    router.get("/api/shop/setting/:shop", setting.findOneInFaqPage);
    router.get("/api/shop/faq-category/:shop", category.findAllInFaqPage);
    router.get("/api/no-token/block/:shop/:product_id/:locale", block.findAllProduct)
    router.get("/api/no-token/block-more-page/:shop/:page/:locale", block_faq_more_page.findFaqOnPage)
    router.get("/api/gdpr/customer-redact", ensureEnpoint.customerRedact);
    router.get("/api/gdpr/customer-data", ensureEnpoint.customerData);
    router.get("/api/gdpr/shop-redact", ensureEnpoint.shopRedact);
    // Sử dụng authMiddleware.isAuth trước những api cần xác thực
    router.use(AuthMiddleWare.isAuth);

    //Faq router
    router.post("/api/faq", faq.create);
    router.get("/api/faq", faq.findAll);
    router.get("/api/faq/all", faq.getAll);
    router.get("/api/faq_by_identify", faq.getByIdentify);
    router.get("/api/faq/:id", faq.findOne);
    router.put("/api/faq/:id", faq.update);
    router.put("/api/faq-update", faq.updateWhenDeleteCategory);
    router.put("/api/faq/update/rearrange", faq.updateRearrangeFaqs);
    router.delete("/api/faq/:id", faq.delete);
    router.delete("/api/faq", faq.deleteAll);

    //Setting router
    router.post("/api/setting/", setting.create);
    router.get("/api/setting", setting.findOne);
    router.put("/api/setting", setting.update);
    router.delete("/api/setting", setting.delete);
    router.get("/api/template/:faq_template_number", setting.findTemplateSetting);

    //Category
    router.get("/api/faq-category/all", category.getAll);
    router.post("/api/faq-category", category.create);
    router.get("/api/faq-category", category.findAll);
    router.get("/api/faq-category/:id", category.findOne);
    router.put("/api/faq-category/:id", category.update);
    router.put("/api/faq-category/update/rearrange", category.updateRearrangeCategories);
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
    // router.get("/api/shop/product-list", shopifyApi.getProductList);

    //Product router
    router.post("/api/product", product.create);
    router.get("/api/product", product.findAll);
    router.put("/api/product/:id", product.update);
    router.delete("/api/product/:product_id", product.delete);
    router.post("/api/product/id", product.deleteAll);

    //Faq Product router
    router.post("/api/faq-product", faq_product.create);
    router.get("/api/faq-product/product", faq_product.findAll);
    router.get("/api/faq-product/:id", faq_product.findOne);
    router.put("/api/faq-product/:id", faq_product.update);
    router.put("/api/faq-product-update", faq_product.updateFaqs);
    router.put("/api/faq-product-update/category", faq_product.updateFaqsWhenChangeCategory);
    router.delete("/api/faq-product/:id", faq_product.delete);
    router.delete("/api/faq-product/product", faq_product.deleteAll);

    //Faq More Page router
    router.post("/api/faq-more-page", faq_more_page.create);
    router.get("/api/faq-more-page", faq_more_page.findAll);
    router.get("/api/faq-more-page/:id", faq_more_page.findOne);
    router.get("/api/faq-more-page/page/:page", faq_more_page.findByPage);
    router.put("/api/faq-more-page/:id", faq_more_page.update);
    router.put("/api/faq-more-page-update", faq_more_page.updateFaqs);
    router.delete("/api/faq-more-page/:id", faq_more_page.delete);
    router.delete("/api/faq-more-page/page", faq_more_page.deleteAll);

    //Setting Faq More Page router
    router.post("/api/faq-more-page-setting", faq_more_page_setting.create);
    router.get("/api/faq-more-page-setting", faq_more_page_setting.findAll);
    router.get("/api/faq-more-page-setting/:id", faq_more_page_setting.findOne);
    router.get("/api/faq-more-page-setting/page/:page", faq_more_page_setting.findByPage);
    router.put("/api/faq-more-page-setting/:id", faq_more_page_setting.update);
    router.delete("/api/faq-more-page-setting/:id", faq_more_page_setting.delete);
    router.delete("/api/faq-more-page-setting/page", faq_more_page_setting.deleteAll);


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
    router.post("/api/import-faq", upload.single('faq-list'), importExport.import);
    // Export Faqs
    router.get("/api/export-faq",importExport.export);

    //Router using
    return app.use("/", router);
}
module.exports = initAPIs;