import './Terms.css';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const WarnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BlockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const GavelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 13l3 3-8 8-3-3z" />
    <path d="M7 7L4 4l3-3 3 3z" />
    <path d="M17 3l4 4-9.5 9.5" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Terms() {
  return (
    <div className="terms-page">

      {/* Title */}
      <div className="terms-title-block">
        <h1 className="terms-title">Terms and Conditions</h1>
        <div className="terms-meta">
          <ClockIcon />
          <span>Last updated: October 24, 2023</span>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="alert-banner">
        <WarnIcon />
        <div>
          <p className="alert-banner-title">Important: Public Area Complaints Only</p>
          <p className="alert-banner-text">
            This application is exclusively for reporting waste issues in <strong>public municipal areas</strong> (e.g., parks, streets, sidewalks).
            Do NOT use this service for missed residential garbage collection or private household waste issues.
            For residential services, please visit the <a href="#">Residential Portal</a>.
          </p>
        </div>
      </div>

      {/* Section 1 – Introduction */}
      <section className="terms-section">
        <div className="section-heading">
          <div className="section-icon icon-green"><InfoIcon /></div>
          <h2 className="section-title">1. Introduction</h2>
        </div>
        <div className="section-body">
          <p>
            Welcome to GreenSort's Public Reporting System. By accessing or using our municipal waste reporting
            services, you agree to be bound by these Terms and Conditions. This platform is designed specifically
            for community members to report illegal dumping, overflowing public bins, or litter in public spaces.
          </p>
          <p>
            <span className="highlight-red">
              Please note that reports concerning private residential waste, missed curbside pickups, or commercial
              waste disputes are outside the scope of this platform and will be rejected.
            </span>
          </p>
        </div>
      </section>

      {/* Section 2 – Reporting Guidelines */}
      <section className="terms-section">
        <div className="section-heading">
          <div className="section-icon icon-blue"><PersonIcon /></div>
          <h2 className="section-title">2. Reporting Guidelines</h2>
        </div>
        <div className="section-body">
          <p>To ensure efficient processing of public waste complaints, users are required to:</p>
          <ul className="checklist">
            <li>
              <CheckIcon />
              <span>Provide accurate location data (GPS coordinates or nearest cross-street) for the public issue.</span>
            </li>
            <li>
              <CheckIcon />
              <span>Attach clear photos of the public waste incident where possible to aid clean-up crews.</span>
            </li>
            <li>
              <CheckIcon />
              <span>Ensure the report pertains to municipal property (parks, roads, alleys) only.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Section 3 – Prohibited Activities */}
      <section className="terms-section">
        <div className="section-heading">
          <div className="section-icon icon-red"><BlockIcon /></div>
          <h2 className="section-title">3. Prohibited Activities</h2>
        </div>
        <div className="section-body">
          <p>
            To maintain the integrity of our public service system, the following actions are strictly prohibited
            and may result in account suspension:
          </p>
          <div className="prohibited-notice">
            <p className="prohibited-notice-title">Strictly Prohibited: Reporting Private Household Waste</p>
            <p className="prohibited-notice-text">
              Do not submit reports for missed residential bin collections, neighbor disputes regarding private bins,
              or requests for private bulk item pickup through this public complaint channel.
            </p>
          </div>
          <div className="prohibited-grid">
            {[
              { label: 'False / Spam Reports' },
              { label: 'Private Property Complaints' },
              { label: 'Harassment of Staff' },
              { label: 'Political Solicitation' },
            ].map((item) => (
              <div className="prohibited-item" key={item.label}>
                <XIcon />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 – Data and Privacy */}
      <section className="terms-section">
        <div className="section-heading">
          <div className="section-icon icon-purple"><ShieldIcon /></div>
          <h2 className="section-title">4. Data and Privacy</h2>
        </div>
        <div className="section-body">
          <p>
            GreenSort collects location data and user-submitted photos strictly for the purpose of identifying and
            resolving public waste issues. Your personal contact information is used solely for status updates
            regarding your report. We do not share reporter identities with the public or third parties unless
            required by law.
          </p>
        </div>
      </section>

      {/* Section 5 – Liability Limitations */}
      <section className="terms-section">
        <div className="section-heading">
          <div className="section-icon icon-orange"><GavelIcon /></div>
          <h2 className="section-title">5. Liability Limitations</h2>
        </div>
        <div className="section-body">
          <p>
            GreenSort Municipality is not liable for damages resulting from the delay in responding to a public
            waste report. This platform is not for emergency services. If you encounter hazardous materials that
            pose an immediate threat to life or safety, please contact emergency services (911) directly.
          </p>
        </div>
      </section>

    </div>
  );
}