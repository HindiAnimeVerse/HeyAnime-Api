# Design Document

## Overview

This design outlines the implementation of a new `newAnimes` section for the `/api/v2/hianime/home` endpoint. The feature will extend the existing home page scraper to extract data from the "New On HiAnime" HTML section and include it in the unified response alongside existing sections like `latestEpisodeAnimes`, `spotlightAnimes`, etc.

The implementation leverages the existing `aniwatch` package's `HiAnime.Scraper` class and extends its `getHomePage()` method to include the new section. This approach maintains consistency with the current architecture while adding the requested functionality.

## Architecture

### Current Architecture
The home endpoint currently uses:
- **Route Handler**: `src/routes/hianime.ts` - `/home` endpoint
- **Scraper**: `aniwatch` package - `HiAnime.Scraper.getHomePage()`
- **Caching**: Redis-based caching via `cache.getOrSet()`
- **Response Format**: Standardized JSON with status and data fields

### Proposed Changes
The implementation will modify the `aniwatch` package's scraper to:
1. Extract data from the "New On HiAnime" HTML section during home page scraping
2. Parse anime items with the same structure as other sections
3. Include the `newAnimes` array in the `ScrapedHomePage` type
4. Maintain backward compatibility with existing response structure

## Components and Interfaces

### Data Structure
The `newAnimes` section will follow the same structure as `mostPopularAnimes` and `latestCompletedAnimes`:

```typescript
newAnimes: [
  {
    id: string,           // Extracted from href attribute
    name: string,         // Extracted from title or dynamic-name
    jname: string,        // Extracted from data-jname attribute
    poster: string,       // Extracted from data-src or src attribute
    type: string,         // Extracted from fdi-item (Movie, ONA, etc.)
    duration: string,     // Extracted from fdi-duration
    episodes: {
      sub: number,        // Extracted from tick-sub
      dub: number,        // Extracted from tick-dub (if present)
    }
  }
]
```

### HTML Parsing Strategy
Based on the provided HTML sample, the scraper will:

1. **Section Identification**: Locate the "New On HiAnime" section using the heading selector
2. **Item Extraction**: Parse each `.flw-item` within the section
3. **Data Extraction**: Extract the following from each item:
   - **ID**: From the `href` attribute of `.film-poster-ahref`
   - **Name**: From the `title` attribute or `.dynamic-name` text
   - **Japanese Name**: From the `data-jname` attribute
   - **Poster**: From the `data-src` attribute of `.film-poster-img`
   - **Type**: From the first `.fdi-item` span (Movie, ONA, etc.)
   - **Duration**: From the `.fdi-duration` span
   - **Episodes**: From `.tick-sub` and `.tick-dub` elements

### Integration Points

#### Scraper Extension
The `aniwatch` package's `getHomePage()` method will be extended to include:
```typescript
// Additional parsing logic for "New On HiAnime" section
const newAnimesSection = $('h2.cat-heading:contains("New On HiAnime")').closest('.block_area');
const newAnimes = this.parseAnimeSection(newAnimesSection, 'newAnimes');
```

#### Type Definitions
The `ScrapedHomePage` interface will be extended:
```typescript
interface ScrapedHomePage {
  // ... existing properties
  newAnimes: AnimeItem[];
}
```

## Data Models

### AnimeItem Interface
```typescript
interface AnimeItem {
  id: string;
  name: string;
  jname?: string;
  poster: string;
  type: string;
  duration?: string;
  episodes: {
    sub: number;
    dub: number;
  };
}
```

### Response Schema Extension
The home endpoint response will include:
```json
{
  "success": true,
  "data": {
    "genres": [...],
    "latestEpisodeAnimes": [...],
    "spotlightAnimes": [...],
    "newAnimes": [
      {
        "id": "cardfight-vanguard-movie-neon-messiah-4355",
        "name": "Cardfight!! Vanguard Movie: Neon Messiah",
        "jname": "Cardfight!! Vanguard Movie: Neon Messiah",
        "poster": "https://cdn.noitatnemucod.net/thumbnail/300x400/100/d04a556762139c893a85ad0b8722d1c9.jpg",
        "type": "Movie",
        "duration": "72m",
        "episodes": {
          "sub": 1,
          "dub": 0
        }
      }
    ],
    // ... other existing sections
  }
}
```

## Error Handling

### Parsing Failures
- **Missing Section**: If "New On HiAnime" section is not found, return empty array
- **Malformed HTML**: Skip individual items that fail to parse, continue with others
- **Missing Required Fields**: Use default values (empty string for text, 0 for numbers)

### Backward Compatibility
- Existing API consumers will continue to receive all current sections
- New `newAnimes` section will be added without breaking existing functionality
- Cache invalidation will work seamlessly with existing cache strategy

## Testing Strategy

### Unit Tests
1. **HTML Parsing Tests**: Verify correct extraction from sample HTML
2. **Data Structure Tests**: Ensure newAnimes follows expected schema
3. **Error Handling Tests**: Test behavior with malformed or missing HTML sections

### Integration Tests
1. **Endpoint Tests**: Verify `/api/v2/hianime/home` includes newAnimes section
2. **Cache Tests**: Ensure newAnimes data is properly cached and retrieved
3. **Response Format Tests**: Validate complete response structure

### Test Data
```typescript
// Expected test structure
expect(data.newAnimes).toEqual([
  expect.objectContaining({
    id: expect.any(String),
    name: expect.any(String),
    poster: expect.any(String),
    type: expect.any(String),
    episodes: expect.objectContaining({
      sub: expect.any(Number),
      dub: expect.any(Number)
    })
  })
]);
```

The implementation will maintain the existing performance characteristics and caching behavior while seamlessly adding the new functionality to the unified home endpoint response.