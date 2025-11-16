import express from 'express';
import cors from 'cors';
import { scrapePortalInmobiliario } from './scraper.js';
import { analyzeData } from './dataAnalyzer.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for scraped data (in production, use a database)
let scrapedData = {
    properties: [],
    lastUpdate: null,
    metadata: {}
};

// API Routes

// Get scraped data
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

// Get raw data
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

// Get analyzed data with insights
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

// Trigger scraping
app.post('/api/scrape', async (req, res) => {
    try {
        const { operation = 'venta', propertyType = 'departamento', comuna = 'las-condes', pages = 3 } = req.body;
        
        res.json({
            success: true,
            message: 'Scraping iniciado. Los datos se actualizarán en breve.',
            status: 'in_progress'
        });

        // Run scraping in background
        scrapePortalInmobiliario({ operation, propertyType, comuna, pages })
            .then(data => {
                scrapedData.properties = [...scrapedData.properties, ...data];
                scrapedData.lastUpdate = new Date().toISOString();
                scrapedData.metadata = {
                    lastScrapeParams: { operation, propertyType, comuna, pages },
                    lastScrapeCount: data.length
                };
                console.log(`✅ Scraping completed: ${data.length} properties found`);
            })
            .catch(error => {
                console.error('❌ Scraping error:', error);
            });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Clear data
app.delete('/api/properties', (req, res) => {
    try {
        scrapedData = {
            properties: [],
            lastUpdate: null,
            metadata: {}
        };
        res.json({ success: true, message: 'Data cleared successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        status: 'online',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// AI Analysis endpoint (preparado para futura implementación)
app.post('/api/ai-analysis', async (req, res) => {
    try {
        const { properties, query } = req.body;
        
        // Esta será la integración futura con IA
        res.json({
            success: true,
            message: 'AI Analysis estará disponible próximamente',
            status: 'coming_soon',
            features: [
                'Análisis predictivo de precios',
                'Recomendaciones personalizadas',
                'Detección de oportunidades de inversión',
                'Comparación inteligente de propiedades',
                'Análisis de tendencias del mercado con ML'
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
    console.log(`🔍 Use POST /api/scrape to start scraping`);
});

export default app;

