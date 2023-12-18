import { RequestHandler, Request, Response, NextFunction } from "express";
import * as cheerio from 'cheerio';
import axios, { AxiosError, AxiosResponse } from "axios";

class mozillaController {

    index: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

        const addonId = req.params.addonId;

        if (!addonId) {
            return res.status(400).json({ error: 'Please use an existing addon ID. i.e. /mozilla/medium-parser' });
        }

        let resBody: string | null = null;

        await axios.get(`https://addons.mozilla.org/en-US/firefox/addon/${addonId}`)
            .then((r: AxiosResponse) => {
                console.log(r.status)
                resBody = r.data;
            })
            .catch((err: AxiosError) => {
                console.log(err.message, err.response?.status)
            })

        if (resBody == null) {
            return res.status(404).json({ error: 'Addon not found. Please check the addon ID.' });
        }

        const $ = cheerio.load(resBody);

        const addonAuthor = $('.AddonTitle-author').text().trim();
        const authorLink = $('.AddonTitle-author a').attr('href');
        const addonTitle = ($('.AddonTitle').text()).replace(addonAuthor, "").trim();


        let metaData: Object[] = [];
        // MetadataCard - list
        const metadataCards = $('.MetadataCard-list');

        metadataCards.each((i, elem) => {
            const el = $(elem)
            const key = el.find('.MetadataCard-title').text().trim().toLowerCase();
            const value = el.find('.MetadataCard-content').text().trim().toLowerCase();
            const metaDataItem = { key: key, value: value }
            metaData.push(metaDataItem)
        })

        // ratings
        let ratings: Object[] = [];
        // MetadataCard - list
        const ratingsElements = $('.RatingsByStar-row');

        ratingsElements.each((i, elem) => {
            const el = $(elem)
            const key = el.find('.RatingsByStar-star').text().trim();
            const value = el.find('.RatingsByStar-count').text().trim();
            const ratingItem = { key: key, value: value }
            ratings.push(ratingItem)
        })

        // screenshot images 
        let images: string[] = [];

        const screenshotElements = $('.ScreenShots-image');

        screenshotElements.each((i, elem) => {
            const el = $(elem)
            const imageSrc = el.attr('src')

            if (imageSrc) {
                images.push(imageSrc)
            }

        })

        // description 
        const description = $('.AddonDescription-contents').html();

        // permissions 
        let permissions: string[] = [];

        const permissionsElements = $('.PermissionsCard-list--required').children('li');

        permissionsElements.each((i, elem) => {
            const el = $(elem)
            permissions.push(el.text().trim());
        })

        // homepage 
        const homepage = $('.AddonMoreInfo-homepage-link').attr('title') ?? null;
        const supportEmail = $('.AddonMoreInfo-support-email').attr('href')?.replace("mailto:", "") ?? null;
        const supportLink = $('.AddonMoreInfo-support-link').attr('title') ?? null;
        const version = $('.AddonMoreInfo-version').text().trim();
        const size = $('.AddonMoreInfo-filesize').text().trim();
        const lastUpdated = $('.AddonMoreInfo-last-updated').text().trim().match(/\(([^()]*)\)/)?.pop() ?? null;

        // categories
        let categories: Object[] = [];

        const categoriesElements = $('.AddonMoreInfo-related-category-link');

        categoriesElements.each((i, elem: cheerio.Element) => {
            const el = $(elem)
            categories.push({
                name: el.text().trim(),
                link: el.attr('href') ?? null
            });
        });

        // license 
        const license = $('.AddonMoreInfo-license').text().trim();

        // tags
        let tags: Object[] = [];

        const tagsElements = $('.AddonMoreInfo-tag-link');

        tagsElements.each((i, elem: cheerio.Element) => {
            const el = $(elem)
            tags.push({
                name: el.text().trim(),
                link: el.attr('href') ?? null
            });
        });

        return res.send({ addonTitle, authorLink, addonAuthor: addonAuthor.replace("by ", ""), metaData, ratings, images, description, permissions, homepage, supportEmail, supportLink, version, size, lastUpdated, tags, license });
    };


}

export default new mozillaController();
