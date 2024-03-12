import { join } from "path";
import proxy from "express-http-proxy";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import path from "path";
import dotenv from 'dotenv';
import shopify from "./shopify.js";
import PrivacyWebhookHandlers from "./privacy.js";
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({
    path: envPath
  });
}

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

const url = new URL(process.env.HOST ?? 'http://127.0.0.1');
// const proxyHost = url + '/';
const proxyHost = url.protocol + '//' + url.hostname;

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

// app.use("/api/*", shopify.validateAuthenticatedSession());

app.use('/api', proxy(proxyHost, {
  proxyReqPathResolver: function (req) {
    return req.originalUrl;
  },
  limit: '50mb',
}));


app.use(express.json());

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
