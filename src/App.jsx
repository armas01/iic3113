import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Guide from './pages/Guide'
import Team from './pages/Team'
import Dashboard from './pages/Dashboard'
import RawData from './pages/RawData'
import Analysis from './pages/Analysis'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

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
