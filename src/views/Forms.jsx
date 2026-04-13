"use client"

import React, { useState } from 'react'
import { withBasePath } from '../lib/seo'

const Forms = () => {
  const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')

  // आपके सभी फॉर्म्स
    const formList = [
      { title: "Aadhar Update Form", icon: "fas fa-fingerprint", link: withBasePath('/forms/Aadhar_Update.pdf'), category: 'id', popular: true },
      { title: "Domicile Form", icon: "fas fa-house-user", link: withBasePath('/forms/Domisial.pdf'), category: 'certificate' },
      { title: "Pan Card Apply", icon: "fas fa-id-card", link: withBasePath('/forms/Form_49A.pdf'), category: 'id', popular: true },
      { title: "Birth Name Add", icon: "fas fa-baby", link: withBasePath('/forms/birth-recoad-name-add.pdf'), category: 'certificate' },
      { title: "Income Self Verify", icon: "fas fa-rupee-sign", link: withBasePath('/forms/income-self-verify.pdf'), category: 'income' },
      { title: "Saksham Undertaking", icon: "fas fa-file-signature", link: withBasePath('/forms/saksham-undertaking.pdf'), category: 'student' },
      { title: "Matritva Sahayta Yojna", icon: "fas fa-female", link: withBasePath('/forms/Mukhya-Mantri-Matritva-Sahayta-Yojna-Form.pdf'), category: 'welfare', popular: true },
      { title: "Bank NOC Form", icon: "fas fa-university", link: withBasePath('/forms/Bank_NOC.pdf'), category: 'bank' },
      { title: "PM Kissan Form", icon: "fas fa-tractor", link: withBasePath('/forms/PM-KISSAN-REPORT-1.pdf'), category: 'kisan', popular: true },
      { title: "Birth Certificate Correction", icon: "fas fa-utensils", link: withBasePath('/forms/Birth-Certificate-Correction.pdf'), category: 'certificate' },
      { title: "Lal Dora", icon: "fas fa-user-check", link: withBasePath('/forms/Lal_Dora.pdf'), category: 'property' },
      { title: "Duplicate Marksheet", icon: "fas fa-folder-open", link: withBasePath('/forms/duplicate-marksheet.pdf'), category: 'student' },
  ]

    const filterCounts = {
        all: formList.length,
        popular: formList.filter((f) => f.popular).length,
        id: formList.filter((f) => f.category === 'id').length,
        student: formList.filter((f) => f.category === 'student').length,
        certificate: formList.filter((f) => f.category === 'certificate').length,
    }

  // सर्च के हिसाब से फॉर्म्स को फिल्टर करना
    const filteredForms = formList.filter((f) => {
        const matchSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchFilter =
            activeFilter === 'all' ? true :
            activeFilter === 'popular' ? !!f.popular :
            f.category === activeFilter
        return matchSearch && matchFilter
    })

    const shareForm = (form) => {
        const msg = `📄 ${form.title}\nDownload: ${window.location.origin}${form.link}`
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
    }

  return (
    <div className="forms-page-container">
        
        {/* 🌟 VIP Header */}
        <div className="forms-vip-header">
            <div className="fvh-content">
                <h2><i className="fas fa-file-pdf" style={{color: '#ef4444'}}></i> Offline Forms Center</h2>
                <p>सभी ज़रूरी सरकारी और प्राइवेट फॉर्म्स की PDF 1-क्लिक में डाउनलोड करें।</p>
            </div>
        </div>

        {/* 🚀 ULTRA-PRO SEARCH BAR (मिनी वर्ज़न) */}
        <div className="pro-search-section" style={{marginTop: '-20px', marginBottom: '30px'}}>
            <div className="pro-search-wrapper" style={{maxWidth: '500px'}}>
                <i className="fas fa-search pro-search-icon"></i>
                <input
                    type="text"
                    className="pro-search-input"
                    placeholder="Search any form..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
        </div>

        <div className="forms-stats-row">
            <div className="form-stat-box"><strong>{formList.length}</strong><span>Total Forms</span></div>
            <div className="form-stat-box"><strong>{filterCounts.popular}</strong><span>Popular</span></div>
            <div className="form-stat-box"><strong>{filteredForms.length}</strong><span>Visible</span></div>
        </div>

        <div className="forms-filter-row">
            <button className={`forms-filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>All ({filterCounts.all})</button>
            <button className={`forms-filter-btn ${activeFilter === 'popular' ? 'active' : ''}`} onClick={() => setActiveFilter('popular')}>Popular ({filterCounts.popular})</button>
            <button className={`forms-filter-btn ${activeFilter === 'id' ? 'active' : ''}`} onClick={() => setActiveFilter('id')}>ID ({filterCounts.id})</button>
            <button className={`forms-filter-btn ${activeFilter === 'student' ? 'active' : ''}`} onClick={() => setActiveFilter('student')}>Student ({filterCounts.student})</button>
            <button className={`forms-filter-btn ${activeFilter === 'certificate' ? 'active' : ''}`} onClick={() => setActiveFilter('certificate')}>Certificate ({filterCounts.certificate})</button>
        </div>

        {/* 📂 DOCUMENT LIBRARY GRID */}
        <div className="doc-library-grid">
            {filteredForms.map((f, index) => (
                <div className="doc-file-card" key={index}>
                    <div className="doc-icon-box">
                        <i className="fas fa-file-pdf"></i>
                    </div>
                    <div className="doc-file-info">
                        <h4>{f.title} {f.popular && <span className="form-popular-badge">Popular</span>}</h4>
                        <span>PDF Document <i className="fas fa-check-circle" style={{color: '#10b981', marginLeft: '4px'}}></i></span>
                        <div className="form-meta-tags">
                            <span className="form-meta-tag">{f.category}</span>
                            <span className="form-meta-tag">Updated</span>
                        </div>
                    </div>
                    <div className="doc-actions-inline">
                        <a href={f.link} target="_blank" rel="noreferrer" className="doc-action-mini" title="View PDF">
                            <i className="fas fa-eye"></i>
                        </a>
                        <a href={f.link} download className="doc-action-mini" title="Download PDF">
                            <i className="fas fa-cloud-download-alt"></i>
                        </a>
                        <button className="doc-action-mini" title="Share on WhatsApp" onClick={() => shareForm(f)}>
                            <i className="fab fa-whatsapp"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* अगर सर्च करने पर कुछ न मिले */}
        {filteredForms.length === 0 && (
            <div className="no-form-found">
                <i className="fas fa-folder-open"></i>
                <p>कोई फॉर्म नहीं मिला! कृपया सही नाम लिखें।</p>
            </div>
        )}

    </div>
  )
}

export default Forms