"use client"

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsMounted(true)
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [])

  useEffect(() => {
    if (!isMounted) {
      return undefined
    }

    document.body.style.overflow = isOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMounted, isOpen])

  const isActive = (path) => (pathname === path ? 'active' : '')
  const toggleMenu = () => setIsOpen((prev) => !prev)

  return (
    <>
      <div className="smart-bar">
        <div className="hamburger" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
        </div>

        <div className="bar-menu">
            <Link href="/" className={`nav-btn ${isActive('/')}`}>Home</Link>
            <Link href="/forms" className={`nav-btn ${isActive('/forms')}`}>Forms</Link>
            <Link href="/jobs" className={`nav-btn ${isActive('/jobs')}`}>Jobs</Link>
            <Link href="/tools" className={`nav-btn ${isActive('/tools')}`}>Tools</Link>
        </div>

        <div className="bar-wa">
            <a href="https://chat.whatsapp.com/JTO6kT4j8ykEIgRAVdpags?mode=hqrc" target="_blank" rel="noreferrer">
                <i className="fab fa-whatsapp"></i> Join
            </a>
        </div>
      </div>

      {isMounted
        ? createPortal(
        <>
          {isOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
          <div className="sidenav" style={{ width: isOpen ? '280px' : '0' }}>
            <button type="button" className="closebtn" onClick={toggleMenu}>&times;</button>
            
            <div style={{padding: '0 25px 20px 25px', borderBottom: '2px solid #0d6efd', marginBottom: '10px'}}>
                <h2 style={{margin:0, color:'#0d6efd'}}>Nain CSC</h2>
                <p style={{margin:0, fontSize:'12px', color:'#666'}}>Menu</p>
            </div>

            <Link href="/" onClick={toggleMenu}><i className="fas fa-home"></i> Home</Link>
            <Link href="/forms" onClick={toggleMenu}><i className="fas fa-file-download"></i> Forms</Link>
            <Link href="/jobs" onClick={toggleMenu}><i className="fas fa-briefcase"></i> Jobs</Link>
            <Link href="/tools" onClick={toggleMenu}><i className="fas fa-tools"></i> Tools</Link>
            
            <Link href="/lpg" onClick={toggleMenu}><i className="fas fa-fire"></i> LPG Services</Link>
            <Link href="/resume" onClick={toggleMenu}><i className="fas fa-file-invoice"></i> Resume Maker</Link>
          </div>
        </>,
        document.body
      ) : null}
    </>
  )
}

export default Navbar