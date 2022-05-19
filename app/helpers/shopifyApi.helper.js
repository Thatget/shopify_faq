const request = require('request-promise');
const db = require("../models/index");
const User = db.user;

const productList = async (req, res) => {
    const id = req.jwtDecoded.data.user_id;
    let limit = Number(req.query.limit);
    if (!Number.isInteger(limit)) {
        res.status(500).send({
            message: "Limit need interger type"
        });
        return;
    }
    limit = Math.abs(limit)
    try {
        const userInfo = await User.findByPk(id, {attributes: ['shopify_domain', 'shopify_access_token']});

        const shopRequestUrl = 'https://' + userInfo.dataValues.shopify_domain + '/admin/api/2022-01/products.json';

        var options = {
            uri: shopRequestUrl,
            qs: {
                limit: limit // -> uri + '?access_token=xxxxx%20xxxxx'
            },
            headers: {
                'X-Shopify-Access-Token': userInfo.dataValues.shopify_access_token
            },
            json: true // Automatically parses the JSON string in the response
        };

        products = await request(options)
    } catch (e) {
        return res.status(500).json(e);
    }
    return res.status(200).json({products});
}

module.exports = {
    getProductList: productList
};
