const jwtHelper = require("../helpers/jwt.helper");

const accessTokenSecret = process.env.JWT_KEY;
const app_link = process.env.FRONT_END;

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
        return res.status(403).redirect(app_link+'/not-found');
    }
}

module.exports = {
    isAuth: isAuth,
};