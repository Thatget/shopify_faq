const express = require("express");
const router = express.Router();
const AuthMiddleWare = require("../middleware/AuthMiddleware");
const AuthController = require("../controllers/AuthController");
const faq = require("../controllers/faq.controller");
const user = require("../controllers/user.controller");
const setting = require("../controllers/setting.controller");
const category = require("../controllers/faq_category.controller.js");
/**
 * Init all APIs
 * @param {*} app from express
 */
let initAPIs = (app) => {
// Api
    router.post("/login", AuthController.login);

    router.post("/refresh-token", AuthController.refreshToken);

    // require("../routes/faq_category.routes");
    // Sử dụng authMiddleware.isAuth trước những api cần xác thực
    router.use(AuthMiddleWare.isAuth);

    //Faq router
    router.post("/api/faq", faq.create);
    router.get("/api/faq/:user_id", faq.findAll);
    router.get("/api/faq/:id", faq.findOne);
    router.put("/api/faq/:id", faq.update);
    router.delete("/api/faq/:id", faq.delete);
    router.delete("/api/faq/:category_id", faq.deleteAll);

    //Setting router
    router.post("/api/setting/", setting.create);
    router.get("/api/setting/user/user_id", setting.findAll);
    router.get("/api/setting/:user_id", setting.findOne);
    router.put("/api/setting/:userid", setting.update);
    router.delete("/api/setting/:user_id", setting.delete);

    //Category
    router.post("/api/faq-category", category.create);
    router.get("/api/faq-category/user/:user_id", category.findAll);
    router.get("/api/faq-category/:id", category.findOne);
    router.put("/api/faq-category/:id", category.update);
    router.delete("/api/faq-category/:id", category.delete);
    router.delete("/api/faq-category/user/:user_id", category.deleteAll);

   //User
   //  require("../routes/user.routes");

    router.post("/api/user", user.create);
    router.get("/api/user/:id", user.findOne);
    router.put("/api/user/:id", user.update);
    router.delete("/api/user/:id", user.delete);
    router.delete("/api/user", user.deleteAll);


    //Router using
    return app.use("/", router);
}
module.exports = initAPIs;
