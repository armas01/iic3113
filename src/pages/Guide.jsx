import './Guide.css'

function Guide() {
    return (
        <div className="guide">
            <div className="guide-header">
                <h1>Guía de Uso</h1>
                <p>Aprende a usar el analizador de propiedades paso a paso</p>
            </div>

            <div className="guide-content">
                <section className="guide-section">
                    <h2>🚀 Primeros Pasos</h2>
                    <div className="guide-card">
                        <h3>1. Accede al Dashboard</h3>
                        <p>
                            Navega a la sección "Analizar Propiedades" desde el menú principal.
                            Aquí encontrarás la interfaz principal de análisis con datos en tiempo real.
                        </p>
                    </div>
                    <div className="guide-card">
                        <h3>2. Explora las Estadísticas Generales</h3>
                        <p>
                            En la parte superior del dashboard verás un resumen con:
                        </p>
                        <ul>
                            <li>Total de propiedades disponibles</li>
                            <li>Precio promedio del mercado</li>
                            <li>Tendencia de precios (↑ o ↓)</li>
                            <li>Nuevas propiedades agregadas</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <h2>🔍 Filtros de Búsqueda</h2>
                    <div className="guide-card">
                        <h3>Tipo de Operación</h3>
                        <p>
                            Selecciona entre Venta o Arriendo según tu interés. Esto filtrará
                            todas las propiedades mostradas en el dashboard.
                        </p>
                    </div>
                    <div className="guide-card">
                        <h3>Tipo de Propiedad</h3>
                        <p>
                            Elige el tipo específico que buscas:
                        </p>
                        <ul>
                            <li><strong>Departamento:</strong> Ideal para inversión o vivienda en edificios</li>
                            <li><strong>Casa:</strong> Propiedades independientes con mayor espacio</li>
                            <li><strong>Estacionamiento:</strong> Para inversión o uso personal</li>
                            <li><strong>Bodega:</strong> Espacios de almacenamiento</li>
                            <li><strong>Oficina:</strong> Espacios comerciales</li>
                        </ul>
                    </div>
                    <div className="guide-card">
                        <h3>Rango de Precio</h3>
                        <p>
                            Usa los controles deslizantes para definir tu presupuesto mínimo y máximo.
                            Los resultados se actualizan automáticamente.
                        </p>
                    </div>
                    <div className="guide-card">
                        <h3>Ubicación</h3>
                        <p>
                            Selecciona una o varias comunas de interés. Puedes elegir zonas específicas
                            como Las Condes, Providencia, Santiago Centro, entre otras.
                        </p>
                    </div>
                </section>

                <section className="guide-section">
                    <h2>📊 Interpretando los Resultados</h2>
                    <div className="guide-card">
                        <h3>Tarjetas de Propiedades</h3>
                        <p>Cada propiedad muestra:</p>
                        <ul>
                            <li><strong>Precio:</strong> Valor de venta o arriendo mensual</li>
                            <li><strong>Ubicación:</strong> Comuna y dirección específica</li>
                            <li><strong>Características:</strong> Dormitorios, baños, metros cuadrados</li>
                            <li><strong>Estado:</strong> Nueva o publicación antigua</li>
                            <li><strong>Precio/m²:</strong> Indicador de valor por metro cuadrado</li>
                        </ul>
                    </div>
                    <div className="guide-card">
                        <h3>Gráficos de Análisis</h3>
                        <p>
                            Los gráficos te ayudan a visualizar:
                        </p>
                        <ul>
                            <li><strong>Distribución de precios:</strong> Rangos más comunes</li>
                            <li><strong>Propiedades por comuna:</strong> Oferta disponible por zona</li>
                            <li><strong>Tendencias temporales:</strong> Evolución de precios</li>
                            <li><strong>Relación precio/características:</strong> Valor vs. tamaño</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <h2>💡 Consejos y Mejores Prácticas</h2>
                    <div className="guide-card">
                        <h3>Para Compradores</h3>
                        <ul>
                            <li>Compara el precio/m² entre propiedades similares</li>
                            <li>Revisa las propiedades marcadas como "Nueva" - pueden ser oportunidades</li>
                            <li>Considera propiedades ligeramente fuera de tu rango que lleven más tiempo publicadas</li>
                            <li>Usa los filtros de dormitorios y baños para afinar tu búsqueda</li>
                        </ul>
                    </div>
                    <div className="guide-card">
                        <h3>Para Inversionistas</h3>
                        <ul>
                            <li>Analiza las zonas con mayor volumen de propiedades</li>
                            <li>Compara precios de arriendo vs. venta para calcular rentabilidad</li>
                            <li>Identifica comunas con tendencia al alza en precios</li>
                            <li>Busca estacionamientos y bodegas como inversión complementaria</li>
                        </ul>
                    </div>
                    <div className="guide-card">
                        <h3>Para Análisis de Mercado</h3>
                        <ul>
                            <li>Exporta los datos para análisis más profundos en Excel</li>
                            <li>Monitorea las tendencias semanalmente</li>
                            <li>Compara precios promedio entre diferentes comunas</li>
                            <li>Analiza la velocidad de publicación de nuevas propiedades</li>
                        </ul>
                    </div>
                </section>

                <section className="guide-section">
                    <h2>❓ Preguntas Frecuentes</h2>
                    <div className="guide-card">
                        <h3>¿Con qué frecuencia se actualizan los datos?</h3>
                        <p>
                            Los datos se actualizan cada 24 horas, garantizando información fresca
                            del mercado inmobiliario.
                        </p>
                    </div>
                    <div className="guide-card">
                        <h3>¿Los precios son exactos?</h3>
                        <p>
                            Los precios provienen directamente de Portal Inmobiliario. Sin embargo,
                            siempre recomendamos verificar directamente con el vendedor o corredor.
                        </p>
                    </div>
                    <div className="guide-card">
                        <h3>¿Puedo guardar mis búsquedas?</h3>
                        <p>
                            Actualmente los filtros se resetean al cambiar de página. En futuras
                            versiones implementaremos la funcionalidad de guardar búsquedas favoritas.
                        </p>
                    </div>
                    <div className="guide-card">
                        <h3>¿Cómo interpreto la tendencia de precios?</h3>
                        <p>
                            Una flecha hacia arriba (↑) indica que los precios están subiendo en esa
                            categoría, mientras que una flecha hacia abajo (↓) indica una baja. El
                            porcentaje muestra la magnitud del cambio.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Guide

