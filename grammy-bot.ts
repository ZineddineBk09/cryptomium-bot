import { Bot, Context, InlineKeyboard } from 'grammy'
import axios from 'axios'
import 'dotenv/config'

/**
 * ok now i want to go to the final step which is building the actual cryptomium telegram bot which will serve latest news and cryptocurrencies prices in the crypto space.
i wan't the user when he enter the bot o be greeted with a welcome button in the bottom input field, after he clicks that button he receives a text which will introduce the bot to him and a greeting message (i will leave to you to write it).
then after he clicks on the welcome button he will see 2 buttons in place of welcome button one for latest news and the other for cryptocurrency prices.
the news will be provided by the api we built earlier, and the prices from coingecko API (e.g. :https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=chainlink)
 */

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || '') // <-- put your bot token between the ""

// create first welcome menu
const welcomeMenu = new InlineKeyboard()
  .text('Latest News', 'latest_news')
  .text('Cryptocurrency Prices', 'crypto_prices')

// choose news category menu
const newsCategoryMenu = getCategories().then((categories) => {
  const menu = new InlineKeyboard()
  for (let i = 0; i < categories.length; i++) {
    menu.text(
      categories[i],
      'latest_news_by_category_' + categories[i].toLocaleLowerCase()
    )
  }
  return menu
})

// create second menu
const BackToMenuMenu = new InlineKeyboard().text(
  'Back to Main Menu',
  'back_to_main_menu'
)

// show welcome menu
bot.command('start', async (ctx) => {
  await ctx.reply('Hello! I am Cryptomium Bot. How can I assist you today?', {
    reply_markup: welcomeMenu,
  })
})

// Handle other messages.
bot.on('message', async (ctx) => {
  ctx.reply('I am sorry, I do not understand.')
  // display the welcome menu
  await ctx.reply('Please use the buttons below.', {
    reply_markup: welcomeMenu,
  })
})

// actions
bot.callbackQuery('latest_news', async (ctx) => {
  console.log('latest_news')
  await ctx.editMessageText('Latest News', {
    reply_markup: await newsCategoryMenu,
  })
})

const latestNewsByCategoryRegex = /latest_news_by_category(.*)/
bot.callbackQuery(latestNewsByCategoryRegex, async (ctx) => {
  // check how to get the category from the callback query
  //ex: latest_news_by_categorynews
  const category = ctx.callbackQuery.data.replace(
    'latest_news_by_category_',
    ''
  )
  // get the data from the response
  const data = await getLatestNewsByCategory(category)
  // loop through the data
  for (let i = 0; i < data.length; i++) {
    // add the title and the link to the string
    await ctx.reply(data[i].pageUrl)
  }

  await ctx.reply('Back to Main Menu', {
    reply_markup: BackToMenuMenu,
  })
})

bot.callbackQuery('crypto_prices', async (ctx) => {
  console.log('crypto_prices')
  await ctx.editMessageText('Cryptocurrency Prices', {
    reply_markup: BackToMenuMenu,
  })
})

bot.callbackQuery('back_to_main_menu', async (ctx) => {
  console.log('back_to_main_menu')
  await ctx.editMessageText('Choose an Option', {
    reply_markup: welcomeMenu,
  })
})

// Start the bot.
bot.start()

// Functions
async function getLatestNews() {
  const response = await axios.get('http://localhost:3000/api/news')
  const data = response.data

  return data
}

async function getLatestNewsByCategory(category: string) {
  const response = await axios.get(
    'http://localhost:3000/api/news?category=' + category.toUpperCase()
  )
  const data = response.data

  return data
}

async function getCategories() {
  const data = await getLatestNews()
  let categories: string[] = []
  // get unique categories from the data
  for (let i = 0; i < data.length; i++) {
    if (!categories.includes(data[i].category)) {
      categories.push(data[i].category)
    }
  }
  return categories
}
