const express = require('express');
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const cookie = require('cookie');
const app = express();

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

app.get('/', async (req, res) => {
    var isInstalled;
    await User.findAll({where: {shopify_domain: req.query.shop}})
        .then(data => {
            isInstalled = data.length;
        })
        .catch(err => {
            debug(err);
        });
    const state = nonce();
    var redirectUri = forwardingAddress + '/shopify/vue-page';
    if (!isInstalled) {
        redirectUri = forwardingAddress + '/shopify/callback';
    }
    const pageUri = 'https://' + req.query.shop +
        '/admin/oauth/authorize?client_id=' + apiKey +
        '&scope=' + scopes +
        '&state=' + state +
        '&redirect_uri=' + redirectUri;
    res.cookie('state',state);
    res.redirect(pageUri);
});

app.get('/shopify/vue-page', async (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }

    if (shop && hmac && code) {
        const map = Object.assign({}, req.query);
        var user;
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
            .then(async (accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
                const shopRequestUrl = 'https://' + shop + '/admin/shop.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken
                };
                await request.get(shopRequestUrl, {headers: shopRequestHeaders})
                    .then(async (shopResonse) => {
                        shopResonse = JSON.parse(shopResonse);
                        user = {
                            store_name: shopResonse.shop.name,
                            shopify_domain: shopResonse.shop.domain,
                            shopify_access_token: accessToken,
                            email: shopResonse.shop.email,
                            phone: shopResonse.shop.phone
                        };
                        await User.update(user, {
                            where: { shopify_domain: shopResonse.shop.domain, }
                        }).then(data => {
                            console.log('User updated !');
                        }).catch(err => {
                            res.status(err.statusCode).send(err.error);
                        });
                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error);
                    })

            }).catch((error) => {
                res.status(error.statusCode).send(error.error);
            });

        let token = await login(user);
        res.redirect(app_link + `${token}`);
    } else {
        res.status(400).send('Required parameters missing')
    }
    res.end();
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

        const webhook = {
            webhook : {
                topic: "app/uninstalled",
                address: `${forwardingAddress}/uninstall`,
                format: "json",
            }
        };

        await request.post(accessTokendRequestUrl, { json: accessTokenPayload })
            .then( async (accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
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
                        await User.create(user).then(data => {
                            debug('User created !');
                        }).catch(err => {
                            res.status(err.code).send(err.error);
                        });
                        let token = await login(user);
                        res.redirect(app_link + `${token}`);
                        res.end();

                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error);
                    })

            }).catch((error) => {
            res.status(error.statusCode).send(error.error);
        });

        await request.post(shopRequestUrl, {headers: shopRequestHeaders, json: webhook})
            .then((data) => {
                debug('create webhook succeeded');
            })
            .catch((error) => {
                res.status(error.statusCode).send(error.error);
            });
    } else {
        res.status(400).send('Required parameters missing');
    }
});

app.post('/uninstall', (req, res) => {
    debug(req)
});

//Api
const initAPIs = require("./app/routes/api");
initAPIs(app);

app.listen(port, () => {
    console.log(`Server runing on port ${port} !`);
});

async function login(user) {
    try {
        let db = require('./app/models');
        let User = db.user;
        let shopify_access_token = '';
        let jwtHelper = require("./app/helpers/jwt.helper");

        await User.findOne({where: {email: user.email, shopify_domain: user.shopify_domain }})
            .then(data => {
                shopify_access_token = data.dataValues.shopify_access_token;
            })
            .catch(err => {
                debug(err);
            });
        const userData = {
            email: user.email,
            shopify_domain:user.shopify_domain,
            shopify_access_token:shopify_access_token
        };

        const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);

        const refreshToken = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);

        return '?accessToken=' + accessToken + '&refreshToken' + refreshToken;
    } catch (error) {
        debug(error.message);
    }
}
