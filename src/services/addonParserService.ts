import axios, { AxiosError, AxiosResponse } from "axios";
import * as cheerio from 'cheerio';
import { ErrorResponse } from "src/models/errorResponse";
import { CategoryTagInterface, mozillaResponse } from "src/models/mozillaResponse";

const ADDON_BASE_URL = 'https://addons.mozilla.org';

export const parseAddonData = async (addonId: string): Promise<mozillaResponse | ErrorResponse> => {

    let resBody: string | null = null;

    await axios.get(`https://addons.mozilla.org/en-US/firefox/addon/${addonId}`)
        .then((r: AxiosResponse) => {
            resBody = r.data;
        })
        .catch((err: AxiosError) => {
            console.log(err.message, err.response?.status)
        })

    if (resBody == null) {
        let e: ErrorResponse = { errorCode: 404, errorMessage: 'Could not fetch the addon. Please check the addon ID.' }
        return Promise.reject(e)
    }

    let addonData = {} as mozillaResponse;

    addonData.url = `${ADDON_BASE_URL}/en-US/firefox/addon/${addonId}`;

    const $ = cheerio.load(resBody);

    addonData.author = $('.AddonTitle-author').text().trim();
    addonData.authorURL = $('.AddonTitle-author a').attr('href') ? ADDON_BASE_URL + $('.AddonTitle-author a').attr('href') : '';
    addonData.title = ($('.AddonTitle').text()).replace(addonData.author, "").trim();
    addonData.imageURL = $('.Addon-icon-image').attr('src') ?? '';

    // update the author name 
    addonData.author = addonData.author.replace('by ', '');

    // MetadataCard - list
    let metaData: Object[] = []
    const metadataCards = $('.MetadataCard-list');

    metadataCards.each((i, elem) => {
        const el = $(elem)
        let key = el.find('.MetadataCard-title').text().trim().toLowerCase();
        const value = el.find('.MetadataCard-content').text().trim().toLowerCase();

        if (key.includes('stars')) {
            key = 'ratings';
        }


        const metaDataItem = { key: key, value: value }
        metaData.push(metaDataItem)
    });
    addonData.metaData = metaData;

    // ratings
    let ratings: Object[] = [];
    const ratingsElements = $('.RatingsByStar-row');

    ratingsElements.each((i, elem) => {
        const el = $(elem)
        const key = el.find('.RatingsByStar-star').text().trim();
        const value = el.find('.RatingsByStar-count').text().trim();
        const ratingItem = { key: key, value: value }
        ratings.push(ratingItem)
    });
    addonData.ratings = ratings;

    // screenshot images 
    let images: string[] = [];
    const screenshotElements = $('.ScreenShots-image');

    screenshotElements.each((i, elem) => {
        const el = $(elem)
        const imageSrc = el.attr('src')

        if (imageSrc) {
            images.push(imageSrc)
        }

    });

    addonData.images = images;


    // description 
    addonData.description = $('.AddonDescription-contents').html() ?? '';

    // permissions 
    let permissions: string[] = [];
    const permissionsElements = $('.PermissionsCard-list--required').children('li');

    permissionsElements.each((i, elem) => {
        const el = $(elem)
        permissions.push(el.text().trim());
    });

    addonData.permissions = permissions;

    // homepage 
    addonData.homePage = $('.AddonMoreInfo-homepage-link').attr('title') ?? null;
    addonData.supportEmail = $('.AddonMoreInfo-support-email').attr('href')?.replace("mailto:", "") ?? null;
    addonData.supportLink = $('.AddonMoreInfo-support-link').attr('title') ?? null;
    addonData.version = $('.AddonMoreInfo-version').text().trim();
    addonData.size = $('.AddonMoreInfo-filesize').text().trim();
    addonData.lastUpdated = $('.AddonMoreInfo-last-updated').text().trim().match(/\(([^()]*)\)/)?.pop() ?? '';

    // categories
    let categories: CategoryTagInterface[] = [];
    const categoriesElements = $('.AddonMoreInfo-related-category-link');

    categoriesElements.each((i, elem: cheerio.Element) => {
        const el = $(elem)
        categories.push({
            name: el.text().trim(),
            url: el.attr('href') ? ADDON_BASE_URL + el.attr('href') : ''
        });
    });

    addonData.categories = categories;

    // license 
    addonData.license = $('.AddonMoreInfo-license').text().trim();

    // tags
    let tags: CategoryTagInterface[] = [];
    const tagsElements = $('.AddonMoreInfo-tag-link');

    tagsElements.each((i, elem: cheerio.Element) => {
        const el = $(elem)
        tags.push({
            name: el.text().trim(),
            url: el.attr('href') ? ADDON_BASE_URL + el.attr('href') : ''
        });
    });

    addonData.tags = tags;

    return Promise.resolve(addonData);

}
