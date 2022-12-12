const request = require('request-promise');
const db = require("../models/index");
const errorLog = require('./log.helper');
const User = db.user;

const apiKey = process.env.SHOPIFY_API_KEY;
const forwardingAddress = process.env.HOST;

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
        const shopRequestUrl = 'https://' + userInfo.dataValues.shopify_domain + '/admin/api/2022-01/products.json';
        const shopUrlCountProduct = 'https://' + userInfo.dataValues.shopify_domain + '/admin/api/2022-04/products/count.json';
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
            console.log("X2Q")
            if(response.headers.link){
                var headerLink = response.headers.link;
                var strArray = headerLink.split(',');
                for (i = 0; i < strArray.length; i++) {
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
            console.log("GGx")
            const state = nonce();
            const redirectUri = forwardingAddress + '/shopify/re-authorize';
            const pageUri = 'https://' + req.query.shop + '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes + '&state=' + state + '&redirect_uri=' + redirectUri;
            console.log("GG1")
            res.cookie('state',state);
            res.redirect(pageUri);
            console.log("GG2")
            errorLog.error(e.messages)
        });

        await request(optionsCount)
        .then(data => {
            console.log("X2Q2")
            countProduct = JSON.parse(data)
        })
        .catch(e => {
            console.log("x12")
                console.log(e)
            errorLog.error(e)
        })
    } catch (e) {
        // return res.status(e.statusCode || 500).json(e.message);
    }
    page.products = products;
    page.paginate = pagination;
    page.count = countProduct;
    // return res.status(200).json(page);
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
    if (req.query.title) {
        req.query.title = req.query.title.replace(/"/g, '\\"')
        var title = `,query: "title:*${req.query.title}*"`;
    } else {
        var title = "";
    }

    if (req.query.cursor && req.query.cursor !== "undefined") {
        var cursor = req.query.cursor
        var option = ''
        cursor.indexOf('after') != -1? option = `first: ${limit}, ${title}, ${cursor}`: option = `last: ${limit}, ${title}, ${cursor}`
    } else {
        var cursor = "";
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
                                images(first: 20){
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
        const shopRequestUrlLocale = 'https://' + userInfo.dataValues.shopify_domain + '/admin/api/2022-01/graphql.json';
        await request.post(shopRequestUrlLocale, {headers: shopRequestHeaders, json: body})
            .then(data => {
                console.log("X2Q3")
                if(data.data.products){
                    products = data.data.products
                }
                else{
                    products = []
                }
            }).catch(e => {
                console.log("x13")
                console.log(e)
                errorLog.error(e.messages)
            });

    } catch (e) {
        return res.status(e.statusCode || 500).json(e.message);
    }
    return res.status(200).json(products);
}

module.exports = {
    getProductList: productList,
    searchProductByTitle: searchProductByTitle
};
