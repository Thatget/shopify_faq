module.exports = app => {
    const setting = require("../controllers/setting.controller");
    var router = require("express").Router();
    // Create a new Setting
    router.post("/", setting.create);
    // Retrieve all Setting of a user
    router.get("/user_id/:id", setting.findAll);
    // Retrieve a single Setting by a User
    router.get("/:id", setting.findOne);
    // Update a Setting with id
    router.put("/:id", setting.update);
    // Delete a Setting with id
    router.delete("/:id", setting.delete);
    app.use('/api/setting', router);
};
