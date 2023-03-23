// const request = require('request-promise');
const db = require("../models/index");
const User = db.user;
const Shopify = require("@shopify/shopify-api");

const collection = async (req, res) => {
    var collection = null;
    const id = req.jwtDecoded.data.user_id;
    const collection_title = req.query.collection_title
    try {
      const userInfo = await User.findByPk(id, {attributes: ['shopify_domain', 'shopify_access_token']});
      if(collection_title){
        const client = new Shopify.Shopify.Clients.Graphql(userInfo.dataValues.shopify_domain, userInfo.dataValues.shopify_access_token);
        const data = await client.query({
          data:
          `query {
            collections(first: 5, query: "title:${collection_title}*") {
              edges {
                node {
                  id
                  title
                  handle
                  updatedAt
                  productsCount
                  sortOrder
                }
              }
            }
          }`
        });
        collection = data.body.data.collections.edges
      }
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
    if(collection.length > 0){
      res.status(200).json(collection);
    }
    else{
      res.status(200).send({
        message: "No results"
      });
    }
}

module.exports = {
  getCollection: collection,
};

