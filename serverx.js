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

const debug = console.log.bind(console);

app.get('/', async (req, res) => {
    debug('x1');
    debug(req.query);
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

app.get('/shopify/vue-page', (req, res) => {
    const { shop, hmac, code, state } = req.query;
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
        request.post(accessTokendRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
                const shopRequestUrl = 'https://' + shop + '/admin/shop.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken
                };
                request.get(shopRequestUrl, {headers: shopRequestHeaders})
                    .then((shopResonse) => {
                        shopResonse = JSON.parse(shopResonse);
                        user = {
                            store_name: shopResonse.shop.name,
                            shopify_domain: shopResonse.shop.domain,
                            shopify_access_token: accessToken,
                            email: shopResonse.shop.email,
                            phone: shopResonse.shop.phone
                        };
                        User.update(user, {
                            where: { shopify_domain: shopResonse.shop.domain, }
                        }).then(data => {
                            console.log('User updated !');
                        }).catch(err => {
                            res.status(err.code).send(err.error);
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(error.code).send(error.error);
                    })

            }).catch((error) => {
            res.status(error.code).send(error.error)
        });

        var redirectUri = forwardingAddress + '/login';
        request.post(redirectUri, { json: user }).then( data => {
            debug(data);
        }).catch();
        res.redirect(app_link + `?shop=${shop}`);
    } else {
        res.status(400).send('Required parameters missing')
    }
    res.end();
});

app.get('/shopify/callback', (req, res) => {
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

        request.post(accessTokendRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                const accessToken = accessTokenResponse.access_token;
                const shopRequestUrl = 'https://' + shop + '/admin/shop.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken
                };

                request.get(shopRequestUrl, {headers: shopRequestHeaders})
                    .then((shopResonse) => {
                        shopResonse = JSON.parse(shopResonse);

                        const user = {
                            store_name: shopResonse.shop.name,
                            shopify_domain: shopResonse.shop.domain,
                            shopify_access_token: accessToken,
                            email: shopResonse.shop.email,
                            phone: shopResonse.shop.phone
                        };
                        User.create(user).then(data => {
                            console.log(data);
                        }).catch(err => {
                            res.status(err.code).send(err.error);
                        });
                        res.redirect(app_link + `?shop=${shop}`);
                        res.end();

                    })
                    .catch((error) => {
                        console.log(error);
                        res.status(error.code).send(error.error);
                    })

            }).catch((error) => {
            res.status(error.code).send(error.error)
        })

    } else {
        res.status(400).send('Required parameters missing')
    }
});

//Api
const initAPIs = require("./app/routes/api");
initAPIs(app);

app.listen(port, () => {
    console.log(`Server runing on port ${port} !`);
});


async function login(user) {

    return new Promise(async function (resolve, reject) {
        debug('fa');
        debug(user);
        debug('af');
        let db = require('./app/models');
        let User = db.user;
        let shopify_access_token = '';
        let jwtHelper = require("./app/helpers/jwt.helper");

        const data = await User.findOne({where: {email: user.email, shopify_domain: user.shopify_domain }});


        const userData = {
            email: data.email,
            shopify_domain: data.shopify_domain,
            shopify_access_token: data.shopify_access_token
        };

        const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);

        const refreshToken = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);

        resolve({
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    })
}