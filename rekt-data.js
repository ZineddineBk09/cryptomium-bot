const puppeteer = require('puppeteer')
const cron = require('node-cron')
const fs = require('fs')

const REKT_URL = 'https://rekt.news'

function saveDataToJson(data) {
  const jsonData = JSON.stringify(data, null, 2) // Convert data to JSON format with indentation
  fs.writeFileSync('db.json', JSON.stringify({ securityNews: jsonData }, null, 2)) // Write data to 'db.json' file
  console.log('Data saved to db.json')
}

// Function to scrape data from Rekt
async function scrapeRektLatestNewsURLsAndDescriptions() {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      timeout: 0,
    })
    const page = await browser.newPage()
    await page.goto(REKT_URL)

    // Extract news page URLs
    const urls = await page.evaluate(() => {
      const urls = Array.from(
        document.querySelectorAll('.post-excerpt-more > a')
      ).map((url) => url.getAttribute('href'))
      return urls
    })

    const descriptions = await page.evaluate(() => {
      const descriptions = Array.from(
        document.querySelectorAll('.post-excerpt > p')
      ).map((description) => description.innerText)
      return descriptions
    })

    const newsURLsAndDescriptions = urls.map((url, index) => ({
      url,
      description: descriptions[index * 2],
    }))

    await browser.close()
    return newsURLsAndDescriptions
  } catch (error) {
    throw error
  }
}

const scrapeRektLatestNews = async () => {
  try {
    const newsPageUrls = await scrapeRektLatestNewsURLsAndDescriptions()
    const browser = await puppeteer.launch({
      headless: 'new',
      timeout: 0,
    })

    // Extract data from news pages
    const newsData = await Promise.all(
      newsPageUrls.map(async ({ url, description }) => {
        try {
          const page = await browser.newPage()
          await page.goto(REKT_URL + url, {
            timeout: 0,
          })

          // Extract data from news page
          const data = await page.evaluate(() => {
            const title = document.querySelector('.post-title')?.innerText || ''
            const date =
              document.querySelector('.post-meta > time')?.innerText || ''
            const imageUrl = document
              .querySelector('.post-content p > figure > img')
              .getAttribute('src')
            const category = Array.from(
              document
                .querySelector('.post-meta')
                .querySelectorAll('p > span > a')
            )
              .map((span) => span.innerText)
              .join(' - ')

            return {
              title,
              date,
              category,
              imageUrl,
            }
          })

          await page.close()

          return { ...data, pageUrl: REKT_URL + url, description }
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

scrapeRektLatestNews().then((data) => {
  console.log(data, data.length)
})
// Schedule the scraping script to run every 30 minutes
cron.schedule('*/120 * * * *', () => {
  console.log('Running the scraping script for rekt...')
  scrapeRektLatestNews()
    .then((data) => {
      saveDataToJson(data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })
})
