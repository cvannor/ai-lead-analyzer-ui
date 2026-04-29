import { useEffect, useState } from 'react'
import './Dashboard.css'

function Dashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL') // 'ALL', 'HOT', 'WARM', 'COLD'

  
      const fetchLeads = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/leads')
        if (!response.ok) {
          throw new Error('Failed to fetch leads')
        }
        const data = await response.json()
        setLeads(data)
      } catch (err) {
        setError(err.message || 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
  
  useEffect(() => {
    fetchLeads()
  }, [])

  // Filter leads based on selected filter and sort by newest first
  const filteredLeads = leads
    .filter(lead => filter === 'ALL' ? true : lead.leadScore === filter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const getLeadScoreBadge = (score) => {
    switch (score) {
      case 'HOT':
        return <span className="badge badge-hot">🔥 HOT</span>
      case 'WARM':
        return <span className="badge badge-warm">WARM</span>
      case 'COLD':
        return <span className="badge badge-cold">COLD</span>
      default:
        return <span className="badge">{score}</span>
    }
  }

  const getUrgencyBadge = (urgency) => {
    if (!urgency) return '-'
    return <span className={`urgency urgency-${urgency.toLowerCase()}`}>{urgency}</span>
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Lead Dashboard</h1>
        <p className="subtitle">View and filter all leads</p>
      </header>

      <main className="dashboard-content">
        {loading && <div className="loading">Loading leads...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="filter-section">
              <p className="filter-label">Filter by Lead Score:</p>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setFilter('ALL')}
                >
                  All Leads
                </button>
                <button 
                  className={`filter-btn filter-hot ${filter === 'HOT' ? 'active' : ''}`}
                  onClick={() => setFilter('HOT')}
                >
                  🔥 Hot
                </button>
                <button 
                  className={`filter-btn filter-warm ${filter === 'WARM' ? 'active' : ''}`}
                  onClick={() => setFilter('WARM')}
                >
                  Warm
                </button>
                <button 
                  className={`filter-btn filter-cold ${filter === 'COLD' ? 'active' : ''}`}
                  onClick={() => setFilter('COLD')}
                >
                  Cold
                </button>
              </div>
            </div>

            <div className="leads-count">
              <p>Showing: <strong>{filteredLeads.length}</strong> {filter === 'ALL' ? 'leads' : `${filter.toLowerCase()} leads`}</p>
            </div>

            {filteredLeads.length > 0 ? (
              <div className="table-wrapper">
                <table className="leads-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Message</th>
                      <th>Intent</th>
                      <th>Urgency</th>
                      <th>Lead Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className={`lead-row ${lead.leadScore === 'HOT' ? 'lead-row-hot' : ''}`}>
                        <td className="name">{lead.name}</td>
                        <td className="message">{lead.message}</td>
                        <td className="intent">{lead.intent || '-'}</td>
                        <td className="urgency">{getUrgencyBadge(lead.urgency)}</td>
                        <td className="lead-score">{getLeadScoreBadge(lead.leadScore)}</td>
                        <td className="date">{formatDate(lead.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-leads">
                <p>No {filter === 'ALL' ? '' : filter.toLowerCase() + ' '}leads at the moment</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard
