const db = require("../models");
const User = db.user;
const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);

let tokenList = {};
const accessTokenLife = process.env.JWT_KEY_LIFE;
const accessTokenSecret = process.env.JWT_KEY;
const refreshTokenLife = process.env.REFRESH_JWT_KEY_LIFE;
const refreshTokenSecret = process.env.REFRESH_JWT_KEY;

/**
 * controller login
 * @param {*} req
 * @param {*} res
 */
let login = async (req, res) => {
    if (req.query.shopify_domain) {
        try {
            let shopify_access_token = '';
            let email = '';
            let user_id = 0;
            let hasUser = true;
            await User.findOne({where: {shopify_domain: req.query.shopify_domain}})
                .then(data => {
                    if (data) {
                        shopify_access_token = data.dataValues.shopify_access_token;
                        email = data.dataValues.email;
                        user_id = data.dataValues.id;
                    }else {
                        hasUser = false;
                    }
                })
                .catch(err => {
                    debug(err);
                });
            if (!hasUser) {
                return res.status(400).json(`The store ${req.query.shopify_domain} doesn't exist or not yet created`);
            }
            const userData = {
                email: email,
                shopify_domain: req.query.shopify_domain,
                user_id:user_id
            };
            const accessToken = await jwtHelper.generateToken(userData, accessTokenSecret, accessTokenLife);

            const refreshToken = await jwtHelper.generateToken(userData, refreshTokenSecret, refreshTokenLife);

            tokenList[refreshToken] = {accessToken, refreshToken};

            return res.status(200).json({accessToken, refreshToken});
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(400).json('Missing shopify domain !');
    }
};

/**
 * controller refreshToken
 * @param {*} req
 * @param {*} res
 */
let refreshToken = async (req, res) => {
    const refreshTokenFromClient = req.body.refreshToken;
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);

            const userFakeData = decoded.data;

            const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);

            return res.status(200).json({accessToken});
        } catch (error) {
            debug(error);

            res.status(403).json({
                message: 'Invalid refresh token.',
            });
        }
    } else {
        return res.status(403).send({
            message: 'No token provided!',
        });
    }
};

module.exports = {
    login: login,
    refreshToken: refreshToken,
}
