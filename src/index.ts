// import { feedTheDragons } from './magic/index.js';
import { start as startBot } from './bot/index.js';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import express, { Request, Response } from 'express';
//import { Telegraf } from 'telegraf';

// pull configs from .env:
const env = dotenv.config();
dotenvExpand(env);

/* const token = process.env['BOT_TOKEN'];
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}
const webhookUrl = process.env['WEBHOOK_URL'];
if (webhookUrl === undefined) {
  throw new Error('WEBHOOK_URL must be provided!');
}

// feedTheDragons();
// startBot();

const bot = new Telegraf(token);
// Set the bot response
bot.on('text', ctx => ctx.replyWithHTML('<b>Hello</b>'));

const secretPath = `/telegraf/${bot.secretPathComponent()}`;

// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
//bot.telegram.setWebhook(`https://----.localtunnel.me${secretPath}`);
bot.telegram.setWebhook(webhookUrl); */

const app = express();
app.get('/', (_: Request, res: Response) => res.send('Hello World!'));

// Set the bot API endpoint
//app.use(bot.webhookCallback(secretPath));

app.listen(8443, () => {
  console.log('EWBot listening on port 8443!');
});

// No need to call bot.launch()
