module.exports = app => {
    const delete_category = require("../../controllers/faq/delete_category.controller.js");
    var router = require("express").Router();
    // Delete a Faq with id
    router.delete("/:id", delete_category.delete);
    // Delete all Faq
    router.delete("/user/:user_id", delete_category.deleteAll);
    app.use('/api/delete-category', router);
};
