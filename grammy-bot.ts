import { Bot, Context, InlineKeyboard } from 'grammy'
import 'dotenv/config'


// //Pre-assign menu text
// const firstMenu =
//   '<b>Menu 1</b>\n\nA beautiful menu with a shiny inline button.'
// const secondMenu =
//   '<b>Menu 2</b>\n\nA better menu with even more shiny inline buttons.'

// //Pre-assign button text
// const nextButton = 'Next'
// const backButton = 'Back'
// const tutorialButton = 'Tutorial'

// //Build keyboards
// const firstMenuMarkup = new InlineKeyboard().text(nextButton, backButton)

// const secondMenuMarkup = new InlineKeyboard()
//   .text(backButton, backButton)
//   .text(tutorialButton, 'https://core.telegram.org/bots/tutorial')

// //This handler sends a menu with the inline buttons we pre-assigned above
// bot.command('menu', async (ctx) => {
//   await ctx.reply(firstMenu, {
//     parse_mode: 'HTML',
//     reply_markup: firstMenuMarkup,
//   })
// })

// //This handler processes back button on the menu
// bot.callbackQuery(backButton, async (ctx) => {
//   //Update message content with corresponding menu section
//   await ctx.editMessageText(firstMenu, {
//     reply_markup: firstMenuMarkup,
//     parse_mode: 'HTML',
//   })
// })

// //This handler processes next button on the menu
// bot.callbackQuery(nextButton, async (ctx) => {
//   //Update message content with corresponding menu sectios
//   await ctx.editMessageText(secondMenu, {
//     reply_markup: secondMenuMarkup,
//     parse_mode: 'HTML',
//   })
// })

// //This function would be added to the dispatcher as a handler for messages coming from the Bot API
// bot.on('message', async (ctx) => {
//   //Print to console
//   console.log(
//     `${ctx.from.first_name} wrote ${
//       'text' in ctx.message ? ctx.message.text : ''
//     }`
//   )

//   if (screaming && ctx.message.text) {
//     //Scream the message
//     await ctx.reply(ctx.message.text.toUpperCase(), {
//       entities: ctx.message.entities,
//     })
//   } else {
//     //This is equivalent to forwarding, without the sender's name
//     await ctx.copyMessage(ctx.message.chat.id)
//   }
// })

/**
 * ok now i want to go to the final step which is building the actual cryptomium telegram bot which will serve latest news and cryptocurrencies prices in the crypto space.
i wan't the user when he enter the bot o be greeted with a welcome button in the bottom input field, after he clicks that button he receives a text which will introduce the bot to him and a greeting message (i will leave to you to write it).
then after he clicks on the welcome button he will see 2 buttons in place of welcome button one for latest news and the other for cryptocurrency prices.
the news will be provided by the api we built earlier, and the prices from coingecko API (e.g. :https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=chainlink)
 */
//Create a new bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || '')



//Start the Bot
bot.start()
