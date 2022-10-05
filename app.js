const express = require('express');
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const cookie = require('cookie');
const bodyParser = require('body-parser');
const cors = require('cors');

const errorLog = require('./app/helpers/log.helper');

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

// const debug = console.log.bind(console);
db.sequelize.sync({ force: false }).then(() => {
    console.log("Drop and re-sync db.");
});

app.get('/', async (req, res) => {
    if (req.query.shop) {
        if(!req.query.host){
            const state = nonce();
            const redirectUri = forwardingAddress + '/shopify/callback';
            const pageUri = 'https://' + req.query.shop + '/admin/oauth/authorize?client_id=' + apiKey +
                '&scope=' + scopes + '&state=' + state + '&redirect_uri=' + redirectUri;
            res.cookie('state',state);
            res.redirect(pageUri);
        }
        return  res.render('index', {
            shop: req.query.shop,
            host: req.query.host,
            apiKey: apiKey,
            scopes: scopes,
            forwardingAddress: forwardingAddress
        });
    }
    else{
        return res.redirect(app_link);
    }
});

app.get('/storeFAQs', async (req, res) => {
    let tokenData = await getToken(req.query);
    let txt = "";
    if (tokenData.accessToken) {
        txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
    }
    return res.redirect(app_link+txt);
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

app.get('/shopify/callback', async (req, res) => {
    const {shop, hmac, code} = req.query;

    if (shop && hmac && code) {
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const generateHash = crypto.createHmac('sha256', apiSecret)
            .update(message)
            .digest('hex');

        if (generateHash !== hmac) {
            return res.status(400).send('HMAC validation failed');
        }

        const accessTokendRequestUrl = 'https://' + shop +
            '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code
        };

        await request.post(accessTokendRequestUrl, { json: accessTokenPayload })
            .then( async (accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
                global.accessToken = accessToken;
                const shopRequestUrl = 'https://' + shop + '/admin/shop.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken
                };
                await request.get(shopRequestUrl, {headers: shopRequestHeaders})
                    .then( async (shopResonse) => {
                        let shopLocales = '';
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
                        const shopRequestUrlLocale = 'https://' + shop + process.env.API_GRAPHQL;
                        await request.post(shopRequestUrlLocale, {headers: shopRequestHeaders, json: body})
                            .then(data => {
                                shopLocales = JSON.stringify(data.data);
                            }).catch(e => {
                                errorLog.error(`get shop locale: ${error.message}`)
                            });
                            
                        shopResonse = JSON.parse(shopResonse);
                        const user = {
                            store_name: shopResonse.shop.name,
                            shopify_domain: shopResonse.shop.myshopify_domain,
                            shopify_access_token: accessToken,
                            email: shopResonse.shop.email,
                            phone: shopResonse.shop.phone,
                            shopLocales: shopLocales,
                        };
                        await User.findOne({where: {shopify_domain: user.shopify_domain }}).
                        then( async data =>{
                            if (data) {
                                await User.update(user, {
                                    where: { shopify_domain: user.shopify_domain, }
                                }).then(data => {
                                }).catch(err => {
                                    errorLog.error(`user update error ${err.message}`)
                                });                         
                            } else {
                                await User.create(user).then(data => {
                                }).catch(err => {
                                    errorLog.error(`user created error: ${err.message}`);
                                });
                                const shopRequestUrlWebhook = 'https://' + shop + '/admin/api/2022-01/webhooks.json';
                                const webhook = {
                                    webhook : {
                                        topic: "app/uninstalled",
                                        address: `${forwardingAddress}/uninstall?shop=${shop}`,
                                        format: "json",
                                    }
                                };
                                await request.post(shopRequestUrlWebhook, {headers: shopRequestHeaders, json: webhook})
                                    .then((data) => {
                                    })
                                    .catch((error) => {
                                        errorLog.error(`webhook create: ${error.message}`)
                                    });
                            }
                        });
                    })
                    .catch((error) => {
                        errorLog.error(`user get shop data: error ${error.message}`)
                    });
            }).catch((error) => {
                errorLog.error(`get data api error: ${error.message}`)
            });
    } else {
        errorLog.error("app.js callback misssing data")
        return res.redirect(app_link);
    }
    let pageUri = 'https://' + req.query.shop + '/admin/apps/' + apiKey + '/storeFAQs';
    res.redirect(pageUri);
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
    
    // const query_signature = req.query.signature;
    // const sorted_params = "path_prefix="+req.query.path_prefix+"shop="+req.query.shop+"timestamp="+req.query.timestamp;
    // const generateHash = crypto.createHmac('sha256', apiSecret)
    //     .update(sorted_params)
    //     .digest('hex');
    // if (query_signature === generateHash) {
        // const shop = req.query.shop;
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
                return res.set('Content-Type', 'application/liquid').render('views',{faqs: faqs, setting: setting, messagesSetting: messagesSetting});
            } catch (e) {
                errorLog.error(e.message);
                res.status(400).send('unexpected error occurred');
            }
            res.sendStatus(200);
        } else {
            return res.status(400).send('Required parameters missing');
        }
    // } 
    // else {
    //     res.sendStatus(403);
    // }
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