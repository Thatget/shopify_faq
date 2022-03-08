module.exports = app => {
    const faq_category = require("../controllers/faq-category.controller.js");
    var router = require("express").Router();
    // Create a new User
    router.post("/", faq_category.create);
    // Retrieve all User
    router.get("/user/:user_id", faq_category.findAll);
    // Retrieve a single User with id
    router.get("/:id", faq_category.findOne);
    // Update a User with id
    router.put("/:id", faq_category.update);
    // Delete a User with id
    router.delete("/:id", faq_category.delete);
    // Delete all User
    router.delete("/user/:user_id", faq_category.deleteAll);
    app.use('/api/faq-category', router);
  };