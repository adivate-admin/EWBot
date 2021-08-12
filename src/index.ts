import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { Context, Telegraf, session } from 'telegraf';
import axios, { AxiosRequestConfig } from 'axios';
// const { reply, fork } = Telegraf;

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */
const fetch = require('node-fetch').default;
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */

// pull configs from .env:
const env = dotenv.config();
dotenvExpand(env);

const cToF = (c: number) => (c * 9) / 5 + 32;
// const fToC = (f: number) => ((f - 32) * 5) / 9;
const kToC = (k: number) => k - 273.15;
// const cToK = (c: number) => c + 273.15;
const kToF = (k: number) => cToF(kToC(k));
// const fToK = (f: number) => cToK(fToC(f));

//const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD'];

//const main = async () => {
const token = process.env.BOT_TOKEN ?? ''; // ['BOT_TOKEN'];
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

const openWeatherApiKey = process.env.OPENWEATHER_API_KEY ?? '';

// const randomPhoto = 'https://picsum.photos/200/300/?random';

function round(value: number, precision: number) {
  const multiplier = 10 ** (precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

// const sayYoMiddleware = fork(ctx => ctx.reply('yo'));

const getPriceFromAPI = async (
  symbol = 'EWT',
  currency = 'USD',
): Promise<number> => {
  console.log(`Getting ${symbol} price in ${currency}`);
  const data = JSON.stringify({
    currency,
    code: symbol,
    meta: true,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://api.livecoinwatch.com/coins/single',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.LIVECOINWATCH_API_KEY ?? '',
    },
    data,
  };

  /* eslint-disable */
  const response = await axios(config);
  const responseJson = response.data;
  return responseJson.rate;
  /* eslint-enable */
};

type CurrencyEntry = {
  code: string;
  countries: string[];
  flag: string;
  name: string;
  symbol: string;
};
type CurrencyList = CurrencyEntry[];

const loadCurrencies = async (): Promise<CurrencyList> => {
  console.log(`Loading currencies...`);

  /* const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://api.livecoinwatch.com/fiats/all',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env['LIVECOINWATCH_API_KEY'],
    },
    data: data,
  }; */

  const config: AxiosRequestConfig = {
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.LIVECOINWATCH_API_KEY ?? '',
    },
  };

  const response = await axios.post<CurrencyList>(
    'https://api.livecoinwatch.com/fiats/all',
    {},
    config,
  );
  return response.data;
};

let supportedCurrencies: CurrencyList;

const isValidCurrency = (currency: string): boolean =>
  supportedCurrencies.some(c => c.code === currency);

const getWeather = async (city: string): Promise<string> => {
  console.log('Getting weather for: ' + city);
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${openWeatherApiKey}`;
    /* eslint-disable */
    const response: any = await fetch(apiUrl);
    const responseJson = await response.json();
    //if (responseJson.weather[0]) {
    return `Weather in ${responseJson.name}: Temp ${round(
      kToC(responseJson.main.temp),
      1,
    )}C / ${round(kToF(responseJson.main.temp), 1)}F, ${
      responseJson.weather[0].main
    } (${responseJson.weather[0].description})`;
    /* eslint-enable */
    //} else {
    //  console.log('City not found...');
    //  return 'City not found';
    //}
  } catch (error: any) {
    /* eslint-disable */
    console.log(`Error getting weather...${error.message}`);
    /* eslint-enable */
    return 'Error getting weather...';
  }
};

//const s = getWeather('London').then(s => console.log(s));

interface SessionData {
  heyCounter: number;
}

interface BotContext extends Context {
  session?: SessionData;
}

const bot = new Telegraf<BotContext>(token);

// // Register session middleware
bot.use(session());

// Register logger middleware
/* bot.use((ctx, next) => {
    const start = Date.now();
    return next().then(() => {
      const ms = Date.now() - start;
      console.log('response time %sms', ms);
    });
  }); */

// Login widget events
// bot.on('connected_website', ctx => ctx.reply('Website connected'));

// Telegram passport events
// bot.on('passport_data', ctx => ctx.reply('Telegram password connected'));

// Random location on some text messages
/* bot.on('text', (ctx, next) => {
    if (Math.random() > 0.2) {
      return next();
    }
    return Promise.all([
      ctx.replyWithLocation(Math.random() * 180 - 90, Math.random() * 180 - 90),
      next(),
    ]);
  }); */

// Text messages handling
// bot.hears('Hey', sayYoMiddleware, ctx => {
//  ctx.session ??= { heyCounter: 0 };
//  ctx.session.heyCounter++;
//  return ctx.replyWithMarkdown(`_Hey counter:_ ${ctx.session.heyCounter}`);
// });

// Command handling
// bot.command('answer', sayYoMiddleware, ctx => {
//   console.log(ctx.message);
//   return ctx.replyWithMarkdownV2('*42*');
// });

// bot.command('cat', ctx => ctx.replyWithPhoto(randomPhoto));

// Streaming photo, in case Telegram doesn't accept direct URL
// bot.command('cat2', ctx => ctx.replyWithPhoto({ url: randomPhoto }));

// Look ma, reply middleware factory
// bot.command('foo', reply('https://adivate.net'));

// Wow! RegEx
// bot.hears(/reverse (.+)/, ctx =>
//  ctx.reply(ctx.match[1].split('').reverse().join('')),
// );

bot.command('weather', async ctx =>
  ctx.reply(await getWeather(ctx.update.message.text.split(' ')[1])),
);

const getPrice = async (token: string, currency = 'USD'): Promise<string> => {
  currency = currency.toUpperCase();
  if (!supportedCurrencies) {
    supportedCurrencies = await loadCurrencies();
  }
  if (!isValidCurrency(currency)) {
    return "Sorry, don't know that currency...";
  }
  const currencySymbol =
    supportedCurrencies.find(c => c.code === currency)?.symbol ?? '';
  try {
    return `${token}/${currency}=${currencySymbol}${round(
      await getPriceFromAPI(token, currency),
      3,
    )}`;
  } catch (error: any) {
    /* eslint-disable */
    console.log('Error getting price...' + error.message);
    /* eslint-enable */
    return 'Error getting price';
  }
};

/* eslint-disable */
const runSymbol = async (sym: string, ctx: any): Promise<void> => {
  let currency = 'USD';
  const args: string[] = ctx.update.message.text.split(' ');
  if (args.length > 0) {
    currency = ctx.update.message.text.split(' ')[1]?.toUpperCase();
  }
  ctx.reply(await getPrice(sym, currency)).toString();
};
/* eslint-enable */

bot.command('altszn', async ctx =>
  ctx.reply("Sorry Bro...It's Been Cancelled"),
); //That's a fact, Jack!"));

bot.command('susu', async ctx => runSymbol('SUSU', ctx));

bot.command('ewt', async ctx => runSymbol('EWT', ctx));

bot.on('inline_query', async ctx => {
  console.log(ctx.inlineQuery.query);
});

/* bot.on('inline_query', async ctx => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${ctx.inlineQuery.query}&APPID=${openWeatherApiKey}`;
    const response = await fetch(apiUrl);
    const { results } = await response.json();
    const recipes = results
      // @ts-ignore
      .filter(({ thumbnail }) => thumbnail)
      // @ts-ignore
      .map(({ title, href, thumbnail }) => ({
        type: 'article',
        id: thumbnail,
        title: title,
        description: title,
        thumb_url: thumbnail,
        input_message_content: {
          message_text: title,
        },
        reply_markup: Markup.inlineKeyboard([
          Markup.button.url('Go to recipe', href),
        ]),
      }));
    return await ctx.answerInlineQuery(recipes);
  });
  
  bot.on('chosen_inline_result', ({ chosenInlineResult }) => {
    console.log('chosen inline result', chosenInlineResult);
  }); */

// Launch bot
/* eslint-disable  @typescript-eslint/no-floating-promises */
bot.launch();
/* eslint-enable  @typescript-eslint/no-floating-promises */

// Enable graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
});
console.log('EWBot running...');
// };
//
// main()
//  .catch(error => console.log(error))
//  .finally(() => process.exit());
