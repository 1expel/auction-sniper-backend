import axios from "axios";

const EbayAuthToken = require('ebay-oauth-nodejs-client');

const ebayAuthToken = new EbayAuthToken({
    clientId: '<your_client_id>',
    clientSecret: '<your_client_secret>',
    redirectUri: '<redirect uri>'
});

// View public data from eBay
// https://api.ebay.com/oauth/api_scope


if (!process.env.EBAY_BASE_URL) {
  throw Error('ebay api url required');
}

if (!process.env.EBAY_PROD_APP_ID) {
  throw Error('ebay app id required');
}

//! what is needed for making requests to ebay api?
// 1. clear the client deletion coding challenge / endpont. get + post request setup.
// 2. this verifies the app id you have?
// 3. generate oAuth tokens with the scope of the token you will use - does this expire? how many can i generate?
// 4. requests on your behalf (anon) vs. client's behalf?
// 5. cert id (client secret)
// 5. generate oAuth token by app id (client id) + cert id (client secret).
// auth grant flows
//  1. client credentials grant flow: your application needs to access its own resources rather than on behalf of a user.
//  2. authorization code grant flow: obtaining a User access toekn, which allows your application to act on behalf of a user, accessing and modifying user-specific resources.
//    - requires user consent.
// make api requests: ensure that the token type and permissions match the requirements of the api endpoints you are calling.
// handle token expiry and refresh: oAuth tokens have a llimit lifespan. implement logic in your application to handle token expiration and refreshing.


export const ebay = axios.create({
  baseURL: process.env.EBAY_BASE_URL,
  headers: {
    "X-EBAY-SOA-SECURITY-APPNAME": process.env.EBAY_PROD_APP_ID,
    "X-EBAY-SOA-RESPONSE-DATA-FORMAT": "JSON"
  }
});
