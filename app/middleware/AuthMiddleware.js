const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);

const accessTokenSecret = process.env.JWT_KEY;

let isAuth = async (req, res, next) => {
    const tokenFromClient = req.params.token || req.headers["x-access-token"] || '';
    if (tokenFromClient) {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            req.jwtDecoded = decoded;
            next();
        } catch (e) {
            return res.status(401).json({
                message: "Unauthorized."
            });
        }
    } else {
        return res.status(403).send({
            message: 'No token provided...',
        });
    }
}

module.exports = {
    isAuth: isAuth,
};
