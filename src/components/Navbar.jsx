import './Navbar.css'

function Navbar({ currentPage, setCurrentPage }) {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <span className="logo-icon">🏠</span>
                    <span className="logo-text">Scraper Inmobiliario</span>
                </div>
                <ul className="navbar-menu">
                    <li>
                        <button
                            className={currentPage === 'home' ? 'active' : ''}
                            onClick={() => setCurrentPage('home')}
                        >
                            Inicio
                        </button>
                    </li>
                    <li>
                        <button
                            className={currentPage === 'dashboard' ? 'active' : ''}
                            onClick={() => setCurrentPage('dashboard')}
                        >
                            Analizar Propiedades
                        </button>
                    </li>
                    <li>
                        <button
                            className={currentPage === 'guide' ? 'active' : ''}
                            onClick={() => setCurrentPage('guide')}
                        >
                            Guía de Uso
                        </button>
                    </li>
                    <li>
                        <button
                            className={currentPage === 'team' ? 'active' : ''}
                            onClick={() => setCurrentPage('team')}
                        >
                            Equipo
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar

