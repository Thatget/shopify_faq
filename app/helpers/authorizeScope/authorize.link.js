const state = nonce();
const redirectUri = forwardingAddress + '/shopify/callback';
const pageUri = 'https://' + req.query.shop + '/admin/oauth/authorize?client_id=' + apiKey +
  '&scope=' + scopes + '&state=' + state + '&redirect_uri=' + redirectUri;
res.cookie('state',state);
res.redirect(pageUri);