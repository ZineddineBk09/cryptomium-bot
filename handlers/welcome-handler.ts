import { Context, InlineKeyboard } from 'grammy'
import 'dotenv/config'

export const welcomeMenu = new InlineKeyboard()
  .text('Latest News on Cointelegraph', 'latest_news')
  .text('Cryptocurrency Prices', 'crypto_prices')
  .text('Security News', 'security_news')

export async function handleWelcome(ctx: Context) {
  const introduction = `
👋 Hello! I am Cryptomium Bot.

![Cryptomium Bot](https://github.com/ZineddineBk09/cryptomium-bot/blob/main/public/cryptomium-bot.jpeg?raw=true)

🤖 I can help you with the following:
    - Latest News on Cointelegraph
    - Cryptocurrency Prices
    - Security News in the Blockchain Industry
    - More features are coming soon!

ℹ️ Here's a brief about my creator:
Benkhaled Zineddine, a full-stack developer with 3+ years of experience in web development.

📚 Education: Bachelor's degree in Software Engineering + Master's degree in Cybersecurity from the University of Science and Technology Houari Boumediene (USTHB).

👨‍💻 Skills: JavaScript, TypeScript, Node.js, React, Next.js, MongoDB, SQL, Solidity, Python, Flask, and more.



🌐 Portfolio: [Check out my portfolio](https://zineddine-benkhaled.vercel.app)
👨‍💻 GitHub: [Visit my GitHub profile](https://github.com/ZineddineBk09)

How can I assist you today?
  `

  await ctx.reply(introduction, {
    reply_markup: welcomeMenu,
    parse_mode: 'Markdown',
  })
}
