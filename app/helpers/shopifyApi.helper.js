const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const errorLog = require('../helpers/log.helper');

const accessTokenPayload = {
    client_id: apiKey,
    client_secret: apiSecret,
    code
};

const productList = async (req, res) => {
    const shop = req.params.shop;
    const accessTokendRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
    await request.post(accessTokendRequestUrl, { json: accessTokenPayload })
        .then( async (accessTokenResponse) => {
            const accessToken = accessTokenResponse.access_token;
            const shopRequestUrl = 'https://' + shop + '/admin/api/2022-01/products.json';
            const shopRequestHeaders = {
                'X-Shopify-Access-Token': accessToken
            };
            await request.get(shopRequestUrl, {headers: shopRequestHeaders})
                .then( async (shopResonse) => {
                    console.log(shopResonse)
                    console.log('end line')
                    console.log(JSON.parse(shopResonse))

                })
                .catch((error) => {
                    errorLog.error(`get product list: ${error.message}`)});
        }).catch((e) => {
            errorLog.error(`get access token in product list: ${e.message}`)
        });
    return res.status(200).json({accessToken, refreshToken});
    return res.status(500).json(error);
}

module.exports = {
    getProductList: productList
};
