const express = require('express');
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const {DataType} = require("@shopify/shopify-api");

const app = express();

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = process.env.SCOPES;
const forwardingAddress = process.env.HOST;
const port = process.env.PORT;
const app_link = process.env.FRONT_END;
const jwt_key = process.env.JWT_KEY;

const debug = console.log.bind(console);

    app.get('/', (req, res) => {
        const shop = req.query.shop;
        if (shop) {
            const state = nonce();
            const redirectUri = forwardingAddress + '/shopify/page';
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
app.get('/shopify/page', async (req, res) => {
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
                const shopRequestUrl = 'https://' + shop + '/admin/api/2022-01/pages.json';
                const shopRequestHeaders = {
                    'X-Shopify-Access-Token': accessToken
                };
                const page = {
                        page:{
                            title: "Warranty information",
                            body_html: "<!DOCTYPE html><html lang=\"\"><head><meta charset=\"utf-8\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><link rel=\"icon\" href=\"/favicon.ico\"><title>vue-3-crud</title><link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css\"><link href=\"/css/app.eb409764.css\" rel=\"preload\" as=\"style\"><link href=\"/css/chunk-vendors.5d3035bc.css\" rel=\"preload\" as=\"style\"><link href=\"/js/app.77ed4fd2.js\" rel=\"preload\" as=\"script\"><link href=\"/js/chunk-vendors.34b412cc.js\" rel=\"preload\" as=\"script\"><link href=\"/css/chunk-vendors.5d3035bc.css\" rel=\"stylesheet\"><link href=\"/css/app.eb409764.css\" rel=\"stylesheet\"></head><body><noscript><strong>We're sorry but vue-3-crud doesn't work properly without JavaScript enabled. Please enable it to continue.</strong></noscript><div id=\"app\"></div><script src=\"/js/chunk-vendors.34b412cc.js\"></script><script src=\"/js/app.77ed4fd2.js\"></script></body></html>"
                        }
                };

                debug(page);
                await request.post(shopRequestUrl, {headers: shopRequestHeaders, json: page})
                    .then((data) => {
                        debug(data);
                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error);
                    })

            }).catch((error) => {
            res.status(error.statusCode).send(error.error);
        })

    } else {
        res.status(400).send('Required parameters missing')
    }
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
                            email: shopResonse.shop.email,
                            phone: shopResonse.shop.phone
                        };
                         User.create(user).then(data => {
                            const token = jwt.sign({id: data.id},jwt_key,{ expiresIn: '1h' });
                            User.update({
                                shopify_access_token: token
                            }, {
                                where: { id: data.id }
                            })
                                .then(num => {
                                    if (num == 1) {
                                        res.send( "Access token was created.");
                                    } else {
                                        res.send(`Cannot create access Token with id=${id}.`);
                                    }
                                })
                                .catch(err => {
                                    res.status(500).send("Error updating user");
                                });
                        }).catch(err => {
                            res.status(err.code).send(err.error);
                        });
                        res.writeHead(302, {
                            'Location': app_link
                        });
                        res.end();

                    })
                    .catch((error) => {
                        res.status(error.code).send(error.error);
                    })

            }).catch((error) => {
                res.status(error.code).send(error.error)
        })

    } else {
        res.status(400).send('Required parameters missing')
    }
});

// Api

app.listen(port, () => {
    console.log('Example !')
});
