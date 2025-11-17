import express from 'express';
import cors from 'cors';
import { scrapePortalInmobiliario } from './scraper.js';
import { analyzeData } from './dataAnalyzer.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let scrapedData = {
    properties: [],
    lastUpdate: null,
    metadata: {}
};

let scrapeProgress = {
    inProgress: false,
    currentPage: 0,
    totalPages: 0,
    propertiesFound: 0,
    progress: 0,
    completed: false
};

app.get('/api/properties', (req, res) => {
    try {
        res.json({
            success: true,
            data: scrapedData.properties,
            lastUpdate: scrapedData.lastUpdate,
            count: scrapedData.properties.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/raw-data', (req, res) => {
    try {
        res.json({
            success: true,
            rawData: scrapedData,
            metadata: {
                totalProperties: scrapedData.properties.length,
                lastUpdate: scrapedData.lastUpdate,
                dataStructure: scrapedData.properties.length > 0 ? Object.keys(scrapedData.properties[0]) : [],
                ...scrapedData.metadata
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/analysis', (req, res) => {
    try {
        const analysis = analyzeData(scrapedData.properties);
        res.json({
            success: true,
            analysis,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/scrape', async (req, res) => {
    try {
        const { 
            operation = 'venta', 
            propertyType = 'departamento', 
            comuna = 'las-condes-metropolitana', 
            pages = 5,
            filters = {}
        } = req.body;
        
        const validPages = Math.min(Math.max(1, pages), 5); // Max 5 pages
        
        console.log('[server] new scraping request received');
        console.log(`[server] operation=${operation}, type=${propertyType}, comuna=${comuna}, pages=${validPages}`);
        if (Object.keys(filters).length > 0) {
            console.log('[server] filters:', JSON.stringify(filters));
        }
        
        // Reset progress
        scrapeProgress = {
            inProgress: true,
            currentPage: 0,
            totalPages: validPages,
            propertiesFound: 0,
            progress: 0,
            completed: false
        };
        
        res.json({
            success: true,
            message: 'scraping process started',
            status: 'in_progress',
            estimatedTime: `${validPages * 45}-${validPages * 60} seconds`
        });

        scrapePortalInmobiliario({ 
            operation, 
            propertyType, 
            comuna, 
            pages: validPages, 
            filters,
            onProgress: (progressData) => {
                scrapeProgress = {
                    ...scrapeProgress,
                    ...progressData,
                    inProgress: true,
                    completed: false
                };
                console.log(`[server] progress update: ${progressData.progress}% (${progressData.propertiesFound} properties)`);
            }
        })
            .then(data => {
                scrapedData.properties = [...scrapedData.properties, ...data];
                scrapedData.lastUpdate = new Date().toISOString();
                scrapedData.metadata = {
                    lastScrapeParams: { operation, propertyType, comuna, pages: validPages, filters },
                    lastScrapeCount: data.length
                };
                scrapeProgress.completed = true;
                scrapeProgress.inProgress = false;
                scrapeProgress.progress = 100;
                console.log(`[server] scraping completed: ${data.length} properties added`);
            })
            .catch(error => {
                console.error('[server] scraping error:', error.message);
                console.error('[server] possible solutions:');
                console.error('[server] 1. install puppeteer-core: yarn add puppeteer-core');
                console.error('[server] 2. verify chrome installation path');
                console.error('[server] 3. check system permissions');
                scrapeProgress.inProgress = false;
                scrapeProgress.completed = true;
            });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.delete('/api/properties', (req, res) => {
    try {
        scrapedData = {
            properties: [],
            lastUpdate: null,
            metadata: {}
        };
        res.json({ success: true, message: 'data cleared successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/scrape-progress', (req, res) => {
    try {
        res.json({
            success: true,
            ...scrapeProgress
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        status: 'online',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/ai-analysis', async (req, res) => {
    try {
        const { properties, query } = req.body;
        
        res.json({
            success: true,
            message: 'ai analysis will be available soon',
            status: 'coming_soon',
            features: [
                'predictive price analysis',
                'personalized recommendations',
                'investment opportunity detection',
                'intelligent property comparison',
                'market trend analysis with ml'
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`[server] running on http://localhost:${PORT}`);
    console.log(`[server] api available at http://localhost:${PORT}/api`);
    console.log(`[server] use POST /api/scrape to start scraping`);
});

export default app;
