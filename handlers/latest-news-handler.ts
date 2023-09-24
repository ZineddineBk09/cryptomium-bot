import { Context, InlineKeyboard } from 'grammy'
import 'dotenv/config'
import { getCategories } from '../utils'

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

export async function handleWelcome(ctx: Context) {
  console.log('latest_news')
  await ctx.reply('Latest News on Cointelegraph', {
    reply_markup: await newsCategoryMenu,
  })
}
