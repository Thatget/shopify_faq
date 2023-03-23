var express = require('express');
var router = express.Router();
const db = require("./../app/models");
const querystring = require('querystring');
const crypto = require('crypto');
const User = db.user;
const accessTokenLife = process.env.JWT_KEY_LIFE;
const accessTokenSecret = process.env.JWT_KEY;
const refreshTokenLife = process.env.REFRESH_JWT_KEY_LIFE;
const refreshTokenSecret = process.env.REFRESH_JWT_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const app_link = process.env.FRONT_END;
const apiKey = process.env.SHOPIFY_API_KEY;

/* GET home page. */
router.get('/',async function(req, res) {
  let user_data
  await User.findOne({
    // attributes:['shopify_domain','id', 'shopify_access_token', 'plan_extra'],
    where: {
      shopify_domain: req.query.shop
    }
  })
  .then(async response => {
    user_data = response.dataValues
    console.log(user_data)
  })
  .catch(e => {
    console.log(e)
  })  
  // if(!req.query.session) {    
  //   if(!req.query.host){
  //     const state = nonce()
  //     const redirectUri = forwardingAddress + '/shopify/callback'
  //     const pageUri = 'https://' + req.query.shop + '/admin/oauth/authorize?client_id=' + apiKey +
  //       '&scope=' + scopes + '&state=' + state + '&redirect_uri=' + redirectUri
  //     // res.cookie('state',state)
  //     res.redirect(pageUri)
  //   }
  //   return res.render('index', {
  //     shop: req.query.shop,
  //     host: req.query.host,
  //     apiKey: apiKey,
  //     scopes: scopes,
  //     forwardingAddress: forwardingAddress
  //   });
  // } else {
  //   let txt = ""
  //   try {
  //     let tokenData = await getToken(req.query)
  //     if (tokenData.accessToken) {
  //       txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken
  //     }
  //   } catch (e){
  //     errorLog.error(e)
  //   }
  //   return res.redirect(app_link + txt ); 
	// }
  let tokenData = await getToken(req.query);
  let txt = "";
  if (tokenData.accessToken) {
      txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
  }
  console.log(txt)
  return res.redirect(app_link + txt ); 
});

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
                let jwtHelper = require("./../app/helpers/jwt.helper");
                let userData = await User.findOne({
                    attributes: [['id', 'user_id'],'email','shopify_domain'],
                    where: { shopify_domain: shop }
                });
                accessToken = await jwtHelper.generateToken(userData.dataValues, accessTokenSecret, accessTokenLife) || '';
                refreshToken = await jwtHelper.generateToken(userData.dataValues, refreshTokenSecret, refreshTokenLife) || '';
            } catch (error) {
                // errorLog.error(`error in login function ${error.message}`);
            }
        }
    }
    return {accessToken, refreshToken};
}

module.exports = router;
