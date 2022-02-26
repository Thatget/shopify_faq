module.exports = app => {
    const user = require("../controllers/faq.controller.js");
    var router = require("express").Router();
    // Create a new Category
    router.post("/", faq.create);
    // Retrieve all Category of a user
    router.get("/:user_id", faq.findAll);
    // Retrieve a single Category
    router.get("/:id", faq.findOne);
    // Update a Category with id
    router.put("/:id", faq.update);
    // Delete a Category with id
    router.delete("/:id", faq.delete);
    // Delete all User
    router.delete("/:user_id", faq.deleteAll);
    app.use('/api/faq', router);
};
