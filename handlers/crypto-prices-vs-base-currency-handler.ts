import { Context, InlineKeyboard } from 'grammy'
import 'dotenv/config'
import { CryptoCurrency } from '../interfaces'
import { getLatestCryptoPrices } from '../utils'

let cryptoPrices: CryptoCurrency[] = [] as CryptoCurrency[]
let currentPage = 1
let currency = 'usd'
let counter = 60
const pageSize = 10
const cryptoPricesVsCurrencyMenuRegex = /crypto_prices_vs_(.*)/

export async function handleCryptoVsBaseCurrency(ctx: Context)  {
  console.log('crypto_prices_vs_usd')
  currency = ctx.callbackQuery!.data!.replace('crypto_prices_vs_', '') || 'usd'
  cryptoPrices = await getLatestCryptoPrices(currency)

  // handle coingecko exceeded the rate limit error => data=[]
  if (cryptoPrices.length == 0) {
    await ctx.reply(
      'Coingecko Exceeded the Rate Limit. Please try again later in 1 minute.'
    )
    counter != 60 && counter != 0 ? null : (counter = 60)
    // display a counter to the user
    const interval = setInterval(() => {
      counter--
      ctx.editMessageText('Please try again in ' + counter + ' seconds.')
      if (counter == 0) {
        clearInterval(interval)
        counter = 60
      }
    }, 1000)

    return
  }

  const prices = cryptoPrices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // display each currency as a button
  const currencies = new InlineKeyboard()

  const displayCurrency =
    currency.toUpperCase() === 'USD'
      ? '$'
      : currency.toUpperCase() === 'EUR'
      ? '€'
      : currency.toUpperCase() === 'BTC'
      ? '₿'
      : 'ETH'
  // loop through the data
  for (let i = 0; i < prices.length; i++) {
    const {
      name,
      current_price,
      market_cap_rank,
      price_change_percentage_24h,
      symbol,
    } = prices[i]
    const price_change_percentage_24h_string =
      price_change_percentage_24h > 0
        ? `${market_cap_rank} - ${name} (${symbol.toUpperCase()}) ${displayCurrency}${current_price} (24H: +${price_change_percentage_24h}%)`
        : `${market_cap_rank} - ${name} (${symbol.toUpperCase()}) ${displayCurrency}${current_price} (24H: ${price_change_percentage_24h}%)`

    // add the title and the link to the string
    currencies
      .text(
        price_change_percentage_24h_string,
        'currency_' + name.toLowerCase()
      )
      .row()
  }

  currencies
    .row()
    .text('Back to Main Menu', 'back_to_main_menu')
    .row()
    .text('Previous', 'previous')
    .text('Next', 'next')

  await ctx.editMessageText('Choose a Currency', {
    reply_markup: currencies,
    parse_mode: 'HTML',
  })
}
