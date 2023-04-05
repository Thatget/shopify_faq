// const request = require('request-promise');
const db = require("../models/index");
// const errorLog = require('./log.helper');
const User = db.user;
// const apiGraphql = process.env.API_GRAPHQL;
// const productApiGraphql = process.env.PRODUCT_API_GRAPHQL;
// const countProductApi = process.env.COUNT_PRODUCT_API_GRAPHQL;
const Shopify = require("@shopify/shopify-api");
const productList = async (req, res) => {
    var products = null;
    const id = req.jwtDecoded.data.user_id;
    const product_title = req.query.product_title
    try {
      const userInfo = await User.findByPk(id, {attributes: ['shopify_domain', 'shopify_access_token']});
      if(product_title){
        const client = new Shopify.Shopify.Clients.Graphql(userInfo.dataValues.shopify_domain, userInfo.dataValues.shopify_access_token);
        const data = await client.query({
          data: `query {
            products(first: 5, query: "title:${product_title}*") {
              edges {
                node {
                  id
                  title
                  description
                  images(first: 1){
                    edges{
                      node{
                        altText
                        url
                      }
                    }
                  }
                  handle
                  resourcePublicationOnCurrentPublication {
                    publication {
                      name
                      id
                    }
                    publishDate
                    isPublished
                  }
                }
              }
            }
          }`,
        });
        products = data.body.data.products.edges
      }
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
    if(products.length > 0){
      res.status(200).json(products);
    }
    else{
      res.status(200).send({
        message: "No results"
      });
    }
}

const getProductVariants = async (req, res) => {
  var products_variants = null;
    const id = req.jwtDecoded.data.user_id;
    const product_id = req.query.product_id
    try {
      const userInfo = await User.findByPk(id, {attributes: ['shopify_domain', 'shopify_access_token']});
      if(product_id){
        const client = new Shopify.Shopify.Clients.Graphql(userInfo.dataValues.shopify_domain, userInfo.dataValues.shopify_access_token);
        const data = await client.query({
          data: `query {
            product(id: "${product_id}") {
              title
              description
              onlineStoreUrl
              variants(first: 10) {
                edges {
                  node {
                    id
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }`,
        });
        products_variants = data.body.data.product
      }
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
    res.status(200).json(products_variants);
}
// const searchProductByTitle = async (req, res) => {
//     var products = null;
//     if (!req.jwtDecoded.data.user_id) {
//         res.status(401).send({
//             message: "Session timeout"
//         });
//         return;
//     }
//     const id = req.jwtDecoded.data.user_id;
//     let limit = 20;
//     if (req.query.limit) {
//         limit = Number(req.query.limit);
//         if (!Number.isInteger(limit)) {
//             res.status(500).send({
//                 message: "Limit need interger type"
//             });
//             return;
//         }
//         limit = Math.abs(limit)
//     }
//     try {
//     if (req.query.title) {
//         req.query.title = req.query.title.replace(/"/g, '\\"')
//         var title = `,query: "title:*${req.query.title}*"`;
//     } else {
//         var title = "";
//     }

//     if (req.query.cursor && req.query.cursor !== "undefined") {
//         var cursor = req.query.cursor
//         var option = ''
//         cursor.indexOf('after') != -1? option = `first: ${limit}, ${title}, ${cursor}`: option = `last: ${limit}, ${title}, ${cursor}`
//     } else {
//         var cursor = "";
//         option = `first: ${limit}, ${title}, ${cursor}`
//     }
//         const userInfo = await User.findByPk(id, {attributes: ['shopify_domain', 'shopify_access_token']});
//         const shopRequestHeaders = {
//             'X-Shopify-Access-Token': userInfo.dataValues.shopify_access_token
//         };

//         const body = {
//             query: `
//                 {
//                     products(${option}) {
//                         edges {
//                             cursor
//                             node {
//                                 id
//                                 handle
//                                 title
//                                 images(first: ${limit}){
//                                     edges{
//                                         node{
//                                             url
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                         pageInfo {
//                             hasNextPage
//                             hasPreviousPage
//                         }
//                     }
//                 }
//             `
//         };
//         const shopRequestUrlLocale = 'https://' + userInfo.dataValues.shopify_domain + '/admin/api/2022-04/graphql.json';
//         await getAllColecttion(userInfo.dataValues.shopify_domain, userInfo.dataValues.shopify_access_token)
//         await request.post(shopRequestUrlLocale, {headers: shopRequestHeaders, json: body})
//             .then(data => {
//                 if(data.data.products){
//                     products = data.data.products
//                 }
//                 else{
//                     products = []
//                 }
//             }).catch(e => {
//                 errorLog.error(e.messages)
//             });

//     } catch (e) {
//         return res.status(e.statusCode || 500).json(e.message);
//     }
//     return res.status(200).json(products);
// }

// const getAllColecttion = async(shop, token) => {
//   const client = new Shopify.Shopify.Clients.Graphql(
//     shop,
//     token,
//   );
//   const data = await client.query({
//     data: `query {
//       collections(first: 5) {
//         edges {
//           node {
//             id
//             title
//             handle
//             updatedAt
//             productsCount
//             sortOrder
//           }
//         }
//       }
//     }`,
//   });
//   console.log(data.body.data.collections.edges)
// }

module.exports = {
    getProductList: productList,
    getProductVariants: getProductVariants
    // searchProductByTitle: searchProductByTitle,
};

