const request = require('request-promise');
const errorLog = require('../log.helper');

const forwardingAddress = process.env.HOST;

const uninstallApp = async (shop, accessToken) => {

  try {
    const shopRequestUrlWebhook = 'https://' + shop + '/admin/api/2022-01/webhooks.json';

    const shopRequestHeaders = {
      'X-Shopify-Access-Token': accessToken
    };
    const webhook = {
      webhook : {
        topic: "app/uninstalled",
        address: `${forwardingAddress}/uninstall?shop=${shop}`,
        format: "json",
      }
    };

    await request.post(shopRequestUrlWebhook, {headers: shopRequestHeaders, json: webhook})
  } catch (error) {
    errorLog.error(`Failed to create uninstall webhook !: ${error.message}`)
  }
}

module.exports = { uninstallApp }