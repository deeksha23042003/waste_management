import React from 'react';

export default function GreenSortHowItWorks() {
    const steps = [
        {
            number: 1,
            icon: 'add_a_photo',
            title: 'Raise Complaint',
            description: 'Spot uncollected waste? Take a photo, confirm the GPS location, and submit a brief description via the User Dashboard.',
            badge: 'User Action',
            badgeColor: 'badge-green',
            iconColor: 'icon-green',
            borderColor: 'border-green'
        },
        {
            number: 2,
            icon: 'admin_panel_settings',
            title: 'Assign & Route',
            description: 'System Admins verify the complaint and assign it to the specific Ward Worker responsible for that area.',
            badge: 'Admin Action',
            badgeColor: 'badge-gray',
            iconColor: 'icon-gray',
            borderColor: 'border-gray'
        },
        {
            number: 3,
            icon: 'cleaning_services',
            title: 'Cleanup & Resolve',
            description: 'Ward Workers receive the alert, clean the site, and upload an "After" photo as proof of resolution.',
            badge: 'Worker Action',
            badgeColor: 'badge-gray',
            iconColor: 'icon-gray',
            borderColor: 'border-gray'
        },
        {
            number: 4,
            icon: 'verified',
            title: 'Verification',
            description: 'You receive a notification with the proof. The complaint is marked \'Resolved\' and you earn community points!',
            badge: 'Notification',
            badgeColor: 'badge-green',
            iconColor: 'icon-gray',
            borderColor: 'border-gray'
        }
    ];

    const wasteTypes = [
        {
            icon: 'compost',
            title: 'Wet Waste (Green Bin)',
            description: 'Kitchen scraps, fruits, vegetables, and other biodegradable organic matter.',
            colorClass: 'waste-green'
        },
        {
            icon: 'recycling',
            title: 'Dry Waste (Blue Bin)',
            description: 'Paper, plastics, glass, metals, and other recyclable non-organic materials.',
            colorClass: 'waste-blue'
        },
        {
            icon: 'battery_alert',
            title: 'Hazardous (Red Bin)',
            description: 'Batteries, medical waste, chemicals, paints, and sharp objects.',
            colorClass: 'waste-red'
        }
    ];

    const features = [
        { icon: 'delete_sweep', title: 'Efficient Collection', highlight: true },
        { icon: 'share_location', title: 'GPS Tracking', highlight: false },
        { icon: 'nature_people', title: 'Community Care', highlight: false },
        { icon: 'emoji_events', title: 'Earn Rewards', highlight: true }
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Public Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .greensort-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: #f8fcf8;
        }

        /* Header Styles */
        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #cee8ce;
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 4rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo-icon {
          color: #0df20d;
          font-size: 2rem;
        }

        .logo-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0d1c0d;
        }

        .nav {
          display: none;
          gap: 2rem;
          align-items: center;
        }

        @media (min-width: 768px) {
          .nav {
            display: flex;
          }
        }

        .nav-link {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(13, 28, 13, 0.7);
          text-decoration: none;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #0df20d;
        }

        .nav-link.active {
          color: #0df20d;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .notification-btn {
          position: relative;
          padding: 0.5rem;
          color: #0d1c0d;
          background: transparent;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .notification-btn:hover {
          background-color: #f3f4f6;
        }

        .notification-badge {
          position: absolute;
          top: 0.375rem;
          right: 0.375rem;
          width: 0.5rem;
          height: 0.5rem;
          background-color: #0df20d;
          border-radius: 9999px;
          border: 2px solid white;
        }

        .profile-pic {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 9999px;
          background-color: #e5e7eb;
          border: 2px solid #0df20d;
          cursor: pointer;
        }

        /* Hero Section */
        .hero-section {
          background-color: white;
          border-bottom: 1px solid #cee8ce;
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1rem;
          text-align: center;
        }

        @media (min-width: 768px) {
          .hero-container {
            padding: 5rem 2rem;
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 1rem;
          border-radius: 9999px;
          background-color: rgba(13, 242, 13, 0.1);
          border: 1px solid rgba(13, 242, 13, 0.2);
          margin-bottom: 1.5rem;
        }

        .hero-badge-icon {
          font-size: 0.875rem;
          color: #15803d;
        }

        .hero-badge-text {
          font-size: 0.75rem;
          font-weight: 700;
          color: #166534;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #0d1c0d;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 3.75rem;
          }
        }

        .hero-description {
          font-size: 1.125rem;
          color: #4b5563;
          max-width: 48rem;
          margin: 0 auto;
          line-height: 1.75;
        }

        @media (min-width: 768px) {
          .hero-description {
            font-size: 1.25rem;
          }
        }

        /* How It Works Section */
        .how-it-works-section {
          max-width: 100vw;
          margin: 0 auto;
          padding: 4rem 1rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #0d1c0d;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          color: #6b7280;
          max-width: 42rem;
          margin: 0 auto;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          position: relative;
        }

        @media (min-width: 768px) {
          .steps-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .steps-connector {
          display: none;
        }

        @media (min-width: 768px) {
          .steps-connector {
            display: block;
            position: absolute;
            top: 3rem;
            left: 10%;
            right: 10%;
            height: 2px;
            background: linear-gradient(to right, rgba(13, 242, 13, 0.2), #0df20d, rgba(13, 242, 13, 0.2));
            z-index: -1;
          }
        }

        .step-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .step-icon-wrapper {
          width: 6rem;
          height: 6rem;
          border-radius: 1rem;
          background-color: white;
          border: 2px solid;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          position: relative;
          transition: transform 0.3s;
        }

        .step-card:hover .step-icon-wrapper {
          transform: translateY(-0.5rem);
        }

        .step-icon-wrapper.border-green {
          border-color: #0df20d;
        }

        .step-icon-wrapper.border-gray {
          border-color: #e5e7eb;
        }

        .step-number {
          position: absolute;
          top: -0.75rem;
          right: -0.75rem;
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          border: 2px solid #0df20d;
        }

        .step-number.primary {
          background-color: #0d1c0d;
          color: white;
        }

        .step-number.secondary {
          background-color: #e5e7eb;
          color: #374151;
        }

        .step-icon {
          font-size: 2.5rem;
          transition: color 0.2s;
        }

        .icon-green {
          color: #0df20d;
        }

        .icon-gray {
          color: #9ca3af;
        }

        .step-card:hover .icon-gray {
          color: #0df20d;
        }

        .step-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0d1c0d;
          margin-bottom: 0.5rem;
        }

        .step-description {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.625;
          padding: 0 0.5rem;
        }

        .step-badge {
          margin-top: 1rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .badge-green {
          background-color: #f0fdf4;
          color: #15803d;
        }

        .badge-gray {
          background-color: #f3f4f6;
          color: #4b5563;
        }

        /* Waste Segregation Section */
        .segregation-section {
          background-color: white;
          border-top: 1px solid #cee8ce;
          border-bottom: 1px solid #cee8ce;
          padding: 4rem 0;
        }

        .segregation-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          align-items: center;
        }

        @media (min-width: 768px) {
          .segregation-container {
            flex-direction: row;
          }
        }

        .segregation-content {
          width: 100%;
        }

        @media (min-width: 768px) {
          .segregation-content {
            width: 50%;
          }
        }

        .segregation-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .label-line {
          height: 1px;
          width: 2rem;
          background-color: #0df20d;
        }

        .label-text {
          color: #0df20d;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
        }

        .segregation-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #0d1c0d;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .segregation-title {
            font-size: 2.25rem;
          }
        }

        .segregation-description {
          color: #4b5563;
          font-size: 1.125rem;
          margin-bottom: 2rem;
        }

        .waste-types {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .waste-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          border-radius: 0.75rem;
          background-color: #f8fcf8;
          border: 1px solid #cee8ce;
        }

        .waste-icon-wrapper {
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .waste-green .waste-icon-wrapper {
          background-color: #dcfce7;
          color: #15803d;
        }

        .waste-blue .waste-icon-wrapper {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .waste-red .waste-icon-wrapper {
          background-color: #fee2e2;
          color: #b91c1c;
        }

        .waste-title {
          font-weight: 700;
          color: #0d1c0d;
        }

        .waste-description {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .feature-card {
          padding: 1.5rem;
          border-radius: 1rem;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .feature-card.highlight {
          background-color: rgba(13, 242, 13, 0.05);
          border: 1px solid rgba(13, 242, 13, 0.2);
        }

        .feature-card.normal {
          background-color: #f3f4f6;
        }

        .feature-card:nth-child(2) {
          transform: translateY(2rem);
        }

        .feature-card:nth-child(3) {
          transform: translateY(-2rem);
        }

        .feature-icon {
          font-size: 3.75rem;
          margin-bottom: 0.5rem;
        }

        .feature-icon.primary {
          color: #0df20d;
        }

        .feature-icon.secondary {
          color: #9ca3af;
        }

        .feature-title {
          font-weight: 700;
          font-size: 1.125rem;
          color: #0d1c0d;
        }

        /* CTA Section */
        .cta-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 1rem;
        }

        .cta-card {
          background-color: #0df20d;
          border-radius: 1.5rem;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .cta-card {
            padding: 3rem;
            text-align: left;
            flex-direction: row;
          }
        }

        .cta-blur-1 {
          position: absolute;
          top: 0;
          right: 0;
          margin-right: -5rem;
          margin-top: -5rem;
          width: 16rem;
          height: 16rem;
          background-color: white;
          opacity: 0.1;
          border-radius: 9999px;
          filter: blur(60px);
        }

        .cta-blur-2 {
          position: absolute;
          bottom: 0;
          left: 0;
          margin-left: -5rem;
          margin-bottom: -5rem;
          width: 16rem;
          height: 16rem;
          background-color: black;
          opacity: 0.1;
          border-radius: 9999px;
          filter: blur(60px);
        }

        .cta-content {
          position: relative;
          z-index: 10;
          max-width: 42rem;
        }

        .cta-title {
          font-size: 1.875rem;
          font-weight: 800;
          color: black;
          margin-bottom: 1rem;
        }

        @media (min-width: 768px) {
          .cta-title {
            font-size: 2.25rem;
          }
        }

        .cta-description {
          color: rgba(0, 0, 0, 0.8);
          font-size: 1.125rem;
          font-weight: 500;
        }

        .cta-buttons {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .cta-buttons {
            flex-direction: row;
          }
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 700;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          border: none;
          font-size: 1rem;
          justify-content: center;
        }

        .btn-primary {
          background-color: black;
          color: white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .btn-primary:hover {
          background-color: #1f2937;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          transform: translateY(-0.25rem);
        }

        .btn-secondary {
          background-color: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          color: black;
          border: 2px solid rgba(0, 0, 0, 0.1);
        }

        .btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        /* Footer */
        .footer {
          background-color: white;
          border-top: 1px solid #cee8ce;
          padding: 2rem 0;
          margin-top: auto;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .footer-container {
            flex-direction: row;
          }
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .footer-icon {
          color: #0df20d;
          opacity: 0.8;
        }

        .footer-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: #0d1c0d;
        }

        .footer-links {
          display: flex;
          gap: 1.5rem;
        }

        .footer-link {
          font-size: 0.75rem;
          color: #6b7280;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-link:hover {
          color: #0df20d;
        }

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

            <div className="greensort-container">
                {/* Header */}
                <header className="header">
                    <div className="header-container">
                        <div className="logo-section">
                            <div className="logo-icon">
                                <span className="material-symbols-outlined">recycling</span>
                            </div>
                            <h1 className="logo-text">GreenSort</h1>
                        </div>
                        <nav className="nav">
                            <a className="nav-link" href="#">Home</a>
                            <a className="nav-link active" href="#">How it Works</a>
                            <a className="nav-link" href="#">Community</a>
                            <a className="nav-link" href="#">Contact</a>
                        </nav>
                        <div className="header-actions">
                            <button className="notification-btn">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="notification-badge"></span>
                            </button>
                            <div className="profile-pic"></div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main style={{ flexGrow: 1 }}>
                    {/* Hero Section */}
                    <div className="hero-section">
                        <div className="hero-container">
                            <div className="hero-badge">
                                <span className="material-symbols-outlined hero-badge-icon">info</span>
                                <span className="hero-badge-text">System Overview</span>
                            </div>
                            <h1 className="hero-title">
                                Cleaning Our City,<br /> One Click at a Time.
                            </h1>
                            <p className="hero-description">
                                GreenSort connects citizens, administrators, and ward workers in a seamless loop to ensure efficient waste management and quicker resolution of complaints.
                            </p>
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <div className="how-it-works-section">
                        <div className="section-header">
                            <h2 className="section-title">How It Works</h2>
                            <p className="section-subtitle">From spotting waste to seeing it cleared, our transparent process keeps you informed every step of the way.</p>
                        </div>

                        <div className="steps-grid">
                            <div className="steps-connector"></div>

                            {steps.map((step) => (
                                <div key={step.number} className="step-card">
                                    <div className={`step-icon-wrapper ${step.borderColor}`}>
                                        <span className={`step-number ${step.number === 1 ? 'primary' : 'secondary'}`}>
                                            {step.number}
                                        </span>
                                        <span className={`material-symbols-outlined step-icon ${step.iconColor}`}>
                                            {step.icon}
                                        </span>
                                    </div>
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                    <div className={`step-badge ${step.badgeColor}`}>
                                        {step.badge}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Waste Segregation Section */}
                    <div className="segregation-section">
                        <div className="segregation-container">
                            <div className="segregation-content">
                                <div className="segregation-label">
                                    <span className="label-line"></span>
                                    <span className="label-text">Waste Segregation</span>
                                </div>
                                <h2 className="segregation-title">
                                    Sort It Right,<br />Keep It Bright.
                                </h2>
                                <p className="segregation-description">
                                    Proper segregation at the source is key to effective waste management. Before you raise a complaint or dispose of waste, ensure you categorize it correctly.
                                </p>
                                <div className="waste-types">
                                    {wasteTypes.map((waste, index) => (
                                        <div key={index} className={`waste-card ${waste.colorClass}`}>
                                            <div className="waste-icon-wrapper">
                                                <span className="material-symbols-outlined">{waste.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="waste-title">{waste.title}</h4>
                                                <p className="waste-description">{waste.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="segregation-content">
                                <div className="features-grid">
                                    {features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className={`feature-card ${feature.highlight ? 'highlight' : 'normal'}`}
                                        >
                                            <span className={`material-symbols-outlined feature-icon ${feature.highlight ? 'primary' : 'secondary'}`}>
                                                {feature.icon}
                                            </span>
                                            <span className="feature-title">{feature.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="cta-section">
                        <div className="cta-card">
                            <div className="cta-blur-1"></div>
                            <div className="cta-blur-2"></div>
                            <div className="cta-content">
                                <h2 className="cta-title">Ready to make a difference?</h2>
                                <p className="cta-description">Join thousands of citizens who are actively keeping our city clean. Report your first issue today.</p>
                            </div>
                            <div className="cta-buttons">
                                <button className="btn btn-primary">
                                    <span className="material-symbols-outlined">add_a_photo</span>
                                    Raise Complaint
                                </button>
                                <button className="btn btn-secondary">
                                    <span className="material-symbols-outlined">person</span>
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="footer">
                    <div className="footer-container">
                        <div className="footer-logo">
                            <div className="footer-icon">
                                <span className="material-symbols-outlined">recycling</span>
                            </div>
                            <span className="footer-text">GreenSort © 2023</span>
                        </div>
                        <div className="footer-links">
                            <a className="footer-link" href="#">Privacy Policy</a>
                            <a className="footer-link" href="#">Terms of Service</a>
                            <a className="footer-link" href="#">Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
