"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import MenuGrid from '../components/MenuGrid'
import VanillaTilt from 'vanilla-tilt'
import { onAuthStateChanged } from 'firebase/auth'
import { get, ref, set } from 'firebase/database'
import { auth, db } from '../firebase'
import { homeFaqs } from '../lib/seo'

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

const seoHighlights = [
  {
    title: 'Local CSC aur online help',
    text: 'Danoda Kalan, Jind aur nearby villages ke liye ek hi jagah par forms, IDs, jobs aur daily digital services available hain.',
  },
  {
    title: 'Government form support',
    text: 'Family ID, Aadhaar, PAN, pension, scholarship, college admission, HKRN, CET aur kai official portals ki fast assistance milti hai.',
  },
  {
    title: 'Document to delivery workflow',
    text: 'Photostate, printout, online submission, document correction aur follow-up support ek smooth local service flow me handle hota hai.',
  },
]

const Home = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('top')
  const [recentSearches, setRecentSearches] = useState([])

  const [clickData, setClickData] = useState({})

  const [showScrollTop, setShowScrollTop] = useState(false)
  const [tabKey, setTabKey] = useState(0)
  const [confirmedSearch, setConfirmedSearch] = useState('')
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [showServiceManager, setShowServiceManager] = useState(false)
  const [visibleServiceIds, setVisibleServiceIds] = useState([])
  const [prefsReady, setPrefsReady] = useState(false)
  const [preferenceScopeLabel, setPreferenceScopeLabel] = useState('this device only')

  const glassPanelRef = useRef(null)
  const searchInputRef = useRef(null)
  const suggestionBoxRef = useRef(null)

  useEffect(() => {
    setRecentSearches(readStorage('recentServiceSearches', []))
    setClickData(readStorage('serviceClicks', {}))
  }, [])

  useEffect(() => {
    if (activeTab === 'top') {
      const saved = localStorage.getItem('serviceClicks')
      if (saved) setClickData(JSON.parse(saved))
    }
  }, [activeTab])

  useEffect(() => {
    const panel = glassPanelRef.current

    if (panel) {
      VanillaTilt.init(panel, {
        max: 2,
        speed: 400,
        glare: true,
        'max-glare': 0.08,
        perspective: 1500,
      })
    }

    return () => {
      if (panel && panel.vanillaTilt) {
        panel.vanillaTilt.destroy()
      }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionBoxRef.current && !suggestionBoxRef.current.contains(e.target) && e.target !== searchInputRef.current) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const services = useMemo(() => [
    { title: 'Family ID', icon: 'fas fa-users', url: 'https://ppp-office.haryana.gov.in/FamilyDirect?var=CitizenLogin', external: true, category: 'id' },
    { title: 'Ayushman card', icon: 'fas fa-heartbeat', url: 'https://beneficiary.nha.gov.in/', external: true, category: 'id' },
    { title: 'Saral Haryana', icon: 'fas fa-laptop-house', url: 'https://saralharyana.gov.in/login.do?', external: true, category: 'utility' },
    { title: 'Digital Seva (CSC)', icon: 'fas fa-globe', url: 'https://digitalseva.csc.gov.in/', external: true, category: 'utility' },
    { title: 'Aadhar Card', icon: 'fas fa-fingerprint', url: 'https://myaadhaar.uidai.gov.in/', external: true, category: 'id' },
    { title: 'Ration Card', icon: 'fas fa-utensils', url: 'https://epds.haryanafood.gov.in/search-rc', external: true, category: 'id' },
    { title: 'Jamabandi', icon: 'fas fa-map-marked-alt', url: 'https://jamabandi.nic.in/land%20records/NakalRecord', external: true, category: 'kisan' },
    { title: 'College Forms', icon: 'fas fa-graduation-cap', url: '/college-forms', external: false, category: 'student' },
    { title: 'Farmer ID', icon: 'fas fa-leaf', url: 'https://hrfr.agristack.gov.in/farmer-registry-hr/#/', external: true, category: 'kisan' },
    { title: 'Know Family ID', icon: 'fas fa-search-plus', url: 'https://gjuonline.ac.in/pgadmission/', external: true, category: 'id' },
    { title: 'Sarathi Parivahan', icon: 'fa-solid fa-bus', url: 'https://sarathi.parivahan.gov.in/sarathiservice/', external: true, category: 'utility' },
    { title: 'e-Disha Status', icon: 'fas fa-file-contract', url: 'https://edisha.gov.in/eForms/Status', external: true, category: 'utility' },
    { title: 'Panjikaran', icon: 'fas fa-seedling', url: 'https://fasal.haryana.gov.in/home/login', external: true, category: 'kisan' },
    { title: 'SC / BC Welfare', icon: 'fa-solid fa-people-arrows', url: 'https://schemes.haryanascbc.gov.in/', external: true, category: 'welfare' },
    { title: 'PM Kisan Portal', icon: 'fas fa-tractor', url: 'https://pmkisan.gov.in/', external: true, category: 'kisan' },
    { title: 'Agri Haryana', icon: 'fas fa-leaf', url: 'https://agriharyana.gov.in/FarmerLogin', external: true, category: 'kisan' },
    { title: 'Labour Copy', icon: 'fas fa-hard-hat', url: 'https://hrylabour.gov.in/login/bocw', external: true, category: 'welfare' },
    { title: 'Vote Card', icon: 'fas fa-vote-yea', url: 'https://voters.eci.gov.in/login', external: true, category: 'id' },
    { title: 'PAN Card (NSDL)', icon: 'fas fa-id-card', url: 'https://onlineservices.proteantech.in/paam/endUserRegisterContact.html', external: true, category: 'id' },
    { title: 'Passport', icon: 'fas fa-passport', url: 'https://www.passportindia.gov.in/psp', external: true, category: 'id' },
    { title: 'Pension Status', icon: 'fas fa-blind', url: 'https://pension.socialjusticehry.gov.in/Ben_Inf', external: true, category: 'welfare' },
    { title: 'Pension List', icon: 'fa-solid fa-list-check', url: 'https://pension.socialjusticehry.gov.in', external: true, category: 'welfare' },
    { title: 'Marriage Registration', icon: 'fa-solid fa-children', url: 'https://shaadi.haryana.gov.in/', external: true, category: 'welfare' },
    { title: 'HKRN', icon: 'fas fa-network-wired', url: 'https://hkrnl.itiharyana.gov.in/getMember_pub?userType=CAN', external: true, category: 'student' },
    { title: 'Saksham Yojana', icon: 'fas fa-chalkboard-teacher', url: 'https://hreyahs.gov.in/parvesh', external: true, category: 'student' },
    { title: 'Employment Exchange', icon: 'fas fa-handshake', url: 'https://hrex.gov.in/login', external: true, category: 'student' },
    { title: 'HBSE Board', icon: 'fas fa-book-reader', url: 'https://bseh.org.in/home', external: true, category: 'student' },
    { title: 'Ujjwala Yojana', icon: 'fas fa-burn', url: 'https://pmuy.gov.in/ujjwala2.html', external: true, category: 'welfare' },
    { title: 'Deen Dayal', icon: 'fas fa-home', url: 'https://dapsy.finhry.gov.in/get-family-id', external: true, category: 'welfare' },
    { title: 'College Admission', icon: 'fas fa-user-graduate', url: 'https://admissions.highereduhry.ac.in/', external: true, category: 'student' },
    { title: 'DHBVN Apply', icon: 'fas fa-bolt', url: 'https://econnection.dhbvn.org.in/', external: true, category: 'utility' },
    { title: 'DHBVN Login', icon: 'fas fa-plug', url: 'https://www.dhbvn.org.in/web/portal/auth', external: true, category: 'utility' },
    { title: 'Police Verification', icon: 'fas fa-shield-alt', url: 'https://haryanapolice.gov.in/', external: true, category: 'utility' },
    { title: 'PF Apply / KYC', icon: 'fas fa-piggy-bank', url: 'https://unifiedportal-mem.epfindia.gov.in/memberinterface/', external: true, category: 'utility' },
    { title: 'Aadhaar–PAN Link', icon: 'fas fa-link', url: 'https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar', external: true, category: 'id' },
    { title: 'UDID Card', icon: 'fas fa-wheelchair', url: 'https://swavlambancard.gov.in/', external: true, category: 'id' },
    { title: 'CEIR Complaint', icon: 'fas fa-mobile-alt', url: 'https://www.ceir.gov.in/Home/index.jsp', external: true, category: 'utility' },
    { title: 'Har Chhatravrati', icon: 'fas fa-graduation-cap', url: 'https://harchhatravratti.highereduhry.ac.in/', external: true, category: 'student' },
    { title: 'NCC Enrollment', icon: 'fas fa-medal', url: 'https://www.nccindia.gov.in/', external: true, category: 'student' },
    { title: 'HSSC / CET Haryana', icon: 'fas fa-briefcase', url: 'https://hssc.gov.in/', external: true, category: 'student' },
    { title: 'SSC Portal (New)', icon: 'fas fa-laptop-code', url: 'https://ssc.gov.in/', external: true, category: 'student' },
    { title: 'NSP Scholarship', icon: 'fas fa-university', url: 'https://scholarships.gov.in/', external: true, category: 'student' },
    { title: 'E-Shram Card', icon: 'fas fa-id-card-clip', url: 'https://register.eshram.gov.in/', external: true, category: 'welfare' },
    { title: 'Fasal Bima (PMFBY)', icon: 'fas fa-cloud-sun-rain', url: 'https://pmfby.gov.in/', external: true, category: 'kisan' },
    { title: 'PM Surya Ghar (Solar)', icon: 'fas fa-solar-panel', url: 'https://pmsuryaghar.gov.in/', external: true, category: 'utility' },
    { title: 'Apprenticeship', icon: 'fas fa-tools', url: 'https://www.apprenticeshipindia.gov.in/login', external: true, category: 'student' },
    { title: 'Bijli Bill Pay', icon: 'fas fa-file-invoice-dollar', url: 'https://epayment.dhbvn.org.in/b2csearch.aspx', external: true, category: 'utility' },
    { title: 'Ration Details', icon: 'fas fa-list-alt', url: 'https://epos.haryanafood.gov.in/SRC_Trans_Int', external: true, category: 'id' },
    { title: 'Photo Maker', icon: 'fas fa-camera', url: 'https://www.photopea.com/', external: true, category: 'tools' },
    { title: 'All Card Maker', icon: 'fas fa-print', url: 'https://idcard.store/u/all_cards', external: true, category: 'tools' },
    { title: 'CD Service', icon: 'fas fa-city', url: 'http://hry.cdservice.in/Home/HRLogin', external: true, category: 'utility' },
    { title: 'WhatsApp Web', icon: 'fab fa-whatsapp', url: 'https://web.whatsapp.com/', external: true, category: 'tools' },
    { title: 'Traffic Challan', icon: 'fas fa-receipt', url: 'https://echallan.parivahan.gov.in/index/accused-challan', external: true, category: 'utility' },
    { title: 'Know LPG ID', icon: 'fas fa-fire', url: '/lpg', external: false, category: 'tools' },
    { title: 'Resume Maker', icon: 'fas fa-file-invoice', url: '/resume', external: false, category: 'tools' },
    { title: 'Property ID (NDC)', icon: 'fas fa-building', url: 'https://ulbharyana.gov.in/', external: true, category: 'utility' },
    { title: 'Haryana Rodways Pass', icon: 'fas fa-bus-alt', url: 'https://ebooking.hrtransport.gov.in/#/home', external: true, category: 'student' },
    { title: 'E-Kharid (Gate Pass)', icon: 'fas fa-truck-pickup', url: 'https://ekharid.haryana.gov.in/', external: true, category: 'kisan', isNew: true },
    { title: 'PM Maandhan', icon: 'fas fa-rupee-sign', url: 'https://maandhan.in/', external: true, category: 'welfare', isNew: true },
    { title: 'HSRP Number Plate', icon: 'fas fa-car', url: 'https://bookmyhsrp.com/', external: true, category: 'utility', isNew: true },
    { title: 'DBT / PFMS Status', icon: 'fas fa-money-check-alt', url: 'https://pfms.nic.in/', external: true, category: 'welfare', isNew: true },
    { title: 'Udyam (MSME) Certificate', icon: 'fas fa-store', url: 'https://udyamregistration.gov.in/', external: true, category: 'utility', isNew: true },
  ], [])

  const getServiceId = (service) => service.url || service.title
  const allServiceIds = useMemo(() => services.map(getServiceId), [services])

  const sanitizeVisibleIds = useCallback((ids) => {
    if (!Array.isArray(ids)) return allServiceIds
    const sanitized = ids.filter((id) => allServiceIds.includes(id))
    return sanitized.length || ids.length === 0 ? sanitized : allServiceIds
  }, [allServiceIds])

  useEffect(() => {
    const guestStorageKey = 'homeServicePrefs_guest'

    const loadGuestPreferences = () => {
      try {
        const saved = localStorage.getItem(guestStorageKey)
        return saved ? sanitizeVisibleIds(JSON.parse(saved)) : allServiceIds
      } catch {
        return allServiceIds
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setPrefsReady(false)

      try {
        if (user) {
          setPreferenceScopeLabel(user.email || 'your account')
          const prefsRef = ref(db, `home_service_preferences/${user.uid}`)
          const snapshot = await get(prefsRef)

          if (snapshot.exists()) {
            setVisibleServiceIds(sanitizeVisibleIds(snapshot.val()?.visibleServices))
          } else {
            const guestPrefs = loadGuestPreferences()
            setVisibleServiceIds(guestPrefs)
            await set(prefsRef, {
              visibleServices: guestPrefs,
              updatedAt: Date.now(),
              email: user.email || null,
            })
          }
        } else {
          setPreferenceScopeLabel('this device only')
          setVisibleServiceIds(loadGuestPreferences())
        }
      } catch (error) {
        console.error('Could not load home service preferences:', error)
        setVisibleServiceIds(allServiceIds)
      } finally {
        setPrefsReady(true)
      }
    })

    return () => unsubscribe()
  }, [allServiceIds, sanitizeVisibleIds])

  const saveVisibleServices = async (nextIds) => {
    const sanitizedIds = Array.from(new Set(nextIds)).filter((id) => allServiceIds.includes(id))
    setVisibleServiceIds(sanitizedIds)
    setTabKey((prev) => prev + 1)

    try {
      if (auth.currentUser) {
        await set(ref(db, `home_service_preferences/${auth.currentUser.uid}`), {
          visibleServices: sanitizedIds,
          updatedAt: Date.now(),
          email: auth.currentUser.email || null,
        })
        setPreferenceScopeLabel(auth.currentUser.email || 'your account')
      } else {
        localStorage.setItem('homeServicePrefs_guest', JSON.stringify(sanitizedIds))
        setPreferenceScopeLabel('this device only')
      }
    } catch (error) {
      console.error('Could not save home service preferences:', error)
      localStorage.setItem('homeServicePrefs_guest', JSON.stringify(sanitizedIds))
    }
  }

  const toggleServiceVisibility = (serviceId) => {
    const nextIds = visibleServiceIds.includes(serviceId)
      ? visibleServiceIds.filter((id) => id !== serviceId)
      : [...visibleServiceIds, serviceId]

    saveVisibleServices(nextIds)
  }

  const showAllServices = () => {
    saveVisibleServices(allServiceIds)
    setActiveTab('all')
    setConfirmedSearch('')
    setSearchTerm('')
  }

  const hideAllServices = () => {
    saveVisibleServices([])
    setActiveTab('all')
    setConfirmedSearch('')
    setSearchTerm('')
  }

  const effectiveVisibleIds = prefsReady ? visibleServiceIds : allServiceIds
  const personalizedServices = services.filter((service) => effectiveVisibleIds.includes(getServiceId(service)))

  const toggleAllServices = () => {
    if (effectiveVisibleIds.length === services.length) {
      hideAllServices()
    } else {
      showAllServices()
    }
  }

  const categoryCounts = {
    all: personalizedServices.length,
    top: Math.min(12, personalizedServices.length),
    id: personalizedServices.filter((s) => s.category === 'id').length,
    kisan: personalizedServices.filter((s) => s.category === 'kisan').length,
    student: personalizedServices.filter((s) => s.category === 'student').length,
    welfare: personalizedServices.filter((s) => s.category === 'welfare').length,
    utility: personalizedServices.filter((s) => s.category === 'utility').length,
  }

  const handleLinkClick = (e) => {
    const linkElement = e.target.closest('a')

    if (linkElement) {
      const href = linkElement.getAttribute('href')
      if (!href) return

      if (href.startsWith('http')) {
        e.preventDefault()
        window.open(href, '_blank')
      }

      const saved = localStorage.getItem('serviceClicks')
      const currentData = saved ? JSON.parse(saved) : {}
      currentData[href] = (currentData[href] || 0) + 1
      localStorage.setItem('serviceClicks', JSON.stringify(currentData))
    }
  }

  const openService = (item) => {
    if (item.external) {
      window.open(item.url, '_blank', 'noopener,noreferrer')
      return
    }

    router.push(item.url)
  }

  const saveRecentSearch = (value) => {
    const trimmed = value.trim()
    if (!trimmed) return
    const next = [trimmed, ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6)
    setRecentSearches(next)
    localStorage.setItem('recentServiceSearches', JSON.stringify(next))
  }

  const runSearch = (value) => {
    const trimmed = value.trim()
    if (!trimmed) {
      setConfirmedSearch('')
      setShowSuggestions(false)
      return
    }

    saveRecentSearch(trimmed)
    setConfirmedSearch(trimmed)
    setActiveTab('all')
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
  }

  const suggestedServices = searchTerm.trim()
    ? personalizedServices.filter((s) => s.title.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6)
    : []

  let displayServices = []

  if (activeTab === 'all') {
    displayServices = personalizedServices
  } else if (activeTab === 'top') {
    displayServices = [...personalizedServices].sort((a, b) => {
      const clicksA = clickData[a.url] || 0
      const clicksB = clickData[b.url] || 0
      return clicksB - clicksA
    }).slice(0, 12)
  } else {
    displayServices = personalizedServices.filter((service) => service.category === activeTab)
  }

  if (confirmedSearch) {
    displayServices = displayServices.filter((service) => service.title.toLowerCase().includes(confirmedSearch.toLowerCase()))
  }

  const hiddenCount = services.length - personalizedServices.length
  const noVisibleServices = personalizedServices.length === 0

  return (
    <div className="page home">
      <div className="home-search-block">
        <div className="pro-search-section home-search-section">
          <div className="pro-search-wrapper">
            <i className="fas fa-search pro-search-icon"></i>
            <input
              ref={searchInputRef}
              type="text"
              className="pro-search-input"
              placeholder='Search any service... (Press "/" to focus)'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setSelectedSuggestion(-1)
                setShowSuggestions(true)
                if (e.target.value.trim() !== '') {
                  setActiveTab('all')
                }
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  setSelectedSuggestion((prev) => (prev < suggestedServices.length - 1 ? prev + 1 : 0))
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault()
                  setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : suggestedServices.length - 1))
                } else if (e.key === 'Enter') {
                  e.preventDefault()
                  if (selectedSuggestion >= 0 && suggestedServices[selectedSuggestion]) {
                    const item = suggestedServices[selectedSuggestion]
                    setSearchTerm(item.title)
                    setConfirmedSearch(item.title)
                    saveRecentSearch(item.title)
                    setActiveTab('all')
                    setShowSuggestions(false)
                    setSelectedSuggestion(-1)
                    openService(item)
                  } else {
                    runSearch(searchTerm)
                  }
                } else if (e.key === 'Escape') {
                  setShowSuggestions(false)
                  setSelectedSuggestion(-1)
                  searchInputRef.current?.blur()
                }
              }}
            />

            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => {
                  setSearchTerm('')
                  setConfirmedSearch('')
                }}
                title="Clear"
              >
                <i className="fas fa-times"></i>
              </button>
            )}

            <button className="search-action-btn" onClick={() => runSearch(searchTerm)}>
              <i className="fas fa-arrow-right"></i>
            </button>

            {suggestedServices.length > 0 && showSuggestions && (
              <div className="search-suggestion-box" ref={suggestionBoxRef}>
                {suggestedServices.map((item, index) => (
                  <button
                    key={item.url}
                    className={`search-suggestion-item ${index === selectedSuggestion ? 'selected' : ''}`}
                    onClick={() => {
                      setSearchTerm(item.title)
                      setConfirmedSearch(item.title)
                      saveRecentSearch(item.title)
                      setActiveTab('all')
                      setShowSuggestions(false)
                      setSelectedSuggestion(-1)
                      openService(item)
                    }}
                    onMouseEnter={() => setSelectedSuggestion(index)}
                  >
                    <i className={item.icon}></i>
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {recentSearches.length > 0 && !searchTerm && (
          <div className="recent-search-row">
            <span>Recent:</span>
            {recentSearches.map((item) => (
              <button
                key={item}
                className="recent-search-chip"
                onClick={() => {
                  setSearchTerm(item)
                  runSearch(item)
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="home-tabs-wrapper">
        <button
          className={`home-mini-menu-btn ${showServiceManager ? 'active' : ''}`}
          onClick={() => setShowServiceManager((prev) => !prev)}
          title={`Services • ${personalizedServices.length} shown • ${hiddenCount} hidden • ${preferenceScopeLabel}`}
        >
          <i className="fas fa-ellipsis-v"></i>
        </button>

        {[
          { key: 'top', label: '⭐ Most Used' },
          { key: 'all', label: '🌐 All' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`home-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.key)
              setTabKey((k) => k + 1)
            }}
          >
            {tab.label} <span className="home-tab-count">{categoryCounts[tab.key]}</span>
          </button>
        ))}

        <button className="view-toggle-btn" onClick={() => setViewMode((v) => (v === 'grid' ? 'list' : 'grid'))} title={viewMode === 'grid' ? 'List View' : 'Grid View'}>
          <i className={viewMode === 'grid' ? 'fas fa-list' : 'fas fa-th'}></i>
          <span>{viewMode === 'grid' ? 'List' : 'Grid'}</span>
        </button>
      </div>

      {showServiceManager && (
        <div className="service-popup-overlay" onClick={() => setShowServiceManager(false)}>
          <div className="service-popup-card" onClick={(e) => e.stopPropagation()}>
            <div className="service-popup-top">
              <button type="button" className="service-popup-bulk-btn" onClick={toggleAllServices}>
                <i className={`fas ${effectiveVisibleIds.length === services.length ? 'fa-square-minus' : 'fa-square-check'}`}></i>
                <span>{effectiveVisibleIds.length === services.length ? 'None' : 'All'}</span>
              </button>

              <button
                type="button"
                className="service-popup-close"
                onClick={() => setShowServiceManager(false)}
                title="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="service-popup-grid">
              {services.map((service) => {
                const serviceId = getServiceId(service)
                const checked = effectiveVisibleIds.includes(serviceId)

                return (
                  <button
                    key={serviceId}
                    type="button"
                    className={`service-popup-tile ${checked ? 'active' : ''}`}
                    onClick={() => toggleServiceVisibility(serviceId)}
                    title={service.title}
                  >
                    <i className={service.icon}></i>
                    <span>{service.title}</span>
                    <small className="service-popup-check">
                      <i className={`fas ${checked ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    </small>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div
        ref={glassPanelRef}
        className="gemini-glass-card"
        style={{ padding: '20px', borderRadius: '16px', marginTop: '10px' }}
        onClickCapture={handleLinkClick}
      >
        <div className="home-grid-animated" key={tabKey}>
          <MenuGrid items={displayServices} viewMode={viewMode} />
        </div>
      </div>

      {displayServices.length === 0 && (
        <div className="home-empty-state">
          <i className={`fas ${noVisibleServices ? 'fa-eye-slash' : 'fa-search'}`}></i>
          <h3>{noVisibleServices ? 'Abhi koi service selected nahi hai' : 'कोई सर्विस नहीं मिली'}</h3>
          <p>
            {noVisibleServices
              ? 'Aapne फिलहाल सारी services hide कर दी हैं। "Sab Dikhao" दबाते ही सब वापस दिख जाएँगी।'
              : `"${confirmedSearch || searchTerm}" से कोई रिजल्ट नहीं आया। कुछ और खोजें।`}
          </p>
          <button
            className="home-empty-btn"
            onClick={() => {
              if (noVisibleServices) {
                showAllServices()
              } else {
                setSearchTerm('')
                setConfirmedSearch('')
                setActiveTab('all')
              }
            }}
          >
            {noVisibleServices ? 'सब services वापस दिखाएँ' : 'सभी सर्विसेज देखें'}
          </button>
        </div>
      )}

      <section className="home-seo-section" aria-labelledby="home-seo-title">
        <div className="home-seo-card">
          <span className="home-seo-eyebrow">Nain Photostate CSC Services</span>
          <h2 id="home-seo-title">Danoda Kalan ka trusted CSC, photostate aur online center</h2>
          <p>
            Nain Photostate & Online Center local customers ko fast digital help deta hai. Yahan se government forms,
            Family ID, Aadhaar related work, PAN card, job updates, college forms, LPG links aur daily document services
            easily access ki ja sakti hain.
          </p>
          <p>
            Google par Nain Photostate, CSC Danoda Kalan, online center Jind ya form filling service search karne wale
            users ko business name, location aur core services ek saath clearly milen, isliye yeh section brand aur local
            intent ko directly explain karta hai.
          </p>

          <div className="home-seo-grid">
            {seoHighlights.map((item) => (
              <article key={item.title} className="home-seo-point">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-faq-section" aria-labelledby="home-faq-title">
        <div className="home-faq-card">
          <span className="home-seo-eyebrow">FAQs</span>
          <h2 id="home-faq-title">Nain Photostate ke bare me common sawal</h2>
          <div className="home-faq-list">
            {homeFaqs.map((item) => (
              <article key={item.question} className="home-faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {showScrollTop && (
        <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </div>
  )
}

export default Home