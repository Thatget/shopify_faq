const express = require('express');
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const cookie = require('cookie');
const getRawBody = require("raw-body");
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express();
app.use(bodyParser.json());
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
        var token = '';
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


                        token = await login(user);
                    })
                    .catch((error) => {
                        res.status(error.statusCode).send(error.error);
                    });

            }).catch((error) => {
                res.status(error.statusCode).send(error.error);
            });
    } else {
        res.status(400).send('Required parameters missing');
    }
    res.redirect(app_link + `${token}`);
    res.end();
});


app.listen(8082, () => {
    console.log(`Server runing on port ${port} !`);
});
