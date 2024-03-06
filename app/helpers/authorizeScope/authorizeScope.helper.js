const errorLog = require('../log.helper');
const { updateUserTable } = require('./shopinfo');
const { uninstallApp } = require('./webhook');

const appName = process.env.SHOPIFY_APP_NAME;

const authorizeScope = async (req, res) => {
	// const authorize = cookie.parse(req.headers.cookie).authorize||false;
  errorLog.error('authorizeScope')
  const { shop } = req.query;
  const accessToken = req.accessToken;
  try {
		// if (authorize) {
		// 	await updateUserTable(shop, accessToken)
		// } else {
    //   await updateUserTable(shop, accessToken),
    //   await uninstallApp(shop, accessToken)
		// }
    await updateUserTable(shop, accessToken),
    await uninstallApp(shop, accessToken)
  } catch (error) {
    errorLog.error(`Authorize scope failed: ${error.message}`)
  }
  let pageUri = 'https://admin.shopify.com/store/' + shop.slice(0, shop.indexOf('.')) + '/apps/' + appName;
  // let pageUri = 'https://' + shop + '/admin/apps/' + appName;
  res.redirect(pageUri);
}

module.exports = authorizeScope