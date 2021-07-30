// import { feedTheDragons } from './magic/index.js';
//import { start as startBot } from './bot/index.js';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import express, { Request, Response } from 'express';
import path from 'path';
import { Telegraf, Markup } from 'telegraf';

// pull configs from .env:
const env = dotenv.config();
dotenvExpand(env);

const token = process.env['BOT_TOKEN'];
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}
const webhookUrl = process.env['WEBHOOK_URL'];
if (webhookUrl === undefined) {
  throw new Error('WEBHOOK_URL must be provided!');
}
const port = process.env['PORT'] || 8443;

// feedTheDragons();
// startBot();

const keyboard = Markup.inlineKeyboard([
  Markup.button.url('❤️', 'http://telegraf.js.org'),
  Markup.button.callback('Delete', 'delete'),
]);

const bot = new Telegraf(token);
// Set the bot response
bot.on('text', ctx => ctx.replyWithHTML('<b>Hello</b>'));
bot.start(ctx => ctx.reply('Hello from EWBot'));
bot.help(ctx => ctx.reply('Help from EWBot'));
bot.on('message', ctx =>
  ctx.telegram.sendCopy(ctx.message.chat.id, ctx.message, keyboard),
);
bot.action('delete', ctx => ctx.deleteMessage());
const secretPath = `/telegraf/${bot.secretPathComponent()}`;

// Set telegram webhook
// npm install -g localtunnel && lt --port 3000
//bot.telegram.setWebhook(`https://----.localtunnel.me${secretPath}`);
const telegramPath = path.join(webhookUrl, secretPath);
bot.telegram.setWebhook(telegramPath);

const app = express();
app.get('/', (_: Request, res: Response) =>
  res.send(`EWBot says hello! Telegram path: ${telegramPath}`),
);

// Set the bot API endpoint
app.use(bot.webhookCallback(secretPath));

app.listen(port, () => {
  console.log(`EWBot listening on port ${port}!`);
});

// No need to call bot.launch()
