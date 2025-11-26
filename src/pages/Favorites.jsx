import { useState, useEffect } from 'react'
import './Favorites.css'

function Favorites() {
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        loadFavorites()
    }, [])

    const loadFavorites = () => {
        const stored = localStorage.getItem('favoriteProperties')
        if (stored) {
            setFavorites(JSON.parse(stored))
        }
    }

    const removeFavorite = (propertyId) => {
        const updated = favorites.filter(p => p.id !== propertyId)
        setFavorites(updated)
        localStorage.setItem('favoriteProperties', JSON.stringify(updated))
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

    if (favorites.length === 0) {
        return (
            <div className="favorites-page">
                <div className="favorites-header">
                    <h1>❤️ Mis Favoritos</h1>
                    <p>Propiedades que has marcado como favoritas</p>
                </div>
                <div className="empty-favorites">
                    <div className="empty-icon">💔</div>
                    <h2>No tienes propiedades favoritas</h2>
                    <p>Ve al Dashboard y marca propiedades con el corazón para guardarlas aquí</p>
                </div>
            </div>
        )
    }

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <h1>❤️ Mis Favoritos</h1>
                <p>{favorites.length} {favorites.length === 1 ? 'propiedad guardada' : 'propiedades guardadas'}</p>
            </div>

            <div className="favorites-grid">
                {favorites.map((property) => (
                    <div key={property.id} className="favorite-card">
                        <button 
                            className="remove-favorite-btn"
                            onClick={() => removeFavorite(property.id)}
                            title="Quitar de favoritos"
                        >
                            ❌
                        </button>

                        <div className="favorite-header">
                            <h3>{property.title}</h3>
                            <span className="favorite-comuna">
                                📍 {formatComunaName(property.comuna)}
                            </span>
                        </div>

                        <div className="favorite-price">
                            <span className="price-label">Precio:</span>
                            <span className="price-value">{formatUF(property.priceUF || property.price)}</span>
                        </div>

                        <div className="favorite-specs">
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

                        {property.link && (
                            <a
                                href={property.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="favorite-link"
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

export default Favorites

