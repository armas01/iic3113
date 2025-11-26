import { useState, useEffect } from 'react'
import './Featured.css'

function Featured() {
    const [categories, setCategories] = useState({
        bestValue: [],
        mostSpacious: [],
        bestAmenities: []
    })
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(null)
    const [activeCategory, setActiveCategory] = useState('bestValue')

    useEffect(() => {
        loadFeaturedProperties()
    }, [])

    const loadFeaturedProperties = async () => {
        setLoading(true)
        try {
            const response = await fetch('http://localhost:3001/api/featured')
            const data = await response.json()
            
            if (data.success) {
                setCategories(data.categories || {
                    bestValue: [],
                    mostSpacious: [],
                    bestAmenities: []
                })
                setLastUpdate(new Date(data.lastUpdate))
            }
        } catch (error) {
            console.error('Error loading featured properties:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatUF = (uf) => {
        if (!uf || isNaN(uf)) return 'N/A'
        return `${Math.round(uf).toLocaleString('es-CL')} UF`
    }

    const formatComunaName = (slug) => {
        if (!slug) return 'N/A'
        return slug
            .replace('-metropolitana', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    const addToFavorites = (property) => {
        const favorites = JSON.parse(localStorage.getItem('favoriteProperties') || '[]')
        
        const exists = favorites.find(fav => fav.id === property.id)
        if (!exists) {
            favorites.push(property)
            localStorage.setItem('favoriteProperties', JSON.stringify(favorites))
            alert('✅ Propiedad agregada a favoritos')
        } else {
            alert('⚠️ Esta propiedad ya está en favoritos')
        }
    }

    if (loading) {
        return (
            <div className="featured-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Cargando propiedades destacadas...</p>
                </div>
            </div>
        )
    }

    const allEmpty = !categories.bestValue.length && !categories.mostSpacious.length && !categories.bestAmenities.length

    if (allEmpty) {
        return (
            <div className="featured-page">
                <div className="featured-header">
                    <h1>⭐ Propiedades Destacadas</h1>
                    <p>Top 10 en diferentes categorías</p>
                </div>
                <div className="empty-featured">
                    <div className="empty-icon">📊</div>
                    <h2>No hay suficientes datos</h2>
                    <p>Realiza scraping para generar estadísticas automáticas</p>
                </div>
            </div>
        )
    }

    const currentProperties = categories[activeCategory] || []

    const getCategoryInfo = (category) => {
        switch(category) {
            case 'bestValue':
                return { name: '💰 Mejor Relación Precio/m²', desc: 'Propiedades con menor precio por metro cuadrado' }
            case 'mostSpacious':
                return { name: '📏 Más Espaciosas', desc: 'Mayor superficie por cada 1000 UF' }
            case 'bestAmenities':
                return { name: '✨ Más Completas', desc: 'Mayor cantidad de amenidades y características' }
            default:
                return { name: '', desc: '' }
        }
    }

    const categoryInfo = getCategoryInfo(activeCategory)

    return (
        <div className="featured-page">
            <div className="featured-header">
                <div>
                    <h1>⭐ Propiedades Destacadas</h1>
                    <p>Top 10 en cada categoría - Actualizado automáticamente</p>
                    {lastUpdate && (
                        <span className="last-update">
                            Última actualización: {lastUpdate.toLocaleString('es-CL')}
                        </span>
                    )}
                </div>
                <button onClick={loadFeaturedProperties} className="refresh-btn">
                    🔄 Actualizar
                </button>
            </div>

            {/* Category Tabs */}
            <div className="category-tabs">
                <button
                    className={`category-tab ${activeCategory === 'bestValue' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('bestValue')}
                >
                    💰 Mejor Precio/m²
                    <span className="tab-count">{categories.bestValue.length}</span>
                </button>
                <button
                    className={`category-tab ${activeCategory === 'mostSpacious' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('mostSpacious')}
                >
                    📏 Más Espaciosas
                    <span className="tab-count">{categories.mostSpacious.length}</span>
                </button>
                <button
                    className={`category-tab ${activeCategory === 'bestAmenities' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('bestAmenities')}
                >
                    ✨ Más Completas
                    <span className="tab-count">{categories.bestAmenities.length}</span>
                </button>
            </div>

            {/* Category Description */}
            <div className="category-description">
                <h2>{categoryInfo.name}</h2>
                <p>{categoryInfo.desc}</p>
            </div>

            <div className="featured-grid">
                {currentProperties.map((property, index) => (
                    <div key={property.id} className="featured-card">
                        <div className="featured-badge">
                            <span className="badge-rank">#{index + 1}</span>
                            <span className="badge-label">TOP</span>
                        </div>

                        <button 
                            className="add-favorite-btn"
                            onClick={() => addToFavorites(property)}
                            title="Agregar a favoritos"
                        >
                            ❤️
                        </button>

                        <div className="featured-header-content">
                            <h3>{property.title}</h3>
                            <span className="featured-comuna">
                                📍 {formatComunaName(property.comuna)}
                            </span>
                        </div>

                        <div className="featured-price">
                            <span className="price-label">Precio:</span>
                            <span className="price-value">{formatUF(property.priceUF)}</span>
                        </div>

                        <div className="featured-specs">
                            <div className="spec-item">
                                <span className="spec-icon">🛏️</span>
                                <span className="spec-value">{property.bedrooms || 0}</span>
                                <span className="spec-label">dorm.</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-icon">🚿</span>
                                <span className="spec-value">{property.bathrooms || 0}</span>
                                <span className="spec-label">baño{(property.bathrooms || 0) !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-icon">📐</span>
                                <span className="spec-value">{property.area || 0}</span>
                                <span className="spec-label">m²</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-icon">🚗</span>
                                <span className="spec-value">{property.parking || 0}</span>
                                <span className="spec-label">est.</span>
                            </div>
                        </div>

                        {activeCategory === 'bestValue' && property.pricePerSqM && (
                            <div className="category-metric">
                                <span className="metric-label">Precio/m²:</span>
                                <span className="metric-value">{property.pricePerSqM.toFixed(1)} UF/m²</span>
                            </div>
                        )}

                        {activeCategory === 'mostSpacious' && property.spaceScore && (
                            <div className="category-metric">
                                <span className="metric-label">Espacios por 1000 UF:</span>
                                <span className="metric-value">{property.spaceScore.toFixed(1)} m²</span>
                            </div>
                        )}

                        {activeCategory === 'bestAmenities' && property.amenitiesCount !== undefined && (
                            <div className="category-metric">
                                <span className="metric-label">Amenidades:</span>
                                <span className="metric-value">{property.amenitiesCount} detectadas</span>
                            </div>
                        )}

                        <div className="featured-score">
                            <div className="score-bar">
                                <div 
                                    className="score-fill" 
                                    style={{ width: `${Math.min(property.popularityScore || 0, 100)}%` }}
                                ></div>
                            </div>
                            <span className="score-label">
                                Score: {Math.round(property.popularityScore || 0)}%
                            </span>
                        </div>

                        {property.link && (
                            <a
                                href={property.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="featured-link"
                            >
                                Ver en Portal Inmobiliario →
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Featured

