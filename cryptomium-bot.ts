import { Bot, Context } from 'grammy'
import 'dotenv/config'
import { handleWelcome, welcomeMenu } from './handlers/welcome-handler'
import { handleLatestNews } from './handlers/latest-news-handler'
import { handleLatestNewsByCategory } from './handlers/latest-news-category-handler'
import { handleLatestSecurityNews } from './handlers/latest-security-news-handler'
import { handleCryptoPrices } from './handlers/crypto-prices-handler'
import { handleCurrency } from './handlers/currency-handler'
import {
  handleNext,
  handlePrevious,
} from './handlers/crypto-prices-pagination-handler'
import { handleCryptoVsBaseCurrency } from './handlers/crypto-prices-vs-base-currency-handler'

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || '') // <-- put your bot token here

// ------------------ Start ------------------
bot.command('start', handleWelcome)

// ------------------ Help ------------------
bot.on('message', async (ctx: Context) => {
  await ctx.reply('I am sorry, I do not understand.')
  // display the welcome menu
  await ctx.reply('Please select an option from below.', {
    reply_markup: welcomeMenu,
  })
})

// ------------------ Latest News ------------------
bot.callbackQuery('latest_news', handleLatestNews)

// ------------------ Latest News by Category ------------------
const latestNewsByCategoryRegex = /latest_news_by_category(.*)/
bot.callbackQuery(latestNewsByCategoryRegex, handleLatestNewsByCategory)

// ------------------ Security News ------------------
bot.callbackQuery('security_news', handleLatestSecurityNews)

// ------------------ Crypto Prices Pagination ------------------
bot.callbackQuery('previous', handlePrevious)
bot.callbackQuery('next', handleNext)

// ------------------ Crypto Prices ------------------
bot.callbackQuery('crypto_prices', handleCryptoPrices)

// ------------------ Crypto Prices vs Currency ------------------
const cryptoPricesVsCurrencyMenuRegex = /crypto_prices_vs_(.*)/
bot.callbackQuery(cryptoPricesVsCurrencyMenuRegex, handleCryptoVsBaseCurrency)

// ------------------ Currency ------------------
const currencyRegex = /currency_(.*)/
bot.callbackQuery(currencyRegex, handleCurrency)

// ------------------ Back to Main Menu ------------------
bot.callbackQuery('back_to_main_menu', async (ctx: Context) => {
  console.log('back_to_main_menu')
  await ctx.editMessageText('Choose an Option', {
    reply_markup: welcomeMenu,
  })
})

// ------------------ Start the bot ------------------
bot.start()
