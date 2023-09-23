const axios = require('axios')
const cheerio = require('cheerio')

const URL = 'https://cointelegraph.com/category/latest-news'

// Function to scrape data from CoinTelegraph
async function scrapeCoinTelegraph() {
  try {
    const response = await axios.get(URL)
    const html = response.data
    const $ = cheerio.load(html)

    // Extract news headlines
    const headlines = $('.card-title')
      .map((_, element) => $(element).text())
      .get()

    // Extract news article URLs
    const articleURLs = $('.card-title')
      .map((_, element) => $(element).attr('href'))
      .get()
      .map((url) => `https://cointelegraph.com${url}`)

    // Combine headlines and URLs into an array of objects
    const newsData = headlines.map((headline, index) => ({
      headline,
      url: articleURLs[index],
    }))

    return newsData
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

// Usage
scrapeCoinTelegraph()
  .then((data) => {
    console.log('Latest CoinTelegraph News:')
    data.forEach((item, index) => {
      console.log(`${index + 1}. ${item.headline}`)
      console.log(`   URL: ${item.url}`)
    })
  })
  .catch((error) => {
    console.error('Error:', error)
  })
