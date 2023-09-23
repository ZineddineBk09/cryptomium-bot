const puppeteer = require('puppeteer')

const COINTELEGRAPH_URL = 'https://cointelegraph.com/category/latest-news'
const BASE_URL = 'https://cointelegraph.com'

// Function to scrape data from CoinTelegraph
async function scrapeCoinTelegraphLatestNewsURLs() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
    })
    const page = await browser.newPage()
    await page.goto(COINTELEGRAPH_URL)

    // Scroll down the page multiple times to load more articles
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight - 1200)
      })
      await page.waitForTimeout(2000) // Wait for page to load
    }

    // Extract news page URLs
    const newsPageUrls = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll('.post-card-inline__figure-link')
      )
      return links.map((link) => link.getAttribute('href'))
    })

    await browser.close()
    // console.log(newsPageUrls.length, 'news page URLs found')
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
    })

    // Extract data from news pages
    const newsData = await Promise.all(
      newsPageUrls.map(async (url) => {
        console.log('Scraping data from page:', BASE_URL + url)
        const page = await browser.newPage()
        await page.goto(BASE_URL + url)

        // Extract data from news page
        const data = await page.evaluate(() => {
          const title = document.querySelector('.post__title')?.innerText || ''
          const author =
            document.querySelector('.post-meta__author-name')?.innerText || ''
          const lead = document.querySelector('.post__lead')?.innerText || ''
          const date =
            document.querySelector('.post-meta__publish-date')?.innerText || ''
          const content = document.querySelector('.post__text')?.innerText || ''
          const imageUrl = document
            .querySelector('.lazy-image__img')
            .getAttribute('src')

          return {
            title,
            author,
            lead,
            date,
            content,
            imageUrl,
          }
        })

        await page.close()

        return { ...data, pageUrl: BASE_URL + url }
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
    console.log('Latest CoinTelegraph News:', data)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
