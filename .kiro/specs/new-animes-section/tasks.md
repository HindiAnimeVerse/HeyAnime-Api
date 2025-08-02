# Implementation Plan

- [x] 1. Investigate current aniwatch package structure and scraper implementation



  - Examine the aniwatch package source code to understand how getHomePage() currently works
  - Identify the HTML parsing patterns used for existing sections like latestEpisodeAnimes and spotlightAnimes
  - Locate the ScrapedHomePage type definition to understand the current data structure
  - _Requirements: 1.1, 2.1_

- [x] 2. Create HTML parsing utility for newAnimes section



  - Write a function to locate the "New On HiAnime" section in the HTML using appropriate selectors
  - Implement parsing logic to extract anime data from .flw-item elements within the section
  - Handle extraction of id, name, jname, poster, type, duration, and episode counts from HTML attributes
  - _Requirements: 2.1, 2.2, 2.3_




- [ ] 3. Extend the aniwatch package scraper to include newAnimes
  - Modify the getHomePage() method in the aniwatch package to call the newAnimes parsing function



  - Integrate the newAnimes data extraction into the existing scraping workflow
  - Ensure the newAnimes section is included in the ScrapedHomePage return object
  - _Requirements: 1.1, 3.1, 3.2_




- [ ] 4. Update TypeScript type definitions for newAnimes
  - Add newAnimes property to the ScrapedHomePage interface



  - Ensure the newAnimes array follows the same AnimeItem structure as other sections
  - Update any related type exports to include the new section
  - _Requirements: 3.1, 3.2_


- [ ] 5. Verify caching integration works with newAnimes
  - Test that the existing cache.getOrSet() mechanism properly caches the newAnimes data
  - Ensure cache invalidation includes the newAnimes section when home page data is refreshed
  - Verify that cached responses include the newAnimes section
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 6. Write unit tests for newAnimes HTML parsing
  - Create test cases using the provided HTML sample to verify correct data extraction
  - Test parsing of different anime types (Movie, ONA, etc.) and episode counts
  - Add tests for edge cases like missing data-jname or duration fields
  - _Requirements: 2.2, 2.3_

- [x] 7. Update integration tests for home endpoint


  - Modify the existing homePage.test.ts to include expectations for newAnimes section
  - Add assertions to verify newAnimes array is not empty and contains expected data structure
  - Test that newAnimes section is included alongside all existing sections
  - _Requirements: 1.1, 3.1_

- [x] 8. Update API documentation and README



  - Add newAnimes section to the response schema documentation in README.md
  - Include example newAnimes data structure in the API documentation
  - Update the response sample to show the newAnimes section alongside existing sections
  - _Requirements: 3.1, 3.2_