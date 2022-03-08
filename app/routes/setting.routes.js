module.exports = app => {
    const setting = require("../controllers/setting.controller");
    var router = require("express").Router();
    // Create a new Setting
    router.post("/", setting.create);
    // Retrieve all Setting of a user
    router.get("/user/user_id", setting.findAll);
    // Retrieve a single Setting by a User
    router.get("/:user_id", setting.findOne);
    // Update a Setting with id
    router.put("/:userid", setting.update);
    // Delete a Setting with id
    router.delete("/:user_id", setting.delete);
    app.use('/api/setting', router);
};
