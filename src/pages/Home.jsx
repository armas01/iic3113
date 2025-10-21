import './Home.css'

function Home() {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Análisis Inteligente de Propiedades
                    </h1>
                    <p className="hero-subtitle">
                        Extrae y analiza datos del mercado inmobiliario chileno de forma automatizada
                    </p>
                    <div className="hero-stats">
                        <div className="stat-card">
                            <div className="stat-number">25,000+</div>
                            <div className="stat-label">Propiedades Analizadas</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">35</div>
                            <div className="stat-label">Comunas Monitoreadas</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Actualización Continua</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">98%</div>
                            <div className="stat-label">Precisión de Datos</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2 className="section-title">¿Qué puedes hacer?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Análisis de Precios</h3>
                        <p>Obtén estadísticas detalladas de precios por comuna, tipo de propiedad y características específicas.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Búsqueda Avanzada</h3>
                        <p>Filtra propiedades por múltiples criterios: precio, ubicación, metros cuadrados, dormitorios y más.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📈</div>
                        <h3>Tendencias del Mercado</h3>
                        <p>Visualiza la evolución de precios y disponibilidad en tiempo real del mercado inmobiliario.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Comparación de Propiedades</h3>
                        <p>Compara múltiples propiedades lado a lado para tomar mejores decisiones de inversión.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🏆</div>
                        <h3>Mejores Oportunidades</h3>
                        <p>Identifica propiedades con mejor relación precio-calidad basado en análisis de mercado.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3>Exportación de Datos</h3>
                        <p>Descarga los datos en formatos CSV, Excel o PDF para análisis externos.</p>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <h2 className="section-title">¿Cómo funciona?</h2>
                <div className="steps">
                    <div className="step">
                        <div className="step-number">1</div>
                        <h3>Selecciona tus criterios</h3>
                        <p>Define qué tipo de propiedad buscas y en qué zonas</p>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="step">
                        <div className="step-number">2</div>
                        <h3>Analiza los resultados</h3>
                        <p>Nuestro scraper recopila datos en tiempo real</p>
                    </div>
                    <div className="step-arrow">→</div>
                    <div className="step">
                        <div className="step-number">3</div>
                        <h3>Toma decisiones</h3>
                        <p>Utiliza insights y visualizaciones para tu estrategia</p>
                    </div>
                </div>
            </section>

            <section className="technology">
                <h2 className="section-title">Nuestra Tecnología</h2>
                <div className="tech-content">
                    <p className="tech-description">
                        Utilizamos tecnología de vanguardia para garantizar la mejor experiencia de análisis inmobiliario.
                        Nuestro sistema combina web scraping avanzado, procesamiento de lenguaje natural y análisis de datos
                        para entregarte información precisa y actualizada del mercado chileno.
                    </p>
                    <div className="tech-grid">
                        <div className="tech-item">
                            <div className="tech-icon">🤖</div>
                            <h3>Machine Learning</h3>
                            <p>Algoritmos inteligentes que aprenden patrones del mercado</p>
                        </div>
                        <div className="tech-item">
                            <div className="tech-icon">⚡</div>
                            <h3>Procesamiento Rápido</h3>
                            <p>Análisis de miles de propiedades en segundos</p>
                        </div>
                        <div className="tech-item">
                            <div className="tech-icon">🔒</div>
                            <h3>Datos Seguros</h3>
                            <p>Protección y privacidad de tu información</p>
                        </div>
                        <div className="tech-item">
                            <div className="tech-icon">🌐</div>
                            <h3>Cobertura Total</h3>
                            <p>Monitoreo continuo de todas las regiones de Chile</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="testimonials">
                <h2 className="section-title">Lo que dicen nuestros usuarios</h2>
                <div className="testimonials-grid">
                    <div className="testimonial-card">
                        <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "Increíble herramienta para analizar el mercado. Me ayudó a encontrar
                            la mejor inversión para mi departamento en Las Condes."
                        </p>
                        <div className="testimonial-author">- Carlos M., Inversionista</div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "Los datos son muy precisos y la interfaz es súper fácil de usar.
                            Recomendado para cualquier corredor de propiedades."
                        </p>
                        <div className="testimonial-author">- Patricia S., Corredora</div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
                        <p className="testimonial-text">
                            "Como analista de mercado, esta herramienta se ha vuelto indispensable
                            en mi trabajo diario. Ahorro horas de investigación."
                        </p>
                        <div className="testimonial-author">- Roberto L., Analista</div>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="cta-content">
                    <h2>¿Listo para comenzar?</h2>
                    <p>Empieza a analizar el mercado inmobiliario chileno hoy mismo</p>
                    <button className="cta-button" onClick={() => window.location.href = '#dashboard'}>
                        Comenzar Análisis
                    </button>
                </div>
            </section>
        </div>
    )
}

export default Home

