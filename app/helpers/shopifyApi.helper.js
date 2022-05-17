const request = require('request-promise');
const db = require("../models/index");
const User = db.user;

const errorLog = require('../helpers/log.helper');

const productList = async (req, res) => {
    const id = req.jwtDecoded.data.user_id;
    try {
        const userInfo = await User.findByPk(id, {attributes: ['shopify_domain', 'shopify_access_token']});

        const shopRequestUrl = 'https://' + userInfo.dataValues.shopify_domain + '/admin/api/2022-01/products.json';
        const shopRequestHeaders = {
            'X-Shopify-Access-Token': userInfo.dataValues.shopify_access_token
        };
        products= await request.get(shopRequestUrl, {headers: shopRequestHeaders});
    } catch (e) {
        return res.status(500).json(e);
    }
    return res.status(200).json({products});
}

module.exports = {
    getProductList: productList
};
