const express = require('express');
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const cookie = require('cookie');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// for parsing application/json
// app.use(bodyParser.json());
app.use(bodyParser.json({ verify: verifyRequest }));
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

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

const debug = console.log.bind(console);

db.sequelize.sync({ force: false }).then(() => {
    console.log("Drop and re-sync db.");
});

app.get('/', async (req, res) => {

    if (!req.query.shop ) {
        return res.status(400).send('Required parameters missing');
        res.end();
    }
    const state = nonce();
    const redirectUri = forwardingAddress + '/shopify/callback';
    const pageUri = 'https://' + req.query.shop +
        '/admin/oauth/authorize?client_id=' + apiKey +
        '&scope=' + scopes +
        '&state=' + state +
        '&redirect_uri=' + redirectUri;
    res.cookie('state',state);
    res.redirect(pageUri);
});

app.get('/shopify/callback', async (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }

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
                        shopResonse = JSON.parse(shopResonse);
                        const user = {
                            store_name: shopResonse.shop.name,
                            shopify_domain: shopResonse.shop.domain,
                            shopify_access_token: accessToken,
                            email: shopResonse.shop.email,
                            phone: shopResonse.shop.phone
                        };

                        await User.findOne({where: {shopify_domain: user.shopify_domain }}).
                        then( async data =>{
                            if (data) {
                                await User.update(user, {
                                    where: { shopify_domain: user.shopify_domain, }
                                }).then(data => {
                                    debug('User updated !');
                                }).catch(err => {
                                    res.status(err.code).send(err.error);
                                });
                            } else {
                                await User.create(user).then(data => {
                                    debug('User created !');
                                }).catch(err => {
                                    res.status(err.code).send(err.error);
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
                                        debug('create webhook succeeded');
                                    })
                                    .catch((error) => {
                                    });

                                const shopRequestUrlScripTag = 'https://' + shop + '/admin/api/2022-01/script_tags.json';
                                const script_tag = {
                                    script_tag: {
                                        event: "onload",
                                        src: `${app_link}/js/faq_page_root.js`
                                    }
                                };
                                await request.post(shopRequestUrlScripTag, {headers: shopRequestHeaders, json: script_tag})
                                    .then((data) => {
                                        debug('create scrip_tag root succeeded');
                                    })
                                    .catch( async (error) => {
                                        debug(error)
                                    });
                                const script_tag1 = {
                                    script_tag: {
                                        event: "onload",
                                        src: `${app_link}/js/app.js`
                                    }
                                };
                                await request.post(shopRequestUrlScripTag, {headers: shopRequestHeaders, json: script_tag1})
                                    .then((data) => {
                                        debug('create scrip_tag app succeeded');
                                    })
                                    .catch( async (error) => {
                                        debug(error)
                                    });
                                const script_tag2 = {
                                    script_tag: {
                                        event: "onload",
                                        src: `${app_link}/js/chunk-vendors.js`
                                    }
                                };
                                await request.post(shopRequestUrlScripTag, {headers: shopRequestHeaders, json: script_tag2})
                                    .then((data) => {
                                        debug('create scrip_tag chunk succeeded');
                                    })
                                    .catch( async (error) => {
                                        debug(error)
                                    });
                            }
                        })
                        let token = await login(user);
                        res.redirect(app_link + '/' + `${token}`);
                    })
                    .catch((error) => {
                        debug(error)
                        res.status(error.statusCode).send(error.error);
                    });
            }).catch((error) => {
                debug(error);
                res.status(error.statusCode).send(error.error);
            });
    } else {
        res.status(400).send('Required parameters missing');
    }
    res.end();
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

//Api
const initAPIs = require("./app/routes/api");
initAPIs(app);

app.listen(port, () => {
    console.log(`Server runing on port ${port} !`);
});

function verifyRequest(req, res, buf, encoding) {
    req.rawBody=buf
};

async function login(user) {
    try {
        let shopify_access_token = '';
        let jwtHelper = require("./app/helpers/jwt.helper");
        let userId = null;

        await User.findOne({where: { shopify_domain: user.shopify_domain }})
            .then(async data => {
                shopify_access_token = data.dataValues.shopify_access_token;
                userId = data.dataValues.id;
                const userData = {
                    email: user.email,
                    shopify_domain:user.shopify_domain,
                    user_id: userId
                };

                accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife) || '';
                refreshToken = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife) || '';

            })
            .catch(err => {
                debug(err);
                return null;
            });
    } catch (error) {
        debug(error.message);
        return null;
    }
    return '?accessToken=' + accessToken + '&refreshToken=' + refreshToken;
}

async function removeShop(shop) {
    try {
        await User.destroy({
            where: { shopify_domain: shop }
        })
            .then(num => {})
            .catch(err => {});
    } catch (error) {
        debug(error.message);
    }
}