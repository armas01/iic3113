import puppeteer from 'puppeteer-core';
import * as cheerio from 'cheerio';

export async function scrapePortalInmobiliario({
    operation = 'venta',
    propertyType = 'departamento',
    comuna = 'las-condes-metropolitana',
    pages = 5,
    filters = {},
    onProgress = null // Callback for progress updates
}) {
    console.log('[scraper] starting extraction process');
    console.log(`[scraper] params: operation=${operation}, type=${propertyType}, comuna=${comuna}, pages=${pages}`);

    const allProperties = [];
    let browser;
    const startTime = Date.now();

    try {
        console.log('[scraper] launching browser');

        // use a fixed temporary profile to maintain session across runs
        const os = await import('os');
        const path = await import('path');
        const fs = await import('fs');

        const tempProfileDir = path.join(os.tmpdir(), 'chrome-scraper-persistent');

        // create directory if it doesn't exist
        if (!fs.existsSync(tempProfileDir)) {
            fs.mkdirSync(tempProfileDir, { recursive: true });
            console.log('[scraper] created new profile directory');
        } else {
            console.log('[scraper] using existing profile directory (session should be maintained)');
        }

        browser = await puppeteer.launch({
            headless: false,
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            userDataDir: tempProfileDir,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled',
                '--disable-features=IsolateOrigins,site-per-process'
            ],
            timeout: 60000
        });

        console.log('[scraper] browser launched successfully');

        // check if we need to login (first time only)
        let page = await browser.newPage();
        await page.goto('https://www.portalinmobiliario.com/venta/departamento/las-condes-metropolitana', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        const pageText = await page.evaluate(() => document.body.innerText);
        const needsLogin = pageText.includes('ingresa a') || pageText.includes('tu cuenta');

        if (needsLogin) {
            console.log('[scraper] PRIMERA VEZ: debes iniciar sesión en la ventana que se abrió');
            console.log('[scraper] la sesión se guardará para próximas ejecuciones');
            console.log('[scraper] esperando 60 segundos para que inicies sesión...');
            await new Promise(resolve => setTimeout(resolve, 60000));
        } else {
            console.log('[scraper] sesión activa detectada, no necesitas login');
            console.log('[scraper] esperando 5 segundos...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        await page.close();
        page = await browser.newPage();

        // set viewport to look more like a real browser
        await page.setViewport({ width: 1920, height: 1080 });

        // set additional headers to look more like a real browser
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'es-CL,es;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
        });

        // accept cookies if dialog appears
        page.on('dialog', async dialog => {
            console.log('[scraper] dialog detected:', dialog.message());
            await dialog.accept();
        });

        for (let pageNum = 1; pageNum <= pages; pageNum++) {
            try {
                const url = buildPortalInmobiliarioUrl(operation, propertyType, comuna, pageNum, filters);

                console.log(`[scraper] processing page ${pageNum}/${pages}: ${url}`);

                const navigationStart = Date.now();
                await page.goto(url, {
                    waitUntil: 'networkidle0',
                    timeout: 30000
                });

                // try to click "Entendido" cookie button if it exists
                try {
                    await page.waitForSelector('button:has-text("Entendido")', { timeout: 2000 });
                    await page.click('button:has-text("Entendido")');
                    console.log('[scraper] clicked cookie consent button');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (e) {
                    // cookie button not found or already clicked
                }

                // check if login wall is present and try to bypass
                const pageText = await page.evaluate(() => document.body.innerText);
                if (pageText.includes('ingresa a') || pageText.includes('tu cuenta')) {
                    console.log('[scraper] login wall detected, attempting to bypass');

                    // try to find and click "cerrar" or similar button
                    const closeSelectors = [
                        'button[aria-label="Cerrar"]',
                        'button.close',
                        '.modal-close',
                        '[data-testid="close"]',
                        'button:has-text("Cerrar")',
                        '[aria-label="Close"]'
                    ];

                    for (const selector of closeSelectors) {
                        try {
                            const button = await page.$(selector);
                            if (button) {
                                await button.click();
                                console.log(`[scraper] clicked close button with selector: ${selector}`);
                                await new Promise(resolve => setTimeout(resolve, 2000));
                                break;
                            }
                        } catch (e) {
                            continue;
                        }
                    }

                    // press ESC key to try to close modal
                    await page.keyboard.press('Escape');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                const navigationTime = ((Date.now() - navigationStart) / 1000).toFixed(2);
                console.log(`[scraper] page loaded in ${navigationTime}s`);

                console.log('[scraper] waiting for property elements');

                // wait for content to render - try different strategies
                let foundElements = false;
                const maxAttempts = 8;

                for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                    console.log(`[scraper] attempt ${attempt}/${maxAttempts} to find elements`);

                    // check if elements exist
                    const elementCount = await page.evaluate(() => {
                        const selectors = [
                            '.ui-search-result',
                            '.ui-search-layout__item',
                            '[data-id]',
                            'li.ui-search-layout__item',
                            'article',
                            '.ui-search-result__content'
                        ];

                        for (const selector of selectors) {
                            const elements = document.querySelectorAll(selector);
                            if (elements.length > 0) {
                                return { count: elements.length, selector };
                            }
                        }
                        return { count: 0, selector: null };
                    });

                    if (elementCount.count > 0) {
                        console.log(`[scraper] found ${elementCount.count} elements with selector: ${elementCount.selector}`);
                        foundElements = true;
                        break;
                    }

                    // scroll page to trigger lazy loading
                    if (attempt % 2 === 0) {
                        await page.evaluate(() => {
                            window.scrollTo(0, document.body.scrollHeight / 2);
                        });
                        console.log('[scraper] scrolled page to trigger content loading');
                    }

                    // wait 1.5 seconds before next attempt
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }

                if (!foundElements) {
                    console.log('[scraper] warning: could not find property elements after all attempts');
                    // save html for debugging
                    const content = await page.content();
                    console.log('[scraper] page html length:', content.length);

                    // check if there's a login or captcha
                    const bodyText = await page.evaluate(() => document.body.innerText);
                    if (bodyText.includes('ingresa a') || bodyText.includes('cuenta')) {
                        console.log('[scraper] warning: page seems to require login');
                    }
                    if (bodyText.includes('captcha') || bodyText.includes('robot')) {
                        console.log('[scraper] warning: page seems to have captcha');
                    }
                }

                const content = await page.content();
                const $ = cheerio.load(content);

                const properties = [];

                console.log('[scraper] parsing html with cheerio');

                // try multiple container selectors
                const containerSelectors = [
                    '.ui-search-result',
                    '.ui-search-layout__item',
                    'li.ui-search-layout__item',
                    '[data-id]',
                    'article',
                    '.ui-search-result__wrapper'
                ];

                let $elements = $();
                for (const selector of containerSelectors) {
                    $elements = $(selector);
                    if ($elements.length > 0) {
                        console.log(`[scraper] cheerio found ${$elements.length} elements with selector: ${selector}`);
                        break;
                    }
                }

                if ($elements.length === 0) {
                    console.log('[scraper] warning: cheerio could not find any property elements');
                    // check what's in the body
                    const bodyText = $('body').text().substring(0, 500);
                    console.log('[scraper] body text preview:', bodyText);
                }

                // Extract basic info and links from listing page
                const propertyLinks = [];
                $elements.each((i, element) => {
                    try {
                        const $element = $(element);
                        const link = $element.find('a').first().attr('href');
                        const title = $element.find('.ui-search-item__title, .ui-search-item__group__element--title, h2, .ui-search-item__title-label').first().text().trim();

                        if (link && title && title !== 'sin título') {
                            propertyLinks.push({ link, title, index: i });
                        }
                    } catch (error) {
                        console.error(`[scraper] error extracting link ${i + 1}: ${error.message}`);
                    }
                });

                console.log(`[scraper] found ${propertyLinks.length} property links on page ${pageNum}`);

                // Visit each property detail page to extract comprehensive information
                // Process ALL properties found on the page
                for (let idx = 0; idx < propertyLinks.length; idx++) {
                    const { link, title: basicTitle } = propertyLinks[idx];

                    try {
                        console.log(`[scraper] visiting property ${idx + 1}/${propertyLinks.length}: ${link.substring(0, 60)}...`);

                        await page.goto(link, {
                            waitUntil: 'networkidle0',
                            timeout: 15000
                        });

                        await new Promise(resolve => setTimeout(resolve, 1000));

                        const detailContent = await page.content();
                        const $detail = cheerio.load(detailContent);

                        // Extract comprehensive property data
                        const propertyData = {
                            id: `property-${Date.now()}-${idx}`,
                            title: $detail('h1').first().text().trim() || basicTitle,
                            link,
                            source: 'portal inmobiliario',
                            scrapedAt: new Date().toISOString(),
                            comuna,
                            propertyType,
                            operation
                        };

                        // Extract price information
                        const priceText = $detail('.ui-pdp-price__second-line, .price-tag, [class*="price"]').first().text().trim();
                        if (priceText) {
                            const priceMatch = priceText.match(/[\d.,]+/);
                            if (priceMatch) {
                                propertyData.price = parseFloat(priceMatch[0].replace(/\./g, '').replace(',', '.'));
                                propertyData.priceText = priceText;
                                propertyData.currency = priceText.includes('UF') ? 'UF' : (priceText.includes('USD') ? 'USD' : 'CLP');
                                propertyData.priceUF = propertyData.currency === 'UF' ? propertyData.price : Math.round(propertyData.price / 35000);
                            }
                        }

                        // Extract location
                        const location = $detail('.ui-pdp-media__location, [class*="location"]').first().text().trim();
                        if (location) {
                            propertyData.location = location;
                            const locationParts = location.split(',').map(s => s.trim());
                            propertyData.street = locationParts[0] || null;
                            propertyData.neighborhood = locationParts[1] || null;
                        }

                        // Extract all attributes from the detail page
                        const allAttributes = [];
                        $detail('.ui-pdp-highlighted-specs-res, .ui-vip-core-container, [class*="specs"], [class*="features"], [class*="attribute"]').each((i, elem) => {
                            const text = $detail(elem).text().trim();
                            if (text && text.length > 0 && text.length < 200) {
                                allAttributes.push(text);
                            }
                        });

                        // Look for key-value pairs in specs
                        const specs = {};
                        $detail('.ui-pdp-highlighted-specs-res__item, [class*="specs-item"], .specs-item, .ui-vpp-highlighted-specs__attribute').each((i, elem) => {
                            const $elem = $detail(elem);
                            const label = $elem.find('.ui-pdp-highlighted-specs-res__label, [class*="label"]').text().trim().toLowerCase();
                            const value = $elem.find('.ui-pdp-highlighted-specs-res__value, [class*="value"]').text().trim();

                            if (label && value) {
                                specs[label] = value;
                            }
                        });

                        // Extract description
                        propertyData.description = $detail('.ui-pdp-description, [class*="description"]').first().text().trim() || null;

                        // Parse specific attributes
                        const attributesText = allAttributes.join(' ').toLowerCase();

                        // Bedrooms
                        const bedroomsMatch = attributesText.match(/(\d+)\s*dorm/i) || attributesText.match(/(\d+)\s*recám/i);
                        propertyData.bedrooms = bedroomsMatch ? parseInt(bedroomsMatch[1]) : (specs['dormitorios'] ? parseInt(specs['dormitorios']) : 0);

                        // Bathrooms
                        const bathroomsMatch = attributesText.match(/(\d+)\s*baño/i);
                        propertyData.bathrooms = bathroomsMatch ? parseInt(bathroomsMatch[1]) : (specs['baños'] ? parseInt(specs['baños']) : 0);

                        // Area
                        const areaMatch = attributesText.match(/([\d.,]+)\s*m[²2]/i);
                        propertyData.area = areaMatch ? parseFloat(areaMatch[1].replace(',', '.')) : (specs['superficie total'] ? parseFloat(specs['superficie total'].replace(',', '.')) : 0);
                        propertyData.sqMeters = propertyData.area;

                        // Parking
                        const parkingMatch = attributesText.match(/(\d+)\s*estac/i);
                        propertyData.parking = parkingMatch ? parseInt(parkingMatch[1]) : (specs['estacionamientos'] ? parseInt(specs['estacionamientos']) : 0);
                        propertyData.parkings = propertyData.parking;

                        // Bodegas
                        const bodegasMatch = attributesText.match(/(\d+)\s*bodega/i);
                        propertyData.bodegas = bodegasMatch ? parseInt(bodegasMatch[1]) : (specs['bodegas'] ? parseInt(specs['bodegas']) : 0);

                        // Extract all available specs
                        propertyData.specs = specs;
                        propertyData.attributes = allAttributes;

                        // Extract amenities
                        const fullText = `${propertyData.title} ${propertyData.description || ''} ${attributesText}`.toLowerCase();
                        propertyData.amenities = {
                            gimnasio: fullText.includes('gimnasio') || fullText.includes('gym'),
                            piscina: fullText.includes('piscina') || fullText.includes('pool'),
                            terraza: fullText.includes('terraza') || fullText.includes('balcón'),
                            seguridad: fullText.includes('seguridad') || fullText.includes('conserje') || fullText.includes('portería'),
                            amoblado: fullText.includes('amoblado') || fullText.includes('furnished') || fullText.includes('amueblado'),
                            logia: fullText.includes('logia'),
                            vista: fullText.includes('vista') || fullText.includes('view'),
                            luminoso: fullText.includes('luminoso') || fullText.includes('luz natural'),
                            ascensor: fullText.includes('ascensor') || fullText.includes('elevador'),
                            calefaccion: fullText.includes('calefacción') || fullText.includes('calefaccion'),
                            aireAcondicionado: fullText.includes('aire acondicionado') || fullText.includes('a/c'),
                            aguaCaliente: fullText.includes('agua caliente'),
                            jardin: fullText.includes('jardín') || fullText.includes('jardin'),
                            quincho: fullText.includes('quincho'),
                            salaDeJuegos: fullText.includes('sala de juegos') || fullText.includes('sala juegos'),
                            lavanderia: fullText.includes('lavandería') || fullText.includes('lavanderia')
                        };

                        // Additional property details from specs
                        propertyData.orientation = specs['orientación'] || specs['orientacion'] || null;
                        propertyData.floor = specs['piso'] || null;
                        propertyData.totalFloors = specs['pisos del edificio'] || specs['pisos totales'] || null;
                        propertyData.yearBuilt = specs['año de construcción'] || specs['año construccion'] || null;
                        propertyData.condition = specs['estado'] || specs['condición'] || null;
                        propertyData.expenses = specs['gastos comunes'] || null;

                        // Only add if has minimum required data
                        if (propertyData.price && propertyData.title) {
                            properties.push(propertyData);
                            console.log(`[scraper] ✓ extracted: ${propertyData.title.substring(0, 40)} - ${propertyData.priceText || 'No price'}`);
                        }

                        // Report progress every 10% of properties within the page
                        const propertyProgress = ((idx + 1) / propertyLinks.length) * 100;
                        if (propertyProgress % 10 === 0 || idx === propertyLinks.length - 1) {
                            const overallProgress = Math.round(((pageNum - 1) / pages + (idx + 1) / (propertyLinks.length * pages)) * 100);

                            if (onProgress && typeof onProgress === 'function') {
                                onProgress({
                                    currentPage: pageNum,
                                    totalPages: pages,
                                    propertiesFound: allProperties.length + properties.length,
                                    progress: overallProgress
                                });
                            }
                        }

                        // Small delay between property visits
                        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

                    } catch (error) {
                        console.error(`[scraper] error extracting property details: ${error.message}`);
                    }
                }

                console.log(`[scraper] extracted ${properties.length} properties from page ${pageNum}`);
                console.log(`[scraper] total accumulated: ${allProperties.length + properties.length}`);

                allProperties.push(...properties);

                const progress = Math.round((pageNum / pages) * 100);
                console.log(`[scraper] progress: ${progress}% (${pageNum}/${pages} pages)`);

                // Call progress callback if provided
                if (onProgress && typeof onProgress === 'function') {
                    onProgress({
                        currentPage: pageNum,
                        totalPages: pages,
                        propertiesFound: allProperties.length,
                        progress: progress
                    });
                }

                if (pageNum < pages) {
                    const delay = 1000 + Math.random() * 2000;
                    console.log(`[scraper] waiting ${(delay / 1000).toFixed(1)}s before next page`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

            } catch (error) {
                console.error(`[scraper] error on page ${pageNum}: ${error.message}`);
                console.error('[scraper] continuing with next page');
            }
        }

        const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('[scraper] extraction completed');
        console.log(`[scraper] summary: ${allProperties.length} properties, ${pages} pages, ${totalTime}s total`);
        console.log(`[scraper] average: ${(totalTime / pages).toFixed(2)}s per page, ${(allProperties.length / pages).toFixed(1)} properties per page`);

        return allProperties;

    } catch (error) {
        console.error('[scraper] critical error:', error.message);
        console.error('[scraper] stack:', error.stack);
        throw error;
    } finally {
        if (browser) {
            console.log('[scraper] closing browser');
            await browser.close();
            console.log('[scraper] browser closed');
        }
    }
}

function buildPortalInmobiliarioUrl(operation, propertyType, comuna, pageNum, filters = {}) {
    const baseUrl = `https://www.portalinmobiliario.com/${operation}/${propertyType}/${comuna}`;

    // portal inmobiliario uses offset-based pagination
    // page 1: no offset
    // page 2: _Desde_49_NoIndex_True (48 items per page + 1)
    // page 3: _Desde_97_NoIndex_True (48*2 + 1)
    const itemsPerPage = 48;

    let url = baseUrl;

    if (pageNum > 1) {
        const offset = (pageNum - 1) * itemsPerPage + 1;
        url += `/_Desde_${offset}_NoIndex_True`;
    }

    // add filters as query parameters
    const params = new URLSearchParams();

    // precio minimo y maximo (en UF para venta, CLP para arriendo)
    if (filters.priceMin) {
        params.append('PRICE_FROM', filters.priceMin);
    }
    if (filters.priceMax) {
        params.append('PRICE_TO', filters.priceMax);
    }

    // superficie minima y maxima (m²)
    if (filters.areaMin) {
        params.append('AREA_FROM', filters.areaMin);
    }
    if (filters.areaMax) {
        params.append('AREA_TO', filters.areaMax);
    }

    // numero de dormitorios
    if (filters.bedrooms) {
        params.append('BEDROOMS_FROM', filters.bedrooms);
    }

    // numero de baños
    if (filters.bathrooms) {
        params.append('BATHROOMS_FROM', filters.bathrooms);
    }

    // estacionamientos
    if (filters.parking) {
        params.append('PARKING_FROM', filters.parking);
    }

    // ordenamiento
    if (filters.sort) {
        params.append('sort', filters.sort);
    }

    // condicion: new (nuevas), used (usadas)
    if (filters.condition) {
        params.append('PROPERTY_CONDITION', filters.condition);
    }

    const queryString = params.toString();
    if (queryString) {
        url += `?${queryString}`;
    }

    return url;
}

