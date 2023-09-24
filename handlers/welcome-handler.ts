import { Bot, Context, InlineKeyboard } from 'grammy'
import axios from 'axios'
import 'dotenv/config'
import { CryptoCurrency } from '../interfaces'

export const welcomeMenu = new InlineKeyboard()
  .text('Latest News on Cointelegraph', 'latest_news')
  .text('Cryptocurrency Prices', 'crypto_prices')
  .text('Security News', 'security_news')

export async function handleWelcome(ctx: Context) {
  const introduction = `
👋 Hello! I am Cryptomium Bot.

![Cryptomium Bot](https://github.com/ZineddineBk09/cryptomium-bot/blob/main/public/cryptomium-bot.jpeg?raw=true)

ℹ️ Here's a brief about my creator:
Benkhaled Zineddine, a full-stack developer with 3+ years of experience in web development.

🌐 Portfolio: [Check out my portfolio](https://zineddine-benkhaled.vercel.app)
👨‍💻 GitHub: [Visit my GitHub profile](https://github.com/ZineddineBk09)

How can I assist you today?
  `

  await ctx.reply(introduction, {
    reply_markup: welcomeMenu,
    parse_mode: 'Markdown',
  })
}
