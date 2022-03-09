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

app.listen(port, () => {
    console.log('Example !')
});
