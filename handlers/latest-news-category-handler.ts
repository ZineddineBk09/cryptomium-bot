import { Context, InlineKeyboard } from 'grammy'
import 'dotenv/config'
import { getCategories, getLatestNewsByCategory } from '../utils'

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

export async function handleLatestNewsByCategory(ctx: Context) {
  console.log('latest_news_by_category')
  // check how to get the category from the callback query
  const category =
    ctx.callbackQuery!.data!.replace('latest_news_by_category_', '') || 'news'
  // get the data from the response
  const data = await getLatestNewsByCategory(category)
  // loop through the data
  for (let i = 0; i < data.length; i++) {
    // add the title and the link to the string
    await ctx.reply(data[i].pageUrl)
  }

  await ctx.reply('Latest News on Cointelegraph', {
    reply_markup: await newsCategoryMenu,
  })
}
