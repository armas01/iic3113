import { useState, useEffect } from 'react'
import './Analysis.css'

function Analysis() {
    const [analysis, setAnalysis] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [selectedInsight, setSelectedInsight] = useState(null)

    useEffect(() => {
        fetchAnalysis()
    }, [])

    const fetchAnalysis = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('http://localhost:3001/api/analysis')
            const data = await response.json()
            
            if (data.success) {
                setAnalysis(data.analysis)
            } else {
                setError('Error al cargar el análisis')
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.')
            console.error('Error fetching analysis:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (price) => {
        if (!price) return 'N/A'
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`
        }
        return `$${price.toLocaleString('es-CL')}`
    }

    if (loading) {
        return (
            <div className="analysis">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Analizando datos...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="analysis">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchAnalysis} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    if (!analysis || analysis.summary.totalProperties === 0) {
        return (
            <div className="analysis">
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>No hay datos para analizar</h3>
                    <p>Ejecuta el scraper primero para generar análisis</p>
                </div>
            </div>
        )
    }

    const { summary, priceAnalysis, locationAnalysis, typeAnalysis, marketInsights, opportunities, aiReadyData } = analysis

    return (
        <div className="analysis">
            <div className="analysis-header">
                <div>
                    <h1>🤖 Análisis Avanzado</h1>
                    <p>Insights del mercado inmobiliario con Machine Learning</p>
                </div>
                <button onClick={fetchAnalysis} className="refresh-button">
                    🔄 Actualizar
                </button>
            </div>

            {/* Summary Stats */}
            <div className="stats-overview">
                <div className="stat-card-large">
                    <div className="stat-icon-large">🏘️</div>
                    <div className="stat-content">
                        <div className="stat-value-large">{summary.totalProperties}</div>
                        <div className="stat-label-large">Propiedades Analizadas</div>
                    </div>
                </div>
                <div className="stat-card-large">
                    <div className="stat-icon-large">💰</div>
                    <div className="stat-content">
                        <div className="stat-value-large">{formatPrice(summary.averagePrice)}</div>
                        <div className="stat-label-large">Precio Promedio</div>
                    </div>
                </div>
                <div className="stat-card-large">
                    <div className="stat-icon-large">📊</div>
                    <div className="stat-content">
                        <div className="stat-value-large">{(summary.dataQuality * 100).toFixed(0)}%</div>
                        <div className="stat-label-large">Calidad de Datos</div>
                    </div>
                </div>
                <div className="stat-card-large ai-ready">
                    <div className="stat-icon-large">🤖</div>
                    <div className="stat-content">
                        <div className="stat-value-large">{aiReadyData.summary.readyForML ? 'Listo' : 'Pendiente'}</div>
                        <div className="stat-label-large">Estado IA</div>
                    </div>
                </div>
            </div>

            {/* Market Insights */}
            {marketInsights && marketInsights.length > 0 && (
                <div className="insights-section">
                    <h2>💡 Insights del Mercado</h2>
                    <div className="insights-grid">
                        {marketInsights.map((insight, index) => (
                            <div 
                                key={index} 
                                className={`insight-card ${insight.type}`}
                                onClick={() => setSelectedInsight(insight)}
                            >
                                <div className="insight-header">
                                    <span className="insight-type">{insight.type}</span>
                                </div>
                                <h3>{insight.title}</h3>
                                <p>{insight.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Price Analysis */}
            {priceAnalysis && (
                <div className="analysis-section">
                    <h2>💵 Análisis de Precios</h2>
                    <div className="analysis-grid">
                        <div className="analysis-card">
                            <h3>Distribución de Precios</h3>
                            <div className="distribution-chart">
                                {Object.entries(priceAnalysis.distribution).map(([range, count]) => (
                                    <div key={range} className="distribution-bar">
                                        <div className="bar-label">{range}</div>
                                        <div className="bar-container">
                                            <div 
                                                className="bar-fill" 
                                                style={{ width: `${(count / summary.totalProperties) * 100}%` }}
                                            >
                                                <span className="bar-value">{count}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="analysis-card">
                            <h3>Precio por m²</h3>
                            <div className="metric-list">
                                <div className="metric-item">
                                    <span>Promedio:</span>
                                    <strong>{formatPrice(priceAnalysis.pricePerSqMeter?.average)}/m²</strong>
                                </div>
                                <div className="metric-item">
                                    <span>Mediana:</span>
                                    <strong>{formatPrice(priceAnalysis.pricePerSqMeter?.median)}/m²</strong>
                                </div>
                                <div className="metric-item">
                                    <span>Mínimo:</span>
                                    <strong>{formatPrice(priceAnalysis.pricePerSqMeter?.min)}/m²</strong>
                                </div>
                                <div className="metric-item">
                                    <span>Máximo:</span>
                                    <strong>{formatPrice(priceAnalysis.pricePerSqMeter?.max)}/m²</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Location Analysis */}
            {locationAnalysis && locationAnalysis.ranking && (
                <div className="analysis-section">
                    <h2>📍 Análisis por Ubicación</h2>
                    <div className="ranking-grid">
                        <div className="ranking-card">
                            <h3>🏆 Comunas Más Caras</h3>
                            <div className="ranking-list">
                                {locationAnalysis.ranking.mostExpensive.map((item, index) => (
                                    <div key={index} className="ranking-item">
                                        <span className="rank-number">#{index + 1}</span>
                                        <div className="rank-info">
                                            <div className="rank-name">{item.comuna}</div>
                                            <div className="rank-value">{formatPrice(item.averagePrice)}</div>
                                        </div>
                                        <div className="rank-count">{item.count} prop.</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="ranking-card">
                            <h3>🏘️ Mayor Oferta</h3>
                            <div className="ranking-list">
                                {locationAnalysis.ranking.mostListings.map((item, index) => (
                                    <div key={index} className="ranking-item">
                                        <span className="rank-number">#{index + 1}</span>
                                        <div className="rank-info">
                                            <div className="rank-name">{item.comuna}</div>
                                            <div className="rank-value">{item.count} propiedades</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="ranking-card highlight">
                            <h3>💎 Mejor Valor</h3>
                            <div className="ranking-list">
                                {locationAnalysis.ranking.bestValue.map((item, index) => (
                                    <div key={index} className="ranking-item">
                                        <span className="rank-number">#{index + 1}</span>
                                        <div className="rank-info">
                                            <div className="rank-name">{item.comuna}</div>
                                            <div className="rank-value">{formatPrice(item.averagePricePerSqMeter)}/m²</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Investment Opportunities */}
            {opportunities && opportunities.length > 0 && (
                <div className="analysis-section">
                    <h2>🎯 Oportunidades de Inversión</h2>
                    <p className="section-description">
                        Propiedades con precios por debajo del promedio del mercado, identificadas mediante análisis estadístico
                    </p>
                    <div className="opportunities-grid">
                        {opportunities.slice(0, 6).map((opp, index) => (
                            <div key={index} className="opportunity-card">
                                <div className="opportunity-header">
                                    <span className="opportunity-rank">TOP {index + 1}</span>
                                    <span className={`opportunity-badge ${opp.score > 1 ? 'excellent' : 'good'}`}>
                                        {opp.recommendation}
                                    </span>
                                </div>
                                <h4>{opp.property.title}</h4>
                                <div className="opportunity-details">
                                    <div className="detail-row">
                                        <span>📍 {opp.property.comuna}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>💰 Precio:</span>
                                        <strong>{formatPrice(opp.property.price)}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>📐 Área:</span>
                                        <strong>{opp.property.area}m²</strong>
                                    </div>
                                    <div className="detail-row highlight">
                                        <span>💵 Precio/m²:</span>
                                        <strong>{formatPrice(opp.pricePerSqM)}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>📊 Promedio mercado:</span>
                                        <strong>{formatPrice(opp.marketAverage)}</strong>
                                    </div>
                                    <div className="detail-row success">
                                        <span>💎 Ahorro potencial:</span>
                                        <strong>{formatPrice(opp.savings)}/m²</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Integration Section */}
            <div className="ai-section">
                <div className="ai-header">
                    <h2>🤖 Integración con Inteligencia Artificial</h2>
                    <span className={`ai-status ${aiReadyData.summary.readyForML ? 'ready' : 'pending'}`}>
                        {aiReadyData.summary.readyForML ? '✅ Listo para ML' : '⏳ En preparación'}
                    </span>
                </div>
                
                <div className="ai-content">
                    <div className="ai-info-card">
                        <h3>📊 Estado de los Datos</h3>
                        <div className="ai-metrics">
                            <div className="ai-metric">
                                <span>Total de registros:</span>
                                <strong>{aiReadyData.summary.totalRecords}</strong>
                            </div>
                            <div className="ai-metric">
                                <span>Completitud de datos:</span>
                                <strong>{(aiReadyData.summary.completeness * 100).toFixed(1)}%</strong>
                            </div>
                            <div className="ai-metric">
                                <span>Campos numéricos:</span>
                                <strong>{aiReadyData.dataSchema.numericFields.length}</strong>
                            </div>
                            <div className="ai-metric">
                                <span>Campos categóricos:</span>
                                <strong>{aiReadyData.dataSchema.categoricalFields.length}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="ai-models-section">
                        <h3>🧠 Modelos de IA Sugeridos</h3>
                        <p className="ai-description">
                            Una vez que el sistema de IA esté activo, podrás utilizar estos modelos para análisis avanzados:
                        </p>
                        <div className="ai-models-grid">
                            {aiReadyData.suggestedModels.map((model, index) => (
                                <div key={index} className="ai-model-card">
                                    <div className="model-header">
                                        <h4>{model.name}</h4>
                                        <span className="model-type">{model.type}</span>
                                    </div>
                                    <p className="model-description">{model.description}</p>
                                    <div className="model-features">
                                        <strong>Features:</strong>
                                        <div className="features-list">
                                            {model.features.map((feature, i) => (
                                                <span key={i} className="feature-badge">{feature}</span>
                                            ))}
                                        </div>
                                    </div>
                                    {model.target && (
                                        <div className="model-target">
                                            <strong>Target:</strong> <span>{model.target}</span>
                                        </div>
                                    )}
                                    <button className="model-button disabled">
                                        Disponible Próximamente
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="ai-coming-soon">
                        <div className="coming-soon-icon">🚀</div>
                        <h3>Próximamente: Análisis con IA</h3>
                        <p>
                            Estamos desarrollando capacidades avanzadas de inteligencia artificial que incluirán:
                        </p>
                        <ul className="features-list-vertical">
                            <li>🎯 Predicción de precios con Machine Learning</li>
                            <li>🔍 Detección automática de oportunidades de inversión</li>
                            <li>📈 Análisis predictivo de tendencias del mercado</li>
                            <li>🤝 Recomendaciones personalizadas basadas en tu perfil</li>
                            <li>🧠 Procesamiento de lenguaje natural para analizar descripciones</li>
                            <li>📊 Segmentación automática del mercado mediante clustering</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Insight Detail Modal */}
            {selectedInsight && (
                <div className="modal-overlay" onClick={() => setSelectedInsight(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedInsight.title}</h2>
                            <button className="modal-close" onClick={() => setSelectedInsight(null)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="insight-description-full">{selectedInsight.description}</p>
                            {selectedInsight.property && (
                                <div className="insight-property-details">
                                    <h4>Detalles de la Propiedad</h4>
                                    <pre>{JSON.stringify(selectedInsight.property, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Analysis

