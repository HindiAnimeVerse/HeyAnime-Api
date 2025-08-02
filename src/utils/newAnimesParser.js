import { load } from 'cheerio';
import fs from 'fs';

/**
 * Extracts newAnimes data from the "New On HiAnime" section
 * Follows the same pattern as extractAnimes function from aniwatch package
 * @param {CheerioAPI} $ - Cheerio instance with loaded HTML
 * @param {string} scraperName - Name of the scraper for error handling
 * @returns {Array} Array of anime objects matching aniwatch package structure
 */
export function extractNewAnimes($, scraperName) {
    try {
        const animes = [];

        // Find the "New On HiAnime" section and get the selector for anime items
        const newAnimesSection = $('h2.cat-heading:contains("New On HiAnime")').closest('.block_area');

        if (newAnimesSection.length === 0) {
            // Return empty array if section not found (graceful degradation)
            return animes;
        }

        // Use the same selector pattern as other sections
        const selector = '.film_list-wrap .flw-item';
        newAnimesSection.find(selector).each((_, el) => {
            // Extract anime ID from the dynamic-name href, following aniwatch pattern
            const animeId = $(el).find(".film-detail .film-name .dynamic-name")?.attr("href")?.slice(1).split("?ref=search")[0] || null;

            animes.push({
                id: animeId,
                name: $(el).find(".film-detail .film-name .dynamic-name")?.text()?.trim(),
                jname: $(el).find(".film-detail .film-name .dynamic-name")?.attr("data-jname")?.trim() || null,
                poster: $(el).find(".film-poster .film-poster-img")?.attr("data-src")?.trim() || null,
                duration: $(el).find(".film-detail .fd-infor .fdi-item.fdi-duration")?.text()?.trim(),
                type: $(el).find(".film-detail .fd-infor .fdi-item:nth-of-type(1)")?.text()?.trim(),
                rating: $(el).find(".film-poster .tick-rate")?.text()?.trim() || null,
                episodes: {
                    sub: Number(
                        $(el).find(".film-poster .tick-sub")?.text()?.trim().split(" ").pop()
                    ) || null,
                    dub: Number(
                        $(el).find(".film-poster .tick-dub")?.text()?.trim().split(" ").pop()
                    ) || null
                }
            });
        });

        return animes;
    } catch (err) {
        // Use the same error handling pattern as aniwatch package
        throw new Error(`${scraperName}: Failed to extract newAnimes - ${err.message}`);
    }
}

// Test function to validate the parser with sample HTML
export function testNewAnimesParser() {
    try {
        const html = fs.readFileSync('test-new-animes.html', 'utf8');
        const $ = load(html);

        const result = extractNewAnimes($, 'testParser');

        console.log('Test Results:');
        console.log(`Found ${result.length} anime items`);
        console.log(JSON.stringify(result, null, 2));

        return result;
    } catch (err) {
        console.error('Test failed:', err.message);
        return [];
    }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testNewAnimesParser();
}