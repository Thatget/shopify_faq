module.exports = app => {
    const setting = require("../controllers/setting.controller.js");
    var router = require("express").Router();
    // Create a new User
    router.post("/", setting.create);
    // Retrieve all User
    router.get("/user/:user_id", setting.findAll);
    // Retrieve a single User with id
    router.get("/:user_id", setting.findOne);
    // Update a User with id
    router.put("/:user_id", setting.update);
    // Delete a User with id
    router.delete("/:user_id", setting.delete);
    // Delete all User
    router.delete("/", setting.deleteAll);
    app.use('/api/setting', router);
  };