import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Guide from './pages/Guide'
import Team from './pages/Team'
import Dashboard from './pages/Dashboard'
import RawData from './pages/RawData'
import Analysis from './pages/Analysis'

function App() {
  // Get initial page from localStorage, default to 'home' if not found
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem('currentPage') || 'home'
  })

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage)
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'guide':
        return <Guide />
      case 'team':
        return <Team />
      case 'dashboard':
        return <Dashboard />
      case 'rawdata':
        return <RawData />
      case 'analysis':
        return <Analysis />
      default:
        return <Home />
    }
  }

  return (
    <div className="app">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
