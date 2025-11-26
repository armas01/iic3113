import { useState, useEffect } from 'react'
import './Dashboard.css'

function Dashboard() {
    const [scraperConfig, setScraperConfig] = useState({
        operation: 'venta',
        propertyType: 'departamento',
        comuna: 'las-condes-metropolitana',
        pages: 5 // Limited to 5 pages max
    })

    const [scraping, setScraping] = useState(false)
    const [scrapeMessage, setScrapeMessage] = useState('')
    const [scrapeProgress, setScrapeProgress] = useState(0)
    const [analysis, setAnalysis] = useState(null)
    const [loading, setLoading] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(null)
    const [clearDataOnScrape, setClearDataOnScrape] = useState(false)

    useEffect(() => {
        fetchAnalysis()
        // Check if there's an ongoing scraping process when component mounts
        checkScrapingStatus()
    }, [])

    const checkScrapingStatus = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/scrape-progress')
            const data = await response.json()
            
            if (data.success && data.inProgress) {
                // Resume scraping state
                setScraping(true)
                setScrapeProgress(data.progress || 0)
                if (data.currentPage && data.totalPages) {
                    const propertiesText = data.propertiesFound ? ` - ${data.propertiesFound} propiedades` : ''
                    setScrapeMessage(`⏳ Página ${data.currentPage}/${data.totalPages}${propertiesText}`)
                }
                
                // Start polling since scraping is in progress
                startPolling()
            }
        } catch (error) {
            console.error('error checking scraping status:', error)
        }
    }

    const startPolling = () => {
        const pollInterval = setInterval(async () => {
            try {
                const progressResponse = await fetch('http://localhost:3001/api/scrape-progress')
                const progressData = await progressResponse.json()
                
                if (progressData.progress !== undefined) {
                    setScrapeProgress(progressData.progress)
                    
                    if (progressData.currentPage && progressData.totalPages) {
                        const propertiesText = progressData.propertiesFound ? ` - ${progressData.propertiesFound} propiedades` : ''
                        setScrapeMessage(`⏳ Página ${progressData.currentPage}/${progressData.totalPages}${propertiesText}`)
                    }
                }
                
                if (progressData.completed) {
                    clearInterval(pollInterval)
                    setScrapeProgress(100)
                    setScrapeMessage('✓ Completado, actualizando análisis...')
                    await fetchAnalysis()
                    setScrapeMessage('✓ Datos actualizados correctamente')
                    setScraping(false)
                    setScrapeProgress(0) // Reset progress after completion
                }
            } catch (error) {
                console.error('error polling progress:', error)
            }
        }, 1000)
        
        return pollInterval
    }

    const fetchAnalysis = async () => {
        setLoading(true)
        try {
            const response = await fetch('http://localhost:3001/api/analysis')
            const data = await response.json()
            
            if (data.success) {
                setAnalysis(data.analysis)
                setLastUpdate(data.timestamp)
            } else {
                setAnalysis(null)
                setLastUpdate(null)
            }
        } catch (error) {
            console.error('error fetching analysis:', error)
            setScrapeMessage('⚠️ No se puede conectar con el servidor. Verifique que el servicio backend esté activo.')
        } finally {
            setLoading(false)
        }
    }

    const handleScrape = async () => {
        // Limpiar datos si está activado el toggle
        if (clearDataOnScrape && analysis) {
            try {
                await fetch('http://localhost:3001/api/properties', {
                    method: 'DELETE'
                })
                setAnalysis(null)
                setLastUpdate(null)
            } catch (error) {
                console.error('error clearing data:', error)
            }
        }

        setScraping(true)
        setScrapeProgress(0)
        setScrapeMessage('⏳ Extrayendo datos del mercado...')
        
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
                setScrapeMessage('✓ Proceso iniciado')
                setScraping(true)
                setScrapeProgress(0)
                
                // Start polling for updates
                startPolling()
            } else {
                setScrapeMessage(`✗ Error: ${data.error}`)
                setScraping(false)
                setScrapeProgress(0)
            }
        } catch (error) {
            setScrapeMessage('✗ Error de conexión con el servidor')
            console.error('scrape error:', error)
            setScraping(false)
            setScrapeProgress(0)
        }
    }

    const handleClearData = async () => {
        if (!window.confirm('¿Está seguro de que desea eliminar todas las propiedades analizadas? Esta acción no se puede deshacer.')) {
            return
        }
        
        setLoading(true)
        try {
            const response = await fetch('http://localhost:3001/api/properties', {
                method: 'DELETE'
            })
            
            const data = await response.json()
            
            if (data.success) {
                setAnalysis(null)
                setLastUpdate(null)
                setScrapeMessage('✓ Datos eliminados correctamente')
            } else {
                setScrapeMessage('✗ Error al eliminar datos')
            }
        } catch (error) {
            setScrapeMessage('✗ Error de conexión')
            console.error('clear error:', error)
        } finally {
            setLoading(false)
        }
    }

    const addToFavorites = (property) => {
        const favorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]')
        
        const exists = favorites.find(fav => fav.id === property.id)
        if (!exists) {
            // Track this as a recommendation
            trackPropertyInteraction(property.id, 'recommendation')
            
            favorites.push(property)
            localStorage.setItem('favoriteProperties', JSON.stringify(favorites))
            setScrapeMessage('✅ Propiedad agregada a favoritos')
            setTimeout(() => setScrapeMessage(''), 3000)
        } else {
            setScrapeMessage('⚠️ Esta propiedad ya está en favoritos')
            setTimeout(() => setScrapeMessage(''), 3000)
        }
    }

    const trackPropertyInteraction = async (propertyId, action) => {
        try {
            await fetch('http://localhost:3001/api/track-interaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ propertyId, action })
            })
        } catch (error) {
            console.error('Error tracking interaction:', error)
        }
    }

    const formatUF = (uf) => {
        if (!uf || isNaN(uf)) return 'N/A'
        return `${Math.round(uf).toLocaleString('es-CL')} UF`
    }

    const formatComunaName = (comunaSlug) => {
        if (!comunaSlug) return ''
        // convert "las-condes-metropolitana" to "Las Condes"
        const name = comunaSlug.replace('-metropolitana', '').split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
        return name
    }

    const buildPortalInmobiliarioUrl = () => {
        return `https://www.portalinmobiliario.com/${scraperConfig.operation}/${scraperConfig.propertyType}/${scraperConfig.comuna}`
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Panel de Análisis de Mercado</h1>
                <p>Inteligencia de datos inmobiliarios en tiempo real</p>
            </div>

            <div className="dashboard-content">
                {/* disclaimer */}
                <div className="disclaimer-box">
                    <div className="disclaimer-content">
                        <strong>Requisitos:</strong> macOS • Cuenta en Portal Inmobiliario • Primera vez: login manual (60s)
                    </div>
                </div>

                {/* scraper section */}
                <div className="scraper-section">
                    <div className="scraper-header">
                        <div>
                            <h2>Configuración de Extracción</h2>
                            <p className="scraper-subtitle">Seleccione los parámetros para extraer datos del mercado</p>
                        </div>
                        <span className="scraper-status">
                            {scraping ? '⏳ Procesando...' : lastUpdate ? `✓ Última actualización: ${new Date(lastUpdate).toLocaleString('es-CL')}` : '○ Sin datos'}
                        </span>
                    </div>

                    <div className="scraper-controls">
                        <div className="control-group">
                            <label>Tipo de Operación</label>
                            <select
                                value={scraperConfig.operation}
                                onChange={(e) => setScraperConfig({ ...scraperConfig, operation: e.target.value })}
                                disabled={scraping}
                            >
                                <option value="venta">Venta</option>
                                <option value="arriendo">Arriendo</option>
                                <option value="arriendo-temporal">Arriendo Temporal (en desarrollo)</option>
                            </select>
                        </div>
                        <div className="control-group">
                            <label>Tipo de Propiedad</label>
                            <select
                                value={scraperConfig.propertyType}
                                onChange={(e) => setScraperConfig({ ...scraperConfig, propertyType: e.target.value })}
                                disabled={scraping}
                            >
                                <option value="departamento">Departamento</option>
                                <option value="casa">Casa (en desarrollo)</option>
                                <option value="oficina">Oficina (en desarrollo)</option>
                                <option value="bodega">Bodega (en desarrollo)</option>
                                <option value="estacionamiento">Estacionamiento (en desarrollo)</option>
                                <option value="local-comercial">Local Comercial (en desarrollo)</option>
                                <option value="terreno">Terreno (en desarrollo)</option>
                                <option value="sitio">Sitio (en desarrollo)</option>
                                <option value="parcela">Parcela (en desarrollo)</option>
                            </select>
                        </div>
                        <div className="control-group">
                            <label>Comuna / Sector</label>
                            <select
                                value={scraperConfig.comuna}
                                onChange={(e) => setScraperConfig({ ...scraperConfig, comuna: e.target.value })}
                                disabled={scraping}
                            >
                                <option value="las-condes-metropolitana">Las Condes</option>
                                <option value="vitacura-metropolitana">Vitacura</option>
                                <option value="providencia-metropolitana">Providencia (en desarrollo)</option>
                                <option value="santiago-metropolitana">Santiago Centro (en desarrollo)</option>
                                <option value="nunoa-metropolitana">Ñuñoa (en desarrollo)</option>
                                <option value="la-reina-metropolitana">La Reina (en desarrollo)</option>
                                <option value="quilicura-metropolitana">Quilicura (en desarrollo)</option>
                                <option value="lo-barnechea-metropolitana">Lo Barnechea (en desarrollo)</option>
                                <option value="maipu-metropolitana">Maipú (en desarrollo)</option>
                                <option value="la-florida-metropolitana">La Florida (en desarrollo)</option>
                                <option value="penalolen-metropolitana">Peñalolén (en desarrollo)</option>
                                <option value="macul-metropolitana">Macul (en desarrollo)</option>
                                <option value="huechuraba-metropolitana">Huechuraba (en desarrollo)</option>
                                <option value="pudahuel-metropolitana">Pudahuel (en desarrollo)</option>
                                <option value="estacion-central-metropolitana">Estación Central (en desarrollo)</option>
                            </select>
                        </div>
                        <div className="control-group">
                            <label>Páginas a Procesar</label>
                            <select
                                value={scraperConfig.pages}
                                onChange={(e) => setScraperConfig({ ...scraperConfig, pages: Number(e.target.value) })}
                                disabled={scraping}
                            >
                                <option value="1">1 página (~48 propiedades)</option>
                                <option value="2">2 páginas (~96 propiedades)</option>
                                <option value="3">3 páginas (~144 propiedades)</option>
                                <option value="4">4 páginas (~192 propiedades)</option>
                                <option value="5">5 páginas (~240 propiedades)</option>
                            </select>
                        </div>
                    </div>

                    <div className="scraper-actions">
                        <button
                            className="scraper-button primary"
                            onClick={handleScrape}
                            disabled={scraping}
                        >
                            <span>▶</span> Iniciar Extracción
                        </button>
                        <button
                            className="scraper-button secondary"
                            onClick={() => window.location.reload()}
                            disabled={scraping}
                        >
                            <span>⟳</span> Recargar Página
                        </button>
                        <a
                            href={buildPortalInmobiliarioUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="scraper-button link"
                        >
                            <span>🔗</span> Ver en Portal Inmobiliario
                        </a>
                        <label className="toggle-option-inline">
                            <input
                                type="checkbox"
                                checked={clearDataOnScrape}
                                onChange={(e) => setClearDataOnScrape(e.target.checked)}
                                disabled={scraping}
                            />
                            <span>Limpiar datos existentes</span>
                        </label>
                    </div>

                    {scrapeMessage && (
                        <div className={`scraper-message ${scrapeMessage.includes('✗') ? 'error' : 'success'}`}>
                            <p>{scrapeMessage}</p>
                        </div>
                    )}

                    <div className="scraper-info-professional">
                        <div className="info-row">
                            <strong>Fuente:</strong>
                            <span>Portal Inmobiliario Chile</span>
                        </div>
                        <div className="info-row">
                            <strong>Método:</strong>
                            <span>Navegación headless con Puppeteer-core</span>
                        </div>
                        <div className="info-row">
                            <strong>Procesamiento:</strong>
                            <span>~48 propiedades por página (7s por propiedad = ~336s/página = 5.6min/página)</span>
                        </div>
                    </div>

                    {/* Progress info - direct to terminal */}
                    {scraping && (
                        <div className="progress-section terminal-message">
                            <div className="terminal-icon">⚠️</div>
                            <div className="terminal-content">
                                <h3>Extracción en Proceso</h3>
                                <p>La sincronización de progreso en tiempo real aún no está lista.</p>
                                <p><strong>Por favor, revise la terminal del servidor para ver el progreso detallado.</strong></p>
                                <div className="terminal-tips">
                                    <div>📊 Verá mensajes como: <code>[scraper] progress: 50% (5/10 pages)</code></div>
                                    <div>✓ El proceso continúa en segundo plano</div>
                                    <div>⏱️ Tiempo estimado: ~5-6 minutos por página</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* analysis display */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Cargando análisis...</p>
                    </div>
                ) : !analysis || analysis.summary.totalProperties === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <h3>No hay datos para analizar</h3>
                        <p>Ejecute el scraper para generar análisis del mercado</p>
                    </div>
                ) : (
                    <>
                        {/* Filter info banner */}
                        {analysis.filterInfo && analysis.filterInfo.excluded > 0 && (
                            <div className="filter-info-banner">
                                <div className="filter-icon">🔍</div>
                                <div className="filter-content">
                                    <strong>Filtro Aplicado:</strong> Se excluyeron {analysis.filterInfo.excluded} propiedades con precio superior a {analysis.filterInfo.maxPriceUF.toLocaleString('es-CL')} UF para un análisis más representativo del mercado.
                                    <span className="filter-details">({analysis.filterInfo.totalScraped} scrapeadas → {analysis.filterInfo.totalAnalyzed} analizadas)</span>
                                </div>
                            </div>
                        )}

                        {/* summary stats */}
                        <div className="stats-grid">
                            <div className="stat-box">
                                <div className="stat-icon">🏘️</div>
                                <div className="stat-info">
                                    <div className="stat-value">{analysis.summary.totalProperties}</div>
                                    <div className="stat-label">Propiedades Analizadas</div>
                                </div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-icon">💰</div>
                                <div className="stat-info">
                                    <div className="stat-value">{formatUF(analysis.summary.averagePrice)}</div>
                                    <div className="stat-label">Precio Promedio</div>
                                </div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-icon">📐</div>
                                <div className="stat-info">
                                    <div className="stat-value">{Math.round(analysis.summary.averageArea)}m²</div>
                                    <div className="stat-label">Superficie Promedio</div>
                                </div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-icon">📍</div>
                                <div className="stat-info">
                                    <div className="stat-value">{formatComunaName(scraperConfig.comuna)}</div>
                                    <div className="stat-label">Comuna Analizada</div>
                                </div>
                            </div>
                        </div>

                        {/* price analysis */}
                        {analysis.priceAnalysis && analysis.priceAnalysis.ufStats && (
                                <div className="analysis-section">
                                    <h2>Análisis de Precios</h2>
                                    <div className="analysis-grid">
                                        <div className="analysis-card wide">
                                            <h3>Distribución por Rangos de Precio</h3>
                                            <div className="distribution-chart">
                                            {Object.entries(analysis.priceAnalysis.distribution).map(([range, count]) => {
                                                const maxCount = Math.max(...Object.values(analysis.priceAnalysis.distribution))
                                                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0
                                                
                                                return (
                                                    <div key={range} className="distribution-bar">
                                                        <div className="bar-label">{range} UF</div>
                                                        <div className="bar-container">
                                                            <div 
                                                                className="bar-fill" 
                                                                style={{ width: `${percentage}%` }}
                                                            >
                                                            <span className="bar-value">{count}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div className="analysis-card">
                                        <h3>Estadísticas Generales</h3>
                                        <div className="metric-list">
                                            <div className="metric-item">
                                                <span>Promedio:</span>
                                                <strong>{formatUF(analysis.priceAnalysis.ufStats.average)}</strong>
                                            </div>
                                            <div className="metric-item">
                                                <span>Mediana:</span>
                                                <strong>{formatUF(analysis.priceAnalysis.ufStats.median)}</strong>
                                            </div>
                                            <div className="metric-item">
                                                <span>Mínimo:</span>
                                                <strong>{formatUF(analysis.priceAnalysis.ufStats.min)}</strong>
                                            </div>
                                            <div className="metric-item">
                                                <span>Máximo:</span>
                                                <strong>{formatUF(analysis.priceAnalysis.ufStats.max)}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    {analysis.priceAnalysis.pricePerSqMeterUF && (
                                        <div className="analysis-card">
                                            <h3>Precio por m²</h3>
                                            <div className="metric-list">
                                                <div className="metric-item">
                                                    <span>Promedio:</span>
                                                    <strong>{analysis.priceAnalysis.pricePerSqMeterUF.average.toFixed(1)} UF/m²</strong>
                                                </div>
                                                <div className="metric-item">
                                                    <span>Mediana:</span>
                                                    <strong>{analysis.priceAnalysis.pricePerSqMeterUF.median.toFixed(1)} UF/m²</strong>
                                                </div>
                                                <div className="metric-item">
                                                    <span>Mínimo:</span>
                                                    <strong>{analysis.priceAnalysis.pricePerSqMeterUF.min.toFixed(1)} UF/m²</strong>
                                                </div>
                                                <div className="metric-item">
                                                    <span>Máximo:</span>
                                                    <strong>{analysis.priceAnalysis.pricePerSqMeterUF.max.toFixed(1)} UF/m²</strong>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* neighborhoods analysis */}
                        {analysis.locationAnalysis && analysis.locationAnalysis.topNeighborhoods && analysis.locationAnalysis.topNeighborhoods.length > 0 && (
                            <div className="analysis-section">
                                <h2>Análisis por Sectores</h2>
                                <p className="section-description">
                                    {analysis.locationAnalysis.totalNeighborhoods} sectores identificados en {formatComunaName(scraperConfig.comuna)}
                                </p>
                                <div className="neighborhoods-grid">
                                    {analysis.locationAnalysis.topNeighborhoods.slice(0, 6).map((n, index) => (
                                        <div key={index} className="neighborhood-card">
                                            <div className="neighborhood-rank">#{index + 1}</div>
                                            <h4>{n.neighborhood}</h4>
                                            <div className="neighborhood-stats">
                                                <div className="stat-row">
                                                    <span>Propiedades:</span>
                                                    <strong>{n.count}</strong>
                                                </div>
                                                {n.avgPriceUF > 0 && (
                                                    <div className="stat-row">
                                                        <span>Precio Promedio:</span>
                                                        <strong>{formatUF(n.avgPriceUF)}</strong>
                                                    </div>
                                                )}
                                                {n.avgArea > 0 && (
                                                    <div className="stat-row">
                                                        <span>Superficie Promedio:</span>
                                                        <strong>{Math.round(n.avgArea)}m²</strong>
                                                    </div>
                                                )}
                                                {n.avgPricePerSqMeterUF && (
                                                    <div className="stat-row highlight">
                                                        <span>Precio/m²:</span>
                                                        <strong>{n.avgPricePerSqMeterUF.toFixed(1)} UF/m²</strong>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* amenities analysis */}
                        {analysis.amenitiesAnalysis && (analysis.amenitiesAnalysis.parkingImpact || analysis.amenitiesAnalysis.bodegasImpact || (analysis.amenitiesAnalysis.features && Object.keys(analysis.amenitiesAnalysis.features).length > 0) || (analysis.amenitiesAnalysis.valuableCombinations && analysis.amenitiesAnalysis.valuableCombinations.length > 0)) && (
                            <div className="analysis-section">
                                <h2>Análisis de Características</h2>
                                
                                <div className="amenities-grid">
                                    {analysis.amenitiesAnalysis.parkingImpact && (
                                        <div className="amenity-impact-card">
                                            <h3>Impacto de Estacionamientos</h3>
                                            <div className="impact-comparison">
                                                <div className="impact-side">
                                                    <div className="impact-label">con estacionamiento</div>
                                                    <div className="impact-count">{analysis.amenitiesAnalysis.parkingImpact.withParking.count} prop.</div>
                                                    <div className="impact-price">
                                                        {formatUF(analysis.amenitiesAnalysis.parkingImpact.withParking.avgPriceUF)}
                                                    </div>
                                                    <div className="impact-detail">
                                                        Promedio: {analysis.amenitiesAnalysis.parkingImpact.withParking.avgParkingSpaces.toFixed(1)} espacios
                                                    </div>
                                                </div>
                                                <div className="impact-divider">vs</div>
                                                <div className="impact-side">
                                                    <div className="impact-label">sin estacionamiento</div>
                                                    <div className="impact-count">{analysis.amenitiesAnalysis.parkingImpact.withoutParking.count} prop.</div>
                                                    <div className="impact-price">
                                                        {formatUF(analysis.amenitiesAnalysis.parkingImpact.withoutParking.avgPriceUF)}
                                                    </div>
                                                    <div className="impact-detail">
                                                        Diferencia: {formatUF(
                                                            analysis.amenitiesAnalysis.parkingImpact.withParking.avgPriceUF - 
                                                            analysis.amenitiesAnalysis.parkingImpact.withoutParking.avgPriceUF
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {analysis.amenitiesAnalysis.bodegasImpact && (
                                        <div className="amenity-impact-card">
                                            <h3>Impacto de Bodegas</h3>
                                            <div className="impact-comparison">
                                                <div className="impact-side">
                                                    <div className="impact-label">con bodega</div>
                                                    <div className="impact-count">{analysis.amenitiesAnalysis.bodegasImpact.withBodegas.count} prop.</div>
                                                    <div className="impact-price">
                                                        {formatUF(analysis.amenitiesAnalysis.bodegasImpact.withBodegas.avgPriceUF)}
                                                    </div>
                                                    <div className="impact-detail">
                                                        Promedio: {analysis.amenitiesAnalysis.bodegasImpact.withBodegas.avgBodegas.toFixed(1)} bodegas
                                                    </div>
                                                </div>
                                                <div className="impact-divider">vs</div>
                                                <div className="impact-side">
                                                    <div className="impact-label">sin bodega</div>
                                                    <div className="impact-count">{analysis.amenitiesAnalysis.bodegasImpact.withoutBodegas.count} prop.</div>
                                                    <div className="impact-price">
                                                        {formatUF(analysis.amenitiesAnalysis.bodegasImpact.withoutBodegas.avgPriceUF)}
                                                    </div>
                                                    <div className="impact-detail">
                                                        Diferencia: {formatUF(
                                                            analysis.amenitiesAnalysis.bodegasImpact.withBodegas.avgPriceUF - 
                                                            analysis.amenitiesAnalysis.bodegasImpact.withoutBodegas.avgPriceUF
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {analysis.amenitiesAnalysis.features && Object.keys(analysis.amenitiesAnalysis.features).length > 0 && (
                                    <div className="features-analysis">
                                        <h3>Comodidades Detectadas</h3>
                                        <div className="features-grid">
                                            {Object.entries(analysis.amenitiesAnalysis.features).map(([feature, data]) => (
                                                <div key={feature} className="feature-card">
                                                    <div className="feature-icon">
                                                        {feature === 'gimnasio' && '🏋️'}
                                                        {feature === 'piscina' && '🏊'}
                                                        {feature === 'terraza' && '🌇'}
                                                        {feature === 'seguridad' && '🔒'}
                                                        {feature === 'amoblado' && '🛋️'}
                                                        {feature === 'logia' && '🪟'}
                                                        {feature === 'vista' && '🌄'}
                                                        {feature === 'luminoso' && '☀️'}
                                                    </div>
                                                    <div className="feature-name">{feature}</div>
                                                    <div className="feature-stats">
                                                        <div className="feature-count">{data.count} propiedades</div>
                                                        <div className="feature-percentage">{data.percentage}% del total</div>
                                                        {data.avgPriceUF && (
                                                            <div className="feature-price">
                                                                Promedio: {formatUF(data.avgPriceUF)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {analysis.amenitiesAnalysis.valuableCombinations && analysis.amenitiesAnalysis.valuableCombinations.length > 0 && (
                                    <div className="combinations-analysis">
                                        <h3>Configuraciones Más Comunes</h3>
                                        <div className="combinations-grid">
                                            {analysis.amenitiesAnalysis.valuableCombinations.slice(0, 6).map((combo, index) => (
                                                <div key={index} className="combo-card">
                                                    <div className="combo-name">{combo.combo}</div>
                                                    <div className="combo-stats">
                                                        <div className="combo-stat">
                                                            <span>Cantidad:</span>
                                                            <strong>{combo.count} prop.</strong>
                                                        </div>
                                                        <div className="combo-stat">
                                                            <span>Precio Promedio:</span>
                                                            <strong>{formatUF(combo.avgPriceUF)}</strong>
                                                        </div>
                                                        <div className="combo-stat">
                                                            <span>Superficie Promedio:</span>
                                                            <strong>{Math.round(combo.avgArea)}m²</strong>
                                                        </div>
                                                        <div className="combo-stat highlight">
                                                            <span>Precio/m²:</span>
                                                            <strong>{combo.avgPricePerSqMeterUF.toFixed(1)} UF/m²</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* opportunities */}
                        {analysis.opportunities && analysis.opportunities.length > 0 && (
                            <div className="analysis-section">
                                <h2>Oportunidades de Inversión</h2>
                                <p className="section-description">
                                    Propiedades con precios significativamente por debajo del promedio del mercado
                                </p>
                                <div className="opportunities-grid">
                                    {analysis.opportunities.slice(0, 6).map((opp, index) => (
                                        <div key={index} className="opportunity-card">
                                            <button 
                                                className="add-to-favorites-btn"
                                                onClick={() => addToFavorites(opp.property)}
                                                title="Agregar a favoritos"
                                            >
                                                ❤️
                                            </button>
                                            <div className="opportunity-header">
                                                <span className="opportunity-rank">TOP {index + 1}</span>
                                                <span className={`opportunity-badge ${opp.score > 1 ? 'excellent' : 'good'}`}>
                                                    {opp.recommendation}
                                                </span>
                                            </div>
                                            <h4>{opp.property.title}</h4>
                                            
                                            {/* Basic specs grid */}
                                            <div className="opportunity-specs">
                                                <div className="spec-item">
                                                    <span className="spec-icon">🛏️</span>
                                                    <span className="spec-value">{opp.property.bedrooms || 0}</span>
                                                    <span className="spec-label">dorm.</span>
                                                </div>
                                                <div className="spec-item">
                                                    <span className="spec-icon">🚿</span>
                                                    <span className="spec-value">{opp.property.bathrooms || 0}</span>
                                                    <span className="spec-label">baños</span>
                                                </div>
                                                <div className="spec-item">
                                                    <span className="spec-icon">🚗</span>
                                                    <span className="spec-value">{opp.property.parking || opp.property.parkings || 0}</span>
                                                    <span className="spec-label">estac.</span>
                                                </div>
                                                <div className="spec-item">
                                                    <span className="spec-icon">📦</span>
                                                    <span className="spec-value">{opp.property.bodegas || 0}</span>
                                                    <span className="spec-label">bodega{(opp.property.bodegas || 0) !== 1 ? 's' : ''}</span>
                                                </div>
                                            </div>

                                            {/* Amenities */}
                                            {opp.property.amenities && Object.values(opp.property.amenities).some(v => v) && (
                                                <div className="opportunity-amenities">
                                                    <strong>Amenidades:</strong>
                                                    <div className="amenity-tags">
                                                        {opp.property.amenities.gimnasio && <span className="amenity-tag">🏋️ Gimnasio</span>}
                                                        {opp.property.amenities.piscina && <span className="amenity-tag">🏊 Piscina</span>}
                                                        {opp.property.amenities.terraza && <span className="amenity-tag">🌇 Terraza</span>}
                                                        {opp.property.amenities.seguridad && <span className="amenity-tag">🔒 Seguridad</span>}
                                                        {opp.property.amenities.ascensor && <span className="amenity-tag">🛗 Ascensor</span>}
                                                        {opp.property.amenities.amoblado && <span className="amenity-tag">🛋️ Amoblado</span>}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Additional info */}
                                            <div className="opportunity-additional">
                                                {opp.property.yearBuilt && (
                                                    <div className="additional-item">
                                                        <span>🏗️ Año:</span>
                                                        <strong>{opp.property.yearBuilt}</strong>
                                                    </div>
                                                )}
                                                {opp.property.orientation && (
                                                    <div className="additional-item">
                                                        <span>🧭 Orientación:</span>
                                                        <strong>{opp.property.orientation}</strong>
                                                    </div>
                                                )}
                                                {!opp.property.yearBuilt && !opp.property.orientation && (
                                                    <div className="additional-item">
                                                        <span>ℹ️ Info adicional:</span>
                                                        <strong>No disponible</strong>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="opportunity-details">
                                                <div className="detail-row">
                                                    <span>Precio:</span>
                                                    <strong>{formatUF(opp.property.price)}</strong>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Superficie:</span>
                                                    <strong>{opp.property.area}m²</strong>
                                                </div>
                                                <div className="detail-row highlight">
                                                    <span>Precio/m²:</span>
                                                    <strong>{opp.pricePerSqM.toFixed(1)} UF/m²</strong>
                                                </div>
                                                <div className="detail-row">
                                                    <span>Promedio Mercado:</span>
                                                    <strong>{opp.marketAverage.toFixed(1)} UF/m²</strong>
                                                </div>
                                                <div className="detail-row success">
                                                    <span>Ahorro Potencial:</span>
                                                    <strong>{opp.savings.toFixed(1)} UF/m²</strong>
                                                </div>
                                            </div>
                                            
                                            {/* Link to Portal Inmobiliario */}
                                            {opp.property.link && (
                                                <a 
                                                    href={opp.property.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="opportunity-link"
                                                >
                                                    Ver en Portal Inmobiliario →
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Dashboard
