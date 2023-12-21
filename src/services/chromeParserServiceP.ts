// import puppeteer from "puppeteer";
import { chromeResponse } from "src/models/chromeResponse";
import { ErrorResponse } from "src/models/errorResponse";
// import chromium from 'chrome-aws-lambda';
import { chromium } from "playwright";
import edgeChromium from 'chrome-aws-lambda'

// Importing Puppeteer core as default otherwise
// it won't function correctly with "launch()"
import puppeteer from 'puppeteer-core'
const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const ADDON_BASE_URL = 'https://addons.mozilla.org';

export const parseChromeDataP = async (addonId: string): Promise<chromeResponse | ErrorResponse> => {

    try {
        const executablePath = await edgeChromium.executablePath || LOCAL_CHROME_EXECUTABLE
        const browser = await puppeteer.launch({
            executablePath,
            headless: false,
            defaultViewport: null,
        });

        // const browser = await chromium.puppeteer.launch({
        //     args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        //     defaultViewport: chromium.defaultViewport,
        //     executablePath: await chromium.executablePath,
        //     headless: true,
        //     ignoreHTTPSErrors: true,
        // })

        // const browser = await chromium.launch({ headless: true });
        // const context = await browser.newContext();
        // // Open a new page
        const page = await browser.newPage();

        // On this new page:
        // - open the "http://quotes.toscrape.com/" website
        // - wait until the dom content is loaded (HTML is ready)
        // https://chromewebstore.google.com/detail/medium-parser/egejbknaophaadmhijkepokfchkbnelc?hl=en
        // https://chromewebstore.google.com/detail/medium-for-all/iiakpffjljhppecmbiklaokmnbacpooa?hl=en

        await page.goto(`https://chromewebstore.google.com/detail/${addonId}?hl=en`);

        // check title /html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/a/h1
        let titleEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/a/h1')

        if (titleEl.length === 0) {
            // 404 response 
            let e: ErrorResponse = { errorCode: 404, errorMessage: 'Could not fetch date. Please check the extension id.' }
            return Promise.reject(e)
        }

        // check title /html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/a/h1
        // // let isTitleElVisible = await page.locator('xpath=/html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/a/h1').isVisible({ timeout: 3000 });

        // if (isTitleElVisible == false) {
        //     // 404 response 
        //     let e: ErrorResponse = { errorCode: 404, errorMessage: 'Could not fetch date. Please check the extension id.' }
        //     return Promise.reject(e)
        // }

        // // get the title 


        let addonData = {} as chromeResponse;

        let title = await page.evaluate(el => el.textContent, titleEl[0]);
        addonData.title = title ?? '';


        // let title = await page.locator('xpath=/html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/a/h1').textContent();
        // addonData.title = title ?? '';
        // // console.log(title)

        // // url 
        // // addonData.url = "https://chromewebstore.google.com/detail/" + addonId


        // let img = await page.$x('/html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/a/img/@src')
        // let imgSrc = await page.evaluate(el => el.textContent, img[0]);
        // addonData.imageURL = imgSrc ?? '';
        // // console.log(imgSrc)


        // // rating /html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/div[1]/span[2]/span/span[1]
        // let ratingEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/div[1]/span/span/span[1]')
        // let rating = await page.evaluate(el => el.textContent, ratingEl[0]);
        // addonData.rating = rating ?? '';
        // // console.log(rating)

        // // rating count /html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/div[1]/span[2]/span/span[2]/a/p
        // let ratingCountEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/div[1]/span/span/span[2]/a/p')
        // let ratingCount = await page.evaluate(el => el.textContent, ratingCountEl[0]);
        // addonData.ratingsCount = ratingCount ?? '';
        // // console.log(ratingCount)

        // // users count /html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/div[2]
        // let usersCountEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/div[2]')
        // let usersCountWithComma = await page.evaluate(el => el.textContent, usersCountEl[0]);
        // const usersCount = (usersCountWithComma?.match(/\d/g))?.join('');
        // addonData.users = usersCount ?? '';
        // // console.log(usersCount)

        // // categories /html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/div[2]/a[1]
        // let categoriesEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[1]/section/div[1]/div[2]/a')
        // let categories: string[] = [];
        // if (categoriesEl.length > 0) {
        //     categories = await page.evaluate((...categoriesEl) => {
        //         return categoriesEl.map(e => {
        //             return e.textContent ?? ''
        //         });
        //     }, ...categoriesEl);
        // }
        // addonData.categories = categories;
        // // console.log(categories)

        // // images $x('/html/body/c-wiz/div/div/main/div[1]/section[2]/div[2]/child::node()')
        // let imagesEl = await page.$x('/html/body/c-wiz/div/div/main/div[1]/section[2]/div[2]/descendant::img/@src')
        // let images: string[] = [];
        // if (imagesEl.length > 0) {
        //     images = await page.evaluate((...imagesEl) => {
        //         return imagesEl.map(e => {
        //             console.log(e)
        //             return e.textContent ?? ''
        //         });
        //     }, ...imagesEl);
        // }

        // if (images.length > 0) {
        //     addonData.images = images
        // }

        // // console.log(images)

        // // single img /html/body/c-wiz/div/div/main/div/section[2]/div/div/img
        // //            /html/body/c-wiz/div/div/main/div/section[2]/div/div/div/img
        // let featuredImgEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[2]/div/div/descendant::img/@src')
        // if (featuredImgEl.length > 0) {
        //     let featuredImg = await page.evaluate(el => el.textContent, featuredImgEl[0]);
        //     addonData.images = [featuredImg ?? '']
        //     // console.log(featuredImg)
        // }

        // // overview /html/body/c-wiz/div/div/main/div/section[3]/div[2]/div/div[1]
        // let overviewEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[3]/div[2]/div/div[1]')
        // if (overviewEl.length > 0) {
        //     let overview = await page.evaluate(el => el.textContent, overviewEl[0]);
        //     addonData.description = overview ?? ''
        //     // console.log(overview)
        // }

        // // version /html/body/c-wiz/div/div/main/div/section[4]/div[2]/div/ul/li[1]/div[2]
        // let versionEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[4]/div[2]/div/ul/li[1]/div[2]')
        // let version = await page.evaluate(el => el.textContent, versionEl[0]);
        // addonData.version = version ?? ''
        // // console.log(version)

        // // author /html/body/c-wiz/div/div/main/div/section[4]/div[2]/div/ul/li[4]/div[2]
        // //       /html/body/c-wiz[2]/div/div/main/div/section[4]/div[2]/div/ul/li[6]/div[2]/div/details/div
        // let authorEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[4]/div[2]/div/ul/li[4]/div[2]')
        // let author = await page.evaluate(el => el.textContent, authorEl[0]);
        // addonData.author = author ?? ''
        // // console.log(author)

        // // last updated /html/body/c-wiz/div/div/main/div/section[4]/div[2]/div/ul/li[2]/div[2]
        // let lastUpdatedEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[4]/div[2]/div/ul/li[2]/div[2]')
        // let lastUpdated = await page.evaluate(el => el.textContent, lastUpdatedEl[0]);
        // addonData.lastUpdated = lastUpdated ?? ''
        // // console.log(lastUpdated)

        // // last size /html/body/c-wiz/div/div/main/div/section[4]/div[2]/div/ul/li[5]/div[2]
        // let sizeEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[4]/div[2]/div/ul/li[5]/div[2]')
        // let size = await page.evaluate(el => el.textContent, sizeEl[0]);
        // addonData.size = size ?? ''
        // console.log(size)

        // // dev mail /html/body/c-wiz/div/div/main/div/section[4]/div[2]/div/ul/li[7]/div[2]/div/details/div
        // // let devEl = await page.$x('/html/body/c-wiz/div/div/main/div/section[4]/div[2]/div/ul/li[7]/div[2]/div/details/div')
        // // let dev = await page.evaluate(el => el.textContent, devEl[0]);
        // // addonData.supportEmail = dev ?? ''
        // // console.log(dev)

        // // console.log(addonData)

        await browser.close();

        return Promise.resolve(addonData)

    } catch (error) {
        console.log(error)
        let e: ErrorResponse = { errorCode: 404, errorMessage: 'Could not fetch date. Please check the extension id.' }
        return Promise.reject(e)

    }



}
