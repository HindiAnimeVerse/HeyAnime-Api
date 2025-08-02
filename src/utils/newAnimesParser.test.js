import { extractNewAnimes } from './newAnimesParser.js';
import { load } from 'cheerio';

// Comprehensive test suite for newAnimes HTML parsing
function runTests() {
    console.log('🧪 Running comprehensive newAnimes parser tests...\n');
    
    let passedTests = 0;
    let totalTests = 0;
    
    // Test 1: Normal HTML with New On HiAnime section
    passedTests += test1_normalHTML() ? 1 : 0;
    totalTests++;
    
    // Test 2: HTML without New On HiAnime section
    passedTests += test2_missingSection() ? 1 : 0;
    totalTests++;
    
    // Test 3: Empty section
    passedTests += test3_emptySection() ? 1 : 0;
    totalTests++;
    
    // Test 4: Malformed HTML
    passedTests += test4_malformedHTML() ? 1 : 0;
    totalTests++;
    
    // Test 5: Real HTML sample from requirements
    passedTests += test5_realHTMLSample() ? 1 : 0;
    totalTests++;
    
    // Test 6: Different anime types (Movie, ONA, TV)
    passedTests += test6_differentAnimeTypes() ? 1 : 0;
    totalTests++;
    
    // Test 7: Episode counts parsing
    passedTests += test7_episodeCounts() ? 1 : 0;
    totalTests++;
    
    // Test 8: Missing data-jname field
    passedTests += test8_missingJname() ? 1 : 0;
    totalTests++;
    
    // Test 9: Missing duration field
    passedTests += test9_missingDuration() ? 1 : 0;
    totalTests++;
    
    // Test 10: Multiple anime items
    passedTests += test10_multipleItems() ? 1 : 0;
    totalTests++;
    
    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    if (passedTests === totalTests) {
        console.log('✅ All tests passed successfully!');
    } else {
        console.log('❌ Some tests failed. Please review the output above.');
    }
    
    return passedTests === totalTests;
}

function test1_normalHTML() {
    console.log('Test 1: Normal HTML with New On HiAnime section');
    
    const html = `
        <section class="block_area block_area_home">
            <div class="block_area-header">
                <h2 class="cat-heading">New On HiAnime</h2>
            </div>
            <div class="film_list-wrap">
                <div class="flw-item">
                    <div class="film-poster">
                        <div class="tick-sub">1</div>
                        <img data-src="https://example.com/poster1.jpg" class="film-poster-img">
                    </div>
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/test-anime-1" class="dynamic-name" data-jname="Test Anime 1 JP">Test Anime 1</a>
                        </h3>
                        <div class="fd-infor">
                            <span class="fdi-item">TV</span>
                            <span class="fdi-item fdi-duration">24m</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    try {
        const $ = load(html);
        const result = extractNewAnimes($, 'test1');
        
        // Assertions
        const passed = result.length === 1 &&
                      result[0].name === 'Test Anime 1' &&
                      result[0].id === 'test-anime-1' &&
                      result[0].jname === 'Test Anime 1 JP' &&
                      result[0].type === 'TV' &&
                      result[0].duration === '24m' &&
                      result[0].episodes.sub === 1;
        
        if (passed) {
            console.log('  ✅ All assertions passed');
        } else {
            console.log('  ❌ Some assertions failed');
            console.log('    Expected: 1 anime with correct properties');
            console.log('    Got:', JSON.stringify(result[0], null, 4));
        }
        
        return passed;
    } catch (error) {
        console.log('  ❌ Test failed with error:', error.message);
        return false;
    }
}

function test2_missingSection() {
    console.log('Test 2: HTML without New On HiAnime section');
    
    const html = `
        <section class="block_area block_area_home">
            <div class="block_area-header">
                <h2 class="cat-heading">Other Section</h2>
            </div>
            <div class="film_list-wrap">
                <div class="flw-item">
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/test-anime-1" class="dynamic-name">Test Anime 1</a>
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    try {
        const $ = load(html);
        const result = extractNewAnimes($, 'test2');
        
        const passed = Array.isArray(result) && result.length === 0;
        
        if (passed) {
            console.log('  ✅ Gracefully handled missing section - returned empty array');
        } else {
            console.log('  ❌ Failed to handle missing section properly');
            console.log('    Expected: empty array');
            console.log('    Got:', result);
        }
        
        return passed;
    } catch (error) {
        console.log('  ❌ Test failed with error:', error.message);
        return false;
    }
}

function test3_emptySection() {
    console.log('Test 3: Empty New On HiAnime section');
    
    const html = `
        <section class="block_area block_area_home">
            <div class="block_area-header">
                <h2 class="cat-heading">New On HiAnime</h2>
            </div>
            <div class="film_list-wrap">
                <!-- No anime items -->
            </div>
        </section>
    `;
    
    try {
        const $ = load(html);
        const result = extractNewAnimes($, 'test3');
        
        const passed = Array.isArray(result) && result.length === 0;
        
        if (passed) {
            console.log('  ✅ Handled empty section correctly - returned empty array');
        } else {
            console.log('  ❌ Failed to handle empty section properly');
            console.log('    Expected: empty array');
            console.log('    Got:', result);
        }
        
        return passed;
    } catch (error) {
        console.log('  ❌ Test failed with error:', error.message);
        return false;
    }
}

function test4_malformedHTML() {
    console.log('Test 4: Malformed HTML (missing required fields)');
    
    const html = `
        <section class="block_area block_area_home">
            <div class="block_area-header">
                <h2 class="cat-heading">New On HiAnime</h2>
            </div>
            <div class="film_list-wrap">
                <div class="flw-item">
                    <!-- Missing film-poster and film-detail -->
                </div>
                <div class="flw-item">
                    <div class="film-detail">
                        <!-- Missing film-name -->
                        <div class="fd-infor">
                            <span class="fdi-item">TV</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    try {
        const $ = load(html);
        const result = extractNewAnimes($, 'test4');
        
        // Should handle malformed HTML gracefully - return items with null values for missing fields
        const passed = Array.isArray(result) && 
                      result.length === 2 &&
                      result.every(item => 
                          typeof item === 'object' && 
                          'id' in item && 
                          'name' in item && 
                          'episodes' in item
                      );
        
        if (passed) {
            console.log('  ✅ Handled malformed HTML gracefully');
            console.log(`    Found ${result.length} items with null values for missing fields`);
        } else {
            console.log('  ❌ Failed to handle malformed HTML properly');
            console.log('    Expected: array with items containing null values');
            console.log('    Got:', result);
        }
        
        return passed;
    } catch (error) {
        console.log('  ❌ Test failed with error:', error.message);
        return false;
    }
}

function test5_realHTMLSample() {
    console.log('Test 5: Real HTML sample from requirements');
    
    // Using the actual HTML structure from the requirements
    const html = `
        <section class="block_area block_area_home">
            <div class="block_area-header block_area-header-tabs">
                <div class="float-left bah-heading mr-4">
                    <h2 class="cat-heading">New On HiAnime</h2>
                </div>
            </div>
            <div class="tab-content">
                <div class="block_area-content block_area-list film_list film_list-grid">
                    <div class="film_list-wrap">
                        <div class="flw-item">
                            <div class="film-poster">
                                <div class="tick ltr">
                                    <div class="tick-item tick-sub"><i class="fas fa-closed-captioning mr-1"></i>1</div>
                                </div>
                                <img data-src="https://cdn.noitatnemucod.net/thumbnail/300x400/100/d04a556762139c893a85ad0b8722d1c9.jpg" class="film-poster-img lazyload" alt="Cardfight!! Vanguard Movie: Neon Messiah">
                                <a href="/watch/cardfight-vanguard-movie-neon-messiah-4355" class="film-poster-ahref item-qtip" title="Cardfight!! Vanguard Movie: Neon Messiah" data-id="4355"><i class="fas fa-play"></i></a>
                            </div>
                            <div class="film-detail">
                                <h3 class="film-name">
                                    <a href="/cardfight-vanguard-movie-neon-messiah-4355" title="Cardfight!! Vanguard Movie: Neon Messiah" class="dynamic-name" data-jname="Cardfight!! Vanguard Movie: Neon Messiah">Cardfight!! Vanguard Movie: Neon Messiah</a>
                                </h3>
                                <div class="fd-infor">
                                    <span class="fdi-item">Movie</span>
                                    <span class="dot"></span>
                                    <span class="fdi-item fdi-duration">72m</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    try {
        const $ = load(html);
        const result = extractNewAnimes($, 'test5');
        
        const expected = {
            id: 'cardfight-vanguard-movie-neon-messiah-4355',
            name: 'Cardfight!! Vanguard Movie: Neon Messiah',
            jname: 'Cardfight!! Vanguard Movie: Neon Messiah',
            type: 'Movie',
            duration: '72m',
            episodes: { sub: 1, dub: null }
        };
        
        const passed = result.length === 1 &&
                      result[0].id === expected.id &&
                      result[0].name === expected.name &&
                      result[0].jname === expected.jname &&
                      result[0].type === expected.type &&
                      result[0].duration === expected.duration &&
                      result[0].episodes.sub === expected.episodes.sub;
        
        if (passed) {
            console.log('  ✅ Real HTML sample parsed correctly');
        } else {
            console.log('  ❌ Real HTML sample parsing failed');
            console.log('    Expected:', expected);
            console.log('    Got:', result[0]);
        }
        
        return passed;
    } catch (error) {
        console.log('  ❌ Test failed with error:', error.message);
        return false;
    }
}

function test6_differentAnimeTypes() {
    console.log('Test 6: Different anime types (Movie, ONA, TV)');
    
    const html = `
        <section class="block_area block_area_home">
            <div class="block_area-header">
                <h2 class="cat-heading">New On HiAnime</h2>
            </div>
            <div class="film_list-wrap">
                <div class="flw-item">
                    <div class="film-poster">
                        <div class="tick-sub">1</div>
                        <img data-src="poster1.jpg" class="film-poster-img">
                    </div>
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/movie-anime" class="dynamic-name">Movie Anime</a>
                        </h3>
                        <div class="fd-infor">
                            <span class="fdi-item">Movie</span>
                            <span class="fdi-item fdi-duration">120m</span>
                        </div>
                    </div>
                </div>
                <div class="flw-item">
                    <div class="film-poster">
                        <div class="tick-sub">6</div>
                        <img data-src="poster2.jpg" class="film-poster-img">
                    </div>
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/ona-anime" class="dynamic-name">ONA Anime</a>
                        </h3>
                        <div class="fd-infor">
                            <span class="fdi-item">ONA</span>
                            <span class="fdi-item fdi-duration">22m</span>
                        </div>
                    </div>
                </div>
                <div class="flw-item">
                    <div class="film-poster">
                        <div class="tick-sub">12</div>
                        <img data-src="poster3.jpg" class="film-poster-img">
                    </div>
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/tv-anime" class="dynamic-name">TV Anime</a>
                        </h3>
                        <div class="fd-infor">
                            <span class="fdi-item">TV</span>
                            <span class="fdi-item fdi-duration">24m</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    try {
        const $ = load(html);
        const result = extractNewAnimes($, 'test6');
        
        const passed = result.length === 3 &&
                      result[0].type === 'Movie' &&
                      result[1].type === 'ONA' &&
                      result[2].type === 'TV' &&
                      result[0].duration === '120m' &&
                      result[1].duration === '22m' &&
                      result[2].duration === '24m';
        
        if (passed) {
            console.log('  ✅ Different anime types parsed correctly');
            console.log(`    Movie: ${result[0].name} (${result[0].duration})`);
            console.log(`    ONA: ${result[1].name} (${result[1].duration})`);
            console.log(`    TV: ${result[2].name} (${result[2].duration})`);
        } else {
            console.log('  ❌ Different anime types parsing failed');
            console.log('    Got types:', result.map(r => r.type));
        }
        
        return passed;
    } catch (error) {
        console.log('  ❌ Test failed with error:', error.message);
        return false;
    }
}

function test7_episodeCounts() {
    console.log('Test 7: Episode counts parsing (sub/dub)');
    
    const html = `
        <section class="block_area block_area_home">
            <div class="block_area-header">
                <h2 class="cat-heading">New On HiAnime</h2>
            </div>
            <div class="film_list-wrap">
                <div class="flw-item">
                    <div class="film-poster">
                        <div class="tick-sub">12</div>
                        <img data-src="poster1.jpg" class="film-poster-img">
                    </div>
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/sub-only-anime" class="dynamic-name">Sub Only Anime</a>
                        </h3>
                        <div class="fd-infor">
                            <span class="fdi-item">TV</span>
                        </div>
                    </div>
                </div>
                <div class="flw-item">
                    <div class="film-poster">
                        <div class="tick-sub">24</div>
                        <div class="tick-dub">24</div>
                        <img data-src="poster2.jpg" class="film-poster-img">
                    </div>
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/sub-dub-anime" class="dynamic-name">Sub and Dub Anime</a>
                        </h3>
                        <div class="fd-infor">
                            <span class="fdi-item">TV</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    try {
        const $ = load(html);
        const result = extractNewAnimes($, 'test7');
        
        const passed = result.length === 2 &&
                      result[0].episodes.sub === 12 &&
                      result[0].episodes.dub === null &&
                      result[1].episodes.sub === 24 &&
                      result[1].episodes.dub === 24;
        
        if (passed) {
            console.log('  ✅ Episode counts parsed correctly');
            console.log(`    ${result[0].name}: sub=${result[0].episodes.sub}, dub=${result[0].episodes.dub}`);
            console.log(`    ${result[1].name}: sub=${result[1].episodes.sub}, dub=${result[1].episodes.dub}`);
        } else {
            console.log('  ❌ Episode counts parsing failed');
            console.log('    Got episodes:', result.map(r => r.episodes));
        }
        
        return passed;
    } catch (error) {
        console.log('  ❌ Test failed with error:', error.message);
        return false;
    }
}

function test8_missingJname() {
    console.log('Test 8: Missing data-jname field');
    
    const html = `
        <section class="block_area block_area_home">
            <div class="block_area-header">
                <h2 class="cat-heading">New On HiAnime</h2>
            </div>
            <div class="film_list-wrap">
                <div class="flw-item">
                    <div class="film-poster">
                        <div class="tick-sub">1</div>
                        <img data-src="poster1.jpg" class="film-poster-img">
                    </div>
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/no-jname-anime" class="dynamic-name">No JName Anime</a>
                        </h3>
                        <div class="fd-infor">
                            <span class="fdi-item">TV</span>
                            <span class="fdi-item fdi-duration">24m</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    try {
        const $ = load(html);
        const result = extractNewAnimes($, 'test8');
        
        const passed = result.length === 1 &&
                      result[0].name === 'No JName Anime' &&
                      result[0].jname === null;
        
        if (passed) {
            console.log('  ✅ Missing jname handled correctly (set to null)');
        } else {
            console.log('  ❌ Missing jname not handled properly');
            console.log('    Expected jname: null');
            console.log('    Got jname:', result[0]?.jname);
        }
        
        return passed;
    } catch (error) {
        console.log('  ❌ Test failed with error:', error.message);
        return false;
    }
}

function test9_missingDuration() {
    console.log('Test 9: Missing duration field');
    
    const html = `
        <section class="block_area block_area_home">
            <div class="block_area-header">
                <h2 class="cat-heading">New On HiAnime</h2>
            </div>
            <div class="film_list-wrap">
                <div class="flw-item">
                    <div class="film-poster">
                        <div class="tick-sub">1</div>
                        <img data-src="poster1.jpg" class="film-poster-img">
                    </div>
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/no-duration-anime" class="dynamic-name">No Duration Anime</a>
                        </h3>
                        <div class="fd-infor">
                            <span class="fdi-item">TV</span>
                            <!-- Missing duration span -->
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    try {
        const $ = load(html);
        const result = extractNewAnimes($, 'test9');
        
        const passed = result.length === 1 &&
                      result[0].name === 'No Duration Anime' &&
                      (result[0].duration === null || result[0].duration === undefined || result[0].duration === '');
        
        if (passed) {
            console.log('  ✅ Missing duration handled correctly');
        } else {
            console.log('  ❌ Missing duration not handled properly');
            console.log('    Expected duration: null/undefined/empty');
            console.log('    Got duration:', result[0]?.duration);
        }
        
        return passed;
    } catch (error) {
        console.log('  ❌ Test failed with error:', error.message);
        return false;
    }
}

function test10_multipleItems() {
    console.log('Test 10: Multiple anime items');
    
    const html = `
        <section class="block_area block_area_home">
            <div class="block_area-header">
                <h2 class="cat-heading">New On HiAnime</h2>
            </div>
            <div class="film_list-wrap">
                <div class="flw-item">
                    <div class="film-poster">
                        <div class="tick-sub">1</div>
                        <img data-src="poster1.jpg" class="film-poster-img">
                    </div>
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/anime-1" class="dynamic-name" data-jname="Anime 1 JP">Anime 1</a>
                        </h3>
                        <div class="fd-infor">
                            <span class="fdi-item">Movie</span>
                            <span class="fdi-item fdi-duration">90m</span>
                        </div>
                    </div>
                </div>
                <div class="flw-item">
                    <div class="film-poster">
                        <div class="tick-sub">12</div>
                        <div class="tick-dub">12</div>
                        <img data-src="poster2.jpg" class="film-poster-img">
                    </div>
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/anime-2" class="dynamic-name" data-jname="Anime 2 JP">Anime 2</a>
                        </h3>
                        <div class="fd-infor">
                            <span class="fdi-item">TV</span>
                            <span class="fdi-item fdi-duration">24m</span>
                        </div>
                    </div>
                </div>
                <div class="flw-item">
                    <div class="film-poster">
                        <div class="tick-sub">6</div>
                        <img data-src="poster3.jpg" class="film-poster-img">
                    </div>
                    <div class="film-detail">
                        <h3 class="film-name">
                            <a href="/anime-3" class="dynamic-name" data-jname="Anime 3 JP">Anime 3</a>
                        </h3>
                        <div class="fd-infor">
                            <span class="fdi-item">ONA</span>
                            <span class="fdi-item fdi-duration">22m</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
    
    try {
        const $ = load(html);
        const result = extractNewAnimes($, 'test10');
        
        const passed = result.length === 3 &&
                      result[0].name === 'Anime 1' &&
                      result[1].name === 'Anime 2' &&
                      result[2].name === 'Anime 3' &&
                      result[0].type === 'Movie' &&
                      result[1].type === 'TV' &&
                      result[2].type === 'ONA' &&
                      result[0].episodes.sub === 1 &&
                      result[1].episodes.sub === 12 &&
                      result[1].episodes.dub === 12 &&
                      result[2].episodes.sub === 6;
        
        if (passed) {
            console.log('  ✅ Multiple items parsed correctly');
            console.log(`    Found ${result.length} anime items with correct properties`);
        } else {
            console.log('  ❌ Multiple items parsing failed');
            console.log('    Expected: 3 items with specific properties');
            console.log('    Got:', result.map(r => ({ name: r.name, type: r.type, episodes: r.episodes })));
        }
        
        return passed;
    } catch (error) {
        console.log('  ❌ Test failed with error:', error.message);
        return false;
    }
}

// Run tests
runTests();