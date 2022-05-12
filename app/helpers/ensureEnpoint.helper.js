const db = require("../models");
const User = db.user;

const apiSecret = process.env.SHOPIFY_API_SECRET;
const errorLog = require('../helpers/log.helper');


exports.customerRedact = async (req, res) => {
    const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
    const body = req.rawBody;
    const hash = crypto
        .createHmac("sha256", apiSecret)
        .update(body, "utf8", "hex")
        .digest("base64");
    if (hmacHeader === hash) {
        return res.send({
            message: "we do not store any data of the customer"
        });
    } else {
        return res.status(401).send('Unauthorized');
    }
}
exports.customerData = async (req, res) => {
    const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
    const body = req.rawBody;
    const hash = crypto
        .createHmac("sha256", apiSecret)
        .update(body, "utf8", "hex")
        .digest("base64");
    if (hmacHeader === hash) {
        return res.send({
            message: "we do not store any data of the customer"
        });
    } else {
        return res.status(401).send('Unauthorized');
    }
}
// exports.shopRedact = async (req, res) => {
//     return res.status(200).json({});
// }

exports.shopRedact = async (req, res) => {
    const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
    const body = req.rawBody;
    const hash = crypto
        .createHmac("sha256", apiSecret)
        .update(body, "utf8", "hex")
        .digest("base64");
    if (hmacHeader === hash) {
        const shop = req.body.shop;
        if (shop) {
            try {
                await removeShop(shop);
            } catch (e) {
                errorLog.error(`uninstall error: remove shop ${e.message}`)
                res.status(e.statusCode).send(e.error);
            }
            res.sendStatus(200);
        } else {
            return res.status(400).send('Required parameters missing');
        }
    } else {
        return res.status(401).send('Unauthorized');
    }
    return  res.end({message: "The data of the shop deleted successfully "});
}
async function removeShop(shop) {
    try {
        await User.destroy({
            where: { shopify_domain: shop }
        })
            .then(num => {})
            .catch(err => {
                errorLog.error(err.message)
            });
    } catch (error) {
        errorLog.error(error.message)
    }
}