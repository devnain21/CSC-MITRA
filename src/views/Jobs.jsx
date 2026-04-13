"use client"

import React, { useState, useEffect } from 'react'

const Jobs = () => {
  const [jobsData, setJobsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('job')
  const [searchTerm, setSearchTerm] = useState('')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [sortBy, setSortBy] = useState('latest')

  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOjRuYWhQGvJeQWT4w6knLknfSR7431Ord6IzBCrcchJQwDusOZmKevQ_FFncp5jQZ9cuQ0MAjW1V4/pub?gid=0&single=true&output=csv"

  useEffect(() => {
    fetch(SHEET_URL)
      .then(r => r.text())
      .then(csvText => {
        const rows = csvText.split('\n').filter(row => row.trim() !== '')
        const headers = rows[0].split(',').map(h => h.trim().toLowerCase())
        const parsedData = rows.slice(1).map(row => {
          const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim())
          const obj = {}
          headers.forEach((h, i) => { obj[h] = values[i] || '' })
          return obj
        })
        setJobsData(parsedData)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const MONTH_MAP = {
    jan:0, feb:1, mar:2, apr:3, may:4, jun:5,
    jul:6, aug:7, sep:8, oct:9, nov:10, dec:11,
    january:0, february:1, march:2, april:3, june:5,
    july:6, august:7, september:8, october:9, november:10, december:11,
  }

  const parseDate = (ds) => {
    if (!ds || !ds.trim()) return null
    ds = ds.trim()

    // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
    let m = ds.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
    if (m) { const d = new Date(+m[3], +m[2]-1, +m[1]); if (!isNaN(d)) return d }

    // DD/MM/YY  (2-digit year)
    m = ds.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2})$/)
    if (m) { const d = new Date(2000 + +m[3], +m[2]-1, +m[1]); if (!isNaN(d)) return d }

    // YYYY-MM-DD
    m = ds.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/)
    if (m) { const d = new Date(+m[1], +m[2]-1, +m[3]); if (!isNaN(d)) return d }

    // DD Month YYYY  (e.g. "30 March 2026" or "30 Mar 2026")
    m = ds.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/)
    if (m) {
      const mo = MONTH_MAP[m[2].toLowerCase()]
      if (mo !== undefined) { const d = new Date(+m[3], mo, +m[1]); if (!isNaN(d)) return d }
    }

    // Month DD, YYYY  (e.g. "March 30, 2026")
    m = ds.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/)
    if (m) {
      const mo = MONTH_MAP[m[1].toLowerCase()]
      if (mo !== undefined) { const d = new Date(+m[3], mo, +m[2]); if (!isNaN(d)) return d }
    }

    // Fallback: native Date.parse
    const fallback = new Date(ds)
    return isNaN(fallback) ? null : fallback
  }

  const getDaysLeft = (ds) => {
    const d = parseDate(ds)
    if (!d) return null          // null = date unknown (not 999)
    const today = new Date(); today.setHours(0,0,0,0); d.setHours(0,0,0,0)
    return Math.ceil((d - today) / 86400000)
  }

  // NEW badge: based on postdate column (3-day window); no postdate = NOT new
  const isNewItem = (item) => {
    if (!item.postdate) return false
    const d = parseDate(item.postdate)
    if (!d) return false
    const today = new Date(); today.setHours(0,0,0,0); d.setHours(0,0,0,0)
    return Math.ceil((today - d) / 86400000) <= 3
  }

  const shareOnWhatsApp = (job) => {
    const text = `📢 *नई भर्ती / अपडेट*\n\n📌 *नाम:* ${job.title}\n🎓 *योग्यता:* ${job.eligibility || 'Notice देखें'}\n💰 *फीस:* ${job.fees ? `₹${job.fees}` : 'Notice देखें'}\n📅 *अंतिम तिथि:* ${job.lastdate || 'Update Soon'}\n\n*ऑनलाइन फॉर्म भरवाने के लिए संपर्क करें:*\n📍 *Nain Photostate & Online Center*\n📌 Danoda Kalan, Jind\n📞 8950101037`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const latestJobs   = jobsData.filter(j => j.category?.toLowerCase().includes('job')).reverse()
  const admitCards   = jobsData.filter(j => j.category?.toLowerCase().includes('admit')).reverse()
  const results      = jobsData.filter(j => j.category?.toLowerCase().includes('result')).reverse()
  const collegeForms = jobsData.filter(j => j.category?.toLowerCase().includes('college')).reverse()

  const tabMap = { job: latestJobs, admit: admitCards, result: results, college: collegeForms }
  const hasDeadline = activeTab === 'job' || activeTab === 'college'

  let currentData = (tabMap[activeTab] || []).filter(item =>
    !searchTerm.trim() ? true :
      (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.eligibility || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (urgentOnly && hasDeadline) {
    currentData = currentData.filter(item => {
      const d = getDaysLeft(item.lastdate)
      return d !== null && d >= 0 && d <= 5
    })
  }

  currentData = [...currentData].sort((a, b) => {
    if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '')
    if (sortBy === 'deadline') {
      const da = getDaysLeft(a.lastdate) ?? 9999
      const db = getDaysLeft(b.lastdate) ?? 9999
      return da - db
    }
    return 0
  })

  const tabs = [
    { key: 'job',     label: 'Latest Jobs',   icon: 'fas fa-briefcase',      count: latestJobs.length,   color: '#10b981' },
    { key: 'admit',   label: 'Admit Cards',   icon: 'fas fa-id-card',        count: admitCards.length,   color: '#3b82f6' },
    { key: 'result',  label: 'Results',       icon: 'fas fa-trophy',         count: results.length,      color: '#f59e0b' },
    { key: 'college', label: 'College Forms', icon: 'fas fa-graduation-cap', count: collegeForms.length, color: '#8b5cf6' },
  ]

  const getDayBadge = (daysLeft) => {
    if (daysLeft === null)  return { text: null,             cls: 'jmeta-date'         }
    if (daysLeft < 0)       return { text: 'Expired',        cls: 'jmeta-date expired' }
    if (daysLeft === 0)     return { text: 'Aaj Last Day!',  cls: 'jmeta-date today'   }
    if (daysLeft <= 3)      return { text: `${daysLeft}d Left`, cls: 'jmeta-date urgent' }
    if (daysLeft <= 7)      return { text: `${daysLeft}d Left`, cls: 'jmeta-date soon'   }
    return                         { text: null,              cls: 'jmeta-date'         }
  }

  const SkeletonCard = () => (
    <div className="job-card job-skeleton">
      <div className="sk-line sk-title"></div>
      <div className="sk-line sk-sub"></div>
      <div className="sk-chips">
        <div className="sk-chip"></div>
        <div className="sk-chip"></div>
        <div className="sk-chip"></div>
      </div>
      <div className="sk-line sk-btn"></div>
    </div>
  )

  return (
    <div className="jobs-page">

      {/* ── Header ── */}
      <div className="jobs-page-header">
        <div className="jph-left">
          <span className="jph-live-dot"></span>
          <div>
            <h2>Live Jobs &amp; Updates</h2>
            <p>सभी सरकारी नौकरी, एडमिट कार्ड और रिजल्ट एक जगह</p>
          </div>
        </div>
        <div className="jph-stats">
          <div className="jph-stat"><strong>{latestJobs.length}</strong><span>Jobs</span></div>
          <div className="jph-stat"><strong>{admitCards.length}</strong><span>Admits</span></div>
          <div className="jph-stat"><strong>{results.length}</strong><span>Results</span></div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="jobs-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`jobs-tab ${activeTab === t.key ? 'active' : ''}`}
            style={activeTab === t.key ? { '--tab-color': t.color } : {}}
            onClick={() => setActiveTab(t.key)}
          >
            <i className={t.icon}></i>
            <span>{t.label}</span>
            <em>{t.count}</em>
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="jobs-toolbar">
        <div className="jobs-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="नाम या योग्यता से खोजें..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="jobs-search-clear" onClick={() => setSearchTerm('')}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="jobs-toolbar-right">
          {hasDeadline && (
            <button
              className={`jobs-urgent-btn ${urgentOnly ? 'active' : ''}`}
              onClick={() => setUrgentOnly(!urgentOnly)}
            >
              <i className="fas fa-fire"></i> Urgent
            </button>
          )}
          <select className="jobs-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="deadline">Last Date</option>
            <option value="name">A–Z</option>
          </select>
        </div>
      </div>

      {/* ── Result count ── */}
      {!loading && (
        <div className="jobs-result-count">
          <span>{currentData.length} result{currentData.length !== 1 ? 's' : ''} found</span>
          {urgentOnly && <span className="jrc-filter">Urgent filter on <button onClick={() => setUrgentOnly(false)}>✕</button></span>}
          {searchTerm  && <span className="jrc-filter">"{searchTerm}" <button onClick={() => setSearchTerm('')}>✕</button></span>}
        </div>
      )}

      {/* ── Cards ── */}
      <div className="jobs-cards-grid">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : currentData.length === 0 ? (
          <div className="jobs-empty">
            <i className="fas fa-inbox"></i>
            <h3>कोई नतीजा नहीं मिला</h3>
            <p>{urgentOnly ? 'Urgent filter हटाएँ या सभी देखें' : 'इस केटेगरी में अभी कोई अपडेट नहीं है'}</p>
          </div>
        ) : (
          currentData.map((item, index) => {
            const daysLeft   = getDaysLeft(item.lastdate)
            const isExpired  = daysLeft !== null && daysLeft < 0 && hasDeadline && !!item.lastdate
            const isNew      = isNewItem(item) && !isExpired
            const endingSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3 && hasDeadline
            const dayBadge   = hasDeadline && item.lastdate ? getDayBadge(daysLeft) : null

            return (
              <div
                key={index}
                className={`job-card${isExpired ? ' expired' : ''}${endingSoon ? ' ending-soon' : ''}`}
              >
                {/* Top badges */}
                <div className="job-card-top">
                  <div className="job-card-badges">
                    {isNew     && <span className="jbadge jbadge-new"><i className="fas fa-bolt"></i> NEW</span>}
                    {endingSoon && !isExpired && (
                      <span className="jbadge jbadge-urgent">
                        <i className="fas fa-hourglass-half"></i>
                        {daysLeft === 0 ? ' Aaj Last!' : ` ${daysLeft} Din Baki`}
                      </span>
                    )}
                    {isExpired && <span className="jbadge jbadge-expired"><i className="fas fa-lock"></i> Expired</span>}
                  </div>
                  <button className="job-share-icon" onClick={() => shareOnWhatsApp(item)} title="Share on WhatsApp">
                    <i className="fab fa-whatsapp"></i>
                  </button>
                </div>

                {/* Title */}
                <h3 className="job-card-title">{item.title || 'Untitled'}</h3>

                {/* Meta chips */}
                <div className="job-card-meta">
                  {item.eligibility && (
                    <span className="jmeta jmeta-edu">
                      <i className="fas fa-graduation-cap"></i>
                      <span className="jmeta-label">योग्यता:</span> {item.eligibility}
                    </span>
                  )}
                  {item.fees && (
                    <span className="jmeta jmeta-fee">
                      <i className="fas fa-rupee-sign"></i>
                      <span className="jmeta-label">फीस:</span> ₹{item.fees}
                    </span>
                  )}
                  {item.posts && (
                    <span className="jmeta jmeta-posts">
                      <i className="fas fa-users"></i>
                      <span className="jmeta-label">पद:</span> {item.posts}
                    </span>
                  )}
                  {item.postdate && (
                    <span className="jmeta jmeta-opening">
                      <i className="fas fa-bell"></i>
                      <span className="jmeta-label">Notify:</span> {item.postdate}
                    </span>
                  )}
                  {item.lastdate ? (
                    <span className={`jmeta ${dayBadge ? dayBadge.cls : 'jmeta-date'}`}>
                      <i className="fas fa-hourglass-end"></i>
                      <span className="jmeta-label">Last Date:</span> {item.lastdate}
                      {dayBadge?.text && <strong className="jdate-status"> {dayBadge.text}</strong>}
                    </span>
                  ) : (
                    <span className="jmeta jmeta-date">
                      <i className="fas fa-hourglass-end"></i>
                      <span className="jmeta-label">Last Date:</span> Update Soon
                    </span>
                  )}
                </div>

                {/* Action row */}
                <div className="job-card-actions">
                  {item.applylink ? (
                    isExpired ? (
                      <span className="job-btn job-btn-disabled">
                        <i className="fas fa-ban"></i> Apply Closed
                      </span>
                    ) : (
                      <a href={item.applylink} target="_blank" rel="noreferrer" className="job-btn job-btn-apply">
                        <i className="fas fa-paper-plane"></i> Apply Now
                      </a>
                    )
                  ) : (
                    <span className="job-btn job-btn-soon">
                      <i className="fas fa-clock"></i> Link Soon
                    </span>
                  )}

                  {item.notification && (
                    <a href={item.notification} target="_blank" rel="noreferrer" className="job-btn job-btn-notice" title="Official Notice / PDF">
                      <i className="fas fa-file-pdf"></i> Notice
                    </a>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}

export default Jobs
