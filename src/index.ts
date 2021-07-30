// import { feedTheDragons } from './magic/index.js';
//import { start as startBot } from './bot/index.js';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { Telegraf, Markup } from 'telegraf';
const { reply, fork } = Telegraf;

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
//const port = process.env['PORT'] || 8443;

const keyboard = Markup.inlineKeyboard([
  Markup.button.url('❤️', 'http://telegraf.js.org'),
  Markup.button.callback('Delete', 'delete'),
]);

// *****
// ***** SETUP BOT
// *****
const bot = new Telegraf(token);
bot.start(ctx => ctx.reply('Welcome'));
bot.help(ctx => ctx.reply('Send me a sticker'));
bot.on('sticker', ctx => ctx.reply('👍'));
bot.hears('hi', ctx => ctx.reply('Hey there'));
bot.on('text', ctx => ctx.replyWithHTML('<b>Hello</b>'));
bot.command('foo', reply('http://coub.com/view/9cjmt'));
bot.command('foo2', reply('http://coub.com/view/9cjmt'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
console.log('EWBot started...');
