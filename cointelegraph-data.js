const puppeteer = require('puppeteer')
const fs = require('fs')

const COINTELEGRAPH_URL = 'https://cointelegraph.com/category/latest-news'
const BASE_URL = 'https://cointelegraph.com'

function saveDataToJson(data) {
  //{
  // "news": []
  // }
  // update the news array with the data
  const jsonData = JSON.stringify(data, null, 2) // Convert data to JSON format with indentation
  fs.writeFileSync(
    'coinTelegraphData.json',
    JSON.stringify({ news: data }, null, 2)
  ) // Write data to 'coinTelegraphData.json' file
  console.log('Data saved to coinTelegraphData.json')
}

// Function to scrape data from CoinTelegraph
async function scrapeCoinTelegraphLatestNewsURLs() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      timeout: 0,
    })
    const page = await browser.newPage()
    await page.goto(COINTELEGRAPH_URL)

    // Scroll down the page multiple times to load more articles
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
    }

    // Extract news page URLs
    const newsPageUrls = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll('.post-card-inline__figure-link')
      )
      return links.map((link) => link.getAttribute('href'))
    })

    await browser.close()
    return newsPageUrls
  } catch (error) {
    throw error
  }
}

const scrapeCoinTelegraphLatestNews = async () => {
  try {
    const newsPageUrls = await scrapeCoinTelegraphLatestNewsURLs()
    const browser = await puppeteer.launch({
      headless: 'new',
      timeout: 0,
    })

    // Extract data from news pages
    const newsData = await Promise.all(
      newsPageUrls.map(async (url) => {
        try {
          console.log('Scraping data from page:', BASE_URL + url)
          const page = await browser.newPage()
          await page.goto(BASE_URL + url)

          // Extract data from news page
          const data = await page.evaluate(() => {
            const title =
              document.querySelector('.post__title')?.innerText || ''
            const author =
              document.querySelector('.post-meta__author-name')?.innerText || ''
            const lead = document.querySelector('.post__lead')?.innerText || ''
            const date =
              document.querySelector('.post-meta__publish-date')?.innerText ||
              ''
            const imageUrl = document
              .querySelector('.lazy-image__img')
              .getAttribute('src')
            const category =
              document.querySelector('.post-cover__badge')?.innerText || ''

            return {
              title,
              author,
              lead,
              date,
              category,
              imageUrl,
            }
          })

          await page.close()

          return { ...data, pageUrl: BASE_URL + url }
        } catch (error) {
          console.error('Error scraping news page:', error)
          return {
            title: '',
          }
        }
      })
    )

    await browser.close()
    // add pageUrl to each news
    return newsData.filter((news) => news.title !== '')
  } catch (error) {
    throw error
  }
}

// Usage
scrapeCoinTelegraphLatestNews()
  .then((data) => {
    console.log('Latest CoinTelegraph News:', data, data.length)
    saveDataToJson(data)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
