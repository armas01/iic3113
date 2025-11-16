import { useState, useEffect } from 'react'
import './RawData.css'

function RawData() {
    const [rawData, setRawData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [viewMode, setViewMode] = useState('formatted') // 'formatted', 'json', 'table'
    const [selectedProperty, setSelectedProperty] = useState(null)

    useEffect(() => {
        fetchRawData()
    }, [])

    const fetchRawData = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('http://localhost:3001/api/raw-data')
            const data = await response.json()
            
            if (data.success) {
                setRawData(data)
            } else {
                setError('Error al cargar los datos')
            }
        } catch (err) {
            setError('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.')
            console.error('Error fetching raw data:', err)
        } finally {
            setLoading(false)
        }
    }

    const downloadJSON = () => {
        if (!rawData) return
        
        const dataStr = JSON.stringify(rawData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = `raw-data-${new Date().toISOString()}.json`
        link.click()
        URL.revokeObjectURL(url)
    }

    const downloadCSV = () => {
        if (!rawData || !rawData.rawData || !rawData.rawData.properties) return
        
        const properties = rawData.rawData.properties
        if (properties.length === 0) return

        // Get all keys from all properties
        const allKeys = new Set()
        properties.forEach(prop => {
            Object.keys(prop).forEach(key => allKeys.add(key))
        })

        const headers = Array.from(allKeys).join(',')
        const rows = properties.map(prop => {
            return Array.from(allKeys).map(key => {
                const value = prop[key]
                if (value == null) return ''
                if (typeof value === 'object') return JSON.stringify(value).replace(/,/g, ';')
                return String(value).replace(/,/g, ';')
            }).join(',')
        })

        const csv = [headers, ...rows].join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `properties-${new Date().toISOString()}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    const copyToClipboard = () => {
        if (!rawData) return
        navigator.clipboard.writeText(JSON.stringify(rawData, null, 2))
            .then(() => alert('¡Datos copiados al portapapeles!'))
            .catch(err => console.error('Error copying:', err))
    }

    if (loading) {
        return (
            <div className="raw-data">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Cargando datos...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="raw-data">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchRawData} className="retry-button">
                        Reintentar
                    </button>
                </div>
            </div>
        )
    }

    const properties = rawData?.rawData?.properties || []
    const metadata = rawData?.metadata || {}

    return (
        <div className="raw-data">
            <div className="raw-data-header">
                <div>
                    <h1>📊 Raw Data</h1>
                    <p>Visualización de datos sin procesar del web scraper</p>
                </div>
                <button onClick={fetchRawData} className="refresh-button">
                    🔄 Actualizar
                </button>
            </div>

            {/* Metadata */}
            <div className="metadata-section">
                <h2>Metadata</h2>
                <div className="metadata-grid">
                    <div className="metadata-card">
                        <div className="metadata-label">Total de Propiedades</div>
                        <div className="metadata-value">{metadata.totalProperties || 0}</div>
                    </div>
                    <div className="metadata-card">
                        <div className="metadata-label">Última Actualización</div>
                        <div className="metadata-value">
                            {metadata.lastUpdate 
                                ? new Date(metadata.lastUpdate).toLocaleString('es-CL')
                                : 'No disponible'}
                        </div>
                    </div>
                    <div className="metadata-card">
                        <div className="metadata-label">Estructura de Datos</div>
                        <div className="metadata-value">
                            {metadata.dataStructure?.length || 0} campos
                        </div>
                    </div>
                    <div className="metadata-card">
                        <div className="metadata-label">Última Búsqueda</div>
                        <div className="metadata-value metadata-small">
                            {metadata.lastScrapeParams 
                                ? `${metadata.lastScrapeParams.operation} / ${metadata.lastScrapeParams.propertyType} / ${metadata.lastScrapeParams.comuna}`
                                : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Structure */}
            {metadata.dataStructure && metadata.dataStructure.length > 0 && (
                <div className="data-structure-section">
                    <h2>Estructura de Datos (Campos Disponibles)</h2>
                    <div className="fields-container">
                        {metadata.dataStructure.map((field, index) => (
                            <div key={index} className="field-badge">
                                {field}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="actions-bar">
                <div className="view-mode-selector">
                    <button 
                        className={viewMode === 'formatted' ? 'active' : ''}
                        onClick={() => setViewMode('formatted')}
                    >
                        📋 Formateado
                    </button>
                    <button 
                        className={viewMode === 'json' ? 'active' : ''}
                        onClick={() => setViewMode('json')}
                    >
                        {} JSON
                    </button>
                    <button 
                        className={viewMode === 'table' ? 'active' : ''}
                        onClick={() => setViewMode('table')}
                    >
                        📊 Tabla
                    </button>
                </div>
                <div className="action-buttons">
                    <button onClick={downloadJSON} className="action-btn">
                        💾 Descargar JSON
                    </button>
                    <button onClick={downloadCSV} className="action-btn">
                        📄 Descargar CSV
                    </button>
                    <button onClick={copyToClipboard} className="action-btn">
                        📋 Copiar
                    </button>
                </div>
            </div>

            {/* Data Display */}
            <div className="data-display">
                {properties.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No hay datos disponibles</h3>
                        <p>Ejecuta el scraper desde el Dashboard para ver datos aquí</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'formatted' && (
                            <div className="formatted-view">
                                <h3>Propiedades ({properties.length})</h3>
                                <div className="properties-list">
                                    {properties.map((property, index) => (
                                        <div 
                                            key={index} 
                                            className="property-raw-card"
                                            onClick={() => setSelectedProperty(property)}
                                        >
                                            <div className="property-raw-header">
                                                <span className="property-index">#{index + 1}</span>
                                                <span className="property-id">{property.id}</span>
                                            </div>
                                            <div className="property-raw-content">
                                                <h4>{property.title}</h4>
                                                <div className="property-raw-details">
                                                    <span><strong>Precio:</strong> {property.priceText || property.price}</span>
                                                    <span><strong>Comuna:</strong> {property.comuna}</span>
                                                    <span><strong>Tipo:</strong> {property.propertyType}</span>
                                                    <span><strong>Operación:</strong> {property.operation}</span>
                                                    {property.area && <span><strong>Área:</strong> {property.area}m²</span>}
                                                    {property.bedrooms && <span><strong>Dormitorios:</strong> {property.bedrooms}</span>}
                                                    {property.bathrooms && <span><strong>Baños:</strong> {property.bathrooms}</span>}
                                                </div>
                                                {property.source && (
                                                    <div className="property-source">
                                                        Fuente: {property.source}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {viewMode === 'json' && (
                            <div className="json-view">
                                <pre>{JSON.stringify(rawData, null, 2)}</pre>
                            </div>
                        )}

                        {viewMode === 'table' && (
                            <div className="table-view">
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>ID</th>
                                                <th>Título</th>
                                                <th>Precio</th>
                                                <th>Comuna</th>
                                                <th>Tipo</th>
                                                <th>Operación</th>
                                                <th>Área (m²)</th>
                                                <th>Dorm.</th>
                                                <th>Baños</th>
                                                <th>Estac.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {properties.map((property, index) => (
                                                <tr key={index} onClick={() => setSelectedProperty(property)}>
                                                    <td>{index + 1}</td>
                                                    <td className="cell-id">{property.id?.substring(0, 10)}...</td>
                                                    <td className="cell-title">{property.title}</td>
                                                    <td className="cell-price">{property.priceText || property.price}</td>
                                                    <td>{property.comuna}</td>
                                                    <td>{property.propertyType}</td>
                                                    <td>{property.operation}</td>
                                                    <td>{property.area || '-'}</td>
                                                    <td>{property.bedrooms || '-'}</td>
                                                    <td>{property.bathrooms || '-'}</td>
                                                    <td>{property.parking || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Property Detail Modal */}
            {selectedProperty && (
                <div className="modal-overlay" onClick={() => setSelectedProperty(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Detalles de la Propiedad</h2>
                            <button className="modal-close" onClick={() => setSelectedProperty(null)}>
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <pre>{JSON.stringify(selectedProperty, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RawData

