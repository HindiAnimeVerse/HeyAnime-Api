# Top Search Endpoint Implementation

## Overview

I've successfully created a new endpoint `/api/v2/hianime/topsearch` that extracts top search terms from the HiAnime homepage root page (`/`).

## Implementation Details

### 1. Custom Scraper
- **File**: `src/scrapers/topSearchScraper.js`
- **Function**: `getTopSearchData()`
- **Target**: Scrapes the root page (`https://hianimez.to/`) instead of `/home`
- **Selector**: `.xhashtag a.item` - extracts the "Top search:" section

### 2. Route Handler
- **Endpoint**: `/api/v2/hianime/topsearch`
- **Method**: GET
- **Caching**: Uses the same caching mechanism as other endpoints
- **Response**: JSON with `topSearchItems` array

### 3. Data Structure
Each top search item contains:
```javascript
{
  searchTerm: string,      // Decoded search term (e.g., "One Piece")
  displayText: string,     // Display text from HTML
  searchUrl: string,       // Relative URL (e.g., "/search?keyword=One%20Piece")
  rank: number            // Position in the list (1, 2, 3, ...)
}
```

### 4. HTML Parsing Logic
From your provided HTML sample:
```html
<div class="xhashtag">
  <span class="title">Top search:</span>
  <a href="/search?keyword=Kaiju%20No.%208%20Season%202" class="item">Kaiju No. 8 Season 2</a>
  <a href="/search?keyword=One%20Piece" class="item">One Piece</a>
  <!-- ... more items -->
</div>
```

The scraper:
1. Finds the `.xhashtag` section
2. Extracts each `a.item` element
3. Gets the `href` attribute and extracts the `keyword` parameter
4. Decodes URL encoding (e.g., `%20` → space)
5. Assigns sequential ranks starting from 1

## Files Created/Modified

### New Files:
- `src/scrapers/topSearchScraper.js` - Custom scraper implementation
- `__tests__/topSearch.test.ts` - Comprehensive tests
- `TOPSEARCH_ENDPOINT.md` - This documentation

### Modified Files:
- `src/routes/hianime.ts` - Added new route handler
- `README.md` - Added endpoint documentation

## API Usage

### Request:
```bash
GET /api/v2/hianime/topsearch
```

### Response:
```json
{
  "success": true,
  "data": {
    "topSearchItems": [
      {
        "searchTerm": "Kaiju No. 8 Season 2",
        "displayText": "Kaiju No. 8 Season 2",
        "searchUrl": "/search?keyword=Kaiju%20No.%208%20Season%202",
        "rank": 1
      },
      {
        "searchTerm": "One Piece",
        "displayText": "One Piece", 
        "searchUrl": "/search?keyword=One%20Piece",
        "rank": 2
      }
    ]
  }
}
```

## Key Features

1. **Caching**: Uses the same Redis caching as other endpoints (5-minute default)
2. **Error Handling**: Proper error handling with timeout and network error management
3. **URL Decoding**: Properly decodes URL-encoded search terms
4. **Ranking**: Maintains the order from the website with sequential ranking
5. **Consistent API**: Follows the same response format as other endpoints

## Testing

The endpoint includes comprehensive tests that verify:
- Response structure and data types
- Ranking consistency (sequential 1, 2, 3...)
- URL validity and keyword extraction
- Search term decoding accuracy

## Deployment

The endpoint is ready for deployment and will work with your existing patch-package setup. The custom scraper approach means no additional modifications to the aniwatch package are needed.

## Usage Examples

```javascript
// Fetch top search terms
const response = await fetch('/api/v2/hianime/topsearch');
const data = await response.json();

// Display top searches
data.data.topSearchItems.forEach(item => {
  console.log(`${item.rank}. ${item.searchTerm}`);
});

// Use search URLs for navigation
const firstSearchUrl = data.data.topSearchItems[0].searchUrl;
// Navigate to: /search?keyword=Kaiju%20No.%208%20Season%202
```

The endpoint is now ready for production use! 🎉