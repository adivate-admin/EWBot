# Telegram Bot for EnergyWeb Related Stuff

EnergyWeb telegram bot.

### NOTES:

susu - Get SUSU Price, specify USD or EUR
ewt - Get EWT Price, specify USD or EUR

set BOT_TOKEN from BotFather in .env file
then:
mkdir persist
yarn
yarn build
yarn start

### telegram-typescript-bot-template

Write to the @BotFather on Telegram and create your bot.
You will get a token that looks like this: `123:abc`.
Create a file `bot-token.txt` and put it in there.

The bot stores persistent data within the `persist` folder.
So also create this folder before starting it for the first time.

### Production

See the Dockerfile.
You can build a container using it.
But this repo isn't about containers.
For more information about them, take a look elsewhere.

The container is meant to be used with a secret containing your bot token: `/run/secrets/bot-token.txt`.
Alternatively, you can supply it via the environment variable named `BOT_TOKEN`.

The container has one volume (`/app/persist`) which will contain persistent data your bot creates.
Make sure to explicitly use that volume (for example, make sure it's synced or tied to the host in a multi-node setup).

### Sources

https://github.com/telegraf/telegraf
https://github.com/EdJoPaTo/telegram-typescript-bot-template
