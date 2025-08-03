import axios from 'axios';
import { load } from 'cheerio';

// Configuration matching the aniwatch package
const DOMAIN = "hianimez.to";
const SRC_BASE_URL = `https://${DOMAIN}`;

const clientConfig = {
    timeout: 8000,
    headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept-Encoding": "gzip, deflate, br"
    }
};

const client = axios.create(clientConfig);

/**
 * Scrapes top search data from the root page
 * @returns {Promise<Object>} Top search data
 */
export async function getTopSearchData() {
    const res = {
        topSearchItems: []
    };
    
    try {
        // Fetch the root page
        const mainPage = await client.get(SRC_BASE_URL);
        const $ = load(mainPage.data);
        
        // Extract top search items
        const topSearchSection = $('.xhashtag');
        
        if (topSearchSection.length > 0) {
            topSearchSection.find('a.item').each((_, el) => {
                const $el = $(el);
                
                // Extract the search term from the href parameter
                const href = $el.attr('href');
                let searchTerm = null;
                let searchUrl = null;
                
                if (href) {
                    searchUrl = href;
                    // Extract keyword from URL like "/search?keyword=Kaiju%20No.%208%20Season%202"
                    try {
                        const urlParams = new URLSearchParams(href.split('?')[1]);
                        searchTerm = urlParams.get('keyword');
                        // Decode URL encoding
                        if (searchTerm) {
                            searchTerm = decodeURIComponent(searchTerm);
                        }
                    } catch (e) {
                        // If URL parsing fails, use display text
                        searchTerm = $el.text().trim();
                    }
                }
                
                // Extract the display text
                const displayText = $el.text().trim();
                
                res.topSearchItems.push({
                    searchTerm: searchTerm || displayText,
                    displayText: displayText,
                    searchUrl: searchUrl,
                    rank: res.topSearchItems.length + 1
                });
            });
        }
        
        return res;
    } catch (err) {
        // Create an error similar to HiAnimeError
        const error = new Error(`getTopSearchData: ${err.message}`);
        error.scraper = 'getTopSearchData';
        error.status = err.response?.status || 500;
        throw error;
    }
}