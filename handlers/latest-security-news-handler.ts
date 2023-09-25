import { Context, InlineKeyboard } from 'grammy'
import 'dotenv/config'
import { getCategories, getLatestNews } from '../utils'
import { welcomeMenu } from './welcome-handler'

export const newsCategoryMenu = getCategories().then((categories) => {
  const menu = new InlineKeyboard()
  for (let i = 0; i < categories.length; i++) {
    menu.text(
      categories[i],
      'latest_news_by_category_' + categories[i].toLocaleLowerCase()
    )
  }
  return menu.row().text('Back to Main Menu', 'back_to_main_menu')
})

export async function handleLatestSecurityNews(ctx: Context) {
  console.log('security_news')
  // get the data from the response
  const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000'
  const data = await getLatestNews(SERVER_URL + '/api/security-news')
  if (data.length == 0) {
    await ctx.reply(
      'Coingecko Exceeded the Rate Limit. Please try again later in 1 minute.'
    )
    return
  }
  // loop through the data
  for (let i = 0; i < data.length; i++) {
    // add the title and the link to the string
    await ctx.reply(data[i].pageUrl)
  }

  await ctx.reply('Latest News on Cointelegraph', {
    reply_markup: await welcomeMenu,
  })
}
