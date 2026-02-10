import React from 'react';
import UserHeader from "./UserHeader";
import './HowItWorks.css';
import { useNavigate } from 'react-router-dom';
export default function GreenSortHowItWorks() {
  const navigate = useNavigate();
   const steps = [
  {
    number: 1,
    icon: "add_a_photo",
    title: "Report Garbage",
    description:
      "The user spots uncollected waste, captures a photo, confirms the GPS location, and submits the complaint through the User Dashboard.",
    badge: "User Action",
    badgeColor: "badge-green",
    iconColor: "icon-green",
    borderColor: "border-green",
  },
  {
    number: 2,
    icon: "assignment",
    title: "Mark In Progress",
    description:
      "The assigned ward worker reviews the complaint and marks it as 'In Progress' while heading to the reported location for cleanup.",
    badge: "Ward Worker Action",
    badgeColor: "badge-blue",
    iconColor: "icon-blue",
    borderColor: "border-blue",
  },
  {
    number: 3,
    icon: "cleaning_services",
    title: "Clean & Upload Proof",
    description:
      "After cleaning the area, the ward worker uploads an 'After' photo as evidence and marks the complaint as 'Resolving'.",
    badge: "Ward Worker Action",
    badgeColor: "badge-blue",
    iconColor: "icon-blue",
    borderColor: "border-blue",
  },
  {
    number: 4,
    icon: "verified",
    title: "Admin Verification",
    description:
      "The admin verifies the uploaded photo to ensure the area is properly cleaned and marks the complaint as 'Resolved'.",
    badge: "Admin Action",
    badgeColor: "badge-gray",
    iconColor: "icon-gray",
    borderColor: "border-gray",
  },
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
        { icon: 'emoji_events', title: 'Timely Updates', highlight: true }
    ];

    return (
        <>
           

            <div className="greensort-container">
                {/* Header */}
                <UserHeader active="how" />
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
                                <button className="btn btn-primary" onClick={() => navigate('/user/complaint')}>
                                    <span className="material-symbols-outlined">add_a_photo</span>
                                    Raise Complaint
                                </button>
                                <button className="btn btn-secondary" onClick={()=>{navigate('/user/profile')}}>
                                    <span className="material-symbols-outlined">person</span>
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="footer" >
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
