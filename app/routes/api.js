const express = require("express");
const router = express.Router();
const AuthMiddleWare = require("../middleware/AuthMiddleware");
const AuthController = require("../controllers/AuthController");
const faq = require("../controllers/faq.controller");
const user = require("../controllers/user.controller");
/**
 * Init all APIs
 * @param {*} app from express
 */
let initAPIs = (app) => {
// Api
    router.post("/login", AuthController.login);
    router.post("/refresh-token", AuthController.refreshToken);
    require("../routes/faq.routes");
    require("../routes/faq_category.routes");
    require("../routes/faq/delete_category.routes");
    // router.get("/api/faq/:user_id", faq.findAll);
    // Sử dụng authMiddleware.isAuth trước những api cần xác thực
    router.use(AuthMiddleWare.isAuth);
    // router.get("/api/user", user.findAll);
    // List Protect APIs:
    require("../routes/user.routes");
    return app.use("/", router);
}
module.exports = initAPIs;
