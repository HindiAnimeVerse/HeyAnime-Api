import { expect, test } from "vitest";
import { HiAnime } from "aniwatch";

test("GET /api/v2/hianime/home", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getHomePage();

    // Test existing sections
    expect(data.spotlightAnimes).not.toEqual([]);
    expect(data.trendingAnimes).not.toEqual([]);
    expect(data.latestEpisodeAnimes).not.toEqual([]);
    expect(data.topUpcomingAnimes).not.toEqual([]);
    expect(data.topAiringAnimes).not.toEqual([]);
    expect(data.mostPopularAnimes).not.toEqual([]);
    expect(data.mostFavoriteAnimes).not.toEqual([]);
    expect(data.latestCompletedAnimes).not.toEqual([]);
    expect(data.genres).not.toEqual([]);

    expect(data.top10Animes.today).not.toEqual([]);
    expect(data.top10Animes.week).not.toEqual([]);
    expect(data.top10Animes.month).not.toEqual([]);

    // Test new newAnimes section
    expect(data.newAnimes).toBeDefined();
    expect(Array.isArray(data.newAnimes)).toBe(true);
    
    // If newAnimes section exists on the page, it should contain data
    // Note: This might be empty if the "New On HiAnime" section is not present on the scraped page
    if (data.newAnimes.length > 0) {
        // Verify structure of first newAnimes item
        const firstNewAnime = data.newAnimes[0];
        expect(firstNewAnime).toHaveProperty('id');
        expect(firstNewAnime).toHaveProperty('name');
        expect(firstNewAnime).toHaveProperty('poster');
        expect(firstNewAnime).toHaveProperty('type');
        expect(firstNewAnime).toHaveProperty('episodes');
        expect(firstNewAnime.episodes).toHaveProperty('sub');
        expect(firstNewAnime.episodes).toHaveProperty('dub');
        
        // Verify data types
        expect(typeof firstNewAnime.id).toBe('string');
        expect(typeof firstNewAnime.name).toBe('string');
        expect(typeof firstNewAnime.poster).toBe('string');
        expect(typeof firstNewAnime.type).toBe('string');
        expect(typeof firstNewAnime.episodes.sub).toBe('number');
        expect(firstNewAnime.episodes.dub === null || typeof firstNewAnime.episodes.dub === 'number').toBe(true);
    }
});
test("newAnimes section structure and data validation", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getHomePage();

    // Verify newAnimes property exists and is an array
    expect(data).toHaveProperty('newAnimes');
    expect(Array.isArray(data.newAnimes)).toBe(true);

    // If newAnimes has data, validate each item's structure
    data.newAnimes.forEach((anime, index) => {
        // Required properties
        expect(anime).toHaveProperty('id');
        expect(anime).toHaveProperty('name');
        expect(anime).toHaveProperty('poster');
        expect(anime).toHaveProperty('type');
        expect(anime).toHaveProperty('episodes');

        // Optional properties (can be null)
        expect(anime).toHaveProperty('jname');
        expect(anime).toHaveProperty('duration');
        expect(anime).toHaveProperty('rating');

        // Episodes structure
        expect(anime.episodes).toHaveProperty('sub');
        expect(anime.episodes).toHaveProperty('dub');

        // Type validation for non-null values
        if (anime.id !== null) {
            expect(typeof anime.id).toBe('string');
            expect(anime.id.length).toBeGreaterThan(0);
        }

        if (anime.name !== null) {
            expect(typeof anime.name).toBe('string');
            expect(anime.name.length).toBeGreaterThan(0);
        }

        if (anime.poster !== null) {
            expect(typeof anime.poster).toBe('string');
            expect(anime.poster.length).toBeGreaterThan(0);
        }

        if (anime.type !== null) {
            expect(typeof anime.type).toBe('string');
            expect(['TV', 'Movie', 'ONA', 'OVA', 'Special'].includes(anime.type)).toBe(true);
        }

        if (anime.jname !== null) {
            expect(typeof anime.jname).toBe('string');
        }

        if (anime.duration !== null) {
            expect(typeof anime.duration).toBe('string');
            expect(anime.duration).toMatch(/^\d+m$/); // Format like "24m", "120m"
        }

        // Episodes validation
        if (anime.episodes.sub !== null) {
            expect(typeof anime.episodes.sub).toBe('number');
            expect(anime.episodes.sub).toBeGreaterThan(0);
        }

        if (anime.episodes.dub !== null) {
            expect(typeof anime.episodes.dub).toBe('number');
            expect(anime.episodes.dub).toBeGreaterThan(0);
        }
    });

    console.log(`✓ newAnimes section validated: ${data.newAnimes.length} items found`);
});

test("newAnimes integration with existing sections", async () => {
    const hianime = new HiAnime.Scraper();
    const data = await hianime.getHomePage();

    // Verify that newAnimes is included alongside all existing sections
    const expectedSections = [
        'spotlightAnimes',
        'trendingAnimes', 
        'latestEpisodeAnimes',
        'topUpcomingAnimes',
        'topAiringAnimes',
        'mostPopularAnimes',
        'mostFavoriteAnimes',
        'latestCompletedAnimes',
        'newAnimes', // Our new section
        'genres',
        'top10Animes'
    ];

    expectedSections.forEach(section => {
        expect(data).toHaveProperty(section);
    });

    // Verify that newAnimes doesn't interfere with other sections
    expect(data.spotlightAnimes).toBeDefined();
    expect(data.latestEpisodeAnimes).toBeDefined();
    expect(data.mostPopularAnimes).toBeDefined();
    expect(data.newAnimes).toBeDefined();

    // Verify all sections are arrays (except top10Animes which is an object)
    const arraySections = expectedSections.filter(s => s !== 'top10Animes');
    arraySections.forEach(section => {
        expect(Array.isArray(data[section])).toBe(true);
    });

    // Verify top10Animes structure
    expect(typeof data.top10Animes).toBe('object');
    expect(Array.isArray(data.top10Animes.today)).toBe(true);
    expect(Array.isArray(data.top10Animes.week)).toBe(true);
    expect(Array.isArray(data.top10Animes.month)).toBe(true);

    console.log('✓ All sections present and properly structured');
    console.log(`✓ newAnimes integrated successfully with ${data.newAnimes.length} items`);
});