const jwtHelper = require("../helpers/jwt.helper");

const accessTokenSecret = process.env.JWT_KEY;
const app_link = process.env.FRONT_END;
// const Shopify = require("@shopify/shopify-api");
let isAuth = async (req, res, next) => {
    const tokenFromClient = req.params.token || req.headers["x-access-token"] || '';
    if (tokenFromClient) {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            req.jwtDecoded = decoded;
            // if(Shopify.Shopify.Context.IS_EMBEDDED_APP){
            //   res.set(
            //     'Content-Security-Policy',
            //     `frame-ancestors https://admin.shopify.com;`,
            //   );      
            // }
            // else{
            //   res.set(
            //     'Content-Security-Policy',
            //     `frame-ancestors 'none';`,
            //   );
            // }
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