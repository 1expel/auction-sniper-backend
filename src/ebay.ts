import axios from "axios";

if (!process.env.EBAY_BASE_URL) {
  throw Error('ebay api url rquired');
}

if (!process.env.EBAY_PROD_APP_ID) {
  throw Error('ebay app id rquired');
}

export const ebay = axios.create({
  baseURL: process.env.EBAY_BASE_URL,
  headers: {

  }
});
