import { Context, InlineKeyboard } from 'grammy'
import 'dotenv/config'
import { getCurrencyInfos } from '../utils'
import { CryptoCurrency } from '../interfaces'

let counter = 60

export const paginationKeyboard = new InlineKeyboard()
  .text('Previous', 'previous')
  .text('Next', 'next')
  .row()
  .text('Back to Main Menu', 'back_to_main_menu')

export async function handleCurrency(ctx: Context) {
  console.log('currency:', ctx.callbackQuery!.data || 'currency_')
  // Display full info about the currency
  const currency =
    ctx.callbackQuery!.data!.replace('currency_', '') || 'bitcoin'
  const data = await getCurrencyInfos(currency)

  // handle coingecko exceeded the rate limit error => data=[]
  if (!data) {
    await ctx.reply(
      'Coingecko Exceeded the Rate Limit. Please try again later in 1 minute.'
    )
    counter != 60 && counter != 0 ? null : (counter = 60)
    // display a counter to the user
    const interval = setInterval(async () => {
      counter--
      //replace the message with the new counter
      await ctx.editMessageText('Please try again in ' + counter + ' seconds.')

      if (counter === 0) {
        clearInterval(interval)
        counter = 60
      }
    }, 1000)
    return
  }

  const {
    name,
    current_price,
    market_cap_rank,
    price_change_percentage_24h,
    symbol,
    image,
    ath,
    ath_change_percentage,
    ath_date,
    atl,
    atl_change_percentage,
    atl_date,
  } = data as CryptoCurrency

  const price_change_percentage_24h_string =
    price_change_percentage_24h > 0
      ? `<b>24H Change: <code>+${price_change_percentage_24h.toFixed(
          2
        )}%</code></b>`
      : `<b>24H Change: <code>${price_change_percentage_24h.toFixed(
          2
        )}%</code></b>`
  const ath_change_percentage_string =
    ath_change_percentage > 0
      ? `<b>All-Time High Change: <code>+${ath_change_percentage.toFixed(
          2
        )}%</code></b>`
      : `<b>All-Time High Change: <code>${ath_change_percentage.toFixed(
          2
        )}%</code></b>`
  const atl_change_percentage_string =
    atl_change_percentage > 0
      ? `<b>All-Time Low Change: <code>+${atl_change_percentage.toFixed(
          2
        )}%</code></b>`
      : `<b>All-Time Low Change: <code>${atl_change_percentage.toFixed(
          2
        )}%</code></b>`

  const displayCurrency =
    currency.toUpperCase() === 'USD'
      ? '$'
      : currency.toUpperCase() === 'EUR'
      ? '€'
      : currency.toUpperCase() === 'BTC'
      ? '₿'
      : 'ETH'

  const formattedMessage = `
    <b>Currency:</b> ${name} (${symbol.toUpperCase()}) 
    <b>Rank:</b> #${market_cap_rank} 
    <b>Price:</b> ${displayCurrency}${current_price.toFixed(2)}
    ${price_change_percentage_24h_string}
    ${ath_change_percentage_string}
    ${atl_change_percentage_string}
  `

  await ctx.replyWithPhoto(image, {
    caption: formattedMessage,
    parse_mode: 'HTML',
  })

  await ctx.reply('More Prices', {
    reply_markup: paginationKeyboard,
  })
}
