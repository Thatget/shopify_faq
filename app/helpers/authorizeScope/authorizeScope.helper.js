const errorLog = require('../log.helper');
const { updateUserTable } = require('./shopinfo');
const { uninstallApp } = require('./webhook');

const appName = process.env.SHOPIFY_APP_NAME;

const authorizeScope = async (req, res) => {
  console.log(req.query)
  const { shop } = req.query;
  const accessToken = req.accessToken;
  try {
    await Promise.allSettled([updateUserTable(shop, accessToken),uninstallApp(shop, accessToken)]);
  } catch (error) {
    errorLog.error(`Authorize scope failed: ${error.message}`)
  }
  let pageUri = 'https://' + shop + '/admin/apps/' + appName;
  res.redirect(pageUri);
}

module.exports = authorizeScope