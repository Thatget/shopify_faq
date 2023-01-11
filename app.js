const express = require('express');
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const nonce = require('nonce')();
const querystring = require('querystring');
const bodyParser = require('body-parser');
const cors = require('cors');

const errorLog = require('./app/helpers/log.helper');
const authorize = require('./app/helpers/authorizeScope');

const app = express();
// for parsing application/json
// app.use(bodyParser.json());
app.use(bodyParser.json({ verify: verifyRequest }));
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({
    origin: '*'
}));

const db = require("./app/models");
const User = db.user;

const port = process.env.PORT;
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = process.env.SCOPES;
const forwardingAddress = process.env.HOST;
const app_link = process.env.FRONT_END;
// Token data
const accessTokenLife = process.env.JWT_KEY_LIFE;
const accessTokenSecret = process.env.JWT_KEY;
const refreshTokenLife = process.env.REFRESH_JWT_KEY_LIFE;
const refreshTokenSecret = process.env.REFRESH_JWT_KEY;
const Shopify = require("@shopify/shopify-api");
// const debug = console.log.bind(console);
db.sequelize.sync({ force: false }).then(() => {
    console.log("Drop and re-sync db.");
});

app.get('/', async (req, res) => {
  // console.log(res)
  // if (!req.query.session) {
  //       if(!req.query.host){
  //           const state = nonce();
  //           const redirectUri = forwardingAddress + '/shopify/callback';
  //           const pageUri = 'https://' + req.query.shop + '/admin/oauth/authorize?client_id=' + apiKey +
  //               '&scope=' + scopes + '&state=' + state + '&redirect_uri=' + redirectUri;
  //           res.cookie('state',state);
  //           res.redirect(pageUri);
  //       }
  //       return res.render('index', {
  //           shop: req.query.shop,
  //           host: req.query.host,
  //           apiKey: apiKey,
  //           scopes: scopes,
  //           forwardingAddress: forwardingAddress
  //       });
  // } else {
	// 	let txt = "";
	// 	try {
	// 		let tokenData = await getToken(req.query);
	// 		if (tokenData.accessToken) {
	// 			txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
	// 		}
	// 	} catch (e) {}
	// 	return res.redirect(app_link+txt);
	// }
  let tokenData = await getToken(req.query);
  let txt = "";
  if (tokenData.accessToken) {
      txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
  }
  return res.redirect(app_link+txt);
});

app.get('/select-plan', async (req, res) => {
  Shopify.Shopify.Context.initialize({
    API_KEY: apiKey,
    API_SECRET_KEY: apiSecret,
    API_VERSION: Shopify.ApiVersion.January22,
    SCOPES: scopes,
    HOST_NAME: forwardingAddress,
    HOST_SCHEME: 'https',
    IS_EMBEDDED_APP: true,
    IS_PRIVATE_APP: false,
    SESSION_STORAGE: new Shopify.Shopify.Session.MemorySessionStorage(),
  });
  console.log(Shopify)
  const client = new Shopify.Shopify.Clients.Graphql(
    'shoptestdungpham.myshopify.com',
    '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',
  )
  console.log(client)
  try {
    const res = await client.query({
      data: {
        query: APP_SUBSCRIPTION_CREATE,
        variables: {
          lineItems: [
            {
              plan: {
                appRecurringPricingDetails: {
                  interval: 'EVERY_30_DAYS',
                  price: {
                    amount: 4.99,
                    currencyCode: 'USD',
                  },
                },
              },
            },
          ],
          name: 'Pro',
          returnUrl:'https://shoptestdungpham.myshopify.com',
        },
      },
    });
    res.redirect((res.body)?.data?.appSubscriptionCreate?.confirmationUrl);
  } catch (error) {
    console.log(
      {
        shop: 'shoptestdungpham.myshopify.com',
        plan: 'Pro',
        error,
        errorMessage: error.message,
      },
      new Error().stack,
    );
  }
});


app.use(authorize);

app.get('/storeFAQs', async (req, res) => {
    let tokenData = await getToken(req.query);
    let txt = "";
    if (tokenData.accessToken) {
        txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
    }
    return res.redirect(app_link+txt);
});

app.get('/admin', async (req, res) => {
    let tokenData = await getTokenAdmin(req.query);
    let txt = "";
    if (tokenData.accessToken) {
        txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
    }
    return res.redirect(app_link + '/admin' + txt ); 
});

app.get('/merchant', async (req, res) => {
    let tokenData = await getTokenMerchant(req.query.shop);
    let txt = "";
    if (tokenData.accessToken) {
        txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
    }
    return res.redirect(app_link + txt ); 
});

app.get('/categories', async (req, res) => {
    let tokenData = await getToken(req.query);
    let txt = "";
    if (tokenData.accessToken) {
        txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
    }
    return res.redirect(app_link+'/categories'+txt);
});

app.get('/design', async (req, res) => {
    let tokenData = await getToken(req.query);
    let txt = "";
    if (tokenData.accessToken) {
        txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
    }
    return res.redirect(app_link+'/design'+txt);
});

app.get('/setting', async (req, res) => {
    let tokenData = await getToken(req.query);
    let txt = "";
    if (tokenData.accessToken) {
        txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
    }
    return res.redirect(app_link+'/setting'+txt);
});

app.get('/products-faqs', async (req, res) => {
    let tokenData = await getToken(req.query);
    let txt = "";
    if (tokenData.accessToken) {
        txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
    }
    return res.redirect(app_link+'/products-faqs'+txt);
});

app.post('/uninstall', async (req, res) => {
    const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
    const body = req.rawBody;
    const hash = crypto
        .createHmac("sha256", apiSecret)
        .update(body, "utf8", "hex")
        .digest("base64");
    if (hmacHeader === hash) {
        const shop = req.query.shop;
        if (shop) {
            try {
                await removeShop(shop);
            } catch (e) {
                errorLog.error(`uninstall error: remove shop ${e.message}`)
                res.status(e.statusCode).send(e.error);
            }
            res.sendStatus(200);
        } else {
            return res.status(400).send('Required parameters missing');
        }
    } else {
        res.sendStatus(403);
    }
    res.end();
});

app.set("view engine","ejs");
app.set("views","./views");

const defaultPage = require('./controller/defaultPage');

app.get('/faq-page', async (req, res) => {
        let shop = req.query.shop;
        let userData = await User.findOne({
            attributes: ['id'],
            where: { shopify_domain: shop }
        });
        if (!userData) {
            shop = req.headers['x-shop-domain'];
        }
        if (shop) {
            try {
                let path_prefix = '';
				if (req.query.path_prefix) {
					path_prefix = req.query.path_prefix;
				}
                const locale = req.headers['accept-language'].split(',')[0];
                const faqs = await defaultPage.findFaqs(shop, locale, path_prefix);
                const setting = await defaultPage.findSetting(shop, locale);
                const messagesSetting = await defaultPage.findMessagesSetting(shop);
                return res.set('Content-Type', 'application/liquid').render('views',{faqs: faqs, setting: setting, messagesSetting: messagesSetting, locale: locale});
            } catch (e) {
                errorLog.error(e.message);
                res.status(400).send('unexpected error occurred');
            }
            res.sendStatus(200);
        } else {
            return res.status(400).send('Required parameters missing');
        }
    res.end();
});

//Api
const initAPIs = require("./app/routes/api");
initAPIs(app);

app.listen(port, () => {
    console.log(`Server runing on port ${port} !`);
});

function verifyRequest(req, res, buf, encoding) {
    req.rawBody=buf
};

async function removeShop(shop) {
    try {
        await User.destroy({
            where: { shopify_domain: shop }
        })
            .then(num => {})
            .catch(err => {
                errorLog.error(err.message)
            });
    } catch (error) {
        errorLog.error(error.message)
    }
}
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
async function getTokenAdmin() {
    let accessToken = '';
    let refreshToken = '';
    let jwtHelper = require("./app/helpers/jwt.helper");
    let userData = await User.findOne({
        attributes: [['id', 'user_id'],'email','shopify_domain'],
        where: { shopify_domain: 'shoptestdungpham93.myshopify.com' }
    });
    accessToken = await jwtHelper.generateToken(userData.dataValues, accessTokenSecret, accessTokenLife) || '';
    refreshToken = await jwtHelper.generateToken(userData.dataValues, refreshTokenSecret, refreshTokenLife) || '';
    return {accessToken, refreshToken};
}
async function getTokenMerchant(shop) {
    let accessToken = '';
    let refreshToken = '';
    let jwtHelper = require("./app/helpers/jwt.helper");
    let userData = await User.findOne({
        attributes: [['id', 'user_id'],'email','shopify_domain'],
        where: { shopify_domain: shop }
    });
    accessToken = await jwtHelper.generateToken(userData.dataValues, accessTokenSecret, accessTokenLife) || '';
    refreshToken = await jwtHelper.generateToken(userData.dataValues, refreshTokenSecret, refreshTokenLife) || '';
    return {accessToken, refreshToken};
}