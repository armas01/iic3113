# real estate market intelligence platform

web scraping and analysis system for chilean real estate market. extracts data from portal inmobiliario and provides advanced analytics with ai preparation.

## features

- web scraping: automated property data extraction
- raw data: unprocessed data visualization
- ai analysis: system prepared for machine learning
- market insights: advanced statistical analysis
- investment opportunities: automatic detection of best deals
- geographic analysis: comparison by location
- price analysis: distribution, trends, and correlations

## installation

```bash
yarn install
```

## usage

start both frontend and backend:

```bash
yarn dev:full
```

or separately:

```bash
# terminal 1 - frontend
yarn dev

# terminal 2 - backend
yarn server
```

## access

- frontend: http://localhost:5173
- backend api: http://localhost:3001

## project structure

```
iic3113/
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx (with pagination)
│   │   ├── RawData.jsx
│   │   ├── Analysis.jsx
│   │   ├── Guide.jsx
│   │   └── Team.jsx
│   └── App.jsx
├── server/
│   ├── index.js (express server)
│   ├── scraper.js (puppeteer-core with local chrome)
│   └── dataAnalyzer.js
└── package.json
```

## technologies

### frontend
- react 19
- vite
- css modules
- axios

### backend
- express.js
- puppeteer-core (uses local chrome)
- cheerio (html parsing)
- cors

## pages

### dashboard
main interface with:
- search filters (operation, type, location, price)
- property cards with pagination (20 per page)
- general statistics
- market insights

### ai analysis
advanced analysis with:
- statistical summary
- market insights
- price per m² analysis
- location rankings
- investment opportunities
- suggested ml models

### raw data
unprocessed data visualization with:
- scraping metadata
- three views: formatted, json, table
- json/csv export

## api endpoints

- `GET /api/health` - health check
- `GET /api/properties` - get properties
- `GET /api/raw-data` - raw unprocessed data
- `GET /api/analysis` - advanced analysis
- `POST /api/scrape` - trigger scraping
- `POST /api/ai-analysis` - ai analysis (coming soon)

## team

- rodolfo andrés armas saenz - project lead
- juan manuel hernández - business analysis
- agustín arias - database lead
- baltazar lutjens - nlp lead
- nicolás fernández - data lead
- maría ignacia de goyeneche - web scraping lead

## notes

### web scraper
uses puppeteer-core with local chrome installation for headless browsing and cheerio for html parsing. includes:
- user-agent rotation
- random delays between requests
- robust error handling
- multi-page support (up to 50 pages)

### data analysis
analysis engine automatically calculates:
- descriptive statistics
- price distributions
- location rankings
- variable correlations
- investment opportunities
- data quality metrics
- outlier detection

## ai integration (prepared)

system is fully prepared for ai integration:

### ml data schema
- numeric fields: price, priceUF, bedrooms, bathrooms, area, parking
- categorical fields: comuna, propertyType, operation, currency, realEstate
- temporal fields: scrapedAt

### suggested models
1. price prediction (regression)
2. property classification
3. opportunity detection (anomaly detection)
4. market segmentation (clustering)

## license

this project is part of iic3113 course.

