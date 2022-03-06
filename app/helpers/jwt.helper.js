const jwt = require("jsonwebtoken");
const {decode} = require("jsonwebtoken");

let generateToken = (user, secretSignature, tokenLife) => {
    return new Promise((resolve, reject) => {
        const userData = {
            shopify_access_token: user.shopify_access_token,
            shopify_domain: user.shopify_domain,
            email: user.email
        }

        jwt.sign(
            {data: userData},
            secretSignature,
            {algorithm: "HS256", expiresIn: tokenLife},
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                resolve(token);
            });
    });
}

/**
 * This module used for verify jwt token
 */
let verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            resolve(decoded);
        });
    });
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken
};
