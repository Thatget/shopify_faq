const router = require("express").Router();
const { authorizeMiddleware } = require('./authorize.middleware')

const authorizeScope = require('./authorizeScope.helper');
const reauthorizeScope = require('./reauthorizeScope.helper');

router.use(authorizeMiddleware);

router.get('/callback',authorizeScope);
router.get('/re-authorize',reauthorizeScope);

module.exports = router