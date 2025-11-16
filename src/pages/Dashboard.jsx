import { useState } from 'react'
import './Dashboard.css'

function Dashboard() {
    const [filters, setFilters] = useState({
        operation: 'venta',
        propertyType: 'all',
        priceMin: 0,
        priceMax: 20000,
        comuna: 'all'
    })

    const [scraperConfig, setScraperConfig] = useState({
        operation: 'venta',
        propertyType: 'departamento',
        comuna: 'las-condes',
        pages: 3
    })

    const [scraping, setScraping] = useState(false)
    const [scrapeMessage, setScrapeMessage] = useState('')

    const handleScrape = async () => {
        setScraping(true)
        setScrapeMessage('Iniciando scraping...')
        
        try {
            const response = await fetch('http://localhost:3001/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(scraperConfig)
            })
            
            const data = await response.json()
            
            if (data.success) {
                setScrapeMessage(`✅ Scraping iniciado! Los datos se actualizarán en breve. Ve a "Raw Data" o "Análisis IA" para ver los resultados.`)
            } else {
                setScrapeMessage(`❌ Error: ${data.error}`)
            }
        } catch (error) {
            setScrapeMessage(`❌ Error: No se pudo conectar con el servidor. Asegúrate de ejecutar "yarn server" en otra terminal.`)
            console.error('Scrape error:', error)
        } finally {
            setTimeout(() => {
                setScraping(false)
                setScrapeMessage('')
            }, 5000)
        }
    }

    const handleUseMockData = async () => {
        setScraping(true)
        setScrapeMessage('Generando datos de prueba...')
        
        try {
            const mockData = await import('../../../server/scraper.js')
            const properties = mockData.generateMockProperties({
                operation: scraperConfig.operation,
                propertyType: scraperConfig.propertyType,
                comuna: scraperConfig.comuna,
                count: scraperConfig.pages * 20
            })
            
            setScrapeMessage(`✅ Se generaron ${properties.length} propiedades de prueba. Ve a "Raw Data" para verlas.`)
        } catch (error) {
            setScrapeMessage('❌ Error generando datos de prueba')
            console.error('Mock data error:', error)
        } finally {
            setTimeout(() => {
                setScraping(false)
                setScrapeMessage('')
            }, 5000)
        }
    }

    // Datos hardcodeados simulando scraping de Portal Inmobiliario
    const properties = [
        {
            id: 1,
            title: "Moderno Departamento en Las Condes",
            price: 185000000,
            priceUF: 4500,
            comuna: "Las Condes",
            address: "Av. Apoquindo 6500",
            bedrooms: 3,
            bathrooms: 2,
            parkings: 1,
            sqMeters: 95,
            type: "Departamento",
            operation: "venta",
            isNew: true,
            image: "🏢",
            realEstate: "Inmobiliaria Aconcagua"
        },
        {
            id: 2,
            title: "Casa con Jardín en Providencia",
            price: 320000000,
            priceUF: 7800,
            comuna: "Providencia",
            address: "Los Leones 1234",
            bedrooms: 4,
            bathrooms: 3,
            parkings: 2,
            sqMeters: 180,
            type: "Casa",
            operation: "venta",
            isNew: false,
            image: "🏠",
            realEstate: "Inmobiliaria Manquehue"
        },
        {
            id: 3,
            title: "Estacionamiento Techado en Vitacura",
            price: 25000000,
            priceUF: 610,
            comuna: "Vitacura",
            address: "Av. Vitacura 5678",
            bedrooms: 0,
            bathrooms: 0,
            parkings: 1,
            sqMeters: 12,
            type: "Estacionamiento",
            operation: "venta",
            isNew: true,
            image: "🅿️",
            realEstate: "Propiedades Independientes"
        },
        {
            id: 4,
            title: "Departamento Amoblado en Santiago Centro",
            price: 850000,
            priceUF: 20,
            comuna: "Santiago",
            address: "Alameda 2000",
            bedrooms: 2,
            bathrooms: 1,
            parkings: 0,
            sqMeters: 55,
            type: "Departamento",
            operation: "arriendo",
            isNew: false,
            image: "🏢",
            realEstate: "Inmobiliaria Aconcagua"
        },
        {
            id: 5,
            title: "Oficina en Edificio Corporativo",
            price: 95000000,
            priceUF: 2320,
            comuna: "Las Condes",
            address: "Av. El Bosque Norte 500",
            bedrooms: 0,
            bathrooms: 2,
            parkings: 3,
            sqMeters: 120,
            type: "Oficina",
            operation: "venta",
            isNew: true,
            image: "🏢",
            realEstate: "Inmobiliaria Manquehue"
        },
        {
            id: 6,
            title: "Bodega Industrial en Quilicura",
            price: 150000000,
            priceUF: 3660,
            comuna: "Quilicura",
            address: "Ruta 5 Norte Km 18",
            bedrooms: 0,
            bathrooms: 1,
            parkings: 4,
            sqMeters: 350,
            type: "Bodega",
            operation: "venta",
            isNew: false,
            image: "🏭",
            realEstate: "Inmobiliaria del Sur"
        },
        {
            id: 7,
            title: "Departamento Nuevo en Ñuñoa",
            price: 145000000,
            priceUF: 3540,
            comuna: "Ñuñoa",
            address: "Irarrázaval 3456",
            bedrooms: 2,
            bathrooms: 2,
            parkings: 1,
            sqMeters: 72,
            type: "Departamento",
            operation: "venta",
            isNew: true,
            image: "🏢",
            realEstate: "Inmobiliaria Aconcagua"
        },
        {
            id: 8,
            title: "Casa Familiar en La Reina",
            price: 280000000,
            priceUF: 6830,
            comuna: "La Reina",
            address: "Príncipe de Gales 8900",
            bedrooms: 5,
            bathrooms: 3,
            parkings: 2,
            sqMeters: 220,
            type: "Casa",
            operation: "venta",
            isNew: false,
            image: "🏠",
            realEstate: "Propiedades Independientes"
        },
        {
            id: 9,
            title: "Lujoso Penthouse en Vitacura",
            price: 450000000,
            priceUF: 10975,
            comuna: "Vitacura",
            address: "Av. Kennedy 9000",
            bedrooms: 4,
            bathrooms: 4,
            parkings: 3,
            sqMeters: 250,
            type: "Departamento",
            operation: "venta",
            isNew: true,
            image: "🏢",
            realEstate: "Inmobiliaria Manquehue"
        },
        {
            id: 10,
            title: "Departamento para Estudiantes en Santiago",
            price: 450000,
            priceUF: 11,
            comuna: "Santiago",
            address: "Arturo Prat 850",
            bedrooms: 1,
            bathrooms: 1,
            parkings: 0,
            sqMeters: 35,
            type: "Departamento",
            operation: "arriendo",
            isNew: true,
            image: "🏢",
            realEstate: "Inmobiliaria del Sur"
        },
        {
            id: 11,
            title: "Casa Amplia con Piscina en Lo Barnechea",
            price: 620000000,
            priceUF: 15120,
            comuna: "Las Condes",
            address: "Camino El Alba 12000",
            bedrooms: 6,
            bathrooms: 5,
            parkings: 4,
            sqMeters: 380,
            type: "Casa",
            operation: "venta",
            isNew: false,
            image: "🏠",
            realEstate: "Inmobiliaria Manquehue"
        },
        {
            id: 12,
            title: "Oficina Premium en Providencia",
            price: 125000000,
            priceUF: 3050,
            comuna: "Providencia",
            address: "Av. Providencia 1650",
            bedrooms: 0,
            bathrooms: 3,
            parkings: 2,
            sqMeters: 85,
            type: "Oficina",
            operation: "venta",
            isNew: true,
            image: "🏢",
            realEstate: "Inmobiliaria Aconcagua"
        },
        {
            id: 13,
            title: "Casa en Condominio Cerrado en La Reina",
            price: 385000000,
            priceUF: 9390,
            comuna: "La Reina",
            address: "Av. Larraín 8765",
            bedrooms: 4,
            bathrooms: 3,
            parkings: 2,
            sqMeters: 210,
            type: "Casa",
            operation: "venta",
            isNew: false,
            image: "🏠",
            realEstate: "Inmobiliaria Aconcagua"
        },
        {
            id: 14,
            title: "Departamento con Vista Panorámica en Ñuñoa",
            price: 1150000,
            priceUF: 28,
            comuna: "Ñuñoa",
            address: "Av. Grecia 5432",
            bedrooms: 3,
            bathrooms: 2,
            parkings: 1,
            sqMeters: 85,
            type: "Departamento",
            operation: "arriendo",
            isNew: true,
            image: "🏢",
            realEstate: "Propiedades Independientes"
        },
        {
            id: 15,
            title: "Bodega de Almacenamiento en Pudahuel",
            price: 85000000,
            priceUF: 2075,
            comuna: "Quilicura",
            address: "Ruta 68 Km 15",
            bedrooms: 0,
            bathrooms: 1,
            parkings: 2,
            sqMeters: 280,
            type: "Bodega",
            operation: "venta",
            isNew: false,
            image: "🏭",
            realEstate: "Inmobiliaria del Sur"
        },
        {
            id: 16,
            title: "Estacionamiento Doble en Las Condes",
            price: 35000000,
            priceUF: 855,
            comuna: "Las Condes",
            address: "Av. Manquehue Norte 1500",
            bedrooms: 0,
            bathrooms: 0,
            parkings: 2,
            sqMeters: 24,
            type: "Estacionamiento",
            operation: "venta",
            isNew: true,
            image: "🅿️",
            realEstate: "Inmobiliaria Manquehue"
        },
        {
            id: 17,
            title: "Departamento Luminoso en Providencia",
            price: 168000000,
            priceUF: 4100,
            comuna: "Providencia",
            address: "General Bustamante 200",
            bedrooms: 2,
            bathrooms: 2,
            parkings: 1,
            sqMeters: 68,
            type: "Departamento",
            operation: "venta",
            isNew: true,
            image: "🏢",
            realEstate: "Inmobiliaria Aconcagua"
        },
        {
            id: 18,
            title: "Casa Remodelada en Santiago Centro",
            price: 240000000,
            priceUF: 5860,
            comuna: "Santiago",
            address: "República 650",
            bedrooms: 3,
            bathrooms: 2,
            parkings: 1,
            sqMeters: 145,
            type: "Casa",
            operation: "venta",
            isNew: false,
            image: "🏠",
            realEstate: "Propiedades Independientes"
        },
        {
            id: 19,
            title: "Oficina Compartida en Edificio Nuevo",
            price: 650000,
            priceUF: 16,
            comuna: "Providencia",
            address: "Suecia 155",
            bedrooms: 0,
            bathrooms: 2,
            parkings: 0,
            sqMeters: 45,
            type: "Oficina",
            operation: "arriendo",
            isNew: true,
            image: "🏢",
            realEstate: "Inmobiliaria Manquehue"
        },
        {
            id: 20,
            title: "Departamento con Terraza en Las Condes",
            price: 215000000,
            priceUF: 5245,
            comuna: "Las Condes",
            address: "Isidora Goyenechea 3000",
            bedrooms: 3,
            bathrooms: 2,
            parkings: 2,
            sqMeters: 105,
            type: "Departamento",
            operation: "venta",
            isNew: true,
            image: "🏢",
            realEstate: "Inmobiliaria Aconcagua"
        },
        {
            id: 21,
            title: "Casa Colonial Restaurada en Barrio Brasil",
            price: 195000000,
            priceUF: 4760,
            comuna: "Santiago",
            address: "Huérfanos 2800",
            bedrooms: 3,
            bathrooms: 2,
            parkings: 0,
            sqMeters: 160,
            type: "Casa",
            operation: "venta",
            isNew: false,
            image: "🏠",
            realEstate: "Inmobiliaria del Sur"
        },
        {
            id: 22,
            title: "Bodega Logística con Oficinas",
            price: 280000000,
            priceUF: 6830,
            comuna: "Quilicura",
            address: "Ruta 5 Norte Km 22",
            bedrooms: 0,
            bathrooms: 3,
            parkings: 8,
            sqMeters: 650,
            type: "Bodega",
            operation: "venta",
            isNew: true,
            image: "🏭",
            realEstate: "Inmobiliaria del Sur"
        },
        {
            id: 23,
            title: "Studio Amoblado en Ñuñoa",
            price: 380000,
            priceUF: 9,
            comuna: "Ñuñoa",
            address: "Plaza Egaña 1200",
            bedrooms: 1,
            bathrooms: 1,
            parkings: 0,
            sqMeters: 28,
            type: "Departamento",
            operation: "arriendo",
            isNew: false,
            image: "🏢",
            realEstate: "Propiedades Independientes"
        },
        {
            id: 24,
            title: "Departamento Premium en Edificio Inteligente",
            price: 295000000,
            priceUF: 7200,
            comuna: "Vitacura",
            address: "Av. Bicentenario 3800",
            bedrooms: 3,
            bathrooms: 3,
            parkings: 2,
            sqMeters: 135,
            type: "Departamento",
            operation: "venta",
            isNew: true,
            image: "🏢",
            realEstate: "Inmobiliaria Manquehue"
        }
    ]

    const filteredProperties = properties.filter(prop => {
        if (filters.operation !== 'all' && prop.operation !== filters.operation) return false
        if (filters.propertyType !== 'all' && prop.type !== filters.propertyType) return false
        if (prop.priceUF < filters.priceMin || prop.priceUF > filters.priceMax) return false
        if (filters.comuna !== 'all' && prop.comuna !== filters.comuna) return false
        return true
    })

    const stats = {
        totalProperties: filteredProperties.length,
        averagePrice: filteredProperties.length > 0
            ? Math.round(filteredProperties.reduce((acc, p) => acc + p.price, 0) / filteredProperties.length)
            : 0,
        averagePriceUF: filteredProperties.length > 0
            ? Math.round(filteredProperties.reduce((acc, p) => acc + p.priceUF, 0) / filteredProperties.length)
            : 0,
        newProperties: filteredProperties.filter(p => p.isNew).length,
        trend: "+5.2%"
    }

    // Calcular insights avanzados
    const propertiesWithBathrooms = filteredProperties.filter(p => p.bathrooms > 0)
    const avgPricePerBathroom = propertiesWithBathrooms.length > 0
        ? Math.round(propertiesWithBathrooms.reduce((acc, p) => acc + (p.price / p.bathrooms), 0) / propertiesWithBathrooms.length)
        : 0

    const propertiesWithSqMeters = filteredProperties.filter(p => p.sqMeters > 0)
    const avgPricePerSqMeter = propertiesWithSqMeters.length > 0
        ? Math.round(propertiesWithSqMeters.reduce((acc, p) => acc + (p.price / p.sqMeters), 0) / propertiesWithSqMeters.length)
        : 0

    // Contar propiedades por inmobiliaria
    const realEstateCount = {}
    filteredProperties.forEach(p => {
        if (p.realEstate) {
            realEstateCount[p.realEstate] = (realEstateCount[p.realEstate] || 0) + 1
        }
    })
    const topRealEstates = Object.entries(realEstateCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

    // Contar propiedades por comuna
    const comunaCount = {}
    filteredProperties.forEach(p => {
        comunaCount[p.comuna] = (comunaCount[p.comuna] || 0) + 1
    })
    const topComunas = Object.entries(comunaCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)

    // Análisis de dormitorios
    const propertiesWithBedrooms = filteredProperties.filter(p => p.bedrooms > 0)
    const avgBedrooms = propertiesWithBedrooms.length > 0
        ? (propertiesWithBedrooms.reduce((acc, p) => acc + p.bedrooms, 0) / propertiesWithBedrooms.length).toFixed(1)
        : 0

    const formatPrice = (price) => {
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`
        }
        return `$${price.toLocaleString('es-CL')}`
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Análisis de Propiedades</h1>
                <p>Datos extraídos de Portal Inmobiliario en tiempo real</p>
            </div>

            <div className="dashboard-content">
                {/* Web Scraper Section */}
                <div className="scraper-section">
                    <div className="scraper-header">
                        <h2>🕷️ Web Scraper</h2>
                        <span className="scraper-status">
                            {scraping ? '⏳ Ejecutando...' : '✅ Listo'}
                        </span>
                    </div>

                    <div className="scraper-controls">
                        <div>
                            <select
                                value={scraperConfig.operation}
                                onChange={(e) => setScraperConfig({ ...scraperConfig, operation: e.target.value })}
                                disabled={scraping}
                            >
                                <option value="venta">Venta</option>
                                <option value="arriendo">Arriendo</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={scraperConfig.propertyType}
                                onChange={(e) => setScraperConfig({ ...scraperConfig, propertyType: e.target.value })}
                                disabled={scraping}
                            >
                                <option value="departamento">Departamento</option>
                                <option value="casa">Casa</option>
                                <option value="oficina">Oficina</option>
                                <option value="bodega">Bodega</option>
                                <option value="estacionamiento">Estacionamiento</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={scraperConfig.comuna}
                                onChange={(e) => setScraperConfig({ ...scraperConfig, comuna: e.target.value })}
                                disabled={scraping}
                            >
                                <option value="las-condes">Las Condes</option>
                                <option value="providencia">Providencia</option>
                                <option value="vitacura">Vitacura</option>
                                <option value="santiago">Santiago</option>
                                <option value="nunoa">Ñuñoa</option>
                                <option value="la-reina">La Reina</option>
                                <option value="quilicura">Quilicura</option>
                            </select>
                        </div>
                        <div>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={scraperConfig.pages}
                                onChange={(e) => setScraperConfig({ ...scraperConfig, pages: Number(e.target.value) })}
                                placeholder="Páginas"
                                disabled={scraping}
                            />
                        </div>
                    </div>

                    <div className="scraper-actions">
                        <button 
                            className="scraper-button primary" 
                            onClick={handleScrape}
                            disabled={scraping}
                        >
                            <span>🚀</span> Ejecutar Scraping Real
                        </button>
                        <button 
                            className="scraper-button secondary" 
                            onClick={handleUseMockData}
                            disabled={scraping}
                        >
                            <span>🎲</span> Usar Datos de Prueba
                        </button>
                    </div>

                    {scrapeMessage && (
                        <div className="scraper-info">
                            <p>{scrapeMessage}</p>
                        </div>
                    )}

                    <div className="scraper-info">
                        <p>
                            <strong>📌 Cómo usar:</strong>
                        </p>
                        <p>
                            1️⃣ Configura los parámetros de búsqueda arriba<br />
                            2️⃣ Haz clic en "Ejecutar Scraping Real" para extraer datos reales de Portal Inmobiliario<br />
                            3️⃣ O usa "Datos de Prueba" para generar datos simulados (más rápido)<br />
                            4️⃣ Ve a "Raw Data" para ver los datos sin procesar<br />
                            5️⃣ Ve a "Análisis IA" para ver análisis avanzados y oportunidades
                        </p>
                        <p>
                            <strong>⚠️ Nota:</strong> Para que funcione el scraping real, debes tener el servidor backend corriendo: <code>yarn server</code>
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-box">
                        <div className="stat-icon">🏘️</div>
                        <div className="stat-info">
                            <div className="stat-value">{stats.totalProperties}</div>
                            <div className="stat-label">Propiedades Encontradas</div>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <div className="stat-value">{stats.averagePriceUF} UF</div>
                            <div className="stat-label">Precio Promedio</div>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-icon">📈</div>
                        <div className="stat-info">
                            <div className="stat-value">{stats.trend}</div>
                            <div className="stat-label">Tendencia de Precios</div>
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-icon">✨</div>
                        <div className="stat-info">
                            <div className="stat-value">{stats.newProperties}</div>
                            <div className="stat-label">Nuevas esta Semana</div>
                        </div>
                    </div>
                </div>

                {/* Advanced Insights */}
                <div className="insights-section">
                    <h2>📊 Insights del Mercado</h2>
                    <div className="insights-grid">
                        <div className="insight-card">
                            <div className="insight-header">
                                <span className="insight-icon">🚿</span>
                                <h3>Precio por Baño</h3>
                            </div>
                            <div className="insight-value">{formatPrice(avgPricePerBathroom)}</div>
                            <p className="insight-description">Promedio de precio por cada baño en las propiedades seleccionadas</p>
                        </div>

                        <div className="insight-card">
                            <div className="insight-header">
                                <span className="insight-icon">📐</span>
                                <h3>Precio por m²</h3>
                            </div>
                            <div className="insight-value">{formatPrice(avgPricePerSqMeter)}/m²</div>
                            <p className="insight-description">Valor promedio del metro cuadrado en el mercado actual</p>
                        </div>

                        <div className="insight-card">
                            <div className="insight-header">
                                <span className="insight-icon">🛏️</span>
                                <h3>Dormitorios Promedio</h3>
                            </div>
                            <div className="insight-value">{avgBedrooms}</div>
                            <p className="insight-description">Cantidad promedio de dormitorios en las propiedades analizadas</p>
                        </div>

                        <div className="insight-card">
                            <div className="insight-header">
                                <span className="insight-icon">🏢</span>
                                <h3>Principales Inmobiliarias</h3>
                            </div>
                            <div className="insight-list">
                                {topRealEstates.map(([name, count], index) => (
                                    <div key={index} className="insight-item">
                                        <span className="insight-rank">#{index + 1}</span>
                                        <span className="insight-name">{name}</span>
                                        <span className="insight-count">{count} prop.</span>
                                    </div>
                                ))}
                            </div>
                            <p className="insight-description">Inmobiliarias con mayor presencia en el mercado</p>
                        </div>

                        <div className="insight-card">
                            <div className="insight-header">
                                <span className="insight-icon">📍</span>
                                <h3>Comunas con Mayor Oferta</h3>
                            </div>
                            <div className="insight-list">
                                {topComunas.map(([name, count], index) => (
                                    <div key={index} className="insight-item">
                                        <span className="insight-rank">#{index + 1}</span>
                                        <span className="insight-name">{name}</span>
                                        <span className="insight-count">{count} prop.</span>
                                    </div>
                                ))}
                            </div>
                            <p className="insight-description">Zonas con mayor disponibilidad de propiedades</p>
                        </div>

                        <div className="insight-card highlight">
                            <div className="insight-header">
                                <span className="insight-icon">🎯</span>
                                <h3>Mejor Relación Precio/m²</h3>
                            </div>
                            {propertiesWithSqMeters.length > 0 && (() => {
                                const bestValue = propertiesWithSqMeters.reduce((best, p) => {
                                    const pricePerSqMeter = p.price / p.sqMeters
                                    return !best || pricePerSqMeter < (best.price / best.sqMeters) ? p : best
                                }, null)
                                return (
                                    <>
                                        <div className="insight-value">{bestValue.comuna}</div>
                                        <p className="insight-description">{bestValue.title}</p>
                                        <div className="insight-detail">
                                            {formatPrice(Math.round(bestValue.price / bestValue.sqMeters))}/m² • {bestValue.sqMeters}m²
                                        </div>
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <h2>Filtros de Búsqueda</h2>
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>Tipo de Operación</label>
                            <select
                                value={filters.operation}
                                onChange={(e) => setFilters({ ...filters, operation: e.target.value })}
                            >
                                <option value="all">Todos</option>
                                <option value="venta">Venta</option>
                                <option value="arriendo">Arriendo</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Tipo de Propiedad</label>
                            <select
                                value={filters.propertyType}
                                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                            >
                                <option value="all">Todas</option>
                                <option value="Departamento">Departamento</option>
                                <option value="Casa">Casa</option>
                                <option value="Estacionamiento">Estacionamiento</option>
                                <option value="Bodega">Bodega</option>
                                <option value="Oficina">Oficina</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Comuna</label>
                            <select
                                value={filters.comuna}
                                onChange={(e) => setFilters({ ...filters, comuna: e.target.value })}
                            >
                                <option value="all">Todas</option>
                                <option value="Las Condes">Las Condes</option>
                                <option value="Providencia">Providencia</option>
                                <option value="Vitacura">Vitacura</option>
                                <option value="Santiago">Santiago</option>
                                <option value="Ñuñoa">Ñuñoa</option>
                                <option value="La Reina">La Reina</option>
                                <option value="Quilicura">Quilicura</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Rango de Precio (UF)</label>
                            <div className="price-range">
                                <input
                                    type="number"
                                    placeholder="Min UF"
                                    value={filters.priceMin}
                                    onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) })}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max UF"
                                    value={filters.priceMax}
                                    onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Properties Grid */}
                <div className="properties-section">
                    <h2>Propiedades Disponibles</h2>
                    <div className="properties-grid">
                        {filteredProperties.map(property => (
                            <div key={property.id} className="property-card">
                                {property.isNew && <div className="new-badge">Nueva</div>}
                                <div className="property-image">{property.image}</div>
                                <div className="property-info">
                                    <h3>{property.title}</h3>
                                    <div className="property-price">
                                        {formatPrice(property.price)}
                                        {property.priceUF > 0 && (
                                            <span className="price-uf"> ({property.priceUF} UF)</span>
                                        )}
                                    </div>
                                    <div className="property-location">
                                        📍 {property.comuna} - {property.address}
                                    </div>
                                    <div className="property-features">
                                        {property.bedrooms > 0 && <span>🛏️ {property.bedrooms} dorm</span>}
                                        {property.bathrooms > 0 && <span>🚿 {property.bathrooms} baños</span>}
                                        {property.parkings > 0 && <span>🅿️ {property.parkings} est</span>}
                                        <span>📐 {property.sqMeters}m²</span>
                                    </div>
                                    <div className="property-type-badge">{property.type}</div>
                                    {property.sqMeters > 0 && (
                                        <div className="property-price-per-meter">
                                            {formatPrice(Math.round(property.price / property.sqMeters))}/m²
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard

