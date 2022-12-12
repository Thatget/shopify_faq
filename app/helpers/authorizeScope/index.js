const router = require("express").Router();
const { authorizeMiddleware } = require('./authorize.middleware')

const authorizeScope = require('./authorizeScope.helper');

router.use(authorizeMiddleware);

router.get('/callback',authorizeScope);

module.exports = router