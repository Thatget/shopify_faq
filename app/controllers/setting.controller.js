const db = require("../models");
const Setting = db.setting;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {

  // Create a setting
  const setting = {
    main_page_url: req.body.main_page_url,
    faq_page_url: req.body.faq_page_url,
    intro_text_content: req.body.intro_text_content,
    footer_text_content: req.body.footer_text_content,
    page_title_content: req.body.page_title_content,
    show_intro_text: req.body.show_intro_text,
    show_footer_text: req.body.show_footer_text,
    width_faq_accordian : req.body.width_faq_accordian,
    faq_font_color: req.body.faq_font_color,
    faq_font_size: req.body.faq_font_size,
    faq_bg_color: req.body.faq_bg_color,
    faq_font_weight: req.body.faq_font_weight,
    faq_font_family: req.body.faq_font_family,
    faq_hover_color: req.body.faq_hover_color,
    category_font_color: req.body.category_font_color,
    category_font_size: req.body.category_font_size,
    category_font_weight: req.body.category_font_weight,
    category_font_family: req.body.category_font_family,
    category_text_style: req.body.category_text_style,
    category_text_align: req.body.category_text_align,
    answer_font_size: req.body.answer_font_size,
    answer_font_weight: req.body.answer_font_weight,
    answer_font_color: req.body.answer_font_color,
    answer_bg_color: req.body.answer_bg_color,
    answer_font_family: req.body.answer_font_family,
    show_page_title : req.body.show_page_title,
    status: req.body.status,
    user_id: req.jwtDecoded.data.user_id,
    faq_sort_name: req.body.faq_sort_name,
    faq_uncategory_hidden: req.body.faq_uncategory_hidden,
    category_sort_name: req.body.category_sort_name,
    dont_category_faq: req.body.dont_category_faq,
  };

  Setting.create(setting)
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Setting."
      });
  });
};

// Retrieve all Setting from the database.
exports.findAll = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  // var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  Setting.findAll({ where: { user_id : user_id} })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving setting."
      });
    });
  };

// Find a single Setting with an id
exports.findOne = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  Setting.findOne({ where: { user_id : user_id}})
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Setting with user_id=${user_id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving setting with user_id=" + user_id
      });
    });
  };

// Update a Setting by the id in the request
exports.update = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  Setting.update(req.body, {
    where: { user_id: user_id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Setting was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Setting with user_id=${user_id}. Maybe Setting was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating setting with user_id=" + user_id
      });
    });
};

// Delete a Setting with the specified id in the request
exports.delete = (req, res) => {
  const user_id = req.jwtDecoded.data.user_id;
  Setting.destroy({
    where: { user_id: user_id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Setting was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete setting with user_id=${user_id}. Maybe setting was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete setting with user_id=" + user_id
      });
    });
  };

// Delete all Setting from the database.
exports.deleteAll = (req, res) => {
    const user_id = req.query.user_id;
    var condition = user_id ? { user_id: { [Op.eq]: `${user_id}` } } : null;
    Setting.destroy({
        where: {condition},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} user were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all users."
            });
        });
};
