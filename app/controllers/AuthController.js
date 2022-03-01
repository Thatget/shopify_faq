const db = require("../models");
const User = db.user;
const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);

let tokenList = {};

const accessTokenLife = process.env.JWT_KEY_LIFE;

const accessTokenSecret = process.env.JWT_KEY;

const refreshTokenLife = process.env.REFRESH_JWT_KEY_LIFE;

const refreshTokenSecret = process.env.REFRESH_JWT_KEY;


User.findAll({where: {email: 'quyet.nguyen.7712826@gmail.com'}})
    .then(data => {
        debug(data[0].dataValues.shopify_access_token);
    })
    .catch(err => {
        debug(err);
    });

/**
 * controller login
 * @param {*} req
 * @param {*} res
 */
let login = async (req, res) => {
    try {
        const userFakeData = {
            id: "1234-5678-910JQK-tqd",
            name: "Trung Quân",
            email: req.body.email,
        };

        debug(`Thực hiện tạo mã Token, [thời gian sống 1 giờ.]`);
        const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);

        debug(`Thực hiện tạo mã Refresh Token, [thời gian sống 10 năm] =))`);
        const refreshToken = await jwtHelper.generateToken(userFakeData, refreshTokenSecret, refreshTokenLife);

        tokenList[refreshToken] = {accessToken, refreshToken};

        debug(`Gửi Token và Refresh Token về cho client...`);
        return res.status(200).json({accessToken, refreshToken});
    } catch (error) {
        return res.status(500).json(error);
    }
}

/**
 * controller refreshToken
 * @param {*} req
 * @param {*} res
 */
let refreshToken = async (req, res) => {
    // User gửi mã refresh token kèm theo trong body
    const refreshTokenFromClient = req.body.refreshToken;
    // debug("tokenList: ", tokenList);

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);

            // debug("decoded: ", decoded);
            const userFakeData = decoded.data;

            debug(`Thực hiện tạo mã Token trong bước gọi refresh Token, [thời gian sống vẫn là 1 giờ.]`);
            const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);

            // gửi token mới về cho người dùng
            return res.status(200).json({accessToken});
        } catch (error) {
            debug(error);

            res.status(403).json({
                message: 'Invalid refresh token.',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
};

module.exports = {
    login: login,
    refreshToken: refreshToken,
}
