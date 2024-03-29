const request = require('request-promise');
const User = require("../../models").user;
const apiGraphql = process.env.API_GRAPHQL;
const errorLog = require('./../../../app/helpers/log.helper');

const updateUserTable = async (shop, accessToken) => {
  // Get shop info !
  const shopInfo = await getShopInfo(shop, accessToken);
  const user = {
    store_name: shopInfo[0].shop.name,
    shopify_domain: shopInfo[0].shop.myshopify_domain,
    shopify_access_token: accessToken,
    email: shopInfo[0].shop.email,
    phone: shopInfo[0].shop.phone,
    shopLocales: shopInfo[1],
  };

  // Check and create update shop info in database
  const userData = await User.findOne({ where: { shopify_domain: shopInfo[0].shop.domain }});
  if (userData) {
  await User.update(user, {where: { shopify_domain: shopInfo[0].shop.domain }})
  } else {
  await User.create(user)
  }
}

module.exports = { updateUserTable }

const getShopInfo = async (shop, accessToken) => {

  const shopRequestHeaders = {
    'X-Shopify-Access-Token': accessToken
  };

  const shopRequestUrl = 'https://' + shop + '/admin/shop.json';  
  const body = {
    query: `
    query {
      shopLocales {
        locale
        primary
        published
      }
    }`
  };
  const shopRequestUrlLocale = 'https://' + shop + apiGraphql;
  const locales = async () => {
    let shopLocales = '';
    try {
      const shopLocalesResponse = await request.post(shopRequestUrlLocale, {headers: shopRequestHeaders, json: body});
      shopLocales = JSON.stringify(shopLocalesResponse.data);
    } catch (err) {
      errorLog.error(`reauthorize.helper get shop locale error: ${err.message}`)
    }
    return shopLocales;
  }
  const shopResonse = async () => {
    try {
      const shopResonse = await request.get(shopRequestUrl, {headers: shopRequestHeaders});
      return JSON.parse(shopResonse);
    } catch (e) {
      errorLog.error(e)
    }
  }
  const shopLocales = locales();
  const shopResonseData = shopResonse();

  return (await Promise.all([shopResonseData, shopLocales]))
}