import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

/**
 * Scrape Portal Inmobiliario
 * Este scraper extrae información de propiedades del portal inmobiliario chileno más grande
 */
export async function scrapePortalInmobiliario({ operation = 'venta', propertyType = 'departamento', comuna = 'las-condes', pages = 3 }) {
    console.log(`🕷️ Starting scraper for ${operation} ${propertyType} in ${comuna} (${pages} pages)`);
    
    const allProperties = [];
    let browser;

    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Set user agent to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
        
        for (let pageNum = 1; pageNum <= pages; pageNum++) {
            try {
                // Construct URL (Portal Inmobiliario structure)
                const url = `https://www.portalinmobiliario.com/${operation}/${propertyType}/${comuna}?page=${pageNum}`;
                console.log(`📄 Scraping page ${pageNum}: ${url}`);

                await page.goto(url, { 
                    waitUntil: 'networkidle2',
                    timeout: 30000 
                });

                // Wait for properties to load
                await page.waitForSelector('[data-id]', { timeout: 10000 }).catch(() => {
                    console.log('⚠️ No properties found on this page');
                });

                // Get page content
                const content = await page.content();
                const $ = cheerio.load(content);

                // Extract properties
                const properties = [];
                
                $('[data-id]').each((i, element) => {
                    try {
                        const $element = $(element);
                        
                        // Extract property data
                        const title = $element.find('.ui-search-item__title').text().trim();
                        const priceText = $element.find('.ui-search-price__second-line').text().trim();
                        const location = $element.find('.ui-search-item__location').text().trim();
                        const link = $element.find('a').attr('href');
                        
                        // Extract attributes (bedrooms, bathrooms, area)
                        const attributes = [];
                        $element.find('.ui-search-card-attributes__attribute').each((j, attr) => {
                            attributes.push($(attr).text().trim());
                        });

                        // Parse price
                        let price = null;
                        let currency = 'CLP';
                        if (priceText) {
                            const priceMatch = priceText.match(/[\d.,]+/);
                            if (priceMatch) {
                                price = parseFloat(priceMatch[0].replace(/\./g, '').replace(',', '.'));
                            }
                            if (priceText.includes('UF')) currency = 'UF';
                            if (priceText.includes('USD')) currency = 'USD';
                        }

                        // Parse attributes
                        const bedrooms = attributes.find(a => a.includes('dorm')) || null;
                        const bathrooms = attributes.find(a => a.includes('baño')) || null;
                        const area = attributes.find(a => a.includes('m²')) || null;
                        const parking = attributes.find(a => a.includes('estac')) || null;

                        const property = {
                            id: $element.attr('data-id'),
                            title: title || 'Sin título',
                            price,
                            priceText,
                            currency,
                            location: location || comuna,
                            comuna,
                            propertyType,
                            operation,
                            link: link || '#',
                            bedrooms: bedrooms ? parseInt(bedrooms.match(/\d+/)?.[0]) : null,
                            bathrooms: bathrooms ? parseInt(bathrooms.match(/\d+/)?.[0]) : null,
                            area: area ? parseFloat(area.match(/[\d.,]+/)?.[0]?.replace(',', '.')) : null,
                            parking: parking ? parseInt(parking.match(/\d+/)?.[0]) : null,
                            attributes,
                            scrapedAt: new Date().toISOString(),
                            source: 'Portal Inmobiliario'
                        };

                        if (property.title !== 'Sin título') {
                            properties.push(property);
                        }
                    } catch (error) {
                        console.error('Error parsing property:', error.message);
                    }
                });

                console.log(`✅ Found ${properties.length} properties on page ${pageNum}`);
                allProperties.push(...properties);

                // Random delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

            } catch (error) {
                console.error(`❌ Error scraping page ${pageNum}:`, error.message);
            }
        }

        console.log(`🎉 Scraping completed! Total properties: ${allProperties.length}`);
        return allProperties;

    } catch (error) {
        console.error('❌ Scraper error:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

/**
 * Alternative scraper using mock data (for development/demo)
 * This generates realistic fake data based on real patterns
 */
export function generateMockProperties({ operation = 'venta', propertyType = 'departamento', comuna = 'las-condes', count = 50 }) {
    console.log(`🎲 Generating ${count} mock properties...`);
    
    const properties = [];
    const comunas = ['Las Condes', 'Providencia', 'Vitacura', 'Santiago', 'Ñuñoa', 'La Reina', 'Quilicura'];
    const types = ['Departamento', 'Casa', 'Oficina', 'Bodega', 'Estacionamiento'];
    const addresses = [
        'Av. Apoquindo', 'Av. Kennedy', 'Av. Providencia', 'Los Leones', 
        'Isidora Goyenechea', 'El Bosque', 'Irarrázaval', 'Príncipe de Gales'
    ];

    for (let i = 0; i < count; i++) {
        const selectedComuna = comuna || comunas[Math.floor(Math.random() * comunas.length)];
        const selectedType = propertyType || types[Math.floor(Math.random() * types.length)];
        const isArriendo = operation === 'arriendo';

        // Generate realistic prices
        let price, priceUF;
        if (isArriendo) {
            price = Math.floor(Math.random() * 2000000) + 300000; // 300k - 2.3M CLP
            priceUF = Math.floor(price / 35000); // Approximate UF conversion
        } else {
            priceUF = Math.floor(Math.random() * 15000) + 1000; // 1000 - 16000 UF
            price = priceUF * 35000; // Approximate CLP
        }

        const bedrooms = selectedType === 'Departamento' || selectedType === 'Casa' 
            ? Math.floor(Math.random() * 5) + 1 
            : 0;
        const bathrooms = bedrooms > 0 ? Math.floor(Math.random() * bedrooms) + 1 : Math.floor(Math.random() * 3);
        const area = selectedType === 'Departamento' ? Math.floor(Math.random() * 150) + 40
            : selectedType === 'Casa' ? Math.floor(Math.random() * 300) + 100
            : selectedType === 'Oficina' ? Math.floor(Math.random() * 200) + 30
            : selectedType === 'Bodega' ? Math.floor(Math.random() * 500) + 100
            : Math.floor(Math.random() * 20) + 10;
        
        const parking = Math.random() > 0.5 ? Math.floor(Math.random() * 4) + 1 : 0;

        properties.push({
            id: `mock-${Date.now()}-${i}`,
            title: `${selectedType} en ${selectedComuna} - ${addresses[Math.floor(Math.random() * addresses.length)]}`,
            price,
            priceText: isArriendo ? `$${price.toLocaleString('es-CL')}` : `${priceUF} UF`,
            priceUF,
            currency: isArriendo ? 'CLP' : 'UF',
            location: `${selectedComuna}, ${addresses[Math.floor(Math.random() * addresses.length)]} ${Math.floor(Math.random() * 9000) + 1000}`,
            comuna: selectedComuna,
            address: `${addresses[Math.floor(Math.random() * addresses.length)]} ${Math.floor(Math.random() * 9000) + 1000}`,
            propertyType: selectedType,
            type: selectedType,
            operation,
            link: `https://www.portalinmobiliario.com/MLC-${Math.floor(Math.random() * 1000000)}`,
            bedrooms,
            bathrooms,
            area,
            sqMeters: area,
            parking,
            parkings: parking,
            attributes: [
                bedrooms > 0 ? `${bedrooms} dormitorios` : null,
                bathrooms > 0 ? `${bathrooms} baños` : null,
                `${area} m²`,
                parking > 0 ? `${parking} estacionamientos` : null
            ].filter(Boolean),
            isNew: Math.random() > 0.7,
            realEstate: ['Inmobiliaria Aconcagua', 'Inmobiliaria Manquehue', 'Propiedades Independientes', 'Inmobiliaria del Sur'][Math.floor(Math.random() * 4)],
            scrapedAt: new Date().toISOString(),
            source: 'Mock Data Generator'
        });
    }

    console.log(`✅ Generated ${properties.length} mock properties`);
    return properties;
}

