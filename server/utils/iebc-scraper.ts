
import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import * as pdfParse from 'pdf-parse/lib/pdf-parse.js';

export async function scrapeIEBCRepresentatives() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://www.iebc.or.ke', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // Extract representatives data
    const representatives = await page.evaluate(() => {
      // Add specific selectors and data extraction logic here
      const items = document.querySelectorAll('.representatives-list item');
      return Array.from(items).map(item => ({
        name: item.querySelector('.name')?.textContent?.trim(),
        position: item.querySelector('.position')?.textContent?.trim(),
        region: item.querySelector('.region')?.textContent?.trim()
      }));
    });

    return representatives;
  } catch (error) {
    console.error('Error scraping IEBC website:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export async function scrapeParliamentMPs() {
  try {
    const pdfPath = './attached_assets/List of Members by Parties 13th Parliament as at 22nd May 2023 for website.pdf';
    const data = await pdfParse(pdfPath);
    
    // Parse the PDF content to extract MP information
    const lines = data.text.split('\n').filter(line => line.trim());
    const mps = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Look for lines containing MP information
      if (line.includes('Constituency') && i + 1 < lines.length) {
        const mpInfo = {
          name: lines[i].split('Hon.')[1]?.trim() || '',
          position: 'Member of Parliament',
          level: 'national',
          constituency: lines[i].split('Constituency')[0]?.trim() || '',
          party: lines[i + 1]?.includes('Party:') ? lines[i + 1].split('Party:')[1]?.trim() : '',
          status: 'Active',
          type: 'mp'
        };
        
        if (mpInfo.name && mpInfo.constituency) {
          mps.push(mpInfo);
        }
      }
    }

    return mps;
  } catch (error) {
    console.error('Error scraping Parliament website:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export async function scrapeIEBCPdf(url: string) {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    
    const data = await pdfParse(buffer);
    
    return {
      content: data.text,
      pageCount: data.numpages,
      info: data.info
    };
  } catch (error) {
    console.error('Error scraping IEBC PDF:', error);
    throw error;
  }
}
