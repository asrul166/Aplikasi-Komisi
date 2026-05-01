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

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <>
      {/* SideNavBar Shell */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Canvas */}
      <main className="md:ml-72 min-h-screen">
        <TopNavBar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
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

      {/* Background Decoration */}
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    </>
  )
}

export default App
