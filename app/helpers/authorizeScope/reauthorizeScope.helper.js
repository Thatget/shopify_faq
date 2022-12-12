const errorLog = require('../log.helper');
const { updateUserTable } = require('./shopinfo');

const appName = process.env.SHOPIFY_APP_NAME;

const reauthorizeScope = async (req, res) => {
  try {
    const { shop } = req.query;
    const accessToken = req.accessToken;
    await updateUserTable(shop, accessToken);

  } catch (error) {
    errorLog.error(`Authorize scope failed: ${error.message}`)
  }
  let pageUri = 'https://' + shop + '/admin/apps/' + appName;
  res.redirect(pageUri);
}

module.exports = reauthorizeScope