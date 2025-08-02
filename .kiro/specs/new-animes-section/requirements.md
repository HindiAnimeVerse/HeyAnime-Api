# Requirements Document

## Introduction

This feature adds a new "newAnimes" section to the existing `/api/v2/hianime/home` endpoint response. The newAnimes section will display recently added anime content on HiAnime, similar to how other sections like latestEpisodeAnimes, spotlightAnimes, etc. are currently displayed. This enhancement will provide users with easy access to newly available anime content through the same unified home endpoint.

## Requirements

### Requirement 1

**User Story:** As an API consumer, I want to receive newAnimes data in the home endpoint response, so that I can display recently added anime content to users without making additional API calls.

#### Acceptance Criteria

1. WHEN a request is made to `/api/v2/hianime/home` THEN the system SHALL include a newAnimes section in the response alongside existing sections
2. WHEN the newAnimes section is returned THEN it SHALL contain the same data structure as other anime sections (id, name, poster, type, duration, etc.)
3. WHEN the home endpoint is called THEN all data (including newAnimes) SHALL be returned in a single request without requiring additional API calls

### Requirement 2

**User Story:** As an API consumer, I want the newAnimes data to be extracted from the "New On HiAnime" HTML section, so that the data is consistent with what users see on the website.

#### Acceptance Criteria

1. WHEN scraping the home page THEN the system SHALL extract anime data from the "New On HiAnime" HTML section
2. WHEN parsing the HTML THEN the system SHALL extract anime title, poster image, type, duration, episode count, and subtitle/dub information
3. WHEN extracting data THEN the system SHALL handle both Japanese names (data-jname) and English names consistently with other sections

### Requirement 3

**User Story:** As an API consumer, I want the newAnimes section to maintain the same response format as existing sections, so that my client code can handle all sections uniformly.

#### Acceptance Criteria

1. WHEN the newAnimes section is included THEN it SHALL follow the same data structure as latestEpisodeAnimes, spotlightAnimes, and other existing sections
2. WHEN anime items are returned in newAnimes THEN each item SHALL include id, name, poster, jname, type, duration, and other standard fields
3. WHEN the response is generated THEN the newAnimes section SHALL be included at the same level as other sections in the response object

### Requirement 4

**User Story:** As a system administrator, I want the newAnimes data to be cached with the same strategy as other home page data, so that performance remains consistent.

#### Acceptance Criteria

1. WHEN the home page is scraped THEN the newAnimes data SHALL be cached using the same cache configuration as other home page sections
2. WHEN cached data exists THEN the newAnimes section SHALL be served from cache without re-scraping
3. WHEN cache expires THEN the newAnimes data SHALL be refreshed along with other home page data in a single scraping operation