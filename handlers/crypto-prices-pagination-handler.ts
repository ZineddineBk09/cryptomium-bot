import { Context, InlineKeyboard } from 'grammy'
import 'dotenv/config'
import { CryptoCurrency } from '../interfaces'
import { getLatestCryptoPrices } from '../utils'

let cryptoPrices: CryptoCurrency[] = [] as CryptoCurrency[]
let currentPage = 1
let currency = 'usd'
let counter = 60
const pageSize = 10

export async function handlePrevious(ctx: Context) {
  console.log('previous:', currentPage, ' - ', currency)
  currentPage == 1 ? (currentPage = 1) : (currentPage -= 1)
  cryptoPrices = await getLatestCryptoPrices(currency)
  console.log('cryptoPrices:', cryptoPrices)

  // handle coingecko exceeded the rate limit error => data=[]
  if (cryptoPrices.length == 0) {
    await ctx.reply(
      'Coingecko API Exceeded the Rate Limit. Please try again later in 1 minute.'
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
      id,
    } = prices[i]
    const price_change_percentage_24h_string =
      price_change_percentage_24h > 0
        ? `${market_cap_rank} - ${name} (${symbol.toUpperCase()}) ${displayCurrency}${current_price} (24H: +${price_change_percentage_24h}%)`
        : `${market_cap_rank} - ${name} (${symbol.toUpperCase()}) ${displayCurrency}${current_price} (24H: ${price_change_percentage_24h}%)`

    // add the title and the link to the string
    currencies
      .text(price_change_percentage_24h_string, 'currency_' + id.toLowerCase())
      .row()
  }

  currencies
    .row()
    .text('Previous', 'previous')
    .text('Next', 'next')
    .row()
    .text('Back to Main Menu', 'back_to_main_menu')

  if (currentPage == 1) {
    await ctx.reply('Choose a Currency', {
      reply_markup: currencies,
      parse_mode: 'HTML',
    })
  } else {
    await ctx.editMessageText('Choose a Currency', {
      reply_markup: currencies,
      parse_mode: 'HTML',
    })
  }
}

export async function handleNext(ctx: Context) {
  console.log('next:', currentPage, ' - ', currency)
  console.log(cryptoPrices.length / pageSize)
  currentPage == cryptoPrices.length / pageSize
    ? (currentPage = 1)
    : (currentPage += 1)
  cryptoPrices = await getLatestCryptoPrices(currency)

  // handle coingecko exceeded the rate limit error => data=[]
  if (cryptoPrices.length == 0) {
    await ctx.reply(
      'Coingecko Exceeded the Rate Limit. Please try again later in 1 minute.'
    )
    counter != 60 && counter != 0 ? null : (counter = 60)
    // display a counter to the user
    const interval = setInterval(async () => {
      counter--
      await ctx.editMessageText('Please try again in ' + counter + ' seconds.')
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
      id,
    } = prices[i]
    const price_change_percentage_24h_string =
      price_change_percentage_24h > 0
        ? `${market_cap_rank} - ${name} (${symbol.toUpperCase()}) ${displayCurrency}${current_price} (24H: +${price_change_percentage_24h}%)`
        : `${market_cap_rank} - ${name} (${symbol.toUpperCase()}) ${displayCurrency}${current_price} (24H: ${price_change_percentage_24h}%)`

    // add the title and the link to the string
    currencies
      .text(price_change_percentage_24h_string, 'currency_' + id.toLowerCase())
      .row()
  }

  currencies
    .row()
    .text('Previous', 'previous')
    .text('Next', 'next')
    .row()
    .text('Back to Main Menu', 'back_to_main_menu')

  await ctx.editMessageText('Choose a Currency', {
    reply_markup: currencies,
    parse_mode: 'HTML',
  })
}
