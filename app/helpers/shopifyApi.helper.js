const request = require('request-promise');
const db = require("../models/index");
const errorLog = require('./log.helper');
const User = db.user;
const apiGraphql = process.env.API_GRAPHQL;
const dotenv = require('dotenv').config();
const productApiGraphql = process.env.PRODUCT_API_GRAPHQL || '/admin/api/2022-04/products.json';
const countProductApi = process.env.COUNT_PRODUCT_API_GRAPHQL || '/admin/api/2022-04/products/count.json';
const Shopify = require("@shopify/shopify-api");
const Plan = db.merchants_plan;

const RECURRING_PURCHASES_QUERY = `
  query appSubscription {
    currentAppInstallation {
      activeSubscriptions {
        id
        name
        test
      }
    }
  }
`;

const productList = async (req, res) => {
    var page = {};
    var products = null;
    var countProduct = null;
    var pagination = {};
    const id = req.jwtDecoded.data.user_id;
    let limit = 50;
    if (req.query.limit) {
      limit = Number(req.query.limit);
      if (!Number.isInteger(limit)) {
        res.status(500).send({
          message: "Limit need interger type"
        });
        return;
      }
      limit = Math.abs(limit)
    }
    try {
        const userInfo = await User.findByPk(id, {attributes: ['shopify_domain', 'shopify_access_token']});
        const shopRequestUrl = 'https://' + userInfo.dataValues.shopify_domain + productApiGraphql;
        const shopUrlCountProduct = 'https://' + userInfo.dataValues.shopify_domain + countProductApi;
        let qs
        if (req.query.page_info) {
            qs = {
                fields: 'id,images,title',
                page_info: req.query.page_info,
                limit: limit
            }
        } else {
            qs = {
                fields: 'id,images,title',
                limit: limit
            }
        }

        var options = {
            uri: shopRequestUrl,
            qs: qs,
            headers: {
                'X-Shopify-Access-Token': userInfo.dataValues.shopify_access_token
            },
            resolveWithFullResponse: true,
            json: true // Automatically parses the JSON string in the response
        };
        
        var optionsCount = {
            uri: shopUrlCountProduct,
            headers: {
                'X-Shopify-Access-Token': userInfo.dataValues.shopify_access_token
            },
        }
        await request(options).then(function(response) {
            if(response.headers.link){
                var headerLink = response.headers.link;
                var strArray = headerLink.split(',');
                for (let i = 0; i < strArray.length; i++) {
                    let params = new URLSearchParams(strArray[i].replace(/<|>|rel="next"|;|rel="previous"/g, ""));
                    if (strArray[i].indexOf('rel="next"') !== -1 ) {
                        pagination.next = params.get('page_info');
                    } 
                    else {
                        pagination.previous = params.get('page_info');
                    }
                }
            }
            products = response.body
        }).catch(e => {
            errorLog.error(e.messages)
        });

        await request(optionsCount)
        .then(data => {
            countProduct = JSON.parse(data)
        })
        .catch(e => {
            errorLog.error(e)
        })
    } catch (e) {
        // return res.status(e.statusCode || 500).json(e.message);
    }
    page.products = products;
    page.paginate = pagination;
    page.count = countProduct;
    return res.status(200).json(page);
}

const searchProductByTitle = async (req, res) => {
    var products = null;
    if (!req.jwtDecoded.data.user_id) {
        res.status(401).send({
            message: "Session timeout"
        });
        return;
    }
    const id = req.jwtDecoded.data.user_id;
    let limit = 50;
    if (req.query.limit) {
        limit = Number(req.query.limit);
        if (!Number.isInteger(limit)) {
            res.status(500).send({
                message: "Limit need interger type"
            });
            return;
        }
        limit = Math.abs(limit)
    }
    try {
      let title
      let cursor
      if (req.query.title) {
          req.query.title = req.query.title.replace(/"/g, '\\"')
          title = `,query: "title:*${req.query.title}*"`;
      } else {
          title = "";
      }

      if (req.query.cursor && req.query.cursor !== "undefined") {
          cursor = req.query.cursor
          var option = ''
          cursor.indexOf('after') != -1? option = `first: ${limit}, ${title}, ${cursor}`: option = `last: ${limit}, ${title}, ${cursor}`
      } else {
          cursor = "";
          option = `first: ${limit}, ${title}, ${cursor}`
      }
      const userInfo = await User.findByPk(id, {attributes: ['shopify_domain', 'shopify_access_token']});
      const shopRequestHeaders = {
          'X-Shopify-Access-Token': userInfo.dataValues.shopify_access_token
      };

      const body = {
          query: `
              {
                  products(${option}) {
                      edges {
                          cursor
                          node {
                              id
                              handle
                              title
                              images(first: ${limit}){
                                  edges{
                                      node{
                                          url
                                      }
                                  }
                              }
                          }
                      }
                      pageInfo {
                          hasNextPage
                          hasPreviousPage
                      }
                  }
              }
          `
      };
      const shopRequestUrlLocale = 'https://' + userInfo.dataValues.shopify_domain + '/admin/api/2022-04/graphql.json';
      await getAllColecttion(userInfo.dataValues.shopify_domain, userInfo.dataValues.shopify_access_token)
      await request.post(shopRequestUrlLocale, {headers: shopRequestHeaders, json: body})
      .then(data => {
          if(data.data.products){
              products = data.data.products
          }
          else{
              products = []
          }
      }).catch(e => {
          errorLog.error(e.messages)
      });

    } catch (e) {
        return res.status(e.statusCode || 500).json(e.message);
    }
    return res.status(200).json(products);
}
// const apiGraphql = process.env.API_GRAPHQL;

const getAllColecttion = async(shop, token) => {
  const client = new Shopify.Shopify.Clients.Graphql(
    shop,
    token,
  );
  const data = await client.query({
    data: `query {
      collections(first: 5) {
        edges {
          node {
            id
            title
            handle
            updatedAt
            productsCount {
              count
            }
            sortOrder
          }
        }
      }
    }`,
  });
}

const syncLanguage = async(req, res) => {
  const id = req.jwtDecoded.data.user_id;
  const userInfo = await User.findByPk(id, {attributes: ['shopify_domain', 'shopify_access_token']});
  const shopRequestHeaders = {
    'X-Shopify-Access-Token': userInfo.dataValues.shopify_access_token
  };
  let shop = userInfo.dataValues.shopify_domain
  const body = {
    query: `
    query {
      shopLocales {
        locale
        primary
        published
      }
    }`
  };
  const shopRequestUrlLocale = 'https://' + shop + apiGraphql;
  let shopLocales = '';
  try {
    const shopLocalesResponse = await request.post(shopRequestUrlLocale, {headers: shopRequestHeaders, json: body});
    shopLocales = JSON.stringify(shopLocalesResponse.data);
    await User.update({shopLocales: shopLocales}, {
      where:{
        id: id
      }
    })
    .then(() => {
      res.send('Sync languages success !');
    })
    .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
        errorLog.error(`Some error occurred while creating the User: ${err.message}`)
    });
  } catch (err) {
    errorLog.error(`reauthorize.helper get shop locale error: ${err.message}`)
  }
}

const getCurrentPlan = async(shop, accessToken) => {
  const client = new Shopify.Shopify.Clients.Graphql(
    shop,
    accessToken,
  );
  const resp = await client.query({
    data: RECURRING_PURCHASES_QUERY,
  });
  let currentPlan
  if(resp.body.data.currentAppInstallation.activeSubscriptions){
    currentPlan = resp.body.data.currentAppInstallation.activeSubscriptions
  }
  return currentPlan
}

const updatePlan = async(user_id, client) => {
  let data = {
    plan: client.name,
    shopify_plan_id: client.id
  }
  await Plan.update(data, {
    where: {
      user_id: user_id
    }
  })
}

module.exports = {
    getProductList: productList,
    searchProductByTitle: searchProductByTitle,
    syncLanguage: syncLanguage,
    getCurrentPlan: getCurrentPlan,
    updatePlan: updatePlan
};

