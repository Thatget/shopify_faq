const express = require("express");
const router = express.Router();
const AuthMiddleWare = require("../middleware/AuthMiddleware");
const AuthController = require("../controllers/AuthController");
const faq = require("../controllers/faq.controller");
const user = require("../controllers/user.controller");
const setting = require("../controllers/setting.controller");
const category = require("../controllers/faq_category.controller.js");
const uploadBanner = require("../controllers/uploadTemplateBanner")
/**
 * Init all APIs
 * @param {*} app from express
 */
let initAPIs = (app) => {
// Api
    router.post("/login", AuthController.login);

    router.post("/refresh-token", AuthController.refreshToken);

    router.get("/api/shop/faq/:shop", faq.findAllInFaqPage);
    router.get("/api/shop/faq/search/:shop", faq.searchFaqTitle);
    router.get("/api/shop/setting/:shop", setting.findOneInFaqPage);
    router.get("/api/shop/faq-category/:shop", category.findAllInFaqPage);
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

    //Category
    router.post("/api/faq-category", category.create);
    router.get("/api/faq-category", category.findAll);
    router.get("/api/faq-category/:id", category.findOne);
    router.put("/api/faq-category/:id", category.update);
    router.delete("/api/faq-category/:id", category.delete);
    router.delete("/api/faq-category", category.deleteAll);

    //User
    //  require("../routes/user.routes");
    router.post("/api/user", user.create);
    router.get("/api/user", user.findOne);
    router.put("/api/user", user.update);
    router.delete("/api/user", user.delete);
    router.delete("/api/user", user.deleteAll);

    // Upload image
    const multer = require('multer');
    const upload = multer({
        limits: {
            fileSize: 4 * 1024 * 1024,
        }
    });
    router.post("/api/upload-profile-pic", upload.single('profile_pic'), uploadBanner.upload);

    //Router using
    return app.use("/", router);
}
module.exports = initAPIs;