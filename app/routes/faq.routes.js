module.exports = app => {
    const faq = require("../controllers/faq.controller.js");
    var router = require("express").Router();
    
    // Create a new User
    router.post("/", faq.create);
    
    // Retrieve all User
    router.get("/user/:user_id", faq.findAll);

    // Retrieve a single User with id
    router.get("/:id", faq.findOne);

    // Retrieve a single User with title
    // router.get("/", faq.findByTitle);

    // Update a User with id
    router.put("/:id", faq.update);

    // Delete a User with id
    router.delete("/:id", faq.delete);

    // Delete all User
    router.delete("/user/:user_id", faq.deleteAll);
    app.use('/api/faq', router);
  };