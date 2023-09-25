import axios from 'axios'
import 'dotenv/config'

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000'

export async function getLatestNews(url: string = SERVER_URL + '/api/news') {
  try {
    const response = await axios.get(url)
    const data = response.data

    return data
  } catch (error) {
    console.log('getLatestNews Error:', error)
    return []
  }
}

export async function getLatestNewsByCategory(category: string) {
  try {
    const response = await axios.get(
      SERVER_URL + '/api/news?category=' + category.toUpperCase()
    )
    const data = response.data

    return data
  } catch (error) {
    console.log('getLatestNewsByCategory Error:', error)
    return []
  }
}

export async function getCategories() {
  try {
    const data = await getLatestNews()
    let categories: string[] = []
    // get unique categories from the data
    for (let i = 0; i < data.length; i++) {
      if (!categories.includes(data[i].category)) {
        categories.push(data[i].category)
      }
    }
    return categories
  } catch (error) {
    console.log('getCategories Error:', error)
    return []
  }
}

export async function getSecurityNewsCategories() {
  try {
    const data = await getLatestNews(SERVER_URL + '/api/security-news')
    let categories: string[] = []
    // get unique categories from the data
    for (let i = 0; i < data.length; i++) {
      if (!categories.includes(data[i].category)) {
        categories.push(data[i].category)
      }
    }
    return categories
  } catch (error) {
    console.log('getCategories Error:', error)
    return []
  }
}

export async function getLatestCryptoPrices(currency: string = 'usd') {
  try {
    const URL =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=' + currency
    const response = await axios.get(URL)
    const data = response.data

    return data
  } catch (error) {
    console.log('getLatestCryptoPrices Error:', error)
    return []
  }
}

export async function getCurrencyInfos(currency: string) {
  try {
    const URL =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' +
      currency
    const response = await axios.get(URL)
    const data = response.data

    return data[0]
  } catch (error) {
    console.log('getCurrencyInfos Error:', error)
    return {}
  }
}
