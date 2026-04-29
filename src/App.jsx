import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import LeadForm from './components/LeadForm'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <AppContent />
      </div>
    </Router>
  )
}

function AppContent() {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  return (
    <>
      <main className={`main-content ${isDashboard ? 'dashboard-layout' : ''}`}>
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <section className="hero-section">
                  <div className="hero-text">
                    <h2>Let's Connect</h2>
                    <p>Have a question or interested in our services? Fill out the form below and we'll get back to you shortly.</p>
                  </div>
                </section>

                <section className="form-section">
                  <LeadForm />
                </section>
              </>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      {!isDashboard && (
        <footer className="footer">
          <p>&copy; 2026 Our Company. All rights reserved.</p>
        </footer>
      )}
    </>
  )
}

export default App
