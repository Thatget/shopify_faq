const errorLog = require('../log.helper');
const nonce = require('nonce')();
const forwardingAddress = process.env.HOST;
const apiKey = process.env.SHOPIFY_API_KEY;
const scopes = process.env.SCOPES;

const authorizeLink = async (req, res) => {
	try {
		const state = nonce();
		const redirectUri = forwardingAddress + '/shopify/callback';
		const pageUri = 'https://' + req.query.shop + '/admin/oauth/authorize?client_id=' + apiKey +
			'&scope=' + scopes + '&state=' + state + "&redirect_uri=" + redirectUri;
		res.cookie('authorize',true);
		return res.redirect(pageUri);
	} catch (e) {
		errorLog.error(e.message);
		return res.redirect('https://' + req.query.shop + '/admin');
	}
}

module.exports = authorizeLink
