const request = require('request-promise');
const db = require("../models/index");
const User = db.user;

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
                limit: limit // -> uri + '?access_token=xxxxx%20xxxxx'
            }
        } else {
            qs = {
                fields: 'id,images,title',
                limit: limit // -> uri + '?access_token=xxxxx%20xxxxx'
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
        });

        await request(optionsCount)
        .then(data => {
            countProduct = JSON.parse(data)
        })
        .catch(e => {
            console.log(e)
        })
    } catch (e) {
        return res.status(e.statusCode || 500).json(e.message);
    }
    page.products = products;
    page.paginate = pagination;
    page.count = countProduct;
    return res.status(200).json(page);
}

module.exports = {
    getProductList: productList
};

