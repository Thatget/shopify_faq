const express = require('express');
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const cookie = require('cookie');
const app = express();

const port = process.env.PORT;
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = process.env.SCOPES
const forwardingAddress = process.env.HOST;
const app_link = process.env.FRONT_END;

app.get('/', (req, res) => {
    const state = nonce();
    const redirectUri = forwardingAddress + '/shopify/vue-page';
    const pageUri = 'https://' + 'checktestdevelopstore.myshopify.com' +
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
                        const db = require("./app/models");
                        const User = db.user;
                        const user = {
                            store_name: shopResonse.shop.name,
                            shopify_domain: shopResonse.shop.domain,
                            shopify_access_token: accessToken,
                            email: shopResonse.shop.email,
                            phone: shopResonse.shop.phone
                        }
                        User.update(user, {
                            where: { shopify_domain: shopResonse.shop.domain, }
                        }).then(data => {
                            console.log(accessToken);
                            console.log('updated !');
                        }).catch(err => {
                            res.status(err.code).send(err.error);
                        });
                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(error.code).send(error.error);
                    })

            }).catch((error) => {
            res.status(error.code).send(error.error)
        })
        res.redirect(app_link + `?shopify_domain=${shop}`);
    } else {
        res.status(400).send('Required parameters missing')
    }
    res.end();
});
app.get('/shopify', (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/shopify/callback';
        const installUrl = 'https://' + shop +
            '/admin/oauth/authorize?client_id=' + apiKey +
            '&scope=' + scopes +
            '&state=' + state +
            '&redirect_uri=' + redirectUri;
        res.cookie('state',state);
        res.redirect(installUrl);
    } else {
        return res.status(400).send('Missing shop parameter')
    }
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

                        const db = require("./app/models");
                        const User = db.user;
                        const user = {
                            store_name: shopResonse.shop.name,
                            shopify_domain: shopResonse.shop.domain,
                            shopify_access_token: accessToken,
                            email: shopResonse.shop.email,
                            phone: shopResonse.shop.phone
                        }
                        User.create(user).then(data => {
                            console.log(data);
                        }).catch(err => {
                            res.status(err.code).send(err.error);
                        });
                        res.writeHead(302, {
                            'Location': app_link
                        });
                        res.end();

                    })
                    .catch((error) => {
                        console.log(error)
                        res.status(error.code).send(error.error);
                    })

            }).catch((error) => {
            res.status(error.code).send(error.error)
        })

    } else {
        res.status(400).send('Required parameters missing')
    }
})

//Api
const initAPIs = require("./app/routes/api");
initAPIs(app);

app.listen(port, () => {
    console.log('Exmple !')
});
