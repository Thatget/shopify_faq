const accessTokenLife = process.env.JWT_KEY_LIFE;
const accessTokenSecret = process.env.JWT_KEY;
const refreshTokenLife = process.env.REFRESH_JWT_KEY_LIFE;
const refreshTokenSecret = process.env.REFRESH_JWT_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const errorLog = require('../helpers/log.helper');
const querystring = require('querystring');
const db = require("./app/models");
const User = db.user;

async function getToken(query) {
  let accessToken = '';
  let refreshToken = '';
  const {shop, hmac} = query;
  if (shop && hmac ) {
    const map = Object.assign({}, query);
    delete map['signature'];
    delete map['hmac'];
    const message = querystring.stringify(map);
    const generateHash = crypto.createHmac('sha256', apiSecret)
      .update(message)
      .digest('hex');

    if (generateHash === hmac) {
      try {
          let jwtHelper = require("./app/helpers/jwt.helper");
          let userData = await User.findOne({
            attributes: [['id', 'user_id'],'email','shopify_domain'],
            where: { shopify_domain: shop }
          });
          accessToken = await jwtHelper.generateToken(userData.dataValues, accessTokenSecret, accessTokenLife) || '';
          refreshToken = await jwtHelper.generateToken(userData.dataValues, refreshTokenSecret, refreshTokenLife) || '';
        } catch (error) {
          errorLog.error(`error in login function ${error.message}`);
        }
      }
    }
    return {accessToken, refreshToken};
  }

exports.module = getToken
