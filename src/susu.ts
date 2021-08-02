/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import axios, { AxiosRequestConfig } from 'axios';
import { mainModule } from 'process';

// pull configs from .env:
const env = dotenv.config();
dotenvExpand(env);

function round(value: number, precision: number) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

const getSusu = async (currency = 'USD'): Promise<number> => {
  const data = JSON.stringify({
    currency: currency,
    code: 'SUSU',
    meta: true,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://api.livecoinwatch.com/coins/single',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env['LIVECOINWATCH_API_KEY'],
    },
    data: data,
  };

  const response = await axios(config);
  const responseJson: any = response.data;
  return responseJson.rate;
};

async function main() {
  const currency = 'USD';
  console.log(`SUSU/${currency}=${round(await getSusu(currency), 3)}`);
}

main()
  .catch(error => console.log(error))
  .finally(() => process.exit());
