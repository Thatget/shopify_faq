const router = require("express").Router();
const { authorizeMiddleware } = require('./authorize.middleware')

const authorizeLink = require('./authorizeLink.helper');
const authorizeScope = require('./authorizeScope.helper');

router.get('/authorize', authorizeLink)

router.use('/shopify', authorizeMiddleware);

router.get('/shopify/callback', authorizeScope);

module.exports = router