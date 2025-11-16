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
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button
                            className={currentPage === 'analysis' ? 'active' : ''}
                            onClick={() => setCurrentPage('analysis')}
                        >
                            Análisis IA
                        </button>
                    </li>
                    <li>
                        <button
                            className={currentPage === 'rawdata' ? 'active' : ''}
                            onClick={() => setCurrentPage('rawdata')}
                        >
                            Raw Data
                        </button>
                    </li>
                    <li>
                        <button
                            className={currentPage === 'guide' ? 'active' : ''}
                            onClick={() => setCurrentPage('guide')}
                        >
                            Guía
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

