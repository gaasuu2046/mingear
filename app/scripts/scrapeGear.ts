// scripts/scrapeGear.ts
import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import * as cheerio from 'cheerio'

const prisma = new PrismaClient()

async function scrapeGear(url: string) {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    const promises = $('.itemList_item').map((index, element) => {
      const $element = $(element)
      const name = $element.find('._name').text().trim()
      const price = $element.find('._price').text().trim().replace('¥', '').replace(',', '').split(' ')[0]
      const imageUrl = $element.find('._thumb img').attr('src')
      const productUrl = 'https://moonlight-gear.com' + $element.find('a').attr('href')
      const label = $element.find('._label').text().trim()

      return prisma.gear.create({
        data: {
          name,
          description: name,
          // price: parseInt(price),
          img: imageUrl ? `https:${imageUrl}` : '',
          // productUrl,
          // label,
          // カテゴリとブランドは個別の商品ページから取得する必要があるため、ここでは空文字列としています
          category: '',
          brand: '',
        },
      })
    }).get()

    await Promise.all(promises)
    console.log(`Scraped and saved ${promises.length} items`)
  } catch (error) {
    console.error('Error scraping gear:', error)
  }
}

// 使用例
const targetUrl = 'https://moonlight-gear.com/'
scrapeGear(targetUrl)
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })