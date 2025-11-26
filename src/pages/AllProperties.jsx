import { useState, useEffect } from 'react'
import './AllProperties.css'

function AllProperties() {
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('recent') // recent, priceAsc, priceDesc, areaDesc
    const [filterComuna, setFilterComuna] = useState('all')

    useEffect(() => {
        fetchProperties()
    }, [])

    const fetchProperties = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('http://localhost:3001/api/properties')
            const data = await response.json()
            
            if (data.success) {
                setProperties(data.data || [])
            } else {
                setError('Error al cargar las propiedades')
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor')
            console.error('Error fetching properties:', err)
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

    // Get unique comunas for filter
    const comunas = ['all', ...new Set(properties.map(p => p.comuna).filter(Boolean))]

    // Filter and sort properties
    const filteredAndSortedProperties = properties
        .filter(p => {
            const matchesSearch = !searchTerm || 
                p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.comuna?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesComuna = filterComuna === 'all' || p.comuna === filterComuna
            return matchesSearch && matchesComuna
        })
        .sort((a, b) => {
            switch(sortBy) {
                case 'priceAsc':
                    return (a.priceUF || 0) - (b.priceUF || 0)
                case 'priceDesc':
                    return (b.priceUF || 0) - (a.priceUF || 0)
                case 'areaDesc':
                    return (b.area || 0) - (a.area || 0)
                default: // recent
                    return 0
            }
        })

    if (loading) {
        return (
            <div className="all-properties">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Cargando propiedades...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="all-properties">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchProperties} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="all-properties">
            <div className="properties-header">
                <div>
                    <h1>🏘️ Todas las Propiedades</h1>
                    <p>{properties.length} propiedades disponibles</p>
                </div>
                <button onClick={fetchProperties} className="refresh-btn">
                    🔄 Actualizar
                </button>
            </div>

            {/* Filters and Search */}
            <div className="filters-bar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por título o comuna..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select 
                    className="filter-select"
                    value={filterComuna}
                    onChange={(e) => setFilterComuna(e.target.value)}
                >
                    <option value="all">Todas las comunas</option>
                    {comunas.filter(c => c !== 'all').map(comuna => (
                        <option key={comuna} value={comuna}>
                            {formatComunaName(comuna)}
                        </option>
                    ))}
                </select>

                <select 
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="recent">Más recientes</option>
                    <option value="priceAsc">Precio: Menor a Mayor</option>
                    <option value="priceDesc">Precio: Mayor a Menor</option>
                    <option value="areaDesc">Mayor superficie</option>
                </select>
            </div>

            {/* Results Count */}
            {searchTerm || filterComuna !== 'all' ? (
                <div className="results-info">
                    Mostrando {filteredAndSortedProperties.length} de {properties.length} propiedades
                </div>
            ) : null}

            {/* Properties Grid */}
            {filteredAndSortedProperties.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No hay propiedades</h3>
                    <p>
                        {properties.length === 0 
                            ? 'Ejecuta el scraper desde el Dashboard para ver propiedades aquí'
                            : 'No se encontraron propiedades con los filtros aplicados'}
                    </p>
                </div>
            ) : (
                <div className="properties-grid">
                    {filteredAndSortedProperties.map((property, index) => (
                        <div key={property.id || index} className="property-card">
                            <button 
                                className="favorite-btn"
                                onClick={() => addToFavorites(property)}
                                title="Agregar a favoritos"
                            >
                                ❤️
                            </button>

                            <div className="property-header">
                                <h3>{property.title}</h3>
                                <span className="property-comuna">
                                    📍 {formatComunaName(property.comuna)}
                                </span>
                            </div>

                            <div className="property-price">
                                <span className="price-label">Precio:</span>
                                <span className="price-value">{formatUF(property.priceUF || property.price)}</span>
                            </div>

                            <div className="property-specs">
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

                            {property.priceUF && property.area ? (
                                <div className="property-metric">
                                    <span className="metric-label">Precio/m²:</span>
                                    <span className="metric-value">
                                        {(property.priceUF / property.area).toFixed(1)} UF/m²
                                    </span>
                                </div>
                            ) : null}

                            {property.amenities && Object.values(property.amenities).some(v => v) && (
                                <div className="property-amenities">
                                    {property.amenities.gimnasio && <span className="amenity-badge">🏋️</span>}
                                    {property.amenities.piscina && <span className="amenity-badge">🏊</span>}
                                    {property.amenities.terraza && <span className="amenity-badge">🌇</span>}
                                    {property.amenities.seguridad && <span className="amenity-badge">🔒</span>}
                                </div>
                            )}

                            {property.link && (
                                <a
                                    href={property.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="property-link"
                                >
                                    Ver en Portal Inmobiliario →
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AllProperties

