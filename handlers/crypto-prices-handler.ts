import { Context, InlineKeyboard } from 'grammy'
import 'dotenv/config'

export const cryptoPricesVsCurrencyMenu = new InlineKeyboard()
  .text('USD', 'crypto_prices_vs_usd')
  .text('EUR', 'crypto_prices_vs_eur')
  .text('BTC', 'crypto_prices_vs_btc')
  .text('ETH', 'crypto_prices_vs_eth')
  .row()
  .text('Back to Main Menu', 'back_to_main_menu')

export async function handleCryptoPrices(ctx: Context) {
  console.log('crypto_prices')
  // display cryptoPricesVsCurrencyMenu
  await ctx.editMessageText('Choose the Base Currency', {
    reply_markup: cryptoPricesVsCurrencyMenu,
  })
}
