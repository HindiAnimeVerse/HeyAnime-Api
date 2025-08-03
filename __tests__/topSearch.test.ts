import { expect, test } from "vitest";
import { getTopSearchData } from "../src/scrapers/topSearchScraper.js";

test("GET /api/v2/hianime/topsearch", async () => {
    const data = await getTopSearchData();

    // Verify the response structure
    expect(data).toHaveProperty('topSearchItems');
    expect(Array.isArray(data.topSearchItems)).toBe(true);

    // If there are search items, validate their structure
    if (data.topSearchItems.length > 0) {
        const firstItem = data.topSearchItems[0];
        
        // Required properties
        expect(firstItem).toHaveProperty('searchTerm');
        expect(firstItem).toHaveProperty('displayText');
        expect(firstItem).toHaveProperty('searchUrl');
        expect(firstItem).toHaveProperty('rank');

        // Type validation
        expect(typeof firstItem.searchTerm).toBe('string');
        expect(typeof firstItem.displayText).toBe('string');
        expect(typeof firstItem.searchUrl).toBe('string');
        expect(typeof firstItem.rank).toBe('number');

        // Rank should be a positive number
        expect(firstItem.rank).toBeGreaterThan(0);

        // Search URL should be a valid path
        expect(firstItem.searchUrl).toMatch(/^\/search\?keyword=/);

        // Display text should not be empty
        expect(firstItem.displayText.length).toBeGreaterThan(0);
    }

    console.log(`✓ Top search data validated: ${data.topSearchItems.length} items found`);
});

test("Top search items should be ranked correctly", async () => {
    const data = await getTopSearchData();

    if (data.topSearchItems.length > 1) {
        // Check that ranks are sequential starting from 1
        data.topSearchItems.forEach((item, index) => {
            expect(item.rank).toBe(index + 1);
        });

        console.log('✓ Top search items are ranked correctly');
    }
});

test("Top search items should have valid search URLs", async () => {
    const data = await getTopSearchData();

    data.topSearchItems.forEach((item, index) => {
        // Each item should have a valid search URL
        expect(item.searchUrl).toMatch(/^\/search\?keyword=.+/);
        
        // Search term should be extractable from URL
        if (item.searchUrl) {
            const urlParams = new URLSearchParams(item.searchUrl.split('?')[1]);
            const extractedKeyword = urlParams.get('keyword');
            expect(extractedKeyword).toBeTruthy();
            
            // Decoded keyword should match search term (or be similar)
            if (extractedKeyword) {
                const decodedKeyword = decodeURIComponent(extractedKeyword);
                expect(decodedKeyword).toBe(item.searchTerm);
            }
        }
    });

    console.log('✓ All search URLs are valid and consistent');
});