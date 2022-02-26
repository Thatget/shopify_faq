module.exports = app => {
    const user = require("../controllers/setting.controller");
    var router = require("express").Router();
    // Create a new Faq
    router.post("/", faq.create);
    // Retrieve all Faq of a user
    router.get("/user_id/:id", faq.findAll);
    // Retrieve a single Faq by a User
    router.get("/:id", faq.findOne);
    // Update a Faq with id
    router.put("/:id", faq.update);
    // Delete a User with id
    router.delete("/:id", faq.delete);
    // Delete all User
    router.delete("/user_id/:id", faq.deleteAll);
    app.use('/api/faq', router);
};
