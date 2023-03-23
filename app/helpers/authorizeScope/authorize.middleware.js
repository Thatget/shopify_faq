const request = require('request-promise');
const querystring = require('querystring');
const crypto = require('crypto');
const errorLog = require('../log.helper');
const Shopify = require("@shopify/shopify-api");

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;

let fileName = 'autheorize.middleware'
exports.authorizeMiddleware = async (req, res, next) => {
  console.log('authorizeMiddleware')
  const {shop, hmac, code} = req.query;
  if (shop && hmac && code) {
    const map = Object.assign({}, req.query);
    delete map['signature'];
    delete map['hmac'];
    const message = querystring.stringify(map);
    const generateHash = crypto.createHmac('sha256', apiSecret).update(message).digest('hex');

    if (generateHash !== hmac) {
      errorLog.error("Callback HMAC validation failed.")
      return res.status(400).json({
        message: "Callback HMAC validation failed."
      });
    }

    try {
      const accessTokendRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
      const accessTokenPayload = {
        client_id: apiKey,
        client_secret: apiSecret,
        code
      };
      const accessTokenResponse = await request.post(accessTokendRequestUrl, { json: accessTokenPayload });
      req.accessToken = accessTokenResponse.access_token;
    } catch (eror) {
      errorLog.error(`Failed to get shopify access token ${eror.message} in ${fileName}`)
      return res.status(401).json({
        message: "Failed to get shopify access token."
      });
    }
  } else {
    errorLog.error("Callback misssing data")
    return res.status(401).json({
      message: "Callback misssing data."
    });
  }
  next();
}

