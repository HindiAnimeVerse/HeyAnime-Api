import { load } from 'cheerio';

/**
 * Extracts top search data from the root page
 * @param {CheerioAPI} $ - Cheerio instance with loaded HTML
 * @param {string} scraperName - Name of the scraper for error handling
 * @returns {Array} Array of top search items
 */
export function extractTopSearch($, scraperName) {
    try {
        const topSearchItems = [];
        
        // Find the top search section
        const topSearchSection = $('.xhashtag');
        
        if (topSearchSection.length === 0) {
            // Return empty array if section not found (graceful degradation)
            return topSearchItems;
        }
        
        // Extract each search item
        topSearchSection.find('a.item').each((_, el) => {
            const $el = $(el);
            
            // Extract the search term from the href parameter
            const href = $el.attr('href');
            let searchTerm = null;
            let searchUrl = null;
            
            if (href) {
                searchUrl = href;
                // Extract keyword from URL like "/search?keyword=Kaiju%20No.%208%20Season%202"
                const urlParams = new URLSearchParams(href.split('?')[1]);
                searchTerm = urlParams.get('keyword');
                // Decode URL encoding
                if (searchTerm) {
                    searchTerm = decodeURIComponent(searchTerm);
                }
            }
            
            // Extract the display text
            const displayText = $el.text().trim();
            
            topSearchItems.push({
                searchTerm: searchTerm || displayText,
                displayText: displayText,
                searchUrl: searchUrl,
                rank: topSearchItems.length + 1
            });
        });
        
        return topSearchItems;
    } catch (err) {
        // Use the same error handling pattern as other parsers
        throw new Error(`${scraperName}: Failed to extract top search - ${err.message}`);
    }
}

// Test function to validate the parser with sample HTML
export function testTopSearchParser() {
    try {
        // Sample HTML from the provided data
        const html = `
            <div class="xhashtag">
                <span class="title">Top search:</span>
                <a href="/search?keyword=Kaiju%20No.%208%20Season%202" class="item">Kaiju No. 8 Season 2</a>
                <a href="/search?keyword=The%20Fragrant%20Flower%20Blooms%20with%20Dignity" class="item">The Fragrant Flower Blooms with Dignity</a>
                <a href="/search?keyword=One%20Piece" class="item">One Piece</a>
                <a href="/search?keyword=Demon%20Slayer%3A%20Kimetsu%20no%20Yaiba%20Infinity%20Castle" class="item">Demon Slayer: Kimetsu no Yaiba Infinity Castle</a>
                <a href="/search?keyword=My%20Dress-Up%20Darling%20Season%202" class="item">My Dress-Up Darling Season 2</a>
                <a href="/search?keyword=Dan%20Da%20Dan%20Season%202" class="item">Dan Da Dan Season 2</a>
                <a href="/search?keyword=Demon%20Slayer%3A%20Kimetsu%20no%20Yaiba" class="item">Demon Slayer: Kimetsu no Yaiba</a>
                <a href="/search?keyword=Takopi&#39;s%20Original%20Sin" class="item">Takopi's Original Sin</a>
                <a href="/search?keyword=Kaiju%20No.%208" class="item">Kaiju No. 8</a>
                <a href="/search?keyword=Demon%20Slayer%3A%20Mt.%20Natagumo%20Arc" class="item">Demon Slayer: Mt. Natagumo Arc</a>
            </div>
        `;
        
        const $ = load(html);
        const result = extractTopSearch($, 'testParser');
        
        console.log('Top Search Parser Test Results:');
        console.log(`Found ${result.length} search items`);
        console.log(JSON.stringify(result, null, 2));
        
        return result;
    } catch (err) {
        console.error('Test failed:', err.message);
        return [];
    }
}

// Run test if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('topSearchParser.js')) {
    testTopSearchParser();
}