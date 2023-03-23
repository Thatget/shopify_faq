var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const express = require('express');
const crypto = require('crypto');
const nonce = require('nonce')();
const querystring = require('querystring');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();

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
const apiSecret = process.env.SHOPIFY_API_SECRET;
// Token data

// const debug = console.log.bind(console);
db.sequelize.sync({ force: false }).then(() => {
    console.log("Drop and re-sync db.")
});

var indexRouter = require('./routes/index');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set("appSupcription","./views");
app.set("views","./views");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
app.get('/qrcode-page', async (req, res) => {

  let shop = 'aaaaaaaaaaa';
  if (shop) {
    return res.set('Content-Type', 'application/liquid').render('views');
  } else {
    return res.status(400).send('Required parameters missing');
  }
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
    
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.use(authorize);
//Api
const initAPIs = require("./app/api/api.js");
initAPIs(app);

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
module.exports = app;
