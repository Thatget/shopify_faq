const express = require('express');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nonce = require('nonce')();
const bodyParser = require('body-parser');
const cors = require('cors');
const serveStatic = require("serve-static");
const errorLog = require('./app/helpers/log.helper');
const getToken = require('./app/helpers/getToken.helper');
require('react-refresh/runtime');
const proxy = require("express-http-proxy");
const { createProxyMiddleware } = require('http-proxy-middleware');

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

const authorize = require('./app/helpers/authorizeScope');
const app = express();

app.use(bodyParser.json({ verify: verifyRequest }));
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors({
    origin: '*'
}));

const db = require("./app/models");
const User = db.user;
const Plan = db.merchants_plan;
const Setting = db.setting;
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = process.env.SCOPES;
const forwardingAddress = process.env.HOST;
const path = require('node:path');
const fs = require('fs');
const app_link = process.env.HOST;

const Shopify = require("@shopify/shopify-api");
db.sequelize.sync({ force: false }).then(() => {
    console.log("Drop and re-sync db.")
});

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({
    path: envPath
  });
}

const PORT = parseInt(
  process.env.PORT || "3000",
  10
);

const STATIC_PATH = process.env.NODE_ENV === 'production'
  ? `${process.cwd()}/frontend/dist`
  : `${process.cwd()}/frontend/`;

if (process.env.NODE_ENV !== 'production') {
  console.log({ STATIC_PATH, PORT })
}

app.get('/', async (req, res, next) => {
  next()
  // res.send("FA")
 })

app.get('/api/test', async (req, res) => {
  if(req.query.host){
    host = req.query.host
  }
  await User.findOne({
    attributes:['shopify_domain','id', 'shopify_access_token', 'plan_extra'],
    where: {
      shopify_domain: req.query.shop
    }
  })
  .then(async response => {
    let user_data = response.dataValues
    const client = new Shopify.Shopify.Clients.Graphql(
      user_data.shopify_domain,
      user_data.shopify_access_token,
    );
    const resp = await client.query({
      data: RECURRING_PURCHASES_QUERY,
    });
    let currentPlan
    if(resp.body.data.currentAppInstallation.activeSubscriptions){
      currentPlan = resp.body.data.currentAppInstallation.activeSubscriptions
    }
    if(currentPlan.length > 0){
      let data = {
        plan: currentPlan[0].name,
        shopify_plan_id: currentPlan[0].id,
      }
      await Plan.update(data, {
        where: {
          user_id: user_data.id
        }
      })
      .then(async() => {
        await User.update({plan_extra: false}, {
          where: {
            id: user_data.id
          }
        })  
        await Setting.update({yanet_logo_visible: false}, {
          where: {
            user_id: user_data.id
          }
        }) 
      })    
    }
    else{
      if(user_data.plan_extra){
        let data = {
          plan: planName.freeExtraPlan,
          shopify_plan_id: ''
        }    
        await Plan.update(data, {
          where: {
            user_id: user_data.id
          }
        })  
      }
      else{
        await Plan.findOne({
          where: {
            user_id: user_data.id
          }
        })
        .then(async res => {
          if(res.dataValues.plan == 'Free_01'){
            let data = {
              plan: planName.freePlan01,
              shopify_plan_id: ''
            }    
            await Plan.update(data, {
              where: {
                user_id: user_data.id
              }
            })        
          }
          else{
            let data = {
              plan: planName.freePlan,
              shopify_plan_id: ''
            }    
            await Plan.update(data, {
              where: {
                user_id: user_data.id
              }
            })        
          }
        })
        .catch((e) => {
          errorLog.error(e)
        })
      }
    }
  })
  .catch(e => {
    console.log(e)
  })  
  if(!req.query.session) {    
    if(!req.query.host){
      const state = nonce()
      const redirectUri = forwardingAddress + '/shopify/callback'
      const pageUri = 'https://' + req.query.shop + '/admin/oauth/authorize?client_id=' + apiKey +
        '&scope=' + scopes + '&state=' + state + '&redirect_uri=' + redirectUri
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
    return res.redirect(app_link + txt ); 
	}
});

// app.use(authorize);

app.set("appSupcription","./views");

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
app.set("loadMoreFaq","./loadMoreFaq");
app.set("loadMoreCategory","./loadMoreCategory");

const defaultPage = require('./controller/defaultPage');

let limit = 1100
let setting_
let category_
let categoryRender = []

app.get('/faq-proxy',  async (req, res) => {
  let path_prefix = ''
  let shop = req.query.shop
  let plan = req.query.plan
  let locale = req.query.locale
  let offset = 0
  if(req.query.page){
    offset = limit*(req.query.page - 1)
  }
  const messagesSetting = await defaultPage.findMessagesSetting(shop, plan);
  const faqData = await defaultPage.findFaqs(shop, locale, path_prefix, plan, limit, offset);
  category_.forEach(element => {
    if(!categoryRender.includes(element.title)){
      categoryRender.push(element.title)
    }
  })

  faqData.categories.forEach(item => {
    if(!categoryRender.includes(item.title)){
      categoryRender.push(item.title)
    }
  })
  return res.set('Content-Type', 'application/liquid').render('loadMoreFaq',{faqs: faqData, setting: setting_, messagesSetting: messagesSetting, locale: locale, plan: plan, shop: shop});
})

app.get('/category-proxy',  async (req, res) => {
  return res.set('Content-Type', 'application/liquid').render('loadMoreCategory',{setting: setting_, categoryRender: categoryRender});
})


app.get('/faq-page', async (req, res) => {
  let shop = req.query.shop;
  let shopify_access_token
  let plan
  let userData = await User.findOne({
    attributes: ['id', 'shopify_access_token', 'plan_extra'],
    where: { shopify_domain: shop }
  });
  if (!userData) {
    shop = req.headers['x-shop-domain'];
  }
  let currentPlan
  if (shop) {
    try {
      let path_prefix = '';
      if (req.query.path_prefix) {
        path_prefix = req.query.path_prefix;
      }      
      shopify_access_token = userData.shopify_access_token
      if(userData.id != 3520){
        const client = new Shopify.Shopify.Clients.Graphql(
          shop,
          shopify_access_token,
        );
        const resp = await client.query({
          data: RECURRING_PURCHASES_QUERY,
        });
        if(resp.body.data.currentAppInstallation.activeSubscriptions){
          currentPlan = resp.body.data.currentAppInstallation.activeSubscriptions
        }
      }
      await Plan.findOne({
        attributes:['plan','id'],
        where: {
          user_id: userData.id
        }
      })
      .then(async data => {
        if(currentPlan.length > 0){
          plan = currentPlan[0].name
          try {
           await Plan.update({
              plan: currentPlan[0].name,
              shopify_plan_id: currentPlan[0].id
            }, {
              where: {
                user_id: userData.id
              }
            })
            .catch(e => {
              errorLog.error(e)
            })

            await User.update(
              {
                plan_extra: false
              },
              {
                where: {
                  id: userData.id
                }
              }
            )
            .catch(e => {
              errorLog.error(e)
            })

          } catch (error) {
            errorLog.error(error)
          }
        }
        else{
          if(data.dataValues.plan == planName.proPlan || data.dataValues.plan == planName.ultimatePlan){
            await Plan.update({
              plan: planName.freePlan
            }, {
              where: {
                user_id: userData.id
              }
            })
            plan = planName.freePlan
          }
          else if(userData.plan_extra){
            if(data.dataValues.plan == planName.freePlan){
              await Plan.update({
                plan: planName.freeExtraPlan
              }, {
                where: {
                  user_id: userData.id
                }
              })
              plan = planName.freeExtraPlan
            }
          }
          else{
            plan = data.dataValues.plan
          }
        }  
      })
      .catch(err => {
        errorLog.error(err)
      });
      const locale = req.headers['accept-language'].split(',')[0];
      const faqs = await defaultPage.findFaqs(shop, locale, path_prefix, plan, limit, 0);
      category_ = faqs.categories
      const setting = await defaultPage.findSetting(shop, locale, plan);
      setting_ = setting
      const countFaqsNumber = await defaultPage.findCountFaqs(faqs.user_id)
      const messagesSetting = await defaultPage.findMessagesSetting(shop, plan);
      return res.set('Content-Type', 'application/liquid').render('views',{faqs: faqs, setting: setting, messagesSetting: messagesSetting, locale: locale, plan: plan, shop: shop, countFaqs: countFaqsNumber});
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
// const initAPIs = require("./app/routes/api");
const planName = require('./constant/planName');
// initAPIs(app);

app.use(express.json());

app.use(serveStatic(STATIC_PATH, {
  index: false, cacheControl: true, maxAge: 604800000, setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=604800000');
  }
}));

app.use(
  '/@react-refresh',
  createProxyMiddleware({
    target: `http://localhost:3003`,
    changeOrigin: true,
  })
);

app.use("/*", async (_req, res) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .set("Cache-Control", "public, max-age=1800")
    .send(fs.readFileSync(path.join(STATIC_PATH, "index.html")));
});

app.listen(PORT, () => {
    console.log(`Server runing on port ${PORT} !`);
});

function verifyRequest(req, res, buf) {
  req.rawBody = buf
  
}

async function removeShop(shop) {
  try {
    await User.destroy({
        where: { shopify_domain: shop }
    })
    .catch(err => {
      errorLog.error(err.message)
    });
  } catch (error) {
    errorLog.error(error.message)
  }
}
