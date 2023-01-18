const express = require('express');
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const nonce = require('nonce')();
const querystring = require('querystring');
const bodyParser = require('body-parser');
const cors = require('cors');
const APP_SUBSCRIPTION_CREATE = `mutation createAppSubscription(
  $lineItems: [AppSubscriptionLineItemInput!]!
  $name: String!
  $returnUrl: URL!
  $test: Boolean = false
  $trialDays: Int
) {
  appSubscriptionCreate(
    lineItems: $lineItems
    name: $name
    returnUrl: $returnUrl
    test: $test
    trialDays: $trialDays
  ) {
    appSubscription {
      id
      lineItems {
        id
        plan {
          pricingDetails {
            __typename
          }
        }
      }
    }
    confirmationUrl
    userErrors {
      field
      message
    }
  }
}`

const APP_SUBSCRIPTION_CANCEL = `
  mutation AppSubscriptionCancel($id: ID!) {
    appSubscriptionCancel(id: $id) {
      userErrors {
        field
        message
      }
      appSubscription {
        id
        status
      }
    }
  }`

const RECURRING_PURCHASES_QUERY = `
  query appSubscription {
    currentAppInstallation {
      activeSubscriptions {
        id
        name
        test
      }
    }
  }
`;

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
const Plan = db.merchants_plan;
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
    console.log("Drop and re-sync db.")
});

var host
var shopAccessToken
var shopRefreshToken

app.get('/', async (req, res) => {
  let plan
  if(req.query.host){
    host = req.query.host
  }
  await User.findOne({
    attributes:['shopify_domain','id', 'shopify_access_token'],
    where: {
      shopify_domain: req.query.shop
    }
  })
  .then(async response => {
    let query = {
      shop: response.dataValues.shopify_domain,
      accessToken: response.dataValues.shopify_access_token,
      user_id: response.dataValues.id
    }
    const client = new Shopify.Shopify.Clients.Graphql(
      query.shop,
      query.accessToken,
    );
    const resp = await client.query({
      data: RECURRING_PURCHASES_QUERY,
    });
    let currentPlan
    if(resp.body.data.currentAppInstallation.activeSubscriptions){
      currentPlan = resp.body.data.currentAppInstallation.activeSubscriptions
    }
    errorLog.error(`get Current Plan:  ${currentPlan}`)
    if(currentPlan.length > 0){
      plan = await checkBilling(query)
      if(plan.plan !== currentPlan[0].name){
        await updatePlan(query, currentPlan[0])
      }
    }
    else{
      let data = {
        plan: 'Free',
        shopify_plan_id: ''
      }    
      await Plan.update(data, {
        where: {
          user_id: response.dataValues.id
        }
      })    
    }
  })
  .catch(e => {
    console.log(e)
  })
  if (!req.query.session) {
    if(!req.query.host){
      const state = nonce()
      const redirectUri = forwardingAddress + '/shopify/callback'
      const pageUri = 'https://' + req.query.shop + '/admin/oauth/authorize?client_id=' + apiKey +
        '&scope=' + scopes + '&state=' + state + '&redirect_uri=' + redirectUri
      res.cookie('state',state)
      res.redirect(pageUri)
    }
    return res.render('index', {
      shop: req.query.shop,
      host: req.query.host,
      apiKey: apiKey,
      scopes: scopes,
      forwardingAddress: forwardingAddress
    });
  } else {
		let txt = ""
		try {
			let tokenData = await getToken(req.query)
			if (tokenData.accessToken) {
				txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken
			}
		} catch (e){
      errorLog.error(e)
    }
		return res.redirect(app_link + txt)
	}
  // let tokenData = await getToken(req.query);
  // let txt = "";
  // if (tokenData.accessToken) {
  //     txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
  // }
  // return res.redirect(app_link + txt ); 
});

async function checkBilling(query) {
  let plan
  await Plan.findOne({
      attributes:['plan','id'],
      where: {
        user_id: query.user_id
      }
    })
    .then(data => {
      plan = data.dataValues
    })
    .catch(err => {
      errorLog.error(err)
    });
  return plan
}

async function updatePlan(query, client){
  let data = {
    plan: client.name,
    shopify_plan_id: client.id
  }
  await Plan.update(data, {
    where: {
      user_id: query.user_id
    }
  })
}

app.use(authorize);

app.get('/storeFAQs', async (req, res) => {
    let tokenData = await getToken(req.query);
    let txt = "";
    if (tokenData.accessToken) {
        txt = '?accessToken=' + tokenData.accessToken + '&refreshToken=' + tokenData.refreshToken;
    }
    return res.redirect(app_link+txt);
});
app.set("appSupcription","./views");

var linkApproveSupcription

app.get('/select/plan', async (req, res) => {
  errorLog.error(req.query)
  if(req.query.price != '0' && req.query.plan != 'Free'){
    if(req.query.redirect == 'true' && linkApproveSupcription){
      return res.render('appSupcription', {
        shop: req.query.shop,
        host: host,
        apiKey: apiKey,
        scopes: scopes,
        forwardingAddress: linkApproveSupcription
      });
    }
    else{
      linkApproveSupcription = await getlinkApproveSupcription(req.query)
    }
  }
  if(req.query.price == '0' && req.query.plan == 'Free'){
    await Plan.update({
      plan: 'Free'
    }, {
      where: {
        shopify_plan_id: req.query.shopify_plan_id
      }
    })
    .then(async() => {
      return res.redirect(app_link+'?accessToken=' + shopAccessToken + '&refreshToken=' + shopRefreshToken);  
    })      
  }
  if(req.query.price == '0' && req.query.plan == 'Pro'){
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
    let query = {
      shop: req.query.shop,
      accessToken: req.query.accessToken,
    }
    const client = new Shopify.Shopify.Clients.Graphql(
      query.shop,
      query.accessToken,
    );
    const session = await client.query({
      data: {
        query : APP_SUBSCRIPTION_CANCEL,
        variables: {
          id : req.query.shopify_plan_id
        },
      },
    }); 
    console.log(session.body.data.appSubscriptionCancel) 
    if(session.body.data.appSubscriptionCancel.appSubscription.status === 'CANCELLED'){
      await Plan.update({
        plan: 'Free'
      }, {
        where: {
          shopify_plan_id: req.query.shopify_plan_id
        }
      })      
    }
  }
});

async function getlinkApproveSupcription(query) {
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
  const hasSubscription = await getCurrentSubscription(query);
  if(!hasSubscription){
    const client = new Shopify.Shopify.Clients.Graphql(
      query.shop,
      query.accessToken,
    )
    errorLog.error(client, 'client')
    try {
      const session = await client.query({
        data: {
          query: APP_SUBSCRIPTION_CREATE,
          variables: {
            lineItems: [
              {
                plan: {
                  appRecurringPricingDetails: {
                    interval: 'EVERY_30_DAYS',
                    price: {
                      amount: query.price,
                      currencyCode: 'USD',
                    },
                  },
                },
              },
            ],
            name: `${query.plan}`,
            returnUrl:`https://${query.shop}/admin/apps/${process.env.SHOPIFY_APP_NAME}`,
            test: true
          },
        },
      });
      errorLog.error(session.body)
      if(session.body.data.appSubscriptionCreate.confirmationUrl){
        return session.body.data.appSubscriptionCreate.confirmationUrl
      }
      else{
        errorLog.error('getlinkApproveSupcription error')
      }
    } catch (error) {
      errorLog.error(
        {
          shop: query.shop,
          plan: query.plan,
          error,
          errorMessage: error.message,
        },
        new Error().stack,
      );
    }
  }
}

async function getCurrentSubscription(query) {
  const subscriptions = await getActiveSubscriptions(query);
  return (subscriptions || []).find(
    (subscription) => subscription.name === query.plan,
  );
}

async function getActiveSubscriptions(query) {
  const client = new Shopify.Shopify.Clients.Graphql(
    query.shop,
    query.accessToken,
  );

  const res = await client.query({
    data: RECURRING_PURCHASES_QUERY,
  });
  if(res.body.data.currentAppInstallation.activeSubscriptions){
    return res.body.data.currentAppInstallation.activeSubscriptions;
  }
  else{
    errorLog.error('getActiveSubscriptions error')
  }
}


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
  console.log(req.query)
        let shop = req.query.shop;
        let shopify_access_token
        let Plan
        let userData = await User.findOne({
            attributes: ['id', 'shopify_access_token'],
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
				}      shopify_access_token = userData.shopify_access_token
                const client = new Shopify.Shopify.Clients.Graphql(
                  shop,
                  shopify_access_token,
                );
                const resp = await client.query({
                  data: RECURRING_PURCHASES_QUERY,
                });
                let currentPlan
                if(resp.body.data.currentAppInstallation.activeSubscriptions){
                  currentPlan = resp.body.data.currentAppInstallation.activeSubscriptions
                }
                if(currentPlan.length > 0){
                  Plan = currentPlan[0].name
                }
                else{
                  Plan = 'Free'
                }
                const locale = req.headers['accept-language'].split(',')[0];
                const faqs = await defaultPage.findFaqs(shop, locale, path_prefix, Plan);
                const setting = await defaultPage.findSetting(shop, locale, Plan);
                const messagesSetting = await defaultPage.findMessagesSetting(shop, Plan);
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
    shopAccessToken = accessToken
    shopRefreshToken = refreshToken
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