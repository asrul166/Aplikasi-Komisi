import { useState } from 'react'
import Sidebar from './components/Sidebar.tsx'
import TopNavBar from './components/TopNavBar.tsx'
import Reporting from './components/Reporting'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import Login from './components/Login'
import NewCommissionRule from './components/NewCommissionRule'
import Settings from './components/Settings'
import MarketData from './components/MarketData'
import Execution from './components/Execution'
import AIAssistantOverlay from './components/AIAssistantOverlay'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('transactions')
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setIsMobileNavOpen(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <>
      {/* SideNavBar Shell */}
      <Sidebar
        activeTab={activeTab}
        isMobileOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onTabChange={handleTabChange}
      />
      
      {/* Main Canvas */}
      <main className="min-h-screen md:ml-64">
        <TopNavBar 
          activeTab={activeTab} 
          onToggleMobileNav={() => setIsMobileNavOpen((isOpen) => !isOpen)}
          onToggleAI={() => setIsAIOpen(!isAIOpen)} 
        />
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'transactions' && <Transactions />}
        {activeTab === 'reporting' && <Reporting />}
        {activeTab === 'new-rule' && <NewCommissionRule />}
        {activeTab === 'settings' && <Settings />}
        {activeTab === 'market-data' && <MarketData />}
        {activeTab === 'execution' && <Execution />}
      </main>

      <AIAssistantOverlay isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

    </>
  )
}

export default App
