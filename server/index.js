import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { scrapePortalInmobiliario } from './scraper.js';
import { analyzeData } from './dataAnalyzer.js';

dotenv.config();

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

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat-analysis", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Falta mensaje" });
        }

        // Si no hay scraping
        if (!scrapedData.properties || scrapedData.properties.length === 0) {
            return res.json({
                reply: "Aún no hay datos disponibles. Debes realizar un scraping antes."
            });
        }

        const properties = scrapedData.properties;

        // === Estadísticas generales
        const total = properties.length;
        const avgPrice = Math.round(properties.reduce((a, b) => a + (b.priceUF || 0), 0) / total);
        const avgMeters = Math.round(properties.reduce((a, b) => a + (b.sqMeters || 0), 0) / total);

        const byComuna = {};
        for (const p of properties) {
            const c = p.comuna || "desconocida";
            if (!byComuna[c]) byComuna[c] = { count: 0, totalUF: 0 };
            byComuna[c].count++;
            byComuna[c].totalUF += p.priceUF || 0;
        }

        for (const c in byComuna) {
            byComuna[c].avgPrice = Math.round(byComuna[c].totalUF / byComuna[c].count);
        }

        // === TODAS LAS PROPIEDADES (compactas)
        const compactProperties = properties.map(p => ({
            id: p.id,
            title: p.title,
            priceUF: p.priceUF,
            sqMeters: p.sqMeters,
            comuna: p.comuna,
            link: p.link
        }));

        const context = {
            totalProperties: total,
            averageUF: avgPrice,
            averageSqMeters: avgMeters,
            comunas: byComuna,
            properties: compactProperties
        };

        // === LLM CALL ===
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "Eres un analista inmobiliario experto. Responde basándote EXCLUSIVAMENTE en los datos que te entrego (listado completo de propiedades). Siempre que recomiendes una propiedad, incluye su link."
                },
                {
                    role: "assistant",
                    content: "Datos del scraping:\n" + JSON.stringify(context, null, 2)
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        const reply = completion.choices[0].message.content;

        res.json({ reply });

    } catch (error) {
        console.error("Error en /api/chat-analysis:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`[server] running on http://localhost:${PORT}`);
    console.log(`[server] api available at http://localhost:${PORT}/api`);
    console.log(`[server] use POST /api/scrape to start scraping`);
});

export default app;
