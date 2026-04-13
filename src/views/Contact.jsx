"use client"

import React from 'react'

const Contact = () => {
  return (
    <div>
        {/* Contact Grid */}
        <div className="contact-grid">
            <a href="tel:8950101037" className="contact-box c-phone">
                <i className="fas fa-phone-volume"></i>
                <h3>Call Us</h3>
                <p>+91 8950101037</p>
            </a>
            <a href="https://wa.me/918950101037" target="_blank" rel="noreferrer" className="contact-box c-whatsapp">
                <i className="fab fa-whatsapp"></i>
                <h3>WhatsApp</h3>
                <p>Chat with Dev Nain</p>
            </a>
            <a 
                href="https://maps.app.goo.gl/ZH8JRXH8mjyZdUAf8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-box c-loc"
            >
                <i className="fas fa-map-marker-alt"></i>
                <h3>Visit Shop</h3>
                <p>Danoda Kalan</p>
            </a>
            <a href="mailto:dnain81@gmail.com" className="contact-box c-email">
                <i className="fas fa-envelope"></i>
                <h3>Email</h3>
                <p>Send a Mail</p>
            </a>
        </div>

        {/* Rating Button */}
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <a href="https://search.google.com/local/writereview?placeid=ChIJQSgx_hyNETkRQpxNuCUvyeA" target="_blank" rel="noreferrer" style={{
                background: 'white', border: '2px solid #ffc107', padding: '12px 25px',
                borderRadius: '50px', textDecoration: 'none', color: '#333', fontWeight: '600',
                display: 'inline-flex', alignItems: 'center', gap: '10px'
            }}>
                <span style={{fontSize: '18px'}}>⭐⭐⭐⭐⭐</span> Rate Us on Google
            </a>
        </div>

        {/* Map Container (Fixed Name) */}
        <div className="map-container">
            <div className="map-container">
            <iframe 
                width="100%" 
                height="100%" 
                id="gmap_canvas" 
                src="https://maps.google.com/maps?q=Nain+Photostate+Online+Center+Danoda+Kalan&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0"
                title="Shop Map"
                style={{border:0}}
                allowFullScreen="" 
                loading="lazy"
            ></iframe>
        </div>
        </div>

        {/* Form */}
        <div className="form-container">
            <div className="form-header">
                <h2>Send a Message</h2>
                <p>Any query about Forms, Status, or Schemes? Ask here.</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <input type="text" className="form-input" placeholder="Your Full Name" required />
                </div>
                <div className="form-group">
                    <input type="tel" className="form-input" placeholder="Mobile Number" required />
                </div>
                <div className="form-group">
                    <textarea className="form-input" rows="5" placeholder="Write your message or query..."></textarea>
                </div>
                <button type="submit" className="submit-btn">
                    <i className="fas fa-paper-plane"></i> Send Message Now
                </button>
            </form>
        </div>
    </div>
  )
}

export default Contact