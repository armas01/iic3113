import './Team.css'

function Team() {
    const teamMembers = [
        {
            name: "Rodolfo Andrés Armas Saenz",
            role: "Gerente - Líder de Proyecto",
            description: "Responsable de la dirección estratégica del proyecto, coordinación del equipo y supervisión de la arquitectura general del sistema de web scraping.",
            avatar: "👨‍💻"
        },
        {
            name: "Juan Manuel Hernández",
            role: "Gerente - Líder de Análisis de negocio y requerimiento",
            description: "Encargado del análisis de necesidades del mercado inmobiliario, definición de requerimientos funcionales y estrategia de negocio.",
            avatar: "👨‍💼"
        },
        {
            name: "Agustín Arias",
            role: "Jefe de Bases de Datos",
            description: "Responsable del diseño, implementación y optimización de las bases de datos que almacenan toda la información de propiedades extraídas.",
            avatar: "🗄️"
        },
        {
            name: "Baltazar Lutjens",
            role: "Jefe de NLP",
            description: "Especialista en procesamiento de lenguaje natural para extraer y clasificar información relevante de las descripciones de propiedades.",
            avatar: "🧠"
        },
        {
            name: "Nicolás Fernández",
            role: "Jefe de Datos",
            description: "Líder del equipo de análisis de datos, transformación ETL y generación de insights del mercado inmobiliario.",
            avatar: "📊"
        },
        {
            name: "María Ignacia De Goyeneche",
            role: "Jefa de Web Scrapping",
            description: "Experta en técnicas de web scraping, extracción automatizada de datos y desarrollo de crawlers para Portal Inmobiliario.",
            avatar: "🕷️"
        }
    ]

    return (
        <div className="team">
            <div className="team-header">
                <h1>Nuestro Equipo</h1>
                <p>El equipo detrás del analizador de propiedades más completo de Chile</p>
            </div>

            <div className="team-content">
                <div className="team-intro">
                    <h2>Quiénes Somos</h2>
                    <p>
                        Somos un equipo multidisciplinario apasionado por la tecnología y el mercado inmobiliario.
                        Combinamos expertise en desarrollo web, análisis de datos y diseño de experiencias para
                        crear herramientas que faciliten la toma de decisiones en el sector inmobiliario chileno.
                    </p>
                    <p>
                        Nuestro objetivo es democratizar el acceso a información del mercado inmobiliario,
                        proporcionando análisis detallados y actualizados que antes solo estaban disponibles
                        para grandes empresas e inversionistas.
                    </p>
                </div>

                <div className="team-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="team-card">
                            <div className="team-avatar">{member.avatar}</div>
                            <h3>{member.name}</h3>
                            <div className="team-role">{member.role}</div>
                            <p>{member.description}</p>
                        </div>
                    ))}
                </div>

                <div className="team-values">
                    <h2>Nuestros Valores</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">🎯</div>
                            <h3>Precisión</h3>
                            <p>Nos comprometemos a entregar datos precisos y verificados del mercado inmobiliario.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🚀</div>
                            <h3>Innovación</h3>
                            <p>Buscamos constantemente nuevas formas de mejorar nuestro análisis y herramientas.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🤝</div>
                            <h3>Transparencia</h3>
                            <p>Creemos en compartir información clara y accesible para todos nuestros usuarios.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">💡</div>
                            <h3>Accesibilidad</h3>
                            <p>Diseñamos pensando en que cualquier persona pueda usar nuestras herramientas.</p>
                        </div>
                    </div>
                </div>

                <div className="team-contact">
                    <h2>¿Quieres contactarnos?</h2>
                    <p>
                        Estamos siempre abiertos a feedback, colaboraciones y nuevas ideas.
                        Si tienes alguna sugerencia o quieres trabajar con nosotros, no dudes en escribirnos.
                    </p>
                    <button className="contact-button">Enviar un mensaje</button>
                </div>
            </div>
        </div>
    )
}

export default Team

